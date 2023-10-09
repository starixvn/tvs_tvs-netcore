import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Tooltip } from '../../../external/components/tooltip/tooltip';
import { TEXT } from '../../shared/text';
import { Confirmation } from './confirmation';

const MAX_REASON = 150;

@Component({
    selector: 'confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent {
    @Output() voidEvent = new EventEmitter<boolean>();
    @Input() isShowConfirm: boolean;
    tooltip = new Tooltip;
    confirmation: Confirmation = {
        userName: document.body.getAttribute('user-name'),
        reason: '',
        reasonSC: '',
        userPassword: ''
    };

    constructor(private element: ElementRef) {
        this.tooltip.element = this.element;
    }

    voidBet() {
        this.voidEvent.emit(true);
    }

    checkValidation(): boolean {
        if (this.confirmation.reason === '') {
            this.tooltip.display('reason', TEXT.INPUT_REASON);
            return false;
        }
        if (this.confirmation.reasonSC === '') {
            this.tooltip.display('reasonSC', TEXT.INPUT_REASON);
            return false;
        }
        if (this.confirmation.userPassword === '') {
            this.tooltip.display('password', TEXT.INPUT_PASSWORD);
            return false;
        }

        return true;
    }

    clearData() {
        this.confirmation.reason = '';
        this.confirmation.reasonSC = '';
        this.confirmation.userPassword = '';
    }
}