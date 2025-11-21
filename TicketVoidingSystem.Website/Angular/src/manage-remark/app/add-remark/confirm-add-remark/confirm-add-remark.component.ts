import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'confirm-add-remark',
  templateUrl: './confirm-add-remark.component.html',
  styleUrl: './confirm-add-remark.component.scss',
  imports: [CommonModule]
})
export class ConfirmAddRemarkComponent {
  @Input() isOpen: boolean;
  @Input() isEdit: boolean;
  @Output() clickOk = new EventEmitter();
  @Output() clickCancel = new EventEmitter();

  onClickCancel() {
    this.clickCancel.emit();
  }

  onClickOk() {
    this.clickOk.emit();
  }

  getTitle(): string {
    return this.isEdit ? "ARE YOU SURE YOU WANT TO EDIT THIS REMARK?" : "ARE YOU SURE YOU WANT TO ADD THIS REMARK?";
  }
}
