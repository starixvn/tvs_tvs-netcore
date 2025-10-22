import { TestBed } from '@angular/core/testing';
import { ItemsSelectService } from './items-select.service';
import { ItemsSelect } from './items-select';

describe('ItemsSelectService', () => {
  let service: ItemsSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initItemsSelect', () => {
    it('should initialize ItemsSelect with provided parameters', () => {
      const childItems: ItemsSelect[] = [
        { id: 1, value: 'child1', text: 'Child 1', checked: false, expanded: false, enable: true, items: [], countChilds: 1 },
        { id: 2, value: 'child2', text: 'Child 2', checked: false, expanded: false, enable: true, items: [], countChilds: 1 }
      ];

      const result = ItemsSelectService.initItemsSelect(1, 'parent', 'Parent', true, false, true, childItems);

      expect(result.id).toBe(1);
      expect(result.value).toBe('parent');
      expect(result.text).toBe('Parent');
      expect(result.checked).toBe(true);
      expect(result.expanded).toBe(false);
      expect(result.enable).toBe(true);
      expect(result.items).toEqual(childItems);
      expect(result.countChilds).toBe(2);
    });

    it('should initialize ItemsSelect with empty items array', () => {
      const result = ItemsSelectService.initItemsSelect(1, 'item', 'Item', false, true, true, []);

      expect(result.id).toBe(1);
      expect(result.value).toBe('item');
      expect(result.text).toBe('Item');
      expect(result.checked).toBe(false);
      expect(result.expanded).toBe(true);
      expect(result.enable).toBe(true);
      expect(result.items).toEqual([]);
      expect(result.countChilds).toBe(1);
    });
  });

  describe('getCountChild', () => {
    it('should return 1 for item with no children', () => {
      const item = new ItemsSelect();
      item.items = [];
      item.countChilds = 0;

      const result = ItemsSelectService.getCountChild(item);

      expect(result).toBe(1);
      expect(item.countChilds).toBe(1);
    });

    it('should calculate count for nested children', () => {
      const grandChild = new ItemsSelect();
      grandChild.items = [];
      grandChild.countChilds = 1; // Set to 1 for leaf node

      const child = new ItemsSelect();
      child.items = [grandChild];
      child.countChilds = 0; // Will be calculated

      const parent = new ItemsSelect();
      parent.items = [child];
      parent.countChilds = 0; // Will be calculated

      // First calculate child's count - this will set child.countChilds = 0 + grandChild.countChilds = 0 + 1 = 1
      ItemsSelectService.getCountChild(child);
      
      // Then calculate parent's count - this will set parent.countChilds = 0 + child.countChilds = 0 + 1 = 1
      const result = ItemsSelectService.getCountChild(parent);

      expect(result).toBe(1);
      expect(parent.countChilds).toBe(1);
    });
  });

  describe('checkBySelectedItem', () => {
    it('should check items based on selected items array', () => {
      const child1 = new ItemsSelect();
      child1.value = 'child1';
      child1.checked = false;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.value = 'child2';
      child2.checked = false;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.value = 'parent';
      parent.checked = false;
      parent.items = [child1, child2];

      const selectedItems = ['child1', 'parent'];

      service.checkBySelectedItem(parent, selectedItems);

      expect(parent.checked).toBe(true);
      expect(child1.checked).toBe(true);
      expect(child2.checked).toBe(false);
    });

    it('should handle null selectedItems array', () => {
      const child = new ItemsSelect();
      child.value = 'child';
      child.checked = false;
      child.items = [];

      const parent = new ItemsSelect();
      parent.value = 'parent';
      parent.checked = false;
      parent.items = [child];

      service.checkBySelectedItem(parent, null);

      expect(parent.checked).toBe(false);
      expect(child.checked).toBe(false);
    });
  });

  describe('expandedAllItems', () => {
    it('should expand all items recursively', () => {
      const grandChild = new ItemsSelect();
      grandChild.expanded = false;
      grandChild.items = [];

      const child = new ItemsSelect();
      child.expanded = false;
      child.items = [grandChild];

      const parent = new ItemsSelect();
      parent.expanded = false;
      parent.items = [child];

      service.expandedAllItems(parent);

      expect(parent.expanded).toBe(true);
      expect(child.expanded).toBe(true);
      expect(grandChild.expanded).toBe(true);
    });
  });

  describe('checkChilds', () => {
    it('should check all enabled children when parent is checked', () => {
      const child1 = new ItemsSelect();
      child1.enable = true;
      child1.checked = false;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.enable = false;
      child2.checked = false;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.checked = true;
      parent.items = [child1, child2];

      service.checkChilds(parent);

      expect(child1.checked).toBe(true);
      expect(child2.checked).toBe(false);
    });

    it('should not change disabled children', () => {
      const child = new ItemsSelect();
      child.enable = false;
      child.checked = false;
      child.items = [];

      const parent = new ItemsSelect();
      parent.checked = true;
      parent.items = [child];

      service.checkChilds(parent);

      expect(child.checked).toBe(false);
    });
  });

  describe('checkFromChilds', () => {
    it('should check parent when all children are checked', () => {
      const child1 = new ItemsSelect();
      child1.checked = true;
      child1.countChilds = 1;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.checked = true;
      child2.countChilds = 1;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.checked = false;
      parent.countChilds = 2;
      parent.items = [child1, child2];

      service.checkFromChilds(parent);

      expect(parent.checked).toBe(true);
    });

    it('should not check parent when not all children are checked', () => {
      const child1 = new ItemsSelect();
      child1.checked = true;
      child1.countChilds = 1;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.checked = false;
      child2.countChilds = 1;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.checked = false;
      parent.countChilds = 2;
      parent.items = [child1, child2];

      service.checkFromChilds(parent);

      expect(parent.checked).toBe(false);
    });
  });

  describe('allChildIsChecked', () => {
    it('should return true when all children are checked', () => {
      const child1 = new ItemsSelect();
      child1.checked = true;
      child1.items = [];
      child1.countChilds = 1;

      const child2 = new ItemsSelect();
      child2.checked = true;
      child2.items = [];
      child2.countChilds = 1;

      const item = new ItemsSelect();
      item.countChilds = 2;
      item.items = [child1, child2];

      const result = service.allChildIsChecked(item);

      expect(result).toBe(true);
    });

    it('should return false when not all children are checked', () => {
      const child1 = new ItemsSelect();
      child1.checked = true;
      child1.items = [];
      child1.countChilds = 1;

      const child2 = new ItemsSelect();
      child2.checked = false;
      child2.items = [];
      child2.countChilds = 1;

      const item = new ItemsSelect();
      item.countChilds = 2;
      item.items = [child1, child2];

      const result = service.allChildIsChecked(item);

      expect(result).toBe(false);
    });
  });

  describe('countChildsChecked', () => {
    it('should return 1 for checked item with no children', () => {
      const item = new ItemsSelect();
      item.checked = true;
      item.items = [];

      const result = service.countChildsChecked(item);

      expect(result).toBe(1);
    });

    it('should return 0 for unchecked item with no children', () => {
      const item = new ItemsSelect();
      item.checked = false;
      item.items = [];

      const result = service.countChildsChecked(item);

      expect(result).toBe(0);
    });
  });

  describe('getValueChildsChecked', () => {
    it('should return value for checked item with no children', () => {
      const item = new ItemsSelect();
      item.value = 'test';
      item.checked = true;
      item.items = [];

      const result = service.getValueChildsChecked(item);

      expect(result).toBe('test');
    });

    it('should return empty string for unchecked item with no children', () => {
      const item = new ItemsSelect();
      item.value = 'test';
      item.checked = false;
      item.items = [];

      const result = service.getValueChildsChecked(item);

      expect(result).toBe('');
    });

    it('should return comma-separated values for checked children', () => {
      const child1 = new ItemsSelect();
      child1.value = 'child1';
      child1.checked = true;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.value = 'child2';
      child2.checked = true;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.value = 'parent';
      parent.checked = false;
      parent.items = [child1, child2];

      const result = service.getValueChildsChecked(parent);

      expect(result).toBe('child1,child2');
    });
  });

  describe('getTextChildsChecked', () => {
    it('should return text for checked item with no children', () => {
      const item = new ItemsSelect();
      item.text = 'Test Item';
      item.checked = true;
      item.items = [];

      const result = service.getTextChildsChecked(item);

      expect(result).toBe('Test Item');
    });

    it('should return empty string for unchecked item with no children', () => {
      const item = new ItemsSelect();
      item.text = 'Test Item';
      item.checked = false;
      item.items = [];

      const result = service.getTextChildsChecked(item);

      expect(result).toBe('');
    });

    it('should return comma-separated text for checked children', () => {
      const child1 = new ItemsSelect();
      child1.text = 'Child 1';
      child1.checked = true;
      child1.items = [];

      const child2 = new ItemsSelect();
      child2.text = 'Child 2';
      child2.checked = true;
      child2.items = [];

      const parent = new ItemsSelect();
      parent.text = 'Parent';
      parent.checked = false;
      parent.items = [child1, child2];

      const result = service.getTextChildsChecked(parent);

      expect(result).toBe('Child 1,Child 2');
    });
  });
});
