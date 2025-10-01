import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectTreeViewComponent } from './ng-select-tree-view.component';
import { NgSelectMixtureItem } from '../ng-select-mixture-item.model';
import { NgSelectMixtureService } from '../ng-select-mixture.service';

describe('NgSelectTreeViewComponent', () => {
  let component: NgSelectTreeViewComponent;
  let fixture: ComponentFixture<NgSelectTreeViewComponent>;
  let ngSelectMixtureService: NgSelectMixtureService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(NgSelectTreeViewComponent);
    ngSelectMixtureService = fixture.debugElement.injector.get(NgSelectMixtureService);
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
      const mockItems = [{value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} ] as NgSelectMixtureItem[];
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
      const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItems = [mockItem, {value: '2', name: 'Item 2', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem];
      component.items = mockItems;

      component.handleClickSingleItem(mockItem);

      expect(mockItem.checked).toBe(true);
    });

    it('should uncheck other items when single item is selected', () => {
      const mockItem1 = {value: '1', name: 'Item 1', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItem2 = {value: '2', name: 'Item 2', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItems = [mockItem1, mockItem2];
      component.items = mockItems;

      component.handleClickSingleItem(mockItem1);

      expect(mockItem1.checked).toBe(true);
      expect(mockItem2.checked).toBe(false);
    });

    it('should emit single event with selected item', () => {
      const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItems = [mockItem];
      component.items = mockItems;
      component.emitSingleEvent.emit = jest.fn();

      component.handleClickSingleItem(mockItem);

      expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
    });

    it('should handle empty items array', () => {
      component.items = [];
      const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
      component.emitSingleEvent.emit = jest.fn();

      component.handleClickSingleItem(mockItem);

      // Kiểm tra rằng method đã thực thi thành công bằng cách kiểm tra emit được gọi
      expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
    });
  });

  describe('unCheckOtherItem', () => {
    it('should uncheck all items except selected item', () => {
      const mockItem1 = {value: '1', name: 'Item 1', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItem2 = {value: '2', name: 'Item 2', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItem3 = {value: '3', name: 'Item 3', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItems = [mockItem1, mockItem2, mockItem3];
      component.items = mockItems;

      // Access private method through component instance
      (component as any).unCheckOtherItem(mockItem1);

      expect(mockItem1.checked).toBe(true);
      expect(mockItem2.checked).toBe(false);
      expect(mockItem3.checked).toBe(false);
    });

    it('should handle items with same value', () => {
      const mockItem1 = {value: '1', name: 'Item 1', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
      const mockItem2 = {value: '1', name: 'Item 1 Copy', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem;
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
      component.items = [{value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem];
      component.handleClickChildItem();

      expect(component.emitChildEvent.emit).toHaveBeenCalled();
    });

    it('should uncheck all single select items', () => {
      const mockItem1 = {value: '1', name: 'Item 1', parentId: 0, checked: true, expanded: false, items: []} as NgSelectMixtureItem; // single select
      const mockItem2 = {value: '2', name: 'Item 2', parentId: 1, checked: true, expanded: false, items: []} as NgSelectMixtureItem; // not single select
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

      expect(component.emitChildEvent.emit).toHaveBeenCalled();
    });
  });

  describe('checkFromChildEvent', () => {
    it('should call checkFromChild on item', () => {
      const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
      ngSelectMixtureService.checkFromChild = jest.fn();

      component.checkFromChildEvent(mockItem);

      expect(ngSelectMixtureService.checkFromChild).toHaveBeenCalled();
    });

    describe('isHaveCheckBox', () => {
      it('should return true when item has children', () => {
        const childItem = {value: '2', name: 'Child', parentId: 1, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const mockItem = {value: '1', name: 'Parent', parentId: 0, checked: false, expanded: false, items: [childItem]} as NgSelectMixtureItem;

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });

      it('should return true when item has parentId less than 0', () => {
        const mockItem = {value: '1', name: 'Item 1', parentId: -1, checked: false, expanded: false, items: []} as NgSelectMixtureItem;

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });

      it('should return false when item has no children and parentId >= 0', () => {
        const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(false);
      });

      it('should return false when item has no children and parentId > 0', () => {
        const mockItem = {value: '1', name: 'Item 1', parentId: 1, checked: false, expanded: false, items: []} as NgSelectMixtureItem;

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(false);
      });

      it('should return true when item has both children and parentId < 0', () => {
        const childItem = {value: '2', name: 'Child', parentId: 1, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const mockItem = {value: '1', name: 'Parent', parentId: -1, checked: false, expanded: false, items: [childItem]} as NgSelectMixtureItem;

        const result = component.isHaveCheckBox(mockItem);

        expect(result).toBe(true);
      });
    });

    describe('Component Integration Tests', () => {
      it('should handle complex tree structure', () => {
        const grandChild1 = {value: '3', name: 'GrandChild 1', parentId: 2, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const grandChild2 = {value: '4', name: 'GrandChild 2', parentId: 2, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const child1 = {value: '2', name: 'Child 1', parentId: 1, checked: false, expanded: false, items: [grandChild1, grandChild2]} as NgSelectMixtureItem;
        const child2 = {value: '5', name: 'Child 2', parentId: 1, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const parent = {value: '1', name: 'Parent', parentId: 0, checked: false, expanded: false, items: [child1, child2]} as NgSelectMixtureItem;

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
        const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        component.items = [mockItem];
        component.isDisabled = true;

        component.emitSingleEvent.emit = jest.fn();
        component.handleClickSingleItem(mockItem);

        // Even when disabled, the method should still execute
        expect(component.emitSingleEvent.emit).toHaveBeenCalled();
      });

      it('should handle multiple single select items', () => {
        const item1 = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const item2 = {value: '2', name: 'Item 2', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const item3 = {value: '3', name: 'Item 3', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
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
        const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        component.emitSingleEvent.emit = jest.fn();
        component.emitChildEvent.emit = jest.fn();

        component.handleClickSingleItem(mockItem);
        component.handleClickChildItem();

        expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
        expect(component.emitChildEvent.emit).toHaveBeenCalled();
      });

      it('should handle item with null properties', () => {
        const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
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
        const mockItem = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        component.items = [mockItem];
        component.emitSingleEvent.emit = jest.fn();

        component.handleClickSingleItem(mockItem);

        expect(component.emitSingleEvent.emit).toHaveBeenCalledWith(mockItem);
      });

      it('should emit events multiple times', () => {
        const mockItem1 = {value: '1', name: 'Item 1', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
        const mockItem2 = {value: '2', name: 'Item 2', parentId: 0, checked: false, expanded: false, items: []} as NgSelectMixtureItem;
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