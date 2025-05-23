import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as _ from 'lodash';
import { BlockUiDirective } from '../../../../../utility/components/block-ui/block-ui.directive';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { GetSubIssueTypeNoteQuery, SaveSubIssueTypeNoteQuery } from '../../models/sub-type-note.model';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog.model';
import { Button, Category, GroupButton } from './sub-issue-type-json.model';
import SubIssueTypeDangerAcceptedConfig from './sub-type-danger-accepted.json';
import SubIssueTypeRedCardConfig from './sub-type-red-card.json';
import SubIssueTypeWrongScoreConfig from './sub-type-wrong-score.json';

@Component({
  standalone: true,
  selector: 'sub-issue-type-dialog',
  templateUrl: './sub-issue-type-dialog.component.html',
  styleUrls: ['./sub-issue-type-dialog.component.scss'],
  imports: [FormsModule, CommonModule, BlockUiDirective]
})
export class SubIssueTypeDialogComponent implements OnChanges, OnInit {
  @Input() model = new SubIssueTypeDialogModel();
  @Output() updateSubTypeEvent = new EventEmitter<number>();
  @ViewChild('noteGroup') myDiv: ElementRef;
  @Input() isMainEvent = true;
  subIssueTypes: Category[] = [];
  isCheckedViewAllOptions: boolean;
  isCheckedWrongScoreOnwards = false;
  userId: string;
  isBlockUi: boolean;
  private readonly apiService = inject(AddRequestApiService);

  public async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['model'] && this.model.isOpen) {
      this.isCheckedWrongScoreOnwards = false;
      await this.getSubIssueTypeWithUserNote();
    }
  }

  ngOnInit(): void {
    this.userId = document.getElementById('body').getAttribute('user-id');
  }

  public closePopup(): void {
    this.preventNoteEditable();
    this.model.isOpen = false;
  }

  public onSelectSubIssueType(group: GroupButton, subIssueTypeId: number) {
    this.model.allowanceTime = {
      aaTime: Number(group.aa),
      paTime: Number(group.pa),
      saTime: Number(group.sa),
    };
    this.updateSubTypeEvent.emit(subIssueTypeId);
    this.closePopup();
  }

  public isHaveButton(buttons: Button[]): boolean {
    return buttons && buttons.length > 0;
  }

  public onChangeTypeOfWrongScore(): void {
    this.subIssueTypes = this.getSubIssueTypeWrongScoreConfig();
    this.getSubIssueTypeWithUserNote();
  }

  public checkCanShowButtonSelectAll(buttons: Button[]): boolean {
    if (this.isHaveButton(buttons)) {
      return SubIssueTypeGroup.SUBTYPE_HAVE_HIDE_OPTION.includes(buttons[0].subIssueTypeId) ? this.isCheckedViewAllOptions : true;
    }

    return false;
  }

  private getSubTypeConfig(): Category[] {
    switch (true) {
      case StaticService.isDangerAccepted(this.model.issueTypeId):
        return SubIssueTypeDangerAcceptedConfig;
      case StaticService.isRedCard(this.model.issueTypeId):
        return SubIssueTypeRedCardConfig;
      case StaticService.isWrongScore(this.model.issueTypeId):
        return this.getSubIssueTypeWrongScoreConfig();
      default:
        return [];
    }
  }

  private getSubIssueTypeWrongScoreConfig(): Category[] {
    const subIssueTypeWrongScoreConfig = _.cloneDeep(SubIssueTypeWrongScoreConfig);
    const mainCategoryName = "Main Event";
    if (this.isMainEvent) {
      const mainEventSubIssueTypes = subIssueTypeWrongScoreConfig.filter(x => x.categoryName === mainCategoryName);
      mainEventSubIssueTypes[0].groups = this.isCheckedWrongScoreOnwards
        ? SubIssueTypeWrongScoreConfig[0].groups.filter(x => this.isHasSubTypeOnWards(x))
        : SubIssueTypeWrongScoreConfig[0].groups.filter(x => this.isHasSubTypeNoOnWards(x))

      return mainEventSubIssueTypes;
    }

    const relatedEventSubIssueTypes = subIssueTypeWrongScoreConfig.filter(x => x.categoryName !== mainCategoryName);
    relatedEventSubIssueTypes[0].isCollapse = false;

    return relatedEventSubIssueTypes;
  }

  public isDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.model.issueTypeId);
  }

  public isMainEventWrongScore(): boolean {
    return this.isWrongScore() && this.isMainEvent;
  }

  public isWrongScore(): boolean {
    return StaticService.isWrongScore(this.model.issueTypeId);
  }

  private isHasSubTypeNoOnWards(groupButton: GroupButton): boolean {
    return groupButton.buttonSelectAll?.some(t => SubIssueTypeGroup.SUBTYPE_NO_ONWARDS.includes(t.subIssueTypeId))
      || groupButton.buttonSelectHomeAway?.some(t => SubIssueTypeGroup.SUBTYPE_NO_ONWARDS.includes(t.subIssueTypeId));
  }

  private isHasSubTypeOnWards(groupButton: GroupButton): boolean {
    return groupButton.buttonSelectAll?.some(t => SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(t.subIssueTypeId))
      || groupButton.buttonSelectHomeAway?.some(t => SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(t.subIssueTypeId));
  }

  private preventNoteEditable(): void {
    this.subIssueTypes.forEach(x => x.groups.forEach(t => t.noteEditable = false));
  }

  public editNote(groupButton: GroupButton): void {
    groupButton.noteEditable = true;
    const element = document.getElementById(`noteGroup${groupButton.groupId}`);
    window.setTimeout(() => element.focus(), 0);
  }

  public async saveNote(groupButton: GroupButton): Promise<void> {
    groupButton.noteEditable = false
    const saveQuery: SaveSubIssueTypeNoteQuery = {
      issueTypeId: Number(this.model.issueTypeId),
      groupId: groupButton.groupId,
      userId: Number(this.userId),
      note: groupButton.note
    }
    await this.apiService.saveSubIssueTypeNote(saveQuery);
  }

  private async getSubIssueTypeWithUserNote(): Promise<void> {
    const query: GetSubIssueTypeNoteQuery = {
      issueTypeId: Number(this.model.issueTypeId),
      userId: Number(this.userId)
    }
    this.isBlockUi = true;
    this.subIssueTypes = this.getSubTypeConfig();
    const subIssueTypeNotes = await this.apiService.getSubIssueTypeNote(query);

    subIssueTypeNotes.forEach(x => {
      this.subIssueTypes.forEach(y => {
        const index = y.groups.findIndex(group => group.groupId === x.groupId);
        if (index >= 0) {
          y.groups[index].note = x.note;
        }
      })

    });

    this.isBlockUi = false;
  }
}
