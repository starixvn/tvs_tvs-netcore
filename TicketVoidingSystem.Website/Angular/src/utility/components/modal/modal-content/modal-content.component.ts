import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { SanitizeHtmlPipe } from 'src/utility/pipes/sanitize-html.pipe';
import { IModal } from '../modal.model';

@Component({
  standalone: true,
  selector: 'modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  imports: [FormsModule, CommonModule, SanitizeHtmlPipe, ClipboardModule],
})
export class ModalContentComponent {
  data: IModal = {};
  @Output() confirm = new EventEmitter();
  @Output() confirmYes = new EventEmitter();
  @Output() confirmNo = new EventEmitter();
  @Output() close = new EventEmitter();
  isProcessingOkCallback = false;
  isProcessingYesCallback = false;

  constructor(public activeModal: NgbActiveModal) { }

  confirmClickOk() {
    this.isProcessingOkCallback = true;
    this.confirm.emit();
    this.activeModal.close('Confirm Click');
  }

  confirmClickYes() {
    this.isProcessingYesCallback = true;
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
