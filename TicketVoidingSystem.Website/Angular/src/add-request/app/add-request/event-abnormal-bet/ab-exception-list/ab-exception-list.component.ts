import { Component, Input, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupNumber, NumberItem } from '../../../../../utility/components/bet-ids/bet-ids.model';

@Component({
  standalone: true,
  selector: 'ab-exception-list',
  templateUrl: './ab-exception-list.component.html',
  styleUrl: './ab-exception-list.component.scss',
  imports: [FormsModule]
})
export class AbExceptionListComponent {
  @Input() betIds: string = '';
  groupNumber = new GroupNumber();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['betIds']) {
      this.updateGroupItems();
    }
  }

  removeAllItems() {
    this.groupNumber.items = [];
    this.betIds = '';
  }

  removeItem(item: NumberItem) {
    this.groupNumber.remove(item);
    this.betIds = this.betIds.replace(item.value, '');
  }

  private updateGroupItems() {
    if (this.betIds?.length > 0) {
      const items = this.betIds.split(',').filter(x => x !== '');
      items.forEach(item => {
        if (!this.groupNumber.items.find(x => x.value === item)) {
          this.groupNumber.items.push(new NumberItem(item));
        }
      });
    }
  }

  getAllTransIds(): string {
    return this.groupNumber.getAllNumberItemsAsString();
  }
}
