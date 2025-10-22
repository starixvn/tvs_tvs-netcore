import { Injectable } from '@angular/core';
import { CSSCLASS, GroupUsername, UsernameItem } from './user-names.model';
import { TEXT } from '../../constants/text';

@Injectable({
  providedIn: 'root'
})
export class UserNameService {
  changeSelectedAll(usernameItem: UsernameItem, isSelected: boolean) {
    usernameItem.isSelected = isSelected;
    usernameItem.cssClass = usernameItem.isSelected ? CSSCLASS.SELECTED : usernameItem.defaultClass;
  }

  selectAllItems(groupUsername: GroupUsername) {
    groupUsername.isSelectedAll = !groupUsername.isSelectedAll;
    groupUsername.items.forEach(item => {
      this.changeSelectedAll(item, groupUsername.isSelectedAll);
    });
  }

  getAllValue(groupUsername: GroupUsername): string {
    let result = '';
    groupUsername.items.forEach(item => {
      result = result === '' ? item.value : result + ',' + item.value;
    });

    return result;
  }

  removeExistedUsernames(groupUsername: GroupUsername) {
    groupUsername.items = groupUsername.items.filter(x => x.defaultClass !== CSSCLASS.EXISTED)
  }

  removeInvalidUsernames(groupUsername: GroupUsername) {
    groupUsername.items = groupUsername.items.filter(x => x.isValid)
  }

  checkValidItems(groupUsername: GroupUsername): number {
    if (groupUsername.items.length === 0) {
      return 1;
    } else if (groupUsername.items.some(x => !x.isValid)) {
      return 2;
    } else if (groupUsername.isExceededTotalUsernames) {
      return 3;
    }

    return 0;
  }

  private setItemListValue(list: string[], item: UsernameItem, css: string, toolTipText = '') {
    list.forEach(invalidItem => {
      if (item.value === invalidItem) {
        item.cssClass = css;
        item.defaultClass = css;
        item.isValid = false;
        item.isShowTooltip = toolTipText.length > 0;
        item.tooltipText = toolTipText;
      }
    });
  }

  private setItemWarning(list: string[], item: UsernameItem, css: string, toolTipText = '') {
    list.forEach(invalidItem => {
      if (item.value === invalidItem) {
        item.cssClass = css;
        item.defaultClass = css;
        item.isShowTooltip = toolTipText.length > 0;
        item.tooltipText = toolTipText;
      }
    });
  }

  updateInvalid(groupUsername: GroupUsername, text: string) {
    if (text !== null) {
      const invalidItems = text.split(',');
      groupUsername.items.forEach(item => {
        this.setItemListValue(invalidItems, item, CSSCLASS.INVALID);
      });
    }
  }

  updateExisted(groupUsername: GroupUsername, text: string) {
    if (text !== null) {
      const existedItems = text.split(',');
      groupUsername.items.forEach(item => {
        this.setItemListValue(existedItems, item, CSSCLASS.EXISTED);
      });
    }
  }

  updateWarningSiteDBDown(groupUsername: GroupUsername, text: string) {
    if (text !== null) {
      const existedItems = text.split(',');
      groupUsername.items.forEach(item => {
        this.setItemWarning(existedItems, item, CSSCLASS.EXISTED, TEXT.INVALID_USERNAME_SITE_DB_DOWN);
      });
    }
  }

  updateDuplicatedItems(groupUsername: GroupUsername, text: string) {
    if (text !== null) {
      const duplicatedItems = this.getDuplicatedItems(text);
      groupUsername.items.forEach(item => {
        this.setItemListValue(duplicatedItems, item, CSSCLASS.MOVED);
      });
    }
  }

  getDuplicatedItems(text: string): string[] {
    if (text !== null) {
      const list = text.split(',');
      const tempList = list.filter((item, index) => list.indexOf(item) !== index);
      const duplicatedItems = Array.from(new Set(tempList));
      return duplicatedItems;
    }

    return [];
  }

  remove(groupUsername: GroupUsername, item: UsernameItem) {
    const index = groupUsername.items.indexOf(item);
    if (index > -1) {
      groupUsername.items.splice(index, 1);
    }
  }

  removeLasted(groupUsername: GroupUsername) {
    groupUsername.items.pop();
  }

  removeSelected(groupUsername: GroupUsername) {
    const removedItems = groupUsername.items.filter(function (item) {
      return item.isSelected;
    });
    const newItems = groupUsername.items.filter(function (item) {
      return removedItems.indexOf(item) === -1;
    });
    groupUsername.items = newItems;
  }

  resetAllValue(groupUsername: GroupUsername) {
    groupUsername.items.forEach(item => {
      item.isValid = true;
      item.cssClass = CSSCLASS.VALID;
      item.defaultClass = CSSCLASS.VALID;
      item.isShowTooltip = false;
      item.tooltipText = '';
    });
  }
}
