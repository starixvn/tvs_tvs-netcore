import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Selection } from '../../../utility/models/selection.model';
import { IssueTypes } from '../filter/issue-types.model';
import { ConfirmAddRequestModel } from './confirm-add-request.model';
import { TVSRequestActionType } from '../../../utility/constants/config';

@Component({
    selector: 'confirm-add-request',
    templateUrl: './confirm-add-request.component.html',
    styleUrls: ['./confirm-add-request.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class ConfirmAddRequestComponent implements OnChanges {
  @Input() isOpen: boolean;
  @Input() model = new ConfirmAddRequestModel();
  @Input() issueTypes: IssueTypes;
  @Input() voidActions: Selection[] = [];
  @Input() selectedVoidAction: string;
  @Input() selectedSubIssueType: number;
  @Input() siteDBDownInfoJson: string;
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  issueTypeName: string;
  subIssueTypeName: string
  actionName: string;
  
  ngOnChanges(changes: SimpleChanges): void {
    this.onChangeIssueType(changes);
    this.onChangeAction(changes);
    this.onChangeInfoMarkTicketSiteDBDown(changes);
  }

  onChangeInfoMarkTicketSiteDBDown(changes: SimpleChanges) {
    if (changes['isOpen'] && this.isOpen) {
      const isShowCheckbox = this.siteDBDownInfoJson?.length > 0 && this.selectedVoidAction !== TVSRequestActionType.TAKE_NOTE_ID.toString();
      this.model.isHasAffectedTicketSiteDBDown = isShowCheckbox;
      this.model.isMarkTicketSiteDbDown = isShowCheckbox;    }
  }
  
  onClickCancel() {
    this.model.isOpen = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpen = false;
    this.clickOk.emit();
  }

  onChangeAction(changes: SimpleChanges) {
    if (changes['selectedVoidAction'] || changes['voidActions']) {
      this.actionName = this.voidActions?.find(x => x.value === this.selectedVoidAction)?.name;
    }
  }

  onChangeIssueType(changes: SimpleChanges) {
    if (changes['issueTypes'] || changes['selectedSubIssueType']) {
      this.issueTypeName = this.issueTypes.issueTypes.find(x => x.issueTypeId === this.issueTypes.issueId)?.issueTypeName;
      this.subIssueTypeName = this.issueTypes.subIssueTypes.find(x => x.subIssueTypeId === this.issueTypes.subIssueId)?.subIssueTypeName;
    }
  }
}