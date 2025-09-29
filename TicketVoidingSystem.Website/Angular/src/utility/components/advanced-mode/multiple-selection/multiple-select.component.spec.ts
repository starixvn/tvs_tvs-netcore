import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultipleSelectComponent } from './multiple-select.component';
import { MultipleSelectionService } from '../../multiple-selection/multiple-selection.service';
import { MultipleSelection } from '../../multiple-selection/multiple-selection.model';
import { ItemsSelect } from '../../multiple-selection/items-select';

class Helper {
  static readonly fakeMultipleSelection = {
    selectionTitle: 'Test Selection',
    maxHeight: '350px',
    maxWidth: '170px',
    checkAllCheckBoxText: 'Check All Items',
    allItemsCheckedText: 'All',
    noneItemCheckedText: 'None Selected',
    subfixNumberItemsCheckedText: ' selected',
    numberItemsDisplay: 3,
    noData: 'No Data',
    characterValue: ',',
    characterText: ', ',
    showHeader: true,
    items: [],
    buttonHeight: '29.5px',
    isDefaultSelectAll: true,
  } as MultipleSelection;

  static readonly fakeItemsSelect: ItemsSelect[] = [
    new ItemsSelect(1, 'item1', 'Item 1', true, true, true, []),
    new ItemsSelect(2, 'item2', 'Item 2', false, true, true, []),
    new ItemsSelect(3, 'item3', 'Item 3', true, true, true, [])
  ];

  static readonly fakeMultipleSelectionWithItems: MultipleSelection = {
    ...Helper.fakeMultipleSelection,
    items: Helper.fakeItemsSelect
  } as MultipleSelection;
}

describe('MultipleSelectComponent', () => {
  let component: MultipleSelectComponent;
  let fixture: ComponentFixture<MultipleSelectComponent>;
  let multipleSelectionService: MultipleSelectionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(MultipleSelectComponent);
    multipleSelectionService = fixture.debugElement.injector.get(MultipleSelectionService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelection;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.expanded).toBeTruthy();
    expect(component.dropdownToggle).toBeFalsy();
  });

  it('should handle disabled state in ngOnChanges', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.isDisabled = true;

    // Act
    component.ngOnChanges({ isDisabled: { currentValue: true, previousValue: false, firstChange: false, isFirstChange: () => false } });

    // Assert
    component.multipleSelect.items.forEach(item => {
      expect(item.checked).toBeTruthy();
    });
  });

  it('should get selected title on init', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    multipleSelectionService.getDisplayedItems = jest.fn().mockReturnValue('Test Title');

    // Act
    component.ngOnInit();

    // Assert
    expect(multipleSelectionService.getDisplayedItems).toHaveBeenCalledWith(component.multipleSelect);
    expect(component.multipleSelect.selectionTitle).toBe('Test Title');
  });

  it('should toggle dropdown when clicking button', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelection;

    // Act
    component.dropdownToggle = !component.dropdownToggle;

    // Assert
    expect(component.dropdownToggle).toBeTruthy();
  });

  it('should not close dropdown when clicking inside component', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelection;
    component.dropdownToggle = true;
    const mockEvent = {
      target: component['element']
    } as any;

    // Mock element.contains to return true
    component['element'].contains = jest.fn().mockReturnValue(true);

    // Act
    const body = document.querySelector('body');
    const clickEvent = new Event('click');
    Object.defineProperty(clickEvent, 'target', { value: mockEvent.target });
    body?.dispatchEvent(clickEvent);

    // Assert
    expect(component.dropdownToggle).toBeTruthy();
  });

  it('should change items and update selection state', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.checkedItems.emit = jest.fn();
    multipleSelectionService.getValueItems = jest.fn().mockReturnValue('item1,item3');
    multipleSelectionService.getDisplayedItems = jest.fn().mockReturnValue('Item 1, Item 3');

    // Mock countChilds and countChildsChecked methods
    component.multipleSelect.items.forEach(item => {
      item.checkFromChilds = jest.fn();
      Object.defineProperty(item, 'countChilds', {
        get: jest.fn().mockReturnValue(1)
      });
      item.countChildsChecked = jest.fn().mockReturnValue(1);
    });

    // Act
    component.changeItems();

    // Assert
    expect(component.multipleSelect.isCheckAll).toBeTruthy();
    expect(component.multipleSelect.selectionTitle).toBe('Item 1, Item 3');
    expect(component.checkedItems.emit).toHaveBeenCalledWith(['item1', 'item3']);
  });

  it('should toggle expanded state', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.expanded = false;
    component.multipleSelect.items[0].expandedAllItems = jest.fn();

    // Act
    component.toggle();

    // Assert
    expect(component.expanded).toBeTruthy();
    component.multipleSelect.items.forEach(item => {
      expect(item.expanded).toBeTruthy();
    });
  });

  it('should collapse when toggling from expanded state', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.expanded = true;

    // Act
    component.toggle();

    // Assert
    expect(component.expanded).toBeFalsy();
    component.multipleSelect.items.forEach(item => {
      expect(item.expanded).toBeFalsy();
    });
  });

  it('should check all items when checkAllItems is called', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.multipleSelect.isCheckAll = true;
    multipleSelectionService.checkAllItems = jest.fn();

    // Act
    component.checkAllItems();

    // Assert
    expect(multipleSelectionService.checkAllItems).toHaveBeenCalledWith(
      component.multipleSelect, 
      true
    );
  });

  it('should uncheck all items when checkAllItems is called with false', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelectionWithItems;
    component.multipleSelect.isCheckAll = false;
    multipleSelectionService.checkAllItems = jest.fn();

    // Act
    component.checkAllItems();

    // Assert
    expect(multipleSelectionService.checkAllItems).toHaveBeenCalledWith(
      component.multipleSelect, 
      false
    );
  });

  it('should handle empty items array', () => {
    // Arrange
    component.multipleSelect = Helper.fakeMultipleSelection;
    component.multipleSelect.items = [];

    // Act
    component.changeItems();

    // Assert
    expect(component.multipleSelect.isCheckAll).toBeTruthy();
  });

  it('should handle items with no children', () => {
    // Arrange
    const itemsWithoutChildren = [
      new ItemsSelect(1, 'item1', 'Item 1', true, true, true, [])
    ];
    component.multipleSelect = Helper.fakeMultipleSelection;
    component.multipleSelect.items = itemsWithoutChildren;

    // Act
    component.changeItems();

    // Assert
    expect(component.multipleSelect.isCheckAll).toBeTruthy();
  });

  it('should set isCheckAll to false when not all items are checked', () => {
    // Arrange
    const itemsWithMixedState = [
      new ItemsSelect(1, 'item1', 'Item 1', true, true, true, []),
      new ItemsSelect(2, 'item2', 'Item 2', false, true, true, [])
    ];
    component.multipleSelect = Helper.fakeMultipleSelection;
    component.multipleSelect.items = itemsWithMixedState;

    // Mock countChilds and countChildsChecked
    Object.defineProperty(itemsWithMixedState[0], 'countChilds', {
      get: jest.fn().mockReturnValue(1)
    });
    itemsWithMixedState[0].countChildsChecked = jest.fn().mockReturnValue(1);
    Object.defineProperty(itemsWithMixedState[1], 'countChilds', {
      get: jest.fn().mockReturnValue(1)
    });
    itemsWithMixedState[1].countChildsChecked = jest.fn().mockReturnValue(0);

    // Act
    component.changeItems();

    // Assert
    expect(component.multipleSelect.isCheckAll).toBeFalsy();
  });
});
