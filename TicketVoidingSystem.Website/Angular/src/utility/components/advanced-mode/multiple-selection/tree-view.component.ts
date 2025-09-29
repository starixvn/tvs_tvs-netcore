import { Component, Input } from '@angular/core';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'tree-view',
  styleUrls: ['./tree-view.component.scss'],
  templateUrl: './tree-view.component.html',
  imports: [CommonModule, FormsModule]
})

export class TreeViewComponent {
  @Input() items: Array<ItemsSelect>;
  lastItem: ItemsSelect;
  shiftKey: boolean;

  keyDown() {
    this.shiftKey = true;
  }

  keyUp() {
    this.shiftKey = false;
  }

  clickEvent(item: ItemsSelect) {
    if (this.shiftKey) {
      this.handleWithShiftCheckbox(item);
    }

    this.lastItem = item;
  }

  private handleWithShiftCheckbox(item: ItemsSelect) {
    if (this.lastItem !== undefined) {
      this.checkListItem(item);
    }
  }

  private checkListItem(item: ItemsSelect) {
    const last = this.items.indexOf(this.lastItem);
    const current = this.items.indexOf(item);
    const start = Math.min(last, current);
    const end = Math.max(last, current);
    for (let i = start; i <= end; i++) {
      this.items[i].checked = item.checked;
    }
  }
}
