import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Selection } from '../../../../utility/models/selection.model';
import { IssueTypes } from '../filter/issue-types.model';
import { ConfirmAddRequestModel } from './confirm-add-request.model';

@Component({
  selector: 'confirm-add-request',
  templateUrl: './confirm-add-request.component.html',
  styleUrls: ['./confirm-add-request.component.scss']
})
export class ConfirmAddRequestComponent implements OnChanges {
  @Input() model = new ConfirmAddRequestModel();
  @Input() issueTypes: IssueTypes;
  @Input() voidActions: Selection[] = [];
  @Input() selectedVoidAction: string;
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  issueTypeName: string;
  subIssueTypeName: string;
  actionName: string;

  ngOnChanges(changes: SimpleChanges): void {
    this.onChangeIssueType(changes);
    this.onChangeAction(changes);
  }

  onChangeIssueType(changes: SimpleChanges) {
    if (changes['issueTypes']) {
      this.issueTypeName = this.issueTypes.issueTypes.find(x => x.issueTypeId === this.issueTypes.issueId)?.issueTypeName;
      this.subIssueTypeName = this.issueTypes.subIssueTypes.find(x => x.subIssueTypeId === this.issueTypes.subIssueId)?.subIssueTypeName;
    }
  }

  onChangeAction(changes: SimpleChanges) {
    if (changes['selectedVoidAction'] || changes['voidActions']) {
      this.actionName = this.voidActions?.find(x => x.value === this.selectedVoidAction)?.name;
    }
  }

  onClickCancel() {
    this.model.isOpen = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpen = false;
    this.clickOk.emit();
  }
}