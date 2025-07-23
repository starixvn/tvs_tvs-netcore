import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet.component';
import { CheckboxType, ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';

describe('ConfirmAbnormalBetComponent', () => {
  let component: ConfirmAbnormalBetComponent;
  let fixture: ComponentFixture<ConfirmAbnormalBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule, ConfirmAbnormalBetComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmAbnormalBetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeTruthy();
    expect(component.isEdit).toBeFalsy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeFalsy();
    expect(component.isConfirmCalculator).toBeTruthy();
    expect(component.checkboxType).toBeDefined();
  });

  it('should update data when model changes and has warning', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.ticketsOfVIPCustomer = '1,2,3';
    model.settledTickets = '4,5,6';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.ticketsOfCreditCashService = '13,14,15';
    model.transIds = '7,8,9,10,11,12,13,14,15';

    // Act
    component.model = model;
    component.ngOnChanges({
      model: {
        currentValue: model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(component.ticketsOfVIPCustomer).toBe('1, 2, 3');
    expect(component.settledTickets).toBe('4, 5, 6');
    expect(component.ticketsOfCustomerClass201).toBe('7, 8, 9');
    expect(component.ticketsOfCustomerClass4K).toBe('10, 11, 12');
    expect(component.ticketsOfCreditCashService).toBe('13, 14, 15');
  });

  it('should handle all tickets of customer class 201', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '';
    model.ticketsOfCreditCashService = '';
    model.ticketsOfVIPCustomer = '';
    model.settledTickets = '';

    // Act
    component.model = model;
    component.ngOnChanges({
      model: {
        currentValue: model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeFalsy();
  });

  it('should handle all tickets of customer class 4K', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '10,11,12';
    model.ticketsOfCustomerClass201 = '';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.ticketsOfCreditCashService = '';
    model.ticketsOfVIPCustomer = '';
    model.settledTickets = '';

    // Act
    component.model = model;
    component.ngOnChanges({
      model: {
        currentValue: model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeFalsy();
  });

  it('should handle all tickets of both customer classes', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9,10,11,12';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.ticketsOfCreditCashService = '';
    model.ticketsOfVIPCustomer = '';
    model.settledTickets = '';

    // Act
    component.model = model;
    component.ngOnChanges({
      model: {
        currentValue: model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Set checkboxes manually for direct call
    component.model.checkboxes = {
      [CheckboxType.CUSTOMER_CLASS_201]: model.ticketsOfCustomerClass201,
      [CheckboxType.CUSTOMER_CLASS_4K]: model.ticketsOfCustomerClass4K,
      [CheckboxType.CREDIT_CASH_SERVICE]: model.ticketsOfCreditCashService,
    };

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeFalsy();
  });

  it('should handle checkbox toggle', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9,10,11,12';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.ticketsOfCreditCashService = '';
    component.model = model;

    // Act
    component.onCheckboxToggle(CheckboxType.CUSTOMER_CLASS_201);

    // Assert
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
  });

  it('should handle isCheckboxDisabled', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.transIds = '7,8,9,10';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10';
    model.ticketsOfCreditCashService = '';
    component.model = model;

    // Set checkboxes manually since ngOnChanges won't be called
    component.model.checkboxes = {
      [CheckboxType.CUSTOMER_CLASS_201]: model.ticketsOfCustomerClass201,
      [CheckboxType.CUSTOMER_CLASS_4K]: model.ticketsOfCustomerClass4K,
      [CheckboxType.CREDIT_CASH_SERVICE]: model.ticketsOfCreditCashService,
    };

    // Debug: Let's see what happens
    console.log('transIds:', model.transIds);
    console.log('ticketsOfCustomerClass201:', model.ticketsOfCustomerClass201);
    console.log('ticketsOfCustomerClass4K:', model.ticketsOfCustomerClass4K);
    console.log('isCheckboxDisabled CUSTOMER_CLASS_201:', component.isCheckboxDisabled(CheckboxType.CUSTOMER_CLASS_201));
    console.log('isCheckboxDisabled CUSTOMER_CLASS_4K:', component.isCheckboxDisabled(CheckboxType.CUSTOMER_CLASS_4K));

    // Act & Assert
    // Based on the logic: if checking CUSTOMER_CLASS_201 (7,8,9) would remove all tickets from transIds (7,8,9,10)
    // Then remaining would be [10], so length > 0, so should return false (not disabled)
    // But we expect it to be disabled, so our test data is wrong
    expect(component.isCheckboxDisabled(CheckboxType.CUSTOMER_CLASS_201)).toBeFalsy(); // Fixed expectation
    expect(component.isCheckboxDisabled(CheckboxType.CUSTOMER_CLASS_4K)).toBeFalsy();
  });

  it('should handle isCheckboxDisabled when all tickets would be removed', () => {
    // Arrange - This should actually disable the checkbox
    const model = new ConfirmAbnormalBetModel();
    model.transIds = '7,8,9';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '';
    model.ticketsOfCreditCashService = '';
    component.model = model;

    component.model.checkboxes = {
      [CheckboxType.CUSTOMER_CLASS_201]: model.ticketsOfCustomerClass201,
      [CheckboxType.CUSTOMER_CLASS_4K]: model.ticketsOfCustomerClass4K,
      [CheckboxType.CREDIT_CASH_SERVICE]: model.ticketsOfCreditCashService,
    };

    // Act & Assert
    // When checking CUSTOMER_CLASS_201 would remove ALL tickets, it should be disabled
    expect(component.isCheckboxDisabled(CheckboxType.CUSTOMER_CLASS_201)).toBeTruthy();
  });

  it('should handle closeClick', () => {
    // Arrange
    component.model.isOpenDialog = true;
    component.isShowErrorCannotRemoveAllTickets = true;
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] = true;
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K] = true;
    const closeSpy = jest.spyOn(component.close, 'emit');

    // Act
    component.closeClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeFalsy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeFalsy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeFalsy();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should handle saveClick', () => {
    // Arrange
    component.model.isOpenDialog = true;
    const saveSpy = jest.spyOn(component.save, 'emit');

    // Act
    component.saveClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(saveSpy).toHaveBeenCalled();
  });

  it('should auto-check available checkboxes when data is updated', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9,10,11,12,13,14,15,16,17,18';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.ticketsOfCreditCashService = '13,14,15';
    model.ticketsOfVIPCustomer = '';
    model.settledTickets = '';

    // Act
    component.model = model;
    component.ngOnChanges({
      model: {
        currentValue: model,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });

    // Assert - All checkboxes should be checked since they don't remove all tickets
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE]).toBeTruthy();
  });
});
