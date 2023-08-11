import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmRedCardModel } from './confirm-red-card.model';

@Component({
  selector: 'confirm-red-card',
  templateUrl: './confirm-red-card.component.html',
  styleUrls: ['./confirm-red-card.component.scss']
})
export class ConfirmRedCardComponent {
  @Input() model = new ConfirmRedCardModel();
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  constructor() { }

  onClickCancel() {
    this.model.isOpenDialog = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpenDialog = false;
    this.clickOk.emit();
  }
}
