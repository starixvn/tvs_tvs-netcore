import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmEarlyKickOffModel } from './confirm-eko.model';

@Component({
  selector: 'confirm-eko',
  templateUrl: './confirm-eko.component.html',
  styleUrls: ['./confirm-eko.component.scss']
})
export class ConfirmEkoComponent {
  @Input() model = new ConfirmEarlyKickOffModel();
  @Output() clickCancel = new EventEmitter();
  @Output() clickOk = new EventEmitter();

  onClickCancel() {
    this.model.isOpenDialog = false;
    this.clickCancel.emit();
  }

  onClickOk() {
    this.model.isOpenDialog = false;
    this.clickOk.emit();
  }
}
