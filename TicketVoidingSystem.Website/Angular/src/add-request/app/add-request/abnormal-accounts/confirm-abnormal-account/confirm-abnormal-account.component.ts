import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmAbnormalBetModel } from '../../event-abnormal-bet/confirm-abnormal-bet/confirm-abnormal-bet.model';

@Component({
  selector: 'confirm-abnormal-account',
  templateUrl: './confirm-abnormal-account.component.html',
  styleUrls: ['./confirm-abnormal-account.component.scss']
})
export class ConfirmAbnormalAccountComponent {
  @Input() model = new ConfirmAbnormalBetModel();
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();
  
  closeClick() {
    this.model.isOpenDialog = false;
    this.close.emit();
  }

  saveClick() {
    this.model.isOpenDialog = false;
    this.save.emit();
  }
}
