import { Injectable } from '@angular/core';
import { ItemsSelect } from './items-select';

@Injectable({
  providedIn: 'root'
})
export class ItemsSelectService {
  static initItemsSelect(id: number, value: string, text: string, checked: boolean, expanded: boolean, enable: boolean, items: ItemsSelect[]) {
    const itemsSelect = new ItemsSelect();
    itemsSelect.id = id;
    itemsSelect.value = value;
    itemsSelect.text = text;
    itemsSelect.checked = checked;
    itemsSelect.expanded = expanded;
    itemsSelect.enable = enable;
    itemsSelect.items = items;
    itemsSelect.countChilds = 0;
    itemsSelect.countChilds = this.getCountChild(itemsSelect);

    return itemsSelect;
  }

  static getCountChild(itemsSelect: ItemsSelect) {
    if (itemsSelect.items.length === 0) {
      itemsSelect.countChilds = 1;
    }

    itemsSelect.items.forEach(item => {
      itemsSelect.countChilds += item.countChilds;
    });

    return itemsSelect.countChilds;
  }

  checkBySelectedItem(itemsSelect: ItemsSelect, selectedItems: string[]): void {
    itemsSelect.items.forEach(item => {
      item.checked = selectedItems?.includes(item.value);
      this.checkBySelectedItem(item,selectedItems);
    });
    itemsSelect.checked = selectedItems?.includes(itemsSelect.value) || (itemsSelect.items.length > 0 && this.allChildIsChecked(itemsSelect));
  }

  expandedAllItems(itemsSelect: ItemsSelect) {
    itemsSelect.expanded = true;
    itemsSelect.items.forEach(item => {
      this.expandedAllItems(item);
    });
  }

  checkChilds(itemsSelect: ItemsSelect) {
    itemsSelect.items.forEach(item => {
      item.checked = item.enable ? itemsSelect.checked : item.checked;
      this.checkChilds(item);
    });
  }

  checkFromChilds(itemsSelect: ItemsSelect) {
    itemsSelect.checked = this.allChildIsChecked(itemsSelect);
    itemsSelect.items.forEach(item => {
      this.checkFromChilds(item);
    });
  }

  allChildIsChecked(itemsSelect: ItemsSelect) {
    return itemsSelect.countChilds === this.countChildsChecked(itemsSelect);
  }

  countChildsChecked(itemsSelect: ItemsSelect) {
    let count = 0;
    if (itemsSelect.items.length === 0) {
      count = itemsSelect.checked ? 1 : 0;
    }
    itemsSelect.items.forEach(item => {
      count += this.countChildsChecked(item);
    });

    return count;
  }

  getValueChildsChecked(itemsSelect: ItemsSelect) {
    let values = '';
    if (itemsSelect.items.length === 0) {
      values = itemsSelect.checked ? itemsSelect.value : '';
    }

    itemsSelect.items.forEach(item => {
      const value = this.getValueChildsChecked(item);
      if (value !== '') {
        values = values === '' ? value : values + ',' + value;
      }
    });

    return values;
  }

  getTextChildsChecked(itemsSelect: ItemsSelect) {
    let text = '';
    if (itemsSelect.items.length === 0) {
      text = itemsSelect.checked ? itemsSelect.text : '';
    }

    itemsSelect.items.forEach(item => {
      const textItem = this.getTextChildsChecked(item);
      if (textItem !== '') {
        text = text === '' ? textItem : text + ',' + textItem;
      }
    });

    return text;
  }
}
