import { GroupReducedOverConstant } from "src/add-request/app/add-request/event-reduced-over/constants/bet-type-reduced-over.constant";

export class NgSelectMixtureItem {
  value: string;
  name: string;
  parentId: number;
  checked: boolean;
  expanded: boolean;
  items: NgSelectMixtureItem[];
  countChilds: number;
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
    this.countChilds = 0;
    this.countChilds = this.getCountChilds();
  }

  getCountChilds(): number {
    if (this.items.length === 0) {
      this.countChilds = 1;
    }

    this.items.forEach(item => {
      this.countChilds += item.countChilds;
    });

    return this.countChilds;
  }

  checkChilds(): void {
    this.items.forEach(item => {
      item.checked = item.enabled ? this.checked : item.checked;
      item.checkChilds();
    });
  }

  checkBySelectedItem(selectedItems: string[]): void {
    this.items.forEach(item => {
      item.checked = selectedItems.includes(item.value);
      item.checkBySelectedItem(selectedItems);
    });
    this.checked = this.isItemGroup() ? this.items.every(x => x.checked) : selectedItems.includes(this.value);;
  }

  unCheckChilds(): void {
    this.items.forEach(item => {
      item.checked = false;
      item.unCheckChilds();
    });
  }

  checkFromChilds(): void {
    this.checked = this.allChildIsChecked();
  }

  allChildIsChecked(): boolean {
    return this.countChilds === this.countChildsChecked();
  }

  expandedAllItems(): void {
    this.expanded = true;
    this.items.forEach(item => {
      item.expandedAllItems();
    });
  }

  countChildsChecked(): number {
    let count = 0;
    if (this.items.length === 0) {
      count = this.checked ? 1 : 0;
    }
    this.items.forEach(item => {
      count += item.countChildsChecked();
    });

    return count;
  }


  getValueChildsChecked(): string[] {
    const values: string[] = [];
    if (this.items.length === 0 && this.checked) {
      values.push(this.value);
    }

    this.items.forEach(item => {
      const value = item.getValueChildsChecked();
      values.push(...value);
    });

    return values;
  }

  getTextChildsChecked(): string {
    let text = '';
    if (this.items.length === 0) {
      text = this.checked ? this.name : '';
    }

    this.items.forEach(item => {
      const textItem = item.getTextChildsChecked();
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
