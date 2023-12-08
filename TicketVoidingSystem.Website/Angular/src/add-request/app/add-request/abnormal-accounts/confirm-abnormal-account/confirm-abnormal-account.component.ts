import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmAbnormalAccountModel } from './confirm-abnormal-account.model';

@Component({
  selector: 'confirm-abnormal-account',
  templateUrl: './confirm-abnormal-account.component.html',
  styleUrls: ['./confirm-abnormal-account.component.scss']
})
export class ConfirmAbnormalAccountComponent {
  @Input() model = new ConfirmAbnormalAccountModel();
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
