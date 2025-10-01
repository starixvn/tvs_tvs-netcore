import { TestBed } from '@angular/core/testing';
import { NgSelectMixtureService } from './ng-select-mixture.service';
import { NgSelectMixtureModel } from './ng-select-mixture.model';
import { NgSelectMixtureItem } from './ng-select-mixture-item.model';

describe('NgSelectMixtureService', () => {
  let service: NgSelectMixtureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgSelectMixtureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getValueItems', () => {
    it('should return empty array when items is empty', () => {
      const items: NgSelectMixtureItem[] = [];
      const result = service.getValueItems(items);
      expect(result).toEqual([]);
    });

    it('should return values from all items', () => {
      const mockItem1 = {
        items: [],
        checked: true,
        value: 'value1'
      } as any;
      
      const mockItem2 = {
        items: [],
        checked: true,
        value: 'value2'
      } as any;

      const items = [mockItem1, mockItem2];
      const result = service.getValueItems(items);

      expect(result).toEqual(['value1', 'value2']);
    });

    it('should handle items with no checked values', () => {
      const mockItem = {
        items: [],
        checked: false,
        value: 'value1'
      } as any;

      const items = [mockItem];
      const result = service.getValueItems(items);

      expect(result).toEqual([]);
    });
  });

  describe('getDisplayedText', () => {
    let mockModel: NgSelectMixtureModel;
    let mockItems: NgSelectMixtureItem[];

    beforeEach(() => {
      mockModel = {
        items: [],
        numberItemsDisplay: 1,
        noneItemCheckedText: 'none',
        subfixNumberItemsCheckedText: ' selected',
        isShowPlaceHolder: false
      } as NgSelectMixtureModel;

      mockItems = [
        {
          value: 'item1',
          name: 'Item 1',
          items: [],
          countChildChecked: jest.fn().mockReturnValue(0),
          getTextChildChecked: jest.fn().mockReturnValue(''),
          countChild: 1
        },
        {
          value: 'item2', 
          name: 'Item 2',
          items: [],
          countChildChecked: jest.fn().mockReturnValue(0),
          getTextChildChecked: jest.fn().mockReturnValue(''),
          countChild: 1
        }
      ] as any;

      mockModel.items = mockItems;
    });

    it('should return single item name when single item is selected', () => {
      const selectedItem = ['item1'];
      const result = service.getDisplayedText(mockModel, selectedItem);
      
      expect(result).toBe('Item 1');
    });

    it('should call getDisplayedAllChildItems when no single item matches', () => {
      const selectedItem = ['item3'];
      const getDisplayedAllChildItemsSpy = jest.spyOn(service as any, 'getDisplayedAllChildItems')
        .mockReturnValue('No items');
      
      const result = service.getDisplayedText(mockModel, selectedItem);
      
      expect(getDisplayedAllChildItemsSpy).toHaveBeenCalledWith(mockModel);
      expect(result).toBe('No items');
    });
  });

  describe('isSingleItem', () => {
    it('should return true when selected item matches an item value', () => {
      const items = [
        { value: 'item1' },
        { value: 'item2' }
      ] as NgSelectMixtureItem[];
      const selectedItem = ['item1'];
      
      const result = (service as any).isSingleItem(items, selectedItem);
      
      expect(result).toBe(true);
    });

    it('should return false when no item matches selected value', () => {
      const items = [
        { value: 'item1' },
        { value: 'item2' }
      ] as NgSelectMixtureItem[];
      const selectedItem = ['item3'];
      
      const result = (service as any).isSingleItem(items, selectedItem);
      
      expect(result).toBe(false);
    });

    it('should return false when items array is empty', () => {
      const items: NgSelectMixtureItem[] = [];
      const selectedItem = ['item1'];
      
      const result = (service as any).isSingleItem(items, selectedItem);
      
      expect(result).toBe(false);
    });
  });

  describe('getDisplayedAllChildItems', () => {
    let mockModel: NgSelectMixtureModel;

    beforeEach(() => {
      mockModel = {
        numberItemsDisplay: 2,
        noneItemCheckedText: 'none selected',
        subfixNumberItemsCheckedText: ' selected',
        isShowPlaceHolder: false,
        items: []
      } as NgSelectMixtureModel;
    });

    it('should return placeholder text when no items are checked', () => {
      const mockItems = [
        {
          items: [
            { checked: false, value: 'child1', name: 'Child 1', items: [] },
            { checked: false, value: 'child2', name: 'Child 2', items: [] }
          ],
          countChild: 2
        }
      ] as any;

      mockModel.items = mockItems;
      
      const result = (service as any).getDisplayedAllChildItems(mockModel);
      
      expect(result).toBe('none selected');
      expect(mockModel.isShowPlaceHolder).toBe(true);
    });

    it('should return text when checked items are within display limit', () => {
      const mockItems = [
        {
          items: [
            { checked: true, value: 'child1', name: 'Child 1', items: [] },
            { checked: false, value: 'child2', name: 'Child 2', items: [] }
          ],
          countChild: 2
        }
      ] as any;

      mockModel.items = mockItems;
      
      const result = (service as any).getDisplayedAllChildItems(mockModel);
      
      expect(result).toBe('Child 1');
      expect(mockModel.isShowPlaceHolder).toBe(false);
    });

    it('should return count text when checked items exceed display limit', () => {
      const mockItems = [
        {
          items: [
            { checked: true, value: 'child1', name: 'Child 1', items: [] },
            { checked: true, value: 'child2', name: 'Child 2', items: [] },
            { checked: true, value: 'child3', name: 'Child 3', items: [] }
          ],
          countChild: 3
        }
      ] as any;

      mockModel.items = mockItems;
      mockModel.numberItemsDisplay = 2;
      
      const result = (service as any).getDisplayedAllChildItems(mockModel);
      
      expect(result).toBe('3 selected');
      expect(mockModel.isShowPlaceHolder).toBe(false);
    });

    it('should handle multiple items with mixed text', () => {
      const mockItems = [
        {
          items: [
            { checked: true, value: 'child1', name: 'Child 1', items: [] },
            { checked: false, value: 'child2', name: 'Child 2', items: [] }
          ],
          countChild: 2
        },
        {
          items: [
            { checked: true, value: 'child3', name: 'Child 3', items: [] },
            { checked: false, value: 'child4', name: 'Child 4', items: [] }
          ],
          countChild: 2
        }
      ] as any;

      mockModel.items = mockItems;
      
      const result = (service as any).getDisplayedAllChildItems(mockModel);
      
      expect(result).toBe('Child 1,Child 3');
      expect(mockModel.isShowPlaceHolder).toBe(false);
    });

    it('should handle items with no children', () => {
      const mockItems = [
        {
          items: [],
          countChild: 0
        }
      ] as any;

      mockModel.items = mockItems;
      
      const result = (service as any).getDisplayedAllChildItems(mockModel);
      
      expect(result).toBe('none selected');
      expect(mockModel.isShowPlaceHolder).toBe(true);
    });
  });

  describe('initNgSelectMixtureItem', () => {
    it('should create NgSelectMixtureItem with correct properties', () => {
      const value = 'test-value';
      const name = 'Test Item';
      const parentId = 1;
      const checked = true;
      const expanded = false;
      const enabled = true;
      const items: NgSelectMixtureItem[] = [];

      const result = service.initNgSelectMixtureItem(value, name, parentId, checked, expanded, enabled, items);

      expect(result.value).toBe(value);
      expect(result.name).toBe(name);
      expect(result.parentId).toBe(parentId);
      expect(result.checked).toBe(checked);
      expect(result.expanded).toBe(expanded);
      expect(result.enabled).toBe(enabled);
      expect(result.items).toBe(items);
      expect(result.countChild).toBe(1);
    });
  });

  describe('getCountChild', () => {
    it('should return 1 for item with no children', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];

      const result = (service as any).getCountChild(item);

      expect(result).toBe(1);
      expect(item.countChild).toBe(1);
    });
  });

  describe('checkBySelectedItem', () => {
    it('should check items based on selected values', () => {
      const child1 = new NgSelectMixtureItem();
      child1.value = 'value1';
      child1.checked = false;
      child1.items = [];
      
      const child2 = new NgSelectMixtureItem();
      child2.value = 'value2';
      child2.checked = false;
      child2.items = [];

      const item = new NgSelectMixtureItem();
      item.value = 'group';
      item.items = [child1, child2];

      const selectedItems = ['value1'];

      service.checkBySelectedItem(item, selectedItems);

      expect(child1.checked).toBe(true);
      expect(child2.checked).toBe(false);
    });

  });

  describe('unCheckChild', () => {
    it('should uncheck all children', () => {
      const child1 = new NgSelectMixtureItem();
      child1.checked = true;
      child1.items = [];
      
      const child2 = new NgSelectMixtureItem();
      child2.checked = true;
      child2.items = [];

      const items = [child1, child2];

      service.unCheckChild(items);

      expect(child1.checked).toBe(false);
      expect(child2.checked).toBe(false);
    });

    it('should recursively uncheck nested children', () => {
      const grandChild = new NgSelectMixtureItem();
      grandChild.checked = true;
      grandChild.items = [];
      
      const child = new NgSelectMixtureItem();
      child.checked = true;
      child.items = [grandChild];

      const items = [child];

      service.unCheckChild(items);

      expect(child.checked).toBe(false);
      expect(grandChild.checked).toBe(false);
    });
  });

  describe('checkFromChild', () => {
    it('should check parent when all children are checked', () => {
      const item = new NgSelectMixtureItem();
      item.countChild = 2;
      item.checked = false;

      jest.spyOn(service as any, 'allChildIsChecked').mockReturnValue(true);
      jest.spyOn(service as any, 'countChildChecked').mockReturnValue(2);

      service.checkFromChild(item);

      expect(item.checked).toBe(true);
    });

    it('should not check parent when not all children are checked', () => {
      const item = new NgSelectMixtureItem();
      item.countChild = 2;
      item.checked = false;

      jest.spyOn(service as any, 'allChildIsChecked').mockReturnValue(false);
      jest.spyOn(service as any, 'countChildChecked').mockReturnValue(1);

      service.checkFromChild(item);

      expect(item.checked).toBe(false);
    });
  });

  describe('allChildIsChecked', () => {
    it('should return true when all children are checked', () => {
      const item = new NgSelectMixtureItem();
      item.countChild = 3;

      jest.spyOn(service as any, 'countChildChecked').mockReturnValue(3);

      const result = (service as any).allChildIsChecked(item);

      expect(result).toBe(true);
    });

    it('should return false when not all children are checked', () => {
      const item = new NgSelectMixtureItem();
      item.countChild = 3;

      jest.spyOn(service as any, 'countChildChecked').mockReturnValue(2);

      const result = (service as any).allChildIsChecked(item);

      expect(result).toBe(false);
    });
  });

  describe('countChildChecked', () => {
    it('should return 1 for checked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = true;

      const result = service.countChildChecked(item);

      expect(result).toBe(1);
    });

    it('should return 0 for unchecked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = false;

      const result = service.countChildChecked(item);

      expect(result).toBe(0);
    });

    it('should count checked children recursively', () => {
      const child1 = new NgSelectMixtureItem();
      child1.items = [];
      child1.checked = true;
      
      const child2 = new NgSelectMixtureItem();
      child2.items = [];
      child2.checked = false;

      const item = new NgSelectMixtureItem();
      item.items = [child1, child2];
      item.checked = false;

      const result = service.countChildChecked(item);

      expect(result).toBe(1);
    });
  });

  describe('getValueChildChecked', () => {
    it('should return value for checked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = true;
      item.value = 'test-value';

      const result = service.getValueChildChecked(item);

      expect(result).toEqual(['test-value']);
    });

    it('should return empty array for unchecked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = false;
      item.value = 'test-value';

      const result = service.getValueChildChecked(item);

      expect(result).toEqual([]);
    });

    it('should collect values from checked children recursively', () => {
      const child1 = new NgSelectMixtureItem();
      child1.items = [];
      child1.checked = true;
      child1.value = 'value1';
      
      const child2 = new NgSelectMixtureItem();
      child2.items = [];
      child2.checked = false;
      child2.value = 'value2';

      const item = new NgSelectMixtureItem();
      item.items = [child1, child2];
      item.checked = false;

      const result = service.getValueChildChecked(item);

      expect(result).toEqual(['value1']);
    });
  });

  describe('getTextChildChecked', () => {
    it('should return name for checked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = true;
      item.name = 'Test Item';

      const result = service.getTextChildChecked(item);

      expect(result).toBe('Test Item');
    });

    it('should return empty string for unchecked leaf item', () => {
      const item = new NgSelectMixtureItem();
      item.items = [];
      item.checked = false;
      item.name = 'Test Item';

      const result = service.getTextChildChecked(item);

      expect(result).toBe('');
    });

    it('should collect text from checked children recursively', () => {
      const child1 = new NgSelectMixtureItem();
      child1.items = [];
      child1.checked = true;
      child1.name = 'Item 1';
      
      const child2 = new NgSelectMixtureItem();
      child2.items = [];
      child2.checked = true;
      child2.name = 'Item 2';

      const item = new NgSelectMixtureItem();
      item.items = [child1, child2];
      item.checked = false;

      const result = service.getTextChildChecked(item);

      expect(result).toBe('Item 1,Item 2');
    });
  });

  describe('isSingleSelect', () => {
    it('should return true for item with no children and parentId 0', () => {
      const items: NgSelectMixtureItem[] = [];
      const parentId = 0;

      const result = service.isSingleSelect(items, parentId);

      expect(result).toBe(true);
    });

    it('should return false for item with children', () => {
      const child = new NgSelectMixtureItem();
      const items = [child];
      const parentId = 0;

      const result = service.isSingleSelect(items, parentId);

      expect(result).toBe(false);
    });

    it('should return false for item with parentId not 0', () => {
      const items: NgSelectMixtureItem[] = [];
      const parentId = 1;

      const result = service.isSingleSelect(items, parentId);

      expect(result).toBe(false);
    });
  });

  describe('isItemGroup', () => {
    it('should return true for ALL_HOME_OE group', () => {
      const value = '-1'; // GroupReducedOverConstant.ALL_HOME_OE = -1

      const result = service.isItemGroup(value);

      expect(result).toBe(true);
    });

    it('should return true for ALL_AWAY_OE group', () => {
      const value = '-2'; // GroupReducedOverConstant.ALL_AWAY_OE = -2

      const result = service.isItemGroup(value);

      expect(result).toBe(true);
    });

    it('should return true for OTHERS_OE_BET_TYPE group', () => {
      const value = '-3'; // GroupReducedOverConstant.OTHERS_OE_BET_TYPE = -3

      const result = service.isItemGroup(value);

      expect(result).toBe(true);
    });

    it('should return false for non-group value', () => {
      const value = 'other-value';

      const result = service.isItemGroup(value);

      expect(result).toBe(false);
    });
  });

  describe('Edge cases and error scenarios', () => {
    it('should handle null or undefined selectedItem in getDisplayedText', () => {
      const mockModel = { items: [] } as NgSelectMixtureModel;
      expect(() => service.getDisplayedText(mockModel, null as any)).not.toThrow();
      expect(() => service.getDisplayedText(mockModel, undefined as any)).not.toThrow();
    });
  });
});
