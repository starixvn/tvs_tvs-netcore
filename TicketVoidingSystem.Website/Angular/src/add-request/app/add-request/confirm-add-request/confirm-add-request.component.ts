import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmAddRequestModel } from './confirm-add-request.model';

@Component({
  selector: 'confirm-add-request',
  templateUrl: './confirm-add-request.component.html',
  styleUrls: ['./confirm-add-request.component.scss']
})
export class ConfirmAddRequestComponent {
  @Input() model = new ConfirmAddRequestModel();
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  onClickCancel() {
    this.model.isOpen = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpen = false;
    this.clickOk.emit();
  }
}