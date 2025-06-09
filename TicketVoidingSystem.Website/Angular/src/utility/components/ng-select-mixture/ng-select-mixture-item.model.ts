import { GroupReducedOverConstant } from '../../../add-request/app/add-request/event-reduced-over/constants/bet-type-reduced-over.constant';

export class NgSelectMixtureItem {
  value: string;
  name: string;
  parentId: number;
  checked: boolean;
  expanded: boolean;
  items: NgSelectMixtureItem[];
  countChild: number;
  enabled: boolean;

  constructor(
    value: string,
    name: string,
    parentId: number,
    checked: boolean,
    expanded: boolean,
    enabled: boolean,
    items: NgSelectMixtureItem[]) {
    this.value = value;
    this.name = name;
    this.parentId = parentId;
    this.checked = checked;
    this.expanded = expanded;
    this.items = items;
    this.enabled = enabled;
    this.countChild = 0;
    this.countChild = this.getCountChild();
  }

  getCountChild(): number {
    if (this.items.length === 0) {
      this.countChild = 1;
    }

    this.items.forEach(item => {
      this.countChild += item.countChild;
    });

    return this.countChild;
  }

  checkChild(): void {
    this.items.forEach(item => {
      item.checked = item.enabled ? this.checked : item.checked;
      item.checkChild();
    });
  }

  checkBySelectedItem(selectedItems: string[]): void {
    this.items.forEach(item => {
      item.checked = selectedItems.includes(item.value);
      item.checkBySelectedItem(selectedItems);
    });
    this.checked = this.isItemGroup() ? this.items.every(x => x.checked) : selectedItems.includes(this.value);
  }

  unCheckChild(): void {
    this.items.forEach(item => {
      item.checked = false;
      item.unCheckChild();
    });
  }

  checkFromChild(): void {
    this.checked = this.allChildIsChecked();
  }

  allChildIsChecked(): boolean {
    return this.countChild === this.countChildChecked();
  }

  expandedAllItems(): void {
    this.expanded = true;
    this.items.forEach(item => {
      item.expandedAllItems();
    });
  }

  countChildChecked(): number {
    let count = 0;
    if (this.items.length === 0) {
      count = this.checked ? 1 : 0;
    }
    this.items.forEach(item => {
      count += item.countChildChecked();
    });

    return count;
  }


  getValueChildChecked(): string[] {
    const values: string[] = [];
    if (this.items.length === 0 && this.checked) {
      values.push(this.value);
    }

    this.items.forEach(item => {
      const value = item.getValueChildChecked();
      values.push(...value);
    });

    return values;
  }

  getTextChildChecked(): string {
    let text = '';
    if (this.items.length === 0) {
      text = this.checked ? this.name : '';
    }

    this.items.forEach(item => {
      const textItem = item.getTextChildChecked();
      if (textItem !== '') {
        text = text === '' ? textItem : text + ',' + textItem;
      }
    });

    return text;
  }

  isSingleSelect(): boolean {
    return this.items.length === 0 && this.parentId === 0;
  }

  isItemGroup(): boolean {
    return this.value === GroupReducedOverConstant.ALL_HOME_OE.toString()
      || this.value === GroupReducedOverConstant.ALL_AWAY_OE.toString()
      || this.value === GroupReducedOverConstant.OTHERS_OE_BET_TYPE.toString();
  }
}
