import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Tooltip } from '../../components/tooltip/tooltip.model';
import { TEXT } from '../../constants/text';
import { TooltipComponent } from '../tooltip/tooltip.component';
import { GroupUsername, UsernameItem } from './user-names.model';

@Component({
  standalone: true,
  selector: 'user-names',
  templateUrl: './user-names.component.html',
  styleUrls: ['./user-names.component.scss'],
  imports: [FormsModule, CommonModule, TooltipComponent, NgbTooltip],
})
export class UsernamesComponent implements OnChanges {
  private readonly errorTooltipClassName = 'invalid-data';
  @ViewChild('input') input;
  @Input() isAbException = false;
  @Input() usernameComponentCss = '';
  @Input() inputUsernameStyle = {};
  @Input() inputUsernameCss = '';
  @Input() model = '';
  @Input() disabled = false;
  @Input() maxUsername = 50;
  @Output() focusOutUsernames = new EventEmitter();
  @Output() change = new EventEmitter();
  @Output() modelChange = new EventEmitter<string>();
  @Output() afterFocusOutBetIds = new EventEmitter<string>();

  maxLengthOneUsername = 30;
  groupUsername = new GroupUsername();
  username: string;
  lastItem: UsernameItem;
  shiftKey: boolean;
  tooltip = new Tooltip();
  isFocusingUsernames = false;
  isSelectedAll = false;

  element = inject(ElementRef);
  constructor() {
    this.tooltip.element = this.element;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model) {
      this.groupUsername = new GroupUsername();
      if (this.model !== undefined && this.model !== null && this.model !== '') {
        const list = this.model.split(',');
        list.forEach(item => {
          this.addItem(item, true);
        });
      }
    }
  }

  focusUsername() {
    this.input.nativeElement.focus();
    this.isFocusingUsernames = true;
  }

  onBlurBetIdInput(value: string) {
    this.addItem(value, true);
    this.afterFocusOutBetIds.emit(value);
  }

  addItem(value: string, preventEmitChange: boolean) {
    const MAX_CHARS = 30;
    if (value !== undefined && value !== '' && this.groupUsername.items.length < this.maxUsername) {
      value = value.length > MAX_CHARS ? value.substring(0, MAX_CHARS) + '...' : value;
      const item = new UsernameItem(value);
      this.groupUsername.items.push(item);
      this.model = this.groupUsername.getAllValue();
      if (!preventEmitChange) {
        this.modelChange.emit(this.groupUsername.getAllValue());
        this.change.emit();
      }
    }
    this.username = '';
  }

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
        const trimText = item.slice(0, this.maxLengthOneUsername);
        this.addItem(trimText, false);
      });

      setTimeout(() => {
        this.username = '';
      }, 0);
    }
  }

  clickEvent(item: UsernameItem) {
    if (this.lastItem !== undefined && this.shiftKey) {
      this.selectItems(item);
    }

    this.lastItem = item;
  }

  selectItems(item: UsernameItem) {
    const isSelected = item.isSelected;
    const current = this.groupUsername.items.indexOf(item);
    const last = this.groupUsername.items.indexOf(this.lastItem);
    const end = Math.max(last, current);
    const start = Math.min(last, current);
    for (let i = start; i < end; i++) {
      this.groupUsername.items[i].changeSelectedAll(isSelected);
    }
  }

  isCtrlKeyAndNumpad1Key(event: KeyboardEvent, code: number): boolean {
    const KEY_NUMPAD_1 = 97;
    return event.ctrlKey && code === KEY_NUMPAD_1;
  }

  selectAllItems() {
    this.isSelectedAll = !this.isSelectedAll;
    this.groupUsername.items.forEach(item => {
      item.changeSelectedAll(this.isSelectedAll);
    });
  }

  onKey(event: KeyboardEvent): boolean | undefined {
    const KEY_SPACE = 32;
    const KEY_SEMICOLON_FIREFOX = 59;
    const KEY_COMMA = 44;
    const count = this.groupUsername.items.length;
    const value = this.username;
    const keyAddItem = [KEY_SEMICOLON_FIREFOX, KEY_COMMA, KEY_SPACE];
    const keyBackspace = 66;
    const keyDelete = 68;
    const code = event.key.charCodeAt(0);
    if (this.isCtrlKeyAndNumpad1Key(event, code)) {
      this.groupUsername.selectAllItems();
    } else if (code === keyBackspace && value === '') {
      this.groupUsername.removeLasted();
    } else if (code === keyDelete) {
      this.groupUsername.removeSelected();
    } else if (keyAddItem.indexOf(code) > -1) {
      if (value === '') {
        event.preventDefault();
        return;
      }
      this.addItem(value, false);
      event.preventDefault();
    } else if (count >= this.maxUsername) {
      return false;
    } else {
      return true;
    }
  }

  checkValidation(): boolean {
    if (this.groupUsername.getValue() === '') {
      this.tooltip.display(this.errorTooltipClassName, TEXT.REQUIRED_USERNAME);
      return false;
    }

    return true;
  }

  checkValidItems(): boolean {
    const validIndex = this.groupUsername.checkValidItems();
    const tooltipMessages = {
      1: TEXT.REQUIRED_USERNAME,
      2: TEXT.INVALID_USERNAMES,
      3: TEXT.MAX_USERNAME_EXCEEDED,
    };
    if (validIndex in tooltipMessages) {
      this.tooltip.display(this.errorTooltipClassName, tooltipMessages[validIndex]);
      return false;
    }

    return true;
  }

  clearUsernames() {
    this.groupUsername.items = [];
  }

  triggerFocusOutUsernames(): void {
    this.input.nativeElement.blur();
    this.focusOutUsernames.emit();
  }

  deleteItem(item: UsernameItem): void {
    this.groupUsername.remove(item);
    this.model = this.groupUsername.getAllValue();
    this.modelChange.emit(this.groupUsername.getAllValue());
    this.change.emit();
  }

  isShowButtonRemoveInvalid() {
    const validIndex = this.groupUsername.checkValidItems();
    return this.isAbException && validIndex === 2;
  }

  removeInvalidUserNames() {
    this.groupUsername.removeExistedUsernames();
    const usernames = this.groupUsername.getAllValue();
    const duplicatedItems = this.groupUsername.getDuplicatedItems(usernames);
    this.groupUsername.removeInvalidUsernames();
    duplicatedItems.forEach(x => this.addItem(x, true))
  }

  showErrorTicketLimitExceeded() {
    this.tooltip.display(this.errorTooltipClassName, TEXT.TICKET_LIMIT_EXCEEDED);
  }
}
