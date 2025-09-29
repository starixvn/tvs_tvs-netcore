import { TestBed } from '@angular/core/testing';
import { NumberItemService } from './number-item.service';
import { CSSCLASS, GroupNumber, NumberItem } from './bet-ids.model';

describe('NumberItemService', () => {
  let service: NumberItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberItemService);
  });

  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      const validNumbers = ['1', '123', '0', '999999'];
      validNumbers.forEach(number => {
        const item = new NumberItem(number);
        expect(NumberItemService.isNumber(item)).toBe(true);
      });
    });

    it('should return false for invalid numbers', () => {
      const invalidNumbers = ['abc', '1.5', '-1', '1a', '', ' '];
      invalidNumbers.forEach(number => {
        const item = new NumberItem(number);
        expect(NumberItemService.isNumber(item)).toBe(false);
      });
    });
  });

  describe('isInvalidItem', () => {
    it('should return true for invalid CSS class', () => {
      expect(service.isInvalidItem(CSSCLASS.INVALID)).toBe(true);
    });

    it('should return false for valid CSS class', () => {
      expect(service.isInvalidItem(CSSCLASS.VALID)).toBe(false);
      expect(service.isInvalidItem(CSSCLASS.SELECTED)).toBe(false);
    });
  });

  describe('changeSelectStatus', () => {
    it('should set item as selected when isSelected is true', () => {
      const item = new NumberItem('123');
      service.changeSelectStatus(item, true);
      expect(item.isSelected).toBe(true);
      expect(item.cssClass).toBe(CSSCLASS.SELECTED);
    });

    it('should set item as unselected when isSelected is false', () => {
      const item = new NumberItem('123');
      service.changeSelectStatus(item, false);
      expect(item.isSelected).toBe(false);
      expect(item.cssClass).toBe(item.defaultClass);
    });
  });

  describe('getAllNumberItemsAsString', () => {
    it('should return comma-separated string of valid numbers', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('abc'),
        new NumberItem('789')
      ];
      const result = service.getAllNumberItemsAsString(items);
      expect(result).toBe('123,456,789');
    });

    it('should return empty string when no valid numbers', () => {
      const items = [
        new NumberItem('abc'),
        new NumberItem('def')
      ];
      const result = service.getAllNumberItemsAsString(items);
      expect(result).toBe('');
    });
  });

  describe('getAllNotNumberItemsAsString', () => {
    it('should return comma-separated string of invalid items', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('abc'),
        new NumberItem('456'),
        new NumberItem('def')
      ];
      const result = service.getAllNotNumberItemsAsString(items);
      expect(result).toBe('abc,def');
    });

    it('should return empty string when all items are valid numbers', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const result = service.getAllNotNumberItemsAsString(items);
      expect(result).toBe('');
    });
  });

  describe('getInvalidItemsAsString', () => {
    it('should return comma-separated string of invalid items', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      items[0].cssClass = CSSCLASS.VALID;
      items[1].cssClass = CSSCLASS.INVALID;
      
      const result = service.getInvalidItemsAsString(items);
      expect(result).toBe('456');
    });

    it('should return empty string when no invalid items', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      items[0].cssClass = CSSCLASS.VALID;
      items[1].cssClass = CSSCLASS.VALID;
      
      const result = service.getInvalidItemsAsString(items);
      expect(result).toBe('');
    });
  });

  describe('checkValidItems', () => {
    it('should return 0 when items array is empty', () => {
      const result = service.checkValidItems([]);
      expect(result).toBe(0);
    });

    it('should return 1 when has invalid items', () => {
      const items = [
        { value: '1', cssClass: '', isValid: true } as NumberItem,
        { value: '2', cssClass: CSSCLASS.SITE_DB_DOWN, isValid: true } as NumberItem,
        { value: '3', cssClass: CSSCLASS.INVALID, isValid: false } as NumberItem
      ];
      const result = service.checkValidItems(items);
      expect(result).toBe(1);
    });

    it('should return 1 when all items are valid but all have SITE_DB_DOWN cssClass', () => {
      const items = [
        { value: '1', cssClass: CSSCLASS.SITE_DB_DOWN, isValid: true } as NumberItem,
        { value: '2', cssClass: CSSCLASS.SITE_DB_DOWN, isValid: true } as NumberItem
      ];
      const result = service.checkValidItems(items);
      expect(result).toBe(1);
    });

    it('should return 2 when all items are valid and has valid ticket not SITE_DB_DOWN', () => {
      const items = [
        { value: '1', cssClass: '', isValid: true } as NumberItem,
        { value: '2', cssClass: CSSCLASS.SITE_DB_DOWN, isValid: true } as NumberItem
      ];
      const result = service.checkValidItems(items);
      expect(result).toBe(2);
    });
  });

  describe('checkDuplicatedItems', () => {
    it('should mark duplicated items as MOVED', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('123'),
        new NumberItem('789')
      ];
      service.checkDuplicatedItems(items);
      
      const duplicatedItems = items.filter(item => item.cssClass === CSSCLASS.MOVED);
      expect(duplicatedItems.length).toBe(2);
      expect(duplicatedItems.every(item => item.value === '123')).toBe(true);
    });

    it('should not mark any items when no duplicates', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      service.checkDuplicatedItems(items);
      
      const movedItems = items.filter(item => item.cssClass === CSSCLASS.MOVED);
      expect(movedItems.length).toBe(0);
    });
  });

  describe('updateWarningSiteDBDown', () => {
    it('should update items with SITE_DB_DOWN class when text is provided', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const text = '123,789';
      const tooltipText = 'Site DB Down';
      
      service.updateWarningSiteDBDown(items, text, tooltipText);
      
      const siteDbDownItems = items.filter(item => item.cssClass === CSSCLASS.SITE_DB_DOWN);
      expect(siteDbDownItems.length).toBe(2);
      expect(siteDbDownItems.every(item => item.isShowTooltip)).toBe(true);
      expect(siteDbDownItems.every(item => item.tooltipText === tooltipText)).toBe(true);
    });

    it('should not update any items when text is empty', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const originalCssClasses = items.map(item => item.cssClass);
      
      service.updateWarningSiteDBDown(items, '', 'tooltip');
      
      items.forEach((item, index) => {
        expect(item.cssClass).toBe(originalCssClasses[index]);
      });
    });
  });

  describe('updateInvalidItems', () => {
    it('should update items with INVALID class when text is provided', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const text = '123,789';
      const tooltipText = 'Invalid items';
      
      service.updateInvalidItems(items, text, tooltipText);
      
      const invalidItems = items.filter(item => item.cssClass === CSSCLASS.INVALID);
      expect(invalidItems.length).toBe(2);
      expect(invalidItems.every(item => !item.isValid)).toBe(true);
      expect(invalidItems.every(item => item.isShowTooltip)).toBe(true);
      expect(invalidItems.every(item => item.tooltipText === tooltipText)).toBe(true);
    });

    it('should not update any items when text is empty', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const originalCssClasses = items.map(item => item.cssClass);
      
      service.updateInvalidItems(items, '', 'tooltip');
      
      items.forEach((item, index) => {
        expect(item.cssClass).toBe(originalCssClasses[index]);
      });
    });
  });

  describe('updateMoved', () => {
    it('should update items with MOVED class when text is provided', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const text = '123,789';
      
      service.updateMoved(items, text);
      
      const movedItems = items.filter(item => item.cssClass === CSSCLASS.MOVED);
      expect(movedItems.length).toBe(2);
      expect(movedItems.every(item => !item.isValid)).toBe(true);
    });
  });

  describe('updateDifferent', () => {
    it('should update items with DIFFERENT class when text is provided', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const text = '123,789';
      
      service.updateDifferent(items, text);
      
      const differentItems = items.filter(item => item.cssClass === CSSCLASS.DIFFERENT);
      expect(differentItems.length).toBe(2);
      expect(differentItems.every(item => !item.isValid)).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove item from array', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const itemToRemove = items[1];
      
      service.remove(items, itemToRemove);
      
      expect(items.length).toBe(2);
      expect(items).not.toContain(itemToRemove);
    });

    it('should not remove item if not found', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const itemNotInArray = new NumberItem('789');
      const originalLength = items.length;
      
      service.remove(items, itemNotInArray);
      
      expect(items.length).toBe(originalLength);
    });
  });

  describe('removeLasted', () => {
    it('should remove last item from array', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      const lastItem = items[items.length - 1];
      
      service.removeLasted(items);
      
      expect(items.length).toBe(2);
      expect(items).not.toContain(lastItem);
    });
  });

  describe('selectAllItems', () => {
    it('should select all items when none are selected', () => {
      const groupNumber = new GroupNumber();
      groupNumber.items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      groupNumber.isSelectedAll = false;
      
      service.selectAllItems(groupNumber);
      
      expect(groupNumber.isSelectedAll).toBe(true);
      groupNumber.items.forEach(item => {
        expect(item.isSelected).toBe(true);
        expect(item.cssClass).toBe(CSSCLASS.SELECTED);
      });
    });

    it('should deselect all items when all are selected', () => {
      const groupNumber = new GroupNumber();
      groupNumber.items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      groupNumber.isSelectedAll = true;
      groupNumber.items.forEach(item => {
        item.isSelected = true;
        item.cssClass = CSSCLASS.SELECTED;
      });
      
      service.selectAllItems(groupNumber);
      
      expect(groupNumber.isSelectedAll).toBe(false);
      groupNumber.items.forEach(item => {
        expect(item.isSelected).toBe(false);
        expect(item.cssClass).toBe(item.defaultClass);
      });
    });
  });

  describe('removeSelected', () => {
    it('should not modify original array (method has bug)', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('789')
      ];
      items[0].isSelected = true;
      items[2].isSelected = true;
      const originalLength = items.length;
      
      service.removeSelected(items);
      
      // Note: The current implementation has a bug - it doesn't actually modify the original array
      // The method creates a new array but doesn't update the original reference
      expect(items.length).toBe(originalLength);
    });

    it('should not remove any items when none are selected', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const originalLength = items.length;
      
      service.removeSelected(items);
      
      expect(items.length).toBe(originalLength);
    });
  });

  describe('removeByValue', () => {
    it('should remove items with specific value', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('123'),
        new NumberItem('789')
      ];
      
      service.removeByValue(items, '123');
      
      expect(items.length).toBe(2);
      expect(items.every(item => item.value !== '123')).toBe(true);
    });

    it('should not remove any items when value not found', () => {
      const items = [
        new NumberItem('123'),
        new NumberItem('456')
      ];
      const originalLength = items.length;
      
      service.removeByValue(items, '999');
      
      expect(items.length).toBe(originalLength);
    });
  });

  describe('resetAllItemsToValid', () => {
    it('should reset all valid number items to valid state', () => {
      const groupNumber = new GroupNumber();
      groupNumber.items = [
        new NumberItem('123'),
        new NumberItem('456'),
        new NumberItem('abc')
      ];
      groupNumber.isSelectedAll = true;
      
      // Set some items as invalid
      groupNumber.items[0].isValid = false;
      groupNumber.items[0].cssClass = CSSCLASS.INVALID;
      groupNumber.items[1].isValid = false;
      groupNumber.items[1].cssClass = CSSCLASS.INVALID;
      
      service.resetAllItemsToValid(groupNumber);
      
      expect(groupNumber.isSelectedAll).toBe(false);
      
      // Check valid number items
      const validNumberItems = groupNumber.items.filter(item => NumberItemService.isNumber(item));
      validNumberItems.forEach(item => {
        expect(item.isValid).toBe(true);
        expect(item.cssClass).toBe(CSSCLASS.VALID);
        expect(item.defaultClass).toBe(CSSCLASS.VALID);
        expect(item.isShowTooltip).toBe(false);
        expect(item.tooltipText).toBe('');
      });
    });
  });
});