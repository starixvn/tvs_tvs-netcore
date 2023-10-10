import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Tooltip } from '../../components/tooltip/tooltip.model';
import { LABELS } from '../../constants/labels';
import { GroupUsername, UsernameItem } from './user-names.model';

@Component({
  selector: 'user-names',
  templateUrl: './user-names.component.html',
  styleUrls: ['./user-names.component.scss']
})
export class UsernamesComponent implements OnInit {
  private readonly errorTooltipClassName = 'invalid-data';
  @ViewChild('input') input;
  @Input() isAbException = false;
  @Input() userNameComponentCss = '';
  @Input() widthCss = '';
  @Input() model = '';
  @Input() disabled = false;
  @Input() maxUsername = 50;
  @Output() focusOutUsernames = new EventEmitter();
  maxLengthOneUsername = 30;
  groupUsername: GroupUsername;
  username: string;
  lastItem: UsernameItem;
  shiftKey: boolean;
  tooltip = new Tooltip();
  isFocusingUsernames = false;
  isSelectedAll = false;

  constructor(private readonly element: ElementRef) {
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    this.groupUsername = new GroupUsername();
    if (this.model !== undefined && this.model !== null && this.model !== '') {
      const list = this.model.split(',');
      list.forEach(item => {
        this.addItem(item);
      });
    }
  }

  focusUsername() {
    this.input.nativeElement.focus();
    this.isFocusingUsernames = true;
  }

  addItem(value: string) {
    const MAX_CHARS = 30;
    if (value !== undefined && value !== '' && this.groupUsername.items.length < this.maxUsername) {
      value = value.length > MAX_CHARS ? value.substring(0, MAX_CHARS) + '...' : value;
      const item = new UsernameItem(value);
      this.groupUsername.items.push(item);
      this.model = this.groupUsername.getAllValue();
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
        this.addItem(trimText);
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
      this.addItem(value);
      event.preventDefault();
    } else if (count >= this.maxUsername) {
      return false;
    } else {
      return true;
    }
  }

  checkValidation(): boolean {
    if (this.groupUsername.getValue() === '') {
      this.tooltip.display(this.errorTooltipClassName, LABELS.REQUIRED_USERNAME);
      return false;
    }

    return true;
  }

  checkValidItems(): boolean {
    const validIndex = this.groupUsername.checkValidItems();
    let result = true;
    switch (validIndex) {
      case 1:
        this.tooltip.display(this.errorTooltipClassName, LABELS.REQUIRED_USERNAME);
        result = false;
        break;
      case 2:
        this.tooltip.display(this.errorTooltipClassName, LABELS.INVALID_USERNAMES);
        result = false;
        break;
      case 3:
        this.tooltip.display(this.errorTooltipClassName, LABELS.MAX_USERNAME_EXCEEDED);
        result = false;
        break;
      case 0:
        result = true;
        break;
    }
    return result;
  }

  clearUsernames() {
    this.groupUsername.items = [];
  }

  triggerFocusOutUsernames(): void {
    this.input.nativeElement.blur();
    this.focusOutUsernames.emit();
  }
}
