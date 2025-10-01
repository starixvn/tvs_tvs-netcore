import { inject, Injectable } from '@angular/core';
import { ItemsSelect } from './items-select';
import { MultipleSelection } from './multiple-selection.model';
import { ItemsSelectService } from './items-select.service';

@Injectable({
  providedIn: 'root'
})
export class MultipleSelectionService {
  private readonly itemsSelectService = inject(ItemsSelectService);
  
  getValueItems(multipleSelection: MultipleSelection) {
    let value = '';
    multipleSelection.items.forEach(item => {
      const valueItem = this.itemsSelectService.getValueChildsChecked(item);
      if (valueItem !== '') {
        value = value === '' ?
          valueItem : value + ',' + valueItem;
      }
    });

    return value.toString().replace(/,/g, multipleSelection.characterValue);
  }

  getValueCheckedItemsList(items: ItemsSelect[]) {
    return items.filter(x => x.checked).map(y => y.value);
  }

  getDisplayedItems(multipleSelection: MultipleSelection) {
    const maxNumberItems = multipleSelection.numberItemsDisplay;
    let countChecked = 0;
    let count = 0;
    let text = '';

    multipleSelection.items.forEach(item => {
      countChecked += this.itemsSelectService.countChildsChecked(item);
      count += item.countChilds;
      const textItems = this.itemsSelectService.getTextChildsChecked(item);

      if (textItems !== '') {
        text = text === '' ?
          textItems : text + ',' + textItems;
      }
    });

    text = text.replace(/,/g, multipleSelection.characterText);
    let textDisplay =
      count === countChecked ? multipleSelection.allItemsCheckedText :
        countChecked === 0 ? multipleSelection.noneItemCheckedText :
          countChecked > maxNumberItems ? `${countChecked}` + multipleSelection.subfixNumberItemsCheckedText :
            text;
    if (count === 0 && !multipleSelection.isDefaultSelectAll) {
      textDisplay = multipleSelection.noneItemCheckedText;
    }
    multipleSelection.isShowPlaceHolder = textDisplay === multipleSelection.noneItemCheckedText;

    return textDisplay;
  }

  checkAllItems(multipleSelection: MultipleSelection, isChecked: boolean) {
    multipleSelection.items.forEach(item => {
      item.checked = isChecked;
      this.itemsSelectService.checkChilds(item);
    });
    multipleSelection.selectionTitle = this.getDisplayedItems(multipleSelection);
  }

  updateItemChecked(multipleSelection: MultipleSelection, checkedItems: string[]) {
    multipleSelection.items.forEach(item => item.checked = checkedItems.includes(item.value));
    multipleSelection.selectionTitle = this.getDisplayedItems(multipleSelection);
  }

  updateChildItemsChecked(multipleSelection: MultipleSelection, checkedItems: string[]) {
    multipleSelection.items.forEach(group => {
      group.items.forEach(item => item.checked = checkedItems.includes(item.value));
      group.checked = checkedItems.includes(group.value)
        || (group.items.filter(x => x.checked).length === group.items.length && group.items.length > 0);
    });
    multipleSelection.selectionTitle = this.getDisplayedItems(multipleSelection);
  }

  updateDisableStatus(items: ItemsSelect[], isDisabled: boolean) {
    items.forEach(item => item.enable = !isDisabled);
  }
}
