import { Injectable } from '@angular/core';
import { NgSelectMixtureItem } from './ng-select-mixture-item.model';
import { NgSelectMixtureModel } from './ng-select-mixture.model';
import { GroupReducedOverConstant } from '../../../add-request-new/events/reduced-over/app/event-reduced-over/constants/bet-type-reduced-over.constant';

@Injectable({
  providedIn: 'root'
})
export class NgSelectMixtureService {
  getValueItems(items: NgSelectMixtureItem[]): string[] {
    const values: string[] = [];
    items.forEach(item => {
      const valueItems = this.getValueChildChecked(item);
      values.push(...valueItems);
    });

    return values;
  }

  getDisplayedText(model: NgSelectMixtureModel, selectedItem: string[]): string {
    if (this.isSingleItem(model.items, selectedItem)) {
      const x = model.items.find(y => selectedItem.includes(y.value));
      return x.name;
    } else {
      return this.getDisplayedAllChildItems(model);
    }
  }

  private isSingleItem(items: NgSelectMixtureItem[], selectedItem: string[]): boolean {
    return items.some(x => selectedItem.includes(x.value));
  }

  getDisplayedAllChildItems(model: NgSelectMixtureModel): string {
    const maxNumberItems = model.numberItemsDisplay;
    const itemHasChild = model.items.filter(x => x.items.length > 0);
    let countChecked = 0;
    let count = 0;
    let text = '';

    itemHasChild.forEach(item => {
      countChecked += this.countChildChecked(item);
      count += item.countChild;
      const textItems = this.getTextChildChecked(item);

      if (textItems !== '') {
        text = text === '' ?
          textItems : text + ',' + textItems;
      }
    });

    if (countChecked === 0) {
      model.isShowPlaceHolder = true;
      return model.noneItemCheckedText;
    }

    model.isShowPlaceHolder = false;

    return countChecked > maxNumberItems ? `${countChecked}` + model.subfixNumberItemsCheckedText : text;
  }

  initNgSelectMixtureItem(value: string, name: string, parentId: number, checked: boolean, expanded: boolean, enabled: boolean, items: NgSelectMixtureItem[]) {
    const item = new NgSelectMixtureItem();
    item.value = value;
    item.name = name;
    item.parentId = parentId;
    item.checked = checked;
    item.expanded = expanded;
    item.items = items;
    item.enabled = enabled;
    item.countChild = 0;
    item.countChild = this.getCountChild(item);

    return item;
  }

  private getCountChild(itemSelect: NgSelectMixtureItem): number {
    if (itemSelect.items.length === 0) {
      itemSelect.countChild = 1;
    }

    itemSelect.items.forEach(item => {
      itemSelect.countChild += item.countChild;
    });

    return itemSelect.countChild;
  }

  checkChild(itemSelect: NgSelectMixtureItem): void {
    itemSelect.items.forEach(item => {
      item.checked = item.enabled ? itemSelect.checked : item.checked;
      this.checkChild(item);
    });
  }

  checkBySelectedItem(itemSelect: NgSelectMixtureItem, selectedItems: string[]): void {
    itemSelect.items.forEach(item => {
      item.checked = selectedItems.includes(item.value);
      this.checkBySelectedItem(item, selectedItems);
    });
    itemSelect.checked = this.isItemGroup(itemSelect.value) ? itemSelect.items.every(x => x.checked) : selectedItems.includes(itemSelect.value);
  }

  unCheckChild(items: NgSelectMixtureItem[]): void {
    items.forEach(item => {
      item.checked = false;
      this.unCheckChild(item.items);
    });
  }

  checkFromChild(item: NgSelectMixtureItem): void {
    item.checked = this.allChildIsChecked(item);
  }

  private allChildIsChecked(item: NgSelectMixtureItem): boolean {
    return item.countChild === this.countChildChecked(item);
  }

  countChildChecked(itemSelect: NgSelectMixtureItem): number {
    let count = 0;
    if (itemSelect.items.length === 0) {
      count = itemSelect.checked ? 1 : 0;
    }
    itemSelect.items.forEach(item => {
      count += this.countChildChecked(item);
    });

    return count;
  }


  getValueChildChecked(itemSelect: NgSelectMixtureItem): string[] {
    const values: string[] = [];
    if (itemSelect.items.length === 0 && itemSelect.checked) {
      values.push(itemSelect.value);
    }

    itemSelect.items.forEach(item => {
      const value = this.getValueChildChecked(item);
      values.push(...value);
    });

    return values;
  }

  getTextChildChecked(itemSelect: NgSelectMixtureItem): string {
    let text = '';
    if (itemSelect.items.length === 0) {
      text = itemSelect.checked ? itemSelect.name : '';
    }

    itemSelect.items.forEach(item => {
      const textItem = this.getTextChildChecked(item);
      if (textItem !== '') {
        text = text === '' ? textItem : text + ',' + textItem;
      }
    });

    return text;
  }

  isSingleSelect(items: NgSelectMixtureItem[], parentId: number): boolean {
    return items.length === 0 && parentId === 0;
  }

  isItemGroup(value: string): boolean {
    return value === GroupReducedOverConstant.ALL_HOME_OE.toString()
      || value === GroupReducedOverConstant.ALL_AWAY_OE.toString()
      || value === GroupReducedOverConstant.OTHERS_OE_BET_TYPE.toString();
  }
}
