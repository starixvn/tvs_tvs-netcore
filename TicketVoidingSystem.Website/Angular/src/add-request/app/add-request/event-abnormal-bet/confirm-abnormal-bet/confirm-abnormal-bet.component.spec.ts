import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from './confirm-abnormal-bet.model';
import { SimpleChange } from '@angular/core';

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
    expect(component.isRemoveCustomerClass201).toBeTruthy();
    expect(component.isRemoveCustomerClass4K).toBeTruthy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC201).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC4K).toBeFalsy();
    expect(component.isConfirmCalculator).toBeTruthy();
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
    model.transIds = '7,8,9,10,11,12';

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
  });

  it('should handle all tickets of customer class 201', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '';
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
    expect(component.isRemoveCustomerClass201).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC201).toBeTruthy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
  });

  it('should handle all tickets of customer class 4K', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '10,11,12';
    model.ticketsOfCustomerClass201 = '';
    model.ticketsOfCustomerClass4K = '10,11,12';
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
    expect(component.isRemoveCustomerClass4K).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC4K).toBeTruthy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
  });

  it('should handle all tickets of both customer classes', () => {
    // Arrange
    const model = new ConfirmAbnormalBetModel();
    model.isOpenDialog = true;
    model.isHasWarningForAbnormalBet = true;
    model.transIds = '7,8,9,10,11,12';
    model.ticketsOfCustomerClass201 = '7,8,9';
    model.ticketsOfCustomerClass4K = '10,11,12';
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
    expect(component.isRemoveCustomerClass201).toBeFalsy();
    expect(component.isRemoveCustomerClass4K).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC201).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC4K).toBeFalsy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeTruthy();
  });

  it('should handle checkRemoveCC201', () => {
    // Arrange
    component.isShowErrorCannotRemoveAllTickets = true;
    component.isCanNotSelectedRemoveTicketCC4K = true;

    // Act
    component.checkRemoveCC201();

    // Assert
    expect(component.isCanNotSelectedRemoveTicketCC4K).toBeFalsy();
  });

  it('should handle checkRemoveCC4K', () => {
    // Arrange
    component.isShowErrorCannotRemoveAllTickets = true;
    component.isCanNotSelectedRemoveTicketCC201 = true;

    // Act
    component.checkRemoveCC4K();

    // Assert
    expect(component.isCanNotSelectedRemoveTicketCC201).toBeFalsy();
  });

  it('should handle closeClick', () => {
    // Arrange
    component.model.isOpenDialog = true;
    component.isRemoveCustomerClass201 = false;
    component.isRemoveCustomerClass4K = false;
    component.isShowErrorCannotRemoveAllTickets = true;
    component.isCanNotSelectedRemoveTicketCC201 = true;
    component.isCanNotSelectedRemoveTicketCC4K = true;
    const closeSpy = jest.spyOn(component.close, 'emit');

    // Act
    component.closeClick();

    // Assert
    expect(component.model.isOpenDialog).toBeFalsy();
    expect(component.isRemoveCustomerClass201).toBeTruthy();
    expect(component.isRemoveCustomerClass4K).toBeTruthy();
    expect(component.isShowErrorCannotRemoveAllTickets).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC201).toBeFalsy();
    expect(component.isCanNotSelectedRemoveTicketCC4K).toBeFalsy();
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
});
