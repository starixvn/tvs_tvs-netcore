import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmDangerAcceptedModel } from './confirm-danger-accepted.model';

@Component({
  standalone: true,
  selector: 'confirm-danger-accepted',
  templateUrl: './confirm-danger-accepted.component.html',
  styleUrls: ['./confirm-danger-accepted.component.scss']
})
export class ConfirmDangerAcceptedComponent {
  @Input() model = new ConfirmDangerAcceptedModel();
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
