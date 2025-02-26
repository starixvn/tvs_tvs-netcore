import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { LABELS } from '../../../utility/constants/labels';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Tooltip } from '../../components/tooltip/tooltip.model';
import { Confirmation } from './confirmation';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from '../tooltip/tooltip.component';

@Component({
  standalone: true,
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  imports: [FormsModule, TooltipComponent]
})

export class ConfirmationComponent {
  @Output() voidAll = new EventEmitter<boolean>();
  @Input() isDisabledButton = false;
  tooltip = new Tooltip();
  initialVoidReason = new VoidedReason();
  confirmation: Confirmation = {
    userName: document.body.getAttribute('user-name'),
    userPassword: '',
    voidReason: {
      reasonEnglish: '',
      reasonChineseSimplified: ''
    } as VoidedReason,
  };

  element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  voidAllPage() {
    this.voidAll.emit(true);
  }

  checkValidation(): boolean {
    if (this.confirmation.voidReason.reasonEnglish === '') {
      this.tooltip.display('reason', LABELS.INPUT_REASON);
      return false;
    }
    if (this.confirmation.voidReason.reasonChineseSimplified === '') {
      this.tooltip.display('reasonSC', LABELS.INPUT_REASON);
      return false;
    }
    if (this.confirmation.userPassword === '') {
      this.tooltip.display('password', LABELS.INPUT_PASSWORD);
      return false;
    }

    return true;
  }

  clearData() {
    this.confirmation.voidReason.reasonEnglish = '';
    this.confirmation.voidReason.reasonChineseSimplified = '';
    this.confirmation.userPassword = '';
  }
}
