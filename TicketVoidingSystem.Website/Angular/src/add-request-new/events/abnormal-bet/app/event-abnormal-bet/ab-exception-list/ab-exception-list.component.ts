import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupNumber, NumberItem } from '../../../../../../utility/components/bet-ids/bet-ids.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ab-exception-list',
  templateUrl: './ab-exception-list.component.html',
  styleUrl: './ab-exception-list.component.scss',
  imports: [FormsModule, CommonModule]
})
export class AbExceptionListComponent {
  @Input() betIds = '';
  @Input() isVoided = false;
  @Output() changeAbExceptionList = new EventEmitter<string>();

  groupNumber = new GroupNumber();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['betIds']) {
      this.updateGroupItems();
    }
  }

  removeAllItems() {
    this.groupNumber.items = [];
    this.betIds = '';
    this.changeAbExceptionList.emit(this.betIds);
  }

  removeItem(item: NumberItem) {
    this.groupNumber.remove(item);
    this.betIds = this.betIds.replace(item.value, '');
    this.changeAbExceptionList.emit(this.betIds);
  }

  private updateGroupItems() {
    if (!this.betIds || this.betIds.length === 0) {
      this.groupNumber.items = [];
      return;
    }

    const items = this.betIds.split(',').filter(x => x?.length > 0);
    items.forEach(item => {
      if (!this.groupNumber.items.find(x => x.value === item)) {
        this.groupNumber.items.push(new NumberItem(item));
      }
    });
  }
}
