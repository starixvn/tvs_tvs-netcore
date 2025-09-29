import { Injectable } from '@angular/core';
import { CSSCLASS, GroupNumber, NumberItem } from './bet-ids.model';
import { StaticService } from '../../services/static.service';

@Injectable({
  providedIn: 'root'
})
export class NumberItemService {
  static isNumber(item: NumberItem): boolean {
    return /^\+?(0|[1-9]\d*)$/.test(item.value);
  }

  isInvalidItem(cssClass: string): boolean {
    return cssClass === CSSCLASS.INVALID;
  }

  changeSelectStatus(item: NumberItem, isSelected: boolean) {
    item.isSelected = isSelected;
    item.cssClass = item.isSelected ? CSSCLASS.SELECTED : item.defaultClass;
  }

  private getAllNumberItems(items: NumberItem[]): Array<NumberItem> {
    return items.filter(item => NumberItemService.isNumber(item));
  }

  private getAllNotNumberItems(items: NumberItem[]): Array<NumberItem> {
    return items.filter(item => !NumberItemService.isNumber(item));
  }

  getAllNotNumberItemsAsString(items: NumberItem[]): string {
    return this.getAllNotNumberItems(items).map(item => item.value).join(',');
  }

  getAllNumberItemsAsString(items: NumberItem[]): string {
    return this.getAllNumberItems(items).map(item => item.value).join(',');
  }

  getInvalidItemsAsString(items: NumberItem[]): string {
    return items.filter(item => this.isInvalidItem(item.cssClass)).map(item => item.value).join(',');
  }

  checkValidItems(items: NumberItem[]): number {
    if (items.length === 0) {
      return 0;
    }

    const allTicketValid = items.every(x => x.isValid);
    const isHasValidTicketNotSiteDbDown = items.some(x => x.isValid && x.cssClass !== CSSCLASS.SITE_DB_DOWN);
    return allTicketValid && isHasValidTicketNotSiteDbDown ? 2 : 1;
  }

  checkDuplicatedItems(baseItems: NumberItem[]): void {
    const items = this.getAllNumberItems(baseItems);
    if (items.length !== 0) {
      const valueList = items.map(x => x.value);
      const duplicatedValueList = valueList.filter((item, index) => valueList.indexOf(item) !== index);
      const distinctValueList = Array.from(new Set(duplicatedValueList));
      items.forEach(item => {
        this.setItemInvalid(distinctValueList, item, CSSCLASS.MOVED);
      });
    }
  }

  updateWarningSiteDBDown(items: NumberItem[], text: string, tooltipText?: string) {
    if (StaticService.isStringHasLength(text)) {
      const siteDbDownItems = text.split(',');
      items.forEach(item => this.setItemWarning(siteDbDownItems, item, CSSCLASS.SITE_DB_DOWN, tooltipText));
    }
  }

  updateInvalidItems(items: NumberItem[], text: string, tooltipText?: string) {
    if (StaticService.isStringHasLength(text)) {
      const invalidItems = text.split(',');
      items.forEach(item => this.setItemInvalid(invalidItems, item, CSSCLASS.INVALID, tooltipText));
    }
  }

  updateMoved(items: NumberItem[], text: string) {
    if (StaticService.isStringHasLength(text)) {
      const movedItems = text.split(',');
      items.forEach(item => this.setItemInvalid(movedItems, item, CSSCLASS.MOVED));
    }
  }

  updateDifferent(items: NumberItem[], text: string) {
    if (StaticService.isStringHasLength(text)) {
      const differentItems = text.split(',');
      items.forEach(item => this.setItemInvalid(differentItems, item, CSSCLASS.DIFFERENT));
    }
  }

  remove(items: NumberItem[], item: NumberItem) {
    const index = items.indexOf(item);
    if (index > -1) {
      items.splice(index, 1);
    }
  }

  removeLasted(items: NumberItem[]) {
    items.pop();
  }

  selectAllItems(groupNumber: GroupNumber) {
    groupNumber.isSelectedAll = !groupNumber.isSelectedAll;
    groupNumber.items.forEach(item => {
      this.changeSelectStatus(item, groupNumber.isSelectedAll);
    });
  }

  removeSelected(items: NumberItem[]) {
    const removedItems = items.filter(function (item) {
      return item.isSelected;
    });
    const newItems = items.filter(function (item) {
      return removedItems.indexOf(item) === -1;
    });
    
    return newItems;
  }

  removeByValue(items: NumberItem[], value: string) {
    items.filter(item => item.value === value)
      .forEach(x => {
        const index = items.indexOf(x);
        if (index > -1) {
          items.splice(index, 1);
        }
      });
  }

  resetAllItemsToValid(groupNumber: GroupNumber) {
    groupNumber.isSelectedAll = false;
    groupNumber.items.forEach(item => {
      if (NumberItemService.isNumber(item)) {
        item.isValid = true;
        item.cssClass = CSSCLASS.VALID;
        item.defaultClass = CSSCLASS.VALID;
        item.isShowTooltip = false;
        item.tooltipText = '';
      }
    });
  }

  private setItemWarning(warningList: string[], item: NumberItem, css: string, toolTipText = '') {
    if (warningList.some(warningItem => warningItem === item.value)) {
      item.cssClass = css;
      item.defaultClass = css;
      item.isShowTooltip = toolTipText.length > 0;
      item.tooltipText = toolTipText;
    }
  }
  private setItemInvalid(invalidList: string[], item: NumberItem, css: string, toolTipText = '') {
    if (invalidList.some(invalidItem => invalidItem === item.value)) {
      item.cssClass = css;
      item.defaultClass = css;
      item.isValid = false;
      item.isShowTooltip = toolTipText.length > 0;
      item.tooltipText = toolTipText;
    }
  }
}
