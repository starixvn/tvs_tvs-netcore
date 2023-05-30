import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Modal } from './modal.model';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() modal: Modal;
    @Output() confirmEvent = new EventEmitter<boolean>();
    @Output() closeEvent = new EventEmitter<boolean>();

    confirm() {
        this.modal.isShow = false;
        this.confirmEvent.emit(true);
    }

    close() {
        this.modal.isShow = false;
        this.closeEvent.emit(true);
    }
}