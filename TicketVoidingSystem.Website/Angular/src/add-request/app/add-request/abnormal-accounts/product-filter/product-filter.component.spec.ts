import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ProductFilterComponent } from './product-filter.component';
import { ProductFilter, TicketStatus, TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT} from '../../../../../utility/constants/text';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { EventEmitter, SimpleChange } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';

class Helper {
  static readonly fakeAbnormalAccountModel = new AbnormalAccountModel();
  static readonly fakeProductFilter = ProductFilter.SELECTION_ITEMS;
  static readonly fakeTicketStatus = TicketStatus.SELECTION_ITEMS;
}

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent;
  let fixture: ComponentFixture<ProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFilterComponent);
    component = fixture.componentInstance;
    
    // Mock Tooltip
    component.tooltip = {
      display: jest.fn(),
      element: {
        getElementsByClassName: jest.fn().mockReturnValue([{
          scrollIntoView: jest.fn(),
          getBoundingClientRect: jest.fn().mockReturnValue({})
        }])
      }
    } as unknown as Tooltip;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.selectedProducts).toEqual(ProductFilter.SELECTION_ITEMS.map(x => x.value));
    expect(component.selectedTicketStatus).toEqual(TicketStatus.SELECTION_ITEMS.map(x => x.value));
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;
    component.abnormalAccountModel.productIds = '1,2';
    component.abnormalAccountModel.statusIds = '0,1';

    // Act
    component.ngOnInit();

    // Assert
    expect(component.selectedProducts).toEqual(['1', '2']);
    expect(component.selectedTicketStatus).toEqual(['0,1']);
  });

  it('should handle actionId changes', () => {
    // Arrange
    component.actionId = TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
    component.changeFilterEvent = { emit: jest.fn() } as unknown as EventEmitter<void>;

    // Act
    component.ngOnChanges({
      actionId: {
        currentValue: TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString(),
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.selectedTicketStatus).toEqual(
      TicketStatus.SELECTION_ITEMS_AUTO_VOID_POLICY.map(x => x.value)
    );
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should validate component with empty products', () => {
    // Arrange
    component.selectedProducts = [];
    component.selectedTicketStatus = ['0', '1'];
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;

    // Act
    const result = component.isValidComponent();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('product', TEXT.REQUIRED_PRODUCT);
  });

  it('should validate component with empty ticket status', () => {
    // Arrange
    component.selectedProducts = ['1', '2'];
    component.selectedTicketStatus = [];
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;

    // Act
    const result = component.isValidComponent();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('ticket-status', TEXT.REQUIRED_TICKET_STATUS);
  });

  it('should validate component with valid data', () => {
    // Arrange
    component.selectedProducts = ['1', '2'];
    component.selectedTicketStatus = ['0', '1'];
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;

    // Act
    const result = component.isValidComponent();

    // Assert
    expect(result).toBeTruthy();
    expect(component.abnormalAccountModel.productIds).toBe('1,2');
    expect(component.abnormalAccountModel.statusIds).toBe('0,1');
  });

  it('should handle filter changes', () => {
    // Arrange
    component.changeFilterEvent = { emit: jest.fn() } as unknown as EventEmitter<void>;

    // Act
    component.changeFilter();

    // Assert
    expect(component.changeFilterEvent.emit).toHaveBeenCalled();
  });

  it('should update items with running and waiting status', () => {
    // Arrange
    component.isEdit = true;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;
    component.abnormalAccountModel.productIds = '1,2';
    component.abnormalAccountModel.statusIds = '0,1';

    // Act
    component.updateItem();

    // Assert
    expect(component.selectedProducts).toEqual(['1', '2']);
    expect(component.selectedTicketStatus).toEqual(['0,1']);
  });
});
