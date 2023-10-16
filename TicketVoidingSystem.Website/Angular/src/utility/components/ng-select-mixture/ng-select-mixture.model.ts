import { NgSelectMixtureItem } from "./ng-select-mixture-item.model";

export class DefaultValue {
  static readonly maxHeight = '350px';
  static readonly maxWidth = '200px';
  static readonly subfixNumberItemsCheckedText = ' selected';
  static readonly numberItemsDisplay = 1;
  static readonly allItemsCheckedText = '';
  static readonly noneItemCheckedText = 'none ';
  static readonly buttonHeight = '29.5px';
}

export class NgSelectMixtureModel {
  title: string;
  maxHeight: string = DefaultValue.maxHeight;
  maxWidth: string = DefaultValue.maxWidth;
  subfixNumberItemsCheckedText: string = DefaultValue.subfixNumberItemsCheckedText;
  items: NgSelectMixtureItem[] = [];
  isCheckAll: boolean;
  numberItemsDisplay: number = DefaultValue.numberItemsDisplay;
  allItemsCheckedText: string = DefaultValue.allItemsCheckedText;
  noneItemCheckedText: string = DefaultValue.noneItemCheckedText;
  buttonHeight: string = DefaultValue.buttonHeight;
  isShowPlaceHolder: boolean;

  getValueItems(): string[] {
    const values: string[] = [];
    this.items.forEach(item => {
      const valueItems = item.getValueChildsChecked();
      values.push(...valueItems);
    });

    return values;
  }

  getValueCheckedItemsList(): string[] {
    return this.items.filter(x => x.checked).map(y => y.value);
  }

  getValueCheckedAllChildItems(): string {
    const itemsWithChild = this.items.filter(x => x.items.length > 0);
    const allChildItems = [];
    itemsWithChild.forEach(x => {
    if (x.items.length > 0) {
        allChildItems.push(...x.items);
      }
    });

    return allChildItems.filter(x=> x.checked).map(x => x.value).join(',');
  }

  getDisplayedText(selectedItem: string[]): string {
    if(this.isSingleItem(selectedItem)) {
      const x = this.items.find(y => selectedItem.includes(y.value) );
      return x.name;
    } else {
      return this.getDisplayedAllChildItems();
    }
  }

  isSingleItem(selectedItem: string[]): boolean {
    return this.items.some(x => selectedItem.includes(x.value));
  }

  getDisplayedAllChildItems(): string {
    const maxNumberItems = this.numberItemsDisplay;
    const itemHasChild = this.items.filter(x => x.items.length > 0);
    let countChecked = 0;
    let count = 0;
    let text = '';

    itemHasChild.forEach(item => {
      countChecked += item.countChildsChecked();
      count += item.countChilds;
      const textItems = item.getTextChildsChecked();

      if (textItems !== '') {
        text = text === '' ?
          textItems : text + ',' + textItems;
      }
    });

    if (countChecked === 0) {
      this.isShowPlaceHolder = true;
      return this.noneItemCheckedText;
    }

    this.isShowPlaceHolder = false;

    return countChecked > maxNumberItems ? `${countChecked}` + this.subfixNumberItemsCheckedText : text;;
  }

  checkAllItems(isChecked: boolean): void {
    this.items.forEach(item => {
      item.checked = isChecked;
      item.checkChilds();
    });
  }
}
