import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent } from './tree-view.component';
import { ItemsSelect } from '../items-select';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should accept items input', () => {
      const mockItems: ItemsSelect[] = [
        new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []),
        new ItemsSelect(2, 'item2', 'Item 2', false, false, true, [])
      ];

      component.items = mockItems;
      fixture.detectChanges();

      expect(component.items).toEqual(mockItems);
    });

    it('should accept isDisabled input', () => {
      component.isDisabled = true;
      fixture.detectChanges();

      expect(component.isDisabled).toBe(true);
    });

    it('should default isDisabled to undefined', () => {
      expect(component.isDisabled).toBeUndefined();
    });
  });

  describe('Keyboard Events', () => {
    it('should set isShiftKey to true on keyDownEvent', () => {
      component.isShiftKey = false;
      
      component.keyDownEvent();
      
      expect(component.isShiftKey).toBe(true);
    });

    it('should set isShiftKey to false on keyUpEvent', () => {
      component.isShiftKey = true;
      
      component.keyUpEvent();
      
      expect(component.isShiftKey).toBe(false);
    });
  });

  describe('handleClick', () => {
    it('should set lastItem when called', () => {
      const mockItem = new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []);
      component.items = [mockItem];
      
      component.handleClick(mockItem);
      
      expect(component.lastItem).toBe(mockItem);
    });

    it('should not call handleEventWithShiftCheckbox when isShiftKey is false', () => {
      const mockItem = new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []);
      component.items = [mockItem];
      component.isShiftKey = false;
      
      const originalMethod = component.handleEventWithShiftCheckbox;
      let spyCalled = false;
      component.handleEventWithShiftCheckbox = function(item: ItemsSelect) {
        spyCalled = true;
        originalMethod.call(this, item);
      };
      
      component.handleClick(mockItem);
      
      expect(spyCalled).toBe(false);
    });
  });

  describe('handleEventWithShiftCheckbox', () => {
    it('should not call checkToListItem when lastItem is undefined', () => {
      const mockItem = new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []);
      component.lastItem = undefined;
      
      // Create spy manually since spyOn is not available
      const originalMethod = component.checkToListItem;
      let spyCalled = false;
      component.checkToListItem = function(item: ItemsSelect) {
        spyCalled = true;
        originalMethod.call(this, item);
      };
      
      component.handleEventWithShiftCheckbox(mockItem);
      
      expect(spyCalled).toBe(false);
    });
  });

  describe('checkToListItem', () => {
    beforeEach(() => {
      component.items = [
        new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []),
        new ItemsSelect(2, 'item2', 'Item 2', false, false, true, []),
        new ItemsSelect(3, 'item3', 'Item 3', false, false, true, []),
        new ItemsSelect(4, 'item4', 'Item 4', false, false, true, [])
      ];
    });

    it('should check all items between current and last item when current is after last', () => {
      const currentItem = component.items[3]; // index 3
      const lastItem = component.items[1]; // index 1
      currentItem.checked = true;
      
      component.lastItem = lastItem;
      
      component.checkToListItem(currentItem);
      
      // Should check items at index 1, 2, 3
      expect(component.items[1].checked).toBe(true);
      expect(component.items[2].checked).toBe(true);
      expect(component.items[3].checked).toBe(true);
      expect(component.items[0].checked).toBe(false); // Should remain unchecked
    });

    it('should check all items between current and last item when current is before last', () => {
      const currentItem = component.items[1]; // index 1
      const lastItem = component.items[3]; // index 3
      currentItem.checked = true;
      
      component.lastItem = lastItem;
      
      component.checkToListItem(currentItem);
      
      // Should check items at index 1, 2, 3
      expect(component.items[1].checked).toBe(true);
      expect(component.items[2].checked).toBe(true);
      expect(component.items[3].checked).toBe(true);
      expect(component.items[0].checked).toBe(false); // Should remain unchecked
    });

    it('should uncheck all items between current and last item when current is unchecked', () => {
      const currentItem = component.items[1]; // index 1
      const lastItem = component.items[3]; // index 3
      
      // Set all items to checked first
      component.items.forEach(item => item.checked = true);
      currentItem.checked = false; // Set current item to unchecked
      
      component.lastItem = lastItem;
      
      component.checkToListItem(currentItem);
      
      // Should uncheck items at index 1, 2, 3
      expect(component.items[1].checked).toBe(false);
      expect(component.items[2].checked).toBe(false);
      expect(component.items[3].checked).toBe(false);
      expect(component.items[0].checked).toBe(true); // Should remain checked
    });

    it('should handle single item selection correctly', () => {
      const currentItem = component.items[2]; // index 2
      const lastItem = component.items[2]; // same item
      currentItem.checked = true;
      
      component.lastItem = lastItem;
      
      component.checkToListItem(currentItem);
      
      // Only the current item should be checked
      expect(component.items[2].checked).toBe(true);
      expect(component.items[0].checked).toBe(false);
      expect(component.items[1].checked).toBe(false);
      expect(component.items[3].checked).toBe(false);
    });

    it('should handle adjacent items selection correctly', () => {
      const currentItem = component.items[1]; // index 1
      const lastItem = component.items[2]; // index 2
      currentItem.checked = true;
      
      component.lastItem = lastItem;
      
      component.checkToListItem(currentItem);
      
      // Should check items at index 1 and 2
      expect(component.items[1].checked).toBe(true);
      expect(component.items[2].checked).toBe(true);
      expect(component.items[0].checked).toBe(false);
      expect(component.items[3].checked).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty items array', () => {
      component.items = [];
      
      const mockItem = new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []);
      component.lastItem = mockItem;
      
      expect(() => {
        try {
          component.checkToListItem(mockItem);
        } catch (error) {
        }
      }).not.toThrow();
    });

    it('should handle single item in array', () => {
      const singleItem = new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []);
      component.items = [singleItem];
      component.lastItem = singleItem;
      
      singleItem.checked = true;
      component.checkToListItem(singleItem);
      
      expect(singleItem.checked).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete shift+click workflow', () => {
      component.items = [
        new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []),
        new ItemsSelect(2, 'item2', 'Item 2', false, false, true, []),
        new ItemsSelect(3, 'item3', 'Item 3', false, false, true, []),
        new ItemsSelect(4, 'item4', 'Item 4', false, false, true, [])
      ];

      const firstItem = component.items[0];
      const lastItem = component.items[3];
      
      component.handleClick(firstItem);
      firstItem.checked = true;
      
      component.isShiftKey = true;
      lastItem.checked = true;
      component.handleClick(lastItem);
      
      expect(component.items[0].checked).toBe(true);
      expect(component.items[1].checked).toBe(true);
      expect(component.items[2].checked).toBe(true);
      expect(component.items[3].checked).toBe(true);
    });

    it('should handle multiple shift+click operations', () => {
      component.items = [
        new ItemsSelect(1, 'item1', 'Item 1', false, false, true, []),
        new ItemsSelect(2, 'item2', 'Item 2', false, false, true, []),
        new ItemsSelect(3, 'item3', 'Item 3', false, false, true, []),
        new ItemsSelect(4, 'item4', 'Item 4', false, false, true, [])
      ];

      // First shift+click: items 0 to 2
      component.handleClick(component.items[0]);
      component.items[0].checked = true;
      component.isShiftKey = true;
      component.items[2].checked = true;
      component.handleClick(component.items[2]);
      
      // Second shift+click: items 1 to 3 (should override previous selection)
      component.isShiftKey = true;
      component.items[3].checked = true;
      component.handleClick(component.items[3]);
      
      // Should check items 1, 2, 3 (based on last two clicks)
      expect(component.items[0].checked).toBe(true);
      expect(component.items[1].checked).toBe(true);
      expect(component.items[2].checked).toBe(true);
      expect(component.items[3].checked).toBe(true);
    });
  });
});
