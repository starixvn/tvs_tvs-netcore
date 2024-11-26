import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Selection } from 'src/utility/models/selection.model';
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
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  issueTypeName: string;
  subIssueTypeName: string;
  actionName: string;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.voidActions);
    console.log(this.issueTypes);
    console.log(Date.now());
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