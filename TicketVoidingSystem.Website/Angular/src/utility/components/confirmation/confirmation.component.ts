import { Component, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tooltip } from '../tooltip/tooltip.model';
import { TEXT } from '../../constants/text';
import { Confirmation } from './confirmation.model';
import { TooltipComponent } from '../tooltip/tooltip.component';
@Component({
    standalone: true,
    selector: 'confirmation-single',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    imports: [CommonModule, FormsModule, TooltipComponent]
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

    element = inject(ElementRef);

    constructor() {
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