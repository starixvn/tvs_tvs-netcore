import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectTreeViewComponent } from './ng-select-tree-view.component';
import { NgSelectMixtureItem } from '../ng-select-mixture-item.model';

describe('NgSelectTreeViewComponent', () => {
  let component: NgSelectTreeViewComponent;
  let fixture: ComponentFixture<NgSelectTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(NgSelectTreeViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have default paddingLeft value of 10', () => {
      expect(component.paddingLeft).toBe(10);
    });

    it('should accept custom paddingLeft value', () => {
      component.paddingLeft = 20;
      expect(component.paddingLeft).toBe(20);
    });

    it('should accept items array', () => {
      const mockItems: NgSelectMixtureItem[] = [
        new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, [])
      ];
      component.items = mockItems;
      expect(component.items).toEqual(mockItems);
    });

    it('should accept isDisabled boolean', () => {
      component.isDisabled = true;
      expect(component.isDisabled).toBe(true);
    });
  });

  describe('handleClickSingleItem', () => {
    it('should set item checked to true', () => {
      const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
      const mockItems = [mockItem, new NgSelectMixtureItem('2', 'Item 2', 0, false, false, true, [])];
      component.items = mockItems;

      component.handleClickSingleItem(mockItem);

      expect(mockItem.checked).toBe(true);
    });

    it('should uncheck other items when single item is selected', () => {
      const mockItem1 = new NgSelectMixtureItem('1', 'Item 1', 0, true, false, true, []);
      const mockItem2 = new NgSelectMixtureItem('2', 'Item 2', 0, true, false, true, []);
      const mockItems = [mockItem1, mockItem2];
      component.items = mockItems;

      component.handleClickSingleItem(mockItem1);

      expect(mockItem1.checked).toBe(true);
      expect(mockItem2.checked).toBe(false);
    });

    it('should emit single event with selected item', () => {
      const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
      const mockItems = [mockItem];
      component.items = mockItems;
      component.emitSingleEvent.emit = jest.fn();

      component.handleClickSingleItem(mockItem);

      expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
    });

    it('should handle empty items array', () => {
      component.items = [];
      const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
      component.emitSingleEvent.emit = jest.fn();

      component.handleClickSingleItem(mockItem);

      // Kiểm tra rằng method đã thực thi thành công bằng cách kiểm tra emit được gọi
      expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('unCheckOtherItem', () => {
    it('should uncheck all items except selected item', () => {
      const mockItem1 = new NgSelectMixtureItem('1', 'Item 1', 0, true, false, true, []);
      const mockItem2 = new NgSelectMixtureItem('2', 'Item 2', 0, true, false, true, []);
      const mockItem3 = new NgSelectMixtureItem('3', 'Item 3', 0, true, false, true, []);
      const mockItems = [mockItem1, mockItem2, mockItem3];
      component.items = mockItems;

      // Access private method through component instance
      (component as any).unCheckOtherItem(mockItem1);

      expect(mockItem1.checked).toBe(true);
      expect(mockItem2.checked).toBe(false);
      expect(mockItem3.checked).toBe(false);
    });

    it('should handle items with same value', () => {
      const mockItem1 = new NgSelectMixtureItem('1', 'Item 1', 0, true, false, true, []);
      const mockItem2 = new NgSelectMixtureItem('1', 'Item 1 Copy', 0, true, false, true, []);
      const mockItems = [mockItem1, mockItem2];
      component.items = mockItems;

      (component as any).unCheckOtherItem(mockItem1);

      expect(mockItem1.checked).toBe(true);
      expect(mockItem2.checked).toBe(true);
    });
  });

  describe('handleClickChildItem', () => {
    it('should emit child event', () => {
      component.emitChildEvent.emit = jest.fn();
      component.items = [new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, [])];
      component.handleClickChildItem();

      expect(component.emitChildEvent.emit).toHaveBeenCalled();
    });

    it('should uncheck all single select items', () => {
      const mockItem1 = new NgSelectMixtureItem('1', 'Item 1', 0, true, false, true, []); // single select
      const mockItem2 = new NgSelectMixtureItem('2', 'Item 2', 1, true, false, true, []); // not single select
      const mockItems = [mockItem1, mockItem2];
      component.items = mockItems;

      component.handleClickChildItem();

      expect(mockItem1.checked).toBe(false);
      expect(mockItem2.checked).toBe(true); // should remain checked as it's not single select
    });

    it('should handle empty items array', () => {
      component.items = [];
      component.emitChildEvent.emit = jest.fn();

      component.handleClickChildItem();

      // Kiểm tra rằng method đã thực thi thành công bằng cách kiểm tra emit được gọi
      expect(component.emitChildEvent.emit).toHaveBeenCalled();
    });
  });

  describe('checkFromChildEvent', () => {
    it('should call checkFromChild on item', () => {
      const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
      mockItem.checkFromChild = jest.fn();

      component.checkFromChildEvent(mockItem);

      expect(mockItem.checkFromChild).toHaveBeenCalled();
    });

    describe('isHaveCheckBox', () => {
      it('should return true when item has children', () => {
        const childItem = new NgSelectMixtureItem('2', 'Child', 1, false, false, true, []);
        const mockItem = new NgSelectMixtureItem('1', 'Parent', 0, false, false, true, [childItem]);

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });

      it('should return true when item has parentId less than 0', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', -1, false, false, true, []);

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });

      it('should return false when item has no children and parentId >= 0', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(false);
      });

      it('should return false when item has no children and parentId > 0', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 1, false, false, true, []);

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(false);
      });

      it('should return true when item has both children and parentId < 0', () => {
        const childItem = new NgSelectMixtureItem('2', 'Child', 1, false, false, true, []);
        const mockItem = new NgSelectMixtureItem('1', 'Parent', -1, false, false, true, [childItem]);

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });
    });

    describe('Component Integration Tests', () => {
      it('should handle complex tree structure', () => {
        const grandChild1 = new NgSelectMixtureItem('3', 'GrandChild 1', 2, false, false, true, []);
        const grandChild2 = new NgSelectMixtureItem('4', 'GrandChild 2', 2, false, false, true, []);
        const child1 = new NgSelectMixtureItem('2', 'Child 1', 1, false, false, true, [grandChild1, grandChild2]);
        const child2 = new NgSelectMixtureItem('5', 'Child 2', 1, false, false, true, []);
        const parent = new NgSelectMixtureItem('1', 'Parent', 0, false, false, true, [child1, child2]);

        component.items = [parent];

        // Test single item selection
        component.handleClickSingleItem(parent);
        expect(parent.checked).toBe(true);

        // Test child item selection
        component.emitChildEvent.emit = jest.fn();
        component.handleClickChildItem();
        expect(component.emitChildEvent.emit).toHaveBeenCalled();

        // Test checkbox visibility
        expect(component.isHaveCheckBox(parent)).toBe(true);
        expect(component.isHaveCheckBox(child1)).toBe(true);
        expect(component.isHaveCheckBox(grandChild1)).toBe(false);
      });

      it('should handle disabled state', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        component.items = [mockItem];
        component.isDisabled = true;

        component.emitSingleEvent.emit = jest.fn();
        component.handleClickSingleItem(mockItem);

        // Even when disabled, the method should still execute
        expect(component.emitSingleEvent.emit).toHaveBeenCalled();
      });

      it('should handle multiple single select items', () => {
        const item1 = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        const item2 = new NgSelectMixtureItem('2', 'Item 2', 0, false, false, true, []);
        const item3 = new NgSelectMixtureItem('3', 'Item 3', 0, false, false, true, []);
        component.items = [item1, item2, item3];

        // Select first item
        component.handleClickSingleItem(item1);
        expect(item1.checked).toBe(true);
        expect(item2.checked).toBe(false);
        expect(item3.checked).toBe(false);

        // Select second item
        component.handleClickSingleItem(item2);
        expect(item1.checked).toBe(false);
        expect(item2.checked).toBe(true);
        expect(item3.checked).toBe(false);
      });
    });

    describe('Edge Cases', () => {
      it('should handle null items array', () => {
        component.items = null;
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        component.emitSingleEvent.emit = jest.fn();
        component.emitChildEvent.emit = jest.fn();

        component.handleClickSingleItem(mockItem);
        component.handleClickChildItem();

        expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
        expect(component.emitChildEvent.emit).toHaveBeenCalled();
      });

      it('should handle item with null properties', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        mockItem.value = null as any;

        component.items = [mockItem];
        component.emitSingleEvent.emit = jest.fn();

        component.handleClickSingleItem(mockItem);

        expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
      });

      it('should handle very large paddingLeft value', () => {
        component.paddingLeft = 999999;
        expect(component.paddingLeft).toBe(999999);
      });

      it('should handle negative paddingLeft value', () => {
        component.paddingLeft = -10;
        expect(component.paddingLeft).toBe(-10);
      });
    });

    describe('Output Events', () => {
      it('should emit single event with correct data', () => {
        const mockItem = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        component.items = [mockItem];
        component.emitSingleEvent.emit = jest.fn();

        component.handleClickSingleItem(mockItem);

        expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
      });

      it('should emit events multiple times', () => {
        const mockItem1 = new NgSelectMixtureItem('1', 'Item 1', 0, false, false, true, []);
        const mockItem2 = new NgSelectMixtureItem('2', 'Item 2', 0, false, false, true, []);
        component.items = [mockItem1, mockItem2];
        component.emitSingleEvent.emit = jest.fn();
        component.emitChildEvent.emit = jest.fn();
        component.handleClickSingleItem(mockItem1);
        component.handleClickSingleItem(mockItem2);
        component.handleClickChildItem();

        expect(component.emitSingleEvent.emit).toHaveBeenCalledTimes(2);
        expect(component.emitChildEvent.emit).toHaveBeenCalledTimes(1);
      });
    });
  });
});