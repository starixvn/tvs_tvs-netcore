import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { VoidedReason } from 'src/utility/models/reason.model';
import { LABELS } from '../../../utility/constants/labels';
import { Tooltip } from '../../components/tooltip/tooltip.model';
import { Confirmation } from './confirmation';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent implements OnInit {
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
  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnInit(): void {
    (async () => {

    })();
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
