import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { NgSelectMixtureComponent } from './ng-select-mixture.component';
import { NgSelectMixtureModel } from './ng-select-mixture.model';
import { NgSelectMixtureItem } from './ng-select-mixture-item.model';
import { NgSelectMixtureService } from './ng-select-mixture.service';

class Helper {
  static readonly fakeSelectedItems: string[] = ['item1', 'item2'];
  static readonly fakeModel: NgSelectMixtureModel = {
    items: [
      {
        name: 'Item 1',
        value: 'item1',
        children: [],
        parentId: null,
        checked: false,
        expanded: false,
        items: [],
        level: 0,
        isLeaf: true,
        isRoot: true,
        isVisible: true,
        isCollapsed: true,
        checkBySelectedItem: jest.fn(),
        unCheckChild: jest.fn(),
        checkFromChild: jest.fn(),
        getValueChildChecked: jest.fn().mockReturnValue(['item1']),
        getDisplayedText: jest.fn().mockReturnValue('New Title'),
        getDisplayedAllChildItems: jest.fn().mockReturnValue('Updated Title'),
        getValueItems: jest.fn().mockReturnValue(['item1'])
      } as unknown as NgSelectMixtureItem
    ],
    title: 'Test Title',
    isShowPlaceHolder: true,
    getDisplayedText: jest.fn().mockReturnValue('New Title'),
    getDisplayedAllChildItems: jest.fn().mockReturnValue('Updated Title'),
    getValueItems: jest.fn().mockReturnValue(['item1'])
  } as unknown as NgSelectMixtureModel;
}

describe('NgSelectMixtureComponent', () => {
  let component: NgSelectMixtureComponent;
  let fixture: ComponentFixture<NgSelectMixtureComponent>;
  let ngSelectMixtureService: NgSelectMixtureService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NgSelectMixtureComponent);
    ngSelectMixtureService = fixture.debugElement.injector.get(NgSelectMixtureService);
    component = fixture.componentInstance;
    component.checkedItems.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.selectedItems = Helper.fakeSelectedItems;
    component.model = Helper.fakeModel;
    ngSelectMixtureService.checkBySelectedItem = jest.fn();
    // Act
    component.ngOnInit();

    // Assert
    expect(component.isCollapse).toBeFalsy();
    expect(component.model.title).toBeDefined();
    expect(ngSelectMixtureService.checkBySelectedItem).toHaveBeenCalledWith(Helper.fakeModel.items[0], Helper.fakeSelectedItems);
  });

  it('should handle click button toggle', () => {
    // Arrange
    component.isCollapse = false;

    // Act
    component.clickButton();

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });

  it('should emit single event when item is selected', () => {
    // Arrange
    const item = Helper.fakeModel.items[0];
    component.model = Helper.fakeModel;
    ngSelectMixtureService.unCheckChild = jest.fn();
    ngSelectMixtureService.checkFromChild = jest.fn();

    // Act
    component.emitSingleEvent(item);

    // Assert
    expect(component.isCollapse).toBeFalsy();
    expect(component.model.title).toBe(item.name);
    expect(component.model.isShowPlaceHolder).toBeFalsy();
    expect(component.checkedItems.emit).toHaveBeenCalledWith([item.value]);
    expect(ngSelectMixtureService.unCheckChild).toHaveBeenCalled();
    expect(ngSelectMixtureService.checkFromChild).toHaveBeenCalled();
  });

  it('should emit child event and update title', () => {
    // Arrange
    component.model = Helper.fakeModel;
    ngSelectMixtureService.getDisplayedAllChildItems = jest.fn().mockReturnValue('Updated Title');

    // Act
    component.emitChildEvent();

    // Assert
    expect(component.model.title).toBe('Updated Title');
  });

  it('should handle body click outside component', () => {
    // Arrange
    component.isCollapse = true;
    component.isDisabled = false;
    component.model = Helper.fakeModel;

    // Act
    const event = new MouseEvent('click');
    component['handleBodyClick'](event);

    // Assert
    expect(component.isCollapse).toBeTruthy();
  });

  it('should not emit when component is disabled', () => {
    // Arrange
    component.isCollapse = true;
    component.isDisabled = true;
    component.model = Helper.fakeModel;

    // Act
    const event = new MouseEvent('click');
    component['handleBodyClick'](event);

    // Assert
    expect(component.isCollapse).toBeTruthy();
    expect(component.checkedItems.emit).not.toHaveBeenCalled();
  });

  it('should check items by selected items on init', () => {
    // Arrange
    component.selectedItems = Helper.fakeSelectedItems;
    component.model = Helper.fakeModel;
    ngSelectMixtureService.checkBySelectedItem = jest.fn();
    // Act
    component.ngOnInit();

    // Assert
    expect(ngSelectMixtureService.checkBySelectedItem).toHaveBeenCalledWith(Helper.fakeModel.items[0], Helper.fakeSelectedItems);
  });

  it('should update title on init', () => {
    // Arrange
    component.selectedItems = Helper.fakeSelectedItems;
    component.model = Helper.fakeModel;
    ngSelectMixtureService.getDisplayedText = jest.fn().mockReturnValue('New Title');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.model.title).toBe('New Title');
  });
});
