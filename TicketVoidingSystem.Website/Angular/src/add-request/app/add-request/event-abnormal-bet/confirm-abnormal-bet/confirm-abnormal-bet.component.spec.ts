import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';
import { CheckboxType } from '../../../../../utility/constants/config';

class ConfirmAbnormalBetTestHelper {
  static createBaseModel(): ConfirmAbnormalBetModel {
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.isHasWarningEditTakeNoteRequest = false;
    model.isHasWarningRemovedTickets = false;
    model.isEditingByAnotherUser = false;
    model.transIds = '';
    model.requestId = 0;
    model.requestedBy = '';
    model.ticketsOfVIPCustomer = '';
    model.settledTickets = '';
    model.ticketsOfCustomerClass201 = '';
    model.ticketsOfCustomerClass4K = '';
    model.isHasAffectedTicketSiteDBDown = false;
    model.ticketsOfCreditCashService = '';
    model.ticketsOfSiteDBDown = '';
    model.issueTypeName = '';
    model.subIssueTypeName = '';
    model.actionName = '';
    return model;
  }

  static createModelWithWarningData(): ConfirmAbnormalBetModel {
    const model = this.createBaseModel();
    model.ticketsOfVIPCustomer = '1,2,3';
    model.settledTickets = '4,5,6';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    model.transIds = '7,8,9,10,11,12';
    return model;
  }

  static createModelWithAllCC201Tickets(): ConfirmAbnormalBetModel {
    const model = this.createBaseModel();
    model.transIds = '7,8,9';
    model.ticketsOfCustomerClass201 = '7,8,9';
    return model;
  }

  static createModelWithAllCC4KTickets(): ConfirmAbnormalBetModel {
    const model = this.createBaseModel();
    model.transIds = '10,11,12';
    model.ticketsOfCustomerClass4K = '10,11,12';
    return model;
  }

  static createModelWithAllTicketsBothClasses(): ConfirmAbnormalBetModel {
    const model = this.createBaseModel();
    model.transIds = '7,8,9,10,11,12';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
    return model;
  }

  static createSimpleChange(currentValue: any): SimpleChange {
    return {
      currentValue: currentValue,
      previousValue: null,
      firstChange: true,
      isFirstChange: () => true
    } as SimpleChange;
  }
}

describe('ConfirmAbnormalBetComponent', () => {
  let component: ConfirmAbnormalBetComponent;
  let fixture: ComponentFixture<ConfirmAbnormalBetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();

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
    const model = ConfirmAbnormalBetTestHelper.createModelWithWarningData();
    model.ticketsOfCreditCashService = '13,14,15';
    model.transIds = '7,8,9,10,11,12,13,14,15';
    component.model = model;

    // Act
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: ConfirmAbnormalBetTestHelper.createSimpleChange(true)
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
    const model = ConfirmAbnormalBetTestHelper.createModelWithAllCC201Tickets();
    model.ticketsOfCreditCashService = '';
    component.model = model;

    // Act
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: ConfirmAbnormalBetTestHelper.createSimpleChange(true)
    });

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
  });

  it('should handle all tickets of customer class 4K', () => {
    // Arrange
    const model = ConfirmAbnormalBetTestHelper.createModelWithAllCC4KTickets();
    model.ticketsOfCreditCashService = '';
    component.model = model;

    // Act
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: ConfirmAbnormalBetTestHelper.createSimpleChange(true)
    });

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeTruthy();
  });

  it('should handle all tickets of both customer classes', () => {
    // Arrange
    const model = ConfirmAbnormalBetTestHelper.createModelWithAllTicketsBothClasses();
    model.ticketsOfCreditCashService = '';
    component.model = model;

    // Act
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: ConfirmAbnormalBetTestHelper.createSimpleChange(true)
    });

    // Assert
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeTruthy();
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
    component.isOpen = false;
    component.save.emit = jest.fn();

    // Act
    component.saveClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
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
    component.model = model;

    // Act
    component.isOpen = true;
    component.ngOnChanges({
      isOpen: ConfirmAbnormalBetTestHelper.createSimpleChange(true)
    });

    // Assert - All checkboxes should be checked since they don't remove all tickets
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K]).toBeTruthy();
    expect(component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE]).toBeTruthy();
  });

  it('should check if at least one checkbox is checked', () => {
    // Arrange
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] = true;
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K] = false;
    component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] = false;

    // Act & Assert
    expect(component.isExistAtleastOneCheckboxChecked()).toBeTruthy();

    // Arrange - no checkboxes checked
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] = false;
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_4K] = false;
    component.model.checkboxState[CheckboxType.CREDIT_CASH_SERVICE] = false;

    // Act & Assert
    expect(component.isExistAtleastOneCheckboxChecked()).toBeFalsy();
  });

  it('should check if OK button is disabled when all tickets can be removed', () => {
    // Arrange - all tickets can be removed
    component.model.transIds = '7,8,9';
    component.model.checkboxes[CheckboxType.CUSTOMER_CLASS_201] = '7,8,9';
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] = true;

    // Act & Assert
    expect(component.isOkButtonDisabled()).toBeTruthy();

    // Arrange - not all tickets can be removed
    component.model.transIds = '7,8,9,10';
    component.model.checkboxes[CheckboxType.CUSTOMER_CLASS_201] = '7,8,9';
    component.model.checkboxState[CheckboxType.CUSTOMER_CLASS_201] = true;

    // Act & Assert
    expect(component.isOkButtonDisabled()).toBeFalsy();
  });
});
