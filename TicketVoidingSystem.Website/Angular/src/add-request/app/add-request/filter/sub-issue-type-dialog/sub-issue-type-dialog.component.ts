import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog.model';
import { Button, Category, GroupButton } from './sub-issue-type-json.model';
import SubIssueTypeDangerAcceptedConfig from './sub-type-danger-accepted.json';
import SubIssueTypeRedCardConfig from './sub-type-red-card.json';
import SubIssueTypeWrongScoreConfig from './sub-type-wrong-score.json';

@Component({
  selector: 'sub-issue-type-dialog',
  templateUrl: './sub-issue-type-dialog.component.html',
  styleUrls: ['./sub-issue-type-dialog.component.scss']
})
export class SubIssueTypeDialogComponent implements OnChanges {
  @Input() model = new SubIssueTypeDialogModel();
  @Output() updateSubTypeEvent = new EventEmitter<number>();

  subIssueTypes: Category[] = [];
  isCheckedViewAllOptions: boolean;
  isCheckedWrongScoreOnwards = false;
  
  public ngOnChanges(changes: {[propKey: string]: SimpleChange }) {
    if (changes['model']) {
      this.isCheckedWrongScoreOnwards = false;
      this.subIssueTypes = this.getSubTypeConfig();
    }
  }

  public onClose(): void {
    this.model.isOpen = false;
  }

  public onSelectSubIssueType(group: GroupButton, subIssueTypeId: number) {
    this.model.allowanceTime = {
      aaTime: Number(group.aa),
      paTime: Number(group.pa),
      saTime: Number(group.sa),
    };
    this.updateSubTypeEvent.emit(subIssueTypeId);
    this.model.isOpen = false;
  }

  public isHaveButton(buttons: Button[]): boolean {
    return buttons && buttons.length > 0;
  }

  public onChangeTypeOfWrongScore(): void {
    this.subIssueTypes = this.getSubIssueTypeWrongScoreConfig();
  }
  
  public checkCanShowButtonSelectAll(buttons: Button[]): boolean {
    if (this.isHaveButton(buttons)) {
      if (SubIssueTypeGroup.SUBTYPE_HAVE_HIDE_OPTION.includes(buttons[0].subIssueTypeId)) {
        return this.isCheckedViewAllOptions;
      }

      return true;
    }

    return false;
  }

  private getSubTypeConfig(): Category[] {
    if (StaticService.isDangerAccepted(this.model.issueTypeId)) {
      return SubIssueTypeDangerAcceptedConfig;
    } else if (StaticService.isRedCard(this.model.issueTypeId)) {
      return SubIssueTypeRedCardConfig;
    } else if (StaticService.isWrongScore(this.model.issueTypeId)) {
      return this.getSubIssueTypeWrongScoreConfig();
    }

    return [];
  }

  private getSubIssueTypeWrongScoreConfig(): Category[] {
    const subIssueTypeDangerAcceptedConfig = _.cloneDeep(SubIssueTypeWrongScoreConfig);
    
    if (this.isCheckedWrongScoreOnwards) {
      subIssueTypeDangerAcceptedConfig[0].groups = SubIssueTypeWrongScoreConfig[0].groups.filter(x => this.isHasSubTypeOnWards(x));
    } else {
      subIssueTypeDangerAcceptedConfig[0].groups = SubIssueTypeWrongScoreConfig[0].groups.filter(x => this.isHasSubTypeNoOnWards(x));
    }

    return subIssueTypeDangerAcceptedConfig;
  }

  public isDangerAccepted(): boolean {
    return StaticService.isDangerAccepted(this.model.issueTypeId);
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
}
