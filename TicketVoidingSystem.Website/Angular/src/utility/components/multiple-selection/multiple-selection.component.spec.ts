import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { MultipleSelectionComponent } from './multiple-selection.component';
import { MultipleSelection } from './multiple-selection.model';
import { ItemsSelect } from './items-select';
import { SimpleChange } from '@angular/core';
import { ItemsSelectService } from './items-select.service';

class Helper {
  static readonly fakeMultipleSelect = new MultipleSelection();
  static readonly fakeSelectedItems = ['item1', 'item2'];
  static readonly fakeItemsSelect = [
    {
      id: 1,
      value: 'item1',
      text: 'Item 1',
      checked: false,
      expanded: true,
      enable: true,
      items: [],
      countChilds: 1
    }
  ] as ItemsSelect[];
}

describe('MultipleSelectionComponent', () => {
  let component: MultipleSelectionComponent;
  let fixture: ComponentFixture<MultipleSelectionComponent>;
  let itemsSelectService: ItemsSelectService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleSelectionComponent);
    component = fixture.componentInstance;
    itemsSelectService = fixture.debugElement.injector.get(ItemsSelectService);
    component.multipleSelect = Helper.fakeMultipleSelect;
    component.multipleSelect.items = Helper.fakeItemsSelect;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange & Act
    component.ngOnInit();

    // Assert
    expect(component.isExpanded).toBeTruthy();
    expect(component.isCollapse).toBeUndefined();
  });

  it('should handle isDisabled changes', () => {
    // Arrange
    component.isDisabled = true;
    const changes = {
      isDisabled: {
        currentValue: true,
        previousValue: false,
        firstChange: true
      } as SimpleChange
    };

    // Act
    component.ngOnChanges(changes);

    // Assert
    expect(component.multipleSelect.items[0].checked).toBeTruthy();
  });

  it('should handle multipleSelect changes', () => {
    // Arrange
    const changes = {
      multipleSelect: {
        currentValue: Helper.fakeMultipleSelect,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    };

    // Act
    component.ngOnChanges(changes);

    // Assert
    expect(component.multipleSelect.selectionTitle).toBeDefined();
  });

  it('should handle selectedItems changes', () => {
    // Arrange
    const changes = {
      selectedItems: {
        currentValue: Helper.fakeSelectedItems,
        previousValue: [],
        firstChange: true
      } as SimpleChange
    };
    itemsSelectService.checkBySelectedItem = jest.fn();
    itemsSelectService.checkFromChilds = jest.fn();

    // Act
    component.ngOnChanges(changes);

    // Assert
    expect(itemsSelectService.checkBySelectedItem).toHaveBeenCalled();
  });

  it('should check items by selected items', () => {
    // Arrange
    const selectedItems = ['item1'];
    itemsSelectService.checkBySelectedItem = jest.fn();
    itemsSelectService.checkFromChilds = jest.fn();

    // Act
    component.checkBySelectedItem(selectedItems);

    // Assert
    expect(itemsSelectService.checkBySelectedItem).toHaveBeenCalledWith(Helper.fakeItemsSelect[0], selectedItems);
    expect(itemsSelectService.checkFromChilds).toHaveBeenCalledWith(Helper.fakeItemsSelect[0]);
  });

  it('should update multiple select when items change', () => {
    // Arrange
    itemsSelectService.countChildsChecked = jest.fn().mockReturnValue(1);
    Helper.fakeItemsSelect[0].countChilds = 1;

    // Act
    component.updateMultipleSelect();

    // Assert
    expect(component.multipleSelect.selectionTitle).toBeDefined();
    expect(component.multipleSelect.isCheckAll).toBeTruthy();
  });

  it('should toggle expansion state', () => {
    // Arrange
    component.isExpanded = true;

    // Act
    component.toggle();

    // Assert
    expect(component.isExpanded).toBeFalsy();
    expect(Helper.fakeItemsSelect[0].expanded).toBeFalsy();
  });

  it('should emit checked items when items change', () => {
    // Arrange
    component.checkedItems.emit = jest.fn();
    Helper.fakeItemsSelect[0].checked = true;

    // Act
    component.changeItems();

    // Assert
    expect(component.checkedItems.emit).toHaveBeenCalled();
  });

  it('should handle click outside to collapse', () => {
    // Arrange
    component.isCollapse = true;
    const mockEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Act
    component.loseFocus.emit = jest.fn();
    document.body.dispatchEvent(mockEvent);

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });
});
