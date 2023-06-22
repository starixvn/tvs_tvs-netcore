import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IModal } from '../modal.model';

@Component({
  selector: 'modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent {
  data: IModal = {};
  @Output() confirm = new EventEmitter();
  @Output() confirmYes = new EventEmitter();
  @Output() confirmNo = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) { }

  confirmClick() {
    this.confirm.emit();
    this.activeModal.close('Confirm Click');
  }

  confirmClickYes() {
    this.confirmYes.emit();
    this.activeModal.close('Confirm Click Yes');
  }

  confirmClickNo() {
    this.confirmNo.emit();
    this.activeModal.close('Confirm Click No');
  }

  dismissClick() {
    this.close.emit();
    this.activeModal.dismiss('Cross click');
  }

  closeClick() {
    this.close.emit();
    this.activeModal.close('Cancel click');
  }

  copiedContent() {
    alert('The Content has been copied to clipboard.');
  }
}
