import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';

import { Confirmation } from './confirmation';
import { Tooltip } from '../../modules/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';

@Component({
  selector: 'confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent implements OnInit {
  @Output() voidAll = new EventEmitter<boolean>();
  @Input() isDisabledButton = false;
  tooltip = new Tooltip();
  confirmation: Confirmation = {
    userName: document.body.getAttribute('user-name'),
    reason: '',
    reasonSC: '',
    userPassword: ''
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
    if (this.confirmation.reason === '') {
      this.tooltip.display('reason', LABELS.INPUT_REASON);
      return false;
    }
    if (this.confirmation.reasonSC === '') {
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
    this.confirmation.reason = '';
    this.confirmation.reasonSC = '';
    this.confirmation.userPassword = '';
  }
}
