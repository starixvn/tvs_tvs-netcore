import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemsSelect } from '../items-select';

@Component({
  standalone: true,
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  imports: [CommonModule, FormsModule]
})

export class TreeViewComponent {
  @Input() items: Array<ItemsSelect>;
  @Input() isDisabled: boolean;
  lastItem: ItemsSelect;
  isShiftKey: boolean;
  
  keyDownEvent() {
    this.isShiftKey = true;
  }

  keyUpEvent() {
    this.isShiftKey = false;
  }

  handleClick(item: ItemsSelect) {
    if (this.isShiftKey) {
      this.handleEventWithShiftCheckbox(item);
    }

    this.lastItem = item;
  }

  handleEventWithShiftCheckbox(item: ItemsSelect) {
    if (this.lastItem !== undefined) {
      this.checkToListItem(item);
    }
  }

  checkToListItem(item: ItemsSelect) {
    const current = this.items.indexOf(item);
    const last = this.items.indexOf(this.lastItem);
    const end = Math.max(last, current);
    const start = Math.min(last, current);
    for (let i = start; i <= end; i++) {
      this.items[i].checked = item.checked;
    }
  }
}
