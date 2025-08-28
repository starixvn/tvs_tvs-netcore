import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TEXT } from '../../constants/text';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { Tooltip } from '../tooltip/tooltip.model';
import { GroupNumber, NumberItem } from './bet-ids.model';

@Component({
  standalone: true,
  selector: 'bet-ids',
  templateUrl: './bet-ids.component.html',
  styleUrls: ['./bet-ids.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [FormsModule, TooltipComponent, CommonModule, NgbTooltip]
})
export class BetIdsComponent implements OnInit {
  private readonly errorTooltipClassName = 'invalid-data';
  @ViewChild('betIdInput') betIdInput;

  @Input() maxItems = 2000;
  @Input() initBetIds = '';
  @Input() hideWarningMove = false;
  @Input() warningMoveText = '(*) Moved tickets are highlighted in ORANGE.';
  @Input() hideInvalid = false;
  @Input() hideDifferentMatch = true;
  @Input() betIdComponentCss = '';
  @Input() betIdInputCss: {};
  @Input() disabled = false;
  @Input() isShowLabel = true;
  @Output() afterFocusOutBetIds = new EventEmitter<string>();
  groupNumber = new GroupNumber();
  transId: string;
  lastItem: NumberItem;
  shiftKey: boolean;
  tooltip = new Tooltip();
  private readonly element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    if (this.initBetIds) {
      const list = this.initBetIds.split(',');
      list.forEach(item => {
        this.addNewBetId(item);
      });
    }
  }

  getInvalidItems(): string {
    return this.groupNumber.getInvalidItemsAsString();
  }

  getAllBetIds(): string {
    return this.groupNumber.getAllNumberItemsAsString();
  }

  getAllBetIdsAreNotNumber(): string {
    return this.groupNumber.getAllNotNumberItemsAsString();
  }

  isHasBetId(): boolean {
    if (this.groupNumber.getAllNumberItemsAsString() === '') {
      this.tooltip.display(this.errorTooltipClassName, TEXT.REQUIRED_BETIDS);
      return false;
    }

    return true;
  }

  isAllBetIdsValid(): boolean {
    const validIndex = this.groupNumber.checkValidItems();
    let result = true;
    switch (validIndex) {
      case 0:
        this.tooltip.display(this.errorTooltipClassName, TEXT.REQUIRED_BETIDS);
        result = false;
        break;
      case 1:
        this.tooltip.display(this.errorTooltipClassName, TEXT.INVALID_BETID);
        result = false;
        break;
      case 2:
        result = true;
        break;
    }

    return result;
  }


  onBlurBetIdInput(value: string) {
    this.addNewBetId(value);
    this.afterFocusOutBetIds.emit(value);
  }

  clearBetId() {
    this.groupNumber.items = [];
  }

  triggerFocusOutBetIds() {
    this.betIdInput.nativeElement.blur();
  }

  focusBetIdInput(): void {
    this.betIdInput.nativeElement.focus();
  }

  private addNewBetId(value: string) {
    const MAX_CHARS = 75;
    if (value && this.groupNumber.items.length < this.maxItems) {
      value = value.length > MAX_CHARS ? value.substring(0, MAX_CHARS) + '...' : value;
      const item = new NumberItem(value);
      this.groupNumber.items.push(item);
    }
    this.transId = '';
  }

  // Event function
  pasteItem(event: ClipboardEvent) {
    if (!this.disabled) {
      const data = event.clipboardData.getData('text');
      const items = data
        .replace(/ /g, ',')
        .replace(/;/g, ',')
        .replace(/\r\n/g, ',')
        .replace(/\n/g, ',')
        .replace(/\t/g, ',')
        .split(',');
      items.forEach(item => {
        this.addNewBetId(item);
      });

      setTimeout(() => {
        this.transId = '';
      }, 0);
    }
  }

  checkValidationOfSpecialKeys(event: KeyboardEvent, code: number): boolean {
    const KEY_DIGIT_0 = 48;
    const KEY_DIGIT_9 = 57;
    const KEY_NUMPAD_3 = 99;
    const KEY_F7 = 118;
    const KEY_E = 69;
    const KEY_H = 72;
    return (
      (event.ctrlKey && (code === KEY_F7 || code === KEY_NUMPAD_3)) ||
      code === KEY_H ||
      code === KEY_E ||
      (code >= KEY_DIGIT_0 && code <= KEY_DIGIT_9)
    );
  }

  isShiftKeyAndNotDigitalKey(event: KeyboardEvent, code: number): boolean {
    const KEY_DIGIT_0 = 48;
    const KEY_DIGIT_9 = 57;
    return event.shiftKey && (code >= KEY_DIGIT_0 && code <= KEY_DIGIT_9);
  }

  isCtrlKeyAndNumpad1Key(event: KeyboardEvent, code: number): boolean {
    const KEY_NUMPAD_1 = 97;
    return event.ctrlKey && code === KEY_NUMPAD_1;
  }

  onKey(event: KeyboardEvent): boolean | undefined {
    const KEY_E = 69;
    const KEY_SPACE = 32;
    const KEY_SEMICOLON_FIREFOX = 59;
    const count = this.groupNumber.items.length;
    const value = this.transId;
    const keyAddItem = [KEY_SEMICOLON_FIREFOX, KEY_E, KEY_SPACE];
    const keyBackspace = 66;
    const keyDelete = 68;
    const code = event.key.charCodeAt(0);

    if (code === keyBackspace && value === '') {
      this.groupNumber.removeLasted();
    } else if (this.isShiftKeyAndNotDigitalKey(event, code)) {
      event.preventDefault();
    } else if (this.isCtrlKeyAndNumpad1Key(event, code)) {
      this.groupNumber.selectAllItems();
    } else if (code === keyDelete) {
      this.groupNumber.removeSelected();
    } else if (keyAddItem.indexOf(code) > -1) {
      if (value === '') {
        event.preventDefault();
        return;
      }

      this.addNewBetId(value);
      event.preventDefault();
    } else if (count >= this.maxItems) {
      return false;
    } else {
      return this.checkValidationOfSpecialKeys(event, code);
    }
  }

  removeTransId(transIds: string): void {
    transIds.split(',').forEach(x => {
      this.groupNumber.removeByValue(x);
    });
  }

  //ENd Event function
}
