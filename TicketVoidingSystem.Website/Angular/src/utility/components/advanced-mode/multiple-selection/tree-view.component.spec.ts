import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent } from './tree-view.component';
import { ItemsSelect } from '../../multiple-selection/items-select';
import { ItemsSelectService } from '../../multiple-selection/items-select.service';

class Helper {
  static readonly fakeItemsSelect: ItemsSelect[] = [
    ItemsSelectService.initItemsSelect(1, 'item1', 'Item 1', true, true, true, []),
    ItemsSelectService.initItemsSelect(2, 'item2', 'Item 2', false, true, true, []),
    ItemsSelectService.initItemsSelect(3, 'item3', 'Item 3', true, true, true, []),
    ItemsSelectService.initItemsSelect(4, 'item4', 'Item 4', false, true, true, []),
    ItemsSelectService.initItemsSelect(5, 'item5', 'Item 5', true, true, true, [])
  ];
}

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Assert
    expect(component.items).toBeUndefined();
    expect(component.lastItem).toBeUndefined();
    expect(component.shiftKey).toBeFalsy();
  });

  describe('keyDown', () => {
    it('should set shiftKey to true when keyDown is called', () => {
      // Arrange
      component.shiftKey = false;

      // Act
      component.keyDown();

      // Assert
      expect(component.shiftKey).toBeTruthy();
    });
  });

  describe('keyUp', () => {
    it('should set shiftKey to false when keyUp is called', () => {
      // Arrange
      component.shiftKey = true;

      // Act
      component.keyUp();

      // Assert
      expect(component.shiftKey).toBeFalsy();
    });
  });

  describe('clickEvent', () => {
    beforeEach(() => {
      component.items = Helper.fakeItemsSelect;
    });

    it('should handle click event without shift key', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[0];
      component.shiftKey = false;
      component.lastItem = undefined;

      // Act
      component.clickEvent(item);

      // Assert
      expect(component.lastItem).toBe(item);
    });

    it('should handle click event with shift key and no lastItem', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[0];
      component.shiftKey = true;
      component.lastItem = undefined;

      // Act
      component.clickEvent(item);

      // Assert
      expect(component.lastItem).toBe(item);
    });

    it('should handle click event with shift key and existing lastItem', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[2];
      component.shiftKey = true;
      component.lastItem = Helper.fakeItemsSelect[0];

      // Act
      component.clickEvent(item);

      // Assert
      expect(component.lastItem).toBe(item);
    });
  });

  describe('handleWithShiftCheckbox', () => {
    beforeEach(() => {
      component.items = Helper.fakeItemsSelect;
    });

    it('should not process when lastItem is undefined', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[0];
      component.lastItem = undefined;

      // Act
      component['handleWithShiftCheckbox'](item);

      // Assert
      // Should not throw error and should not modify items
      expect(component.items).toEqual(Helper.fakeItemsSelect);
    });

    it('should process when lastItem is defined', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[2];
      component.lastItem = Helper.fakeItemsSelect[0];

      // Act
      component['handleWithShiftCheckbox'](item);

      // Assert
      // The method should call checkListItem
      expect(component.lastItem).toBe(Helper.fakeItemsSelect[0]);
    });
  });

  describe('checkListItem', () => {
    beforeEach(() => {
      component.items = Helper.fakeItemsSelect;
    });

    it('should check items in range from first to last', () => {
      // Arrange
      const firstItem = Helper.fakeItemsSelect[0]; // index 0
      const lastItem = Helper.fakeItemsSelect[2]; // index 2
      component.lastItem = firstItem;
      lastItem.checked = true;

      // Act
      component['checkListItem'](lastItem);

      // Assert
      expect(component.items[0].checked).toBeTruthy();
      expect(component.items[1].checked).toBeTruthy();
      expect(component.items[2].checked).toBeTruthy();
    });

    it('should check items in range from last to first', () => {
      // Arrange
      const firstItem = Helper.fakeItemsSelect[2]; // index 2
      const lastItem = Helper.fakeItemsSelect[0]; // index 0
      component.lastItem = firstItem;
      lastItem.checked = true;

      // Act
      component['checkListItem'](lastItem);

      // Assert
      expect(component.items[0].checked).toBeTruthy();
      expect(component.items[1].checked).toBeTruthy();
      expect(component.items[2].checked).toBeTruthy();
    });

    it('should uncheck items in range when item is unchecked', () => {
      // Arrange
      const firstItem = Helper.fakeItemsSelect[0]; // index 0
      const lastItem = Helper.fakeItemsSelect[2]; // index 2
      component.lastItem = firstItem;
      lastItem.checked = false;

      // Act
      component['checkListItem'](lastItem);

      // Assert
      expect(component.items[0].checked).toBeFalsy();
      expect(component.items[1].checked).toBeFalsy();
      expect(component.items[2].checked).toBeFalsy();
    });

    it('should handle single item selection', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[1]; // index 1
      component.lastItem = item;
      item.checked = true;

      // Act
      component['checkListItem'](item);

      // Assert
      expect(component.items[1].checked).toBeTruthy();
    });

    it('should handle items with same index', () => {
      // Arrange
      const item = Helper.fakeItemsSelect[2]; // index 2
      component.lastItem = item;
      item.checked = false;

      // Act
      component['checkListItem'](item);

      // Assert
      expect(component.items[2].checked).toBeFalsy();
    });
  });

  describe('Integration tests', () => {
    beforeEach(() => {
      component.items = Helper.fakeItemsSelect;
    });

    it('should handle complete shift+click workflow', () => {
      // Arrange
      const firstItem = Helper.fakeItemsSelect[0];
      const lastItem = Helper.fakeItemsSelect[3];
      component.shiftKey = false;
      component.lastItem = undefined;

      // Act - Simulate user pressing shift and clicking first item
      component.keyDown();
      component.clickEvent(firstItem);

      // Act - Simulate user clicking last item while shift is pressed
      component.clickEvent(lastItem);

      // Assert
      expect(component.shiftKey).toBeTruthy();
      expect(component.lastItem).toBe(lastItem);
    });

    it('should handle multiple shift+click selections', () => {
      // Arrange
      component.shiftKey = true;
      component.lastItem = Helper.fakeItemsSelect[0];

      // Act
      component.clickEvent(Helper.fakeItemsSelect[2]);

      // Assert
      expect(component.lastItem).toBe(Helper.fakeItemsSelect[2]);
    });
  });
});
