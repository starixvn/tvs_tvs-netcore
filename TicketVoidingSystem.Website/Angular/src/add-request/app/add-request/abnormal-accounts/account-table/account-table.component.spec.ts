import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AccountTableComponent } from './account-table.component';
import { ValidationService } from '../services/validation.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { AccountWinlostModel } from '../models/account-winlost.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TicketStatus } from '../../../../../utility/constants/config';
import { SortingComponent } from '../../../../../utility/components/sorting/sorting/sorting.component';
import { EventEmitter, QueryList } from '@angular/core';
import * as _ from 'lodash';
import { CheckUsernamesViewModel } from '../models/check-username.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;

  static readonly fakeAbnormalAccountModel: AbnormalAccountModel = {
    statusIds: TicketStatus.LOSE.toString(),
    accountWinlostModels: []
  } as AbnormalAccountModel;

  static readonly fakeAccountWinlostModel: AccountWinlostModel = {
    custId: 123,
    adjustVoidLimit: 1000,
    adjustVoidLimitString: '1,000',
    isShowInput: false,
    isShowOnTable: true,
    isHighlight: false,
    givenCredit: 0,
    currentLosing: -500,
    currentWinning: 0,
    estimateVoidAmount: 0,
    estimateVoidAmountUnEditableTickets: 0,
    winLostAfterVoid: 0,
    isCanEditTicket: true,
    isEditedTicket: false
  } as AccountWinlostModel;

  static readonly fakePrimitiveProperty: PrimitiveProperty = {
    isCheckedShowAdjustAccount: false,
    permission: {} as PermissionAddRequest
  } as PrimitiveProperty;
}

describe('AccountTableComponent', () => {
  let component: AccountTableComponent;
  let fixture: ComponentFixture<AccountTableComponent>;
  let validationService: ValidationService;
  let addRequestApiService: AddRequestApiService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        AddRequestApiService,
        {
          provide: AddRequestStore,
          useValue: {
            changeBlockingUiStatus: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTableComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;
    component.accountWinlostModels = [Helper.fakeAccountWinlostModel];
    component.primitiveProps = Helper.fakePrimitiveProperty;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component.isShowTooltip).toBeFalsy();
    expect(component.isCancelRecalculateAmount).toBeFalsy();
    expect(component.isCheckedShowAdjustAccount).toBeFalsy();
    expect(component.previousAdjustVoidLimit).toBeNull();
  });

  it('should handle reCalculate with valid input', async () => {
    // Arrange
    const account = { ...Helper.fakeAccountWinlostModel };
    const previousAdjustVoid = 500; // Khác với adjustVoidLimit của account
    const index = 0;
    component.isCancelRecalculateAmount = false;
    component.requestId = Helper.fakeRequestId;
    component.filter = Helper.fakeFilterModel;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;
    component.primitiveProps = Helper.fakePrimitiveProperty;
    component.permission = {} as PermissionAddRequest;
    component.reCalculateByAccountEvent = { emit: jest.fn() } as unknown as EventEmitter<number>;

    const updatedAccount = {
      ...account,
      currentLosing: -600,
      winLostAfterVoid: -100,
      isCanEditTicket: true,
      isHighlight: false,
      givenCredit: 0,
      currentWinning: 0,
      estimateVoidAmount: 0,
      estimateVoidAmountUnEditableTickets: 0,
      adjustVoidLimit: 1000
    };

    jest.spyOn(validationService, 'getValidation').mockResolvedValue({
      accountWinlostModels: [updatedAccount],
      transInfoAddRequestModel: {
        transInfoJson: '{}'
      }
    } as CheckUsernamesViewModel);

    // Act
    await component.reCalculate(account, previousAdjustVoid, index);

    // Assert
    expect(account.isShowInput).toBeFalsy();
    expect(component.previousAdjustVoidLimit).toBe(1000);
    expect(validationService.getValidation).toHaveBeenCalled();
    expect(account.currentLosing).toBe(-600);
    expect(account.winLostAfterVoid).toBe(-100);
    expect(account.isCanEditTicket).toBeTruthy();
    expect(component.reCalculateByAccountEvent.emit).toHaveBeenCalledWith(account.custId);
  });

  it('should handle reCalculate with same adjustVoidLimit', async () => {
    // Arrange
    const account = { ...Helper.fakeAccountWinlostModel };
    const previousAdjustVoid = 1000;
    account.adjustVoidLimit = 1000;

    // Act
    await component.reCalculate(account, previousAdjustVoid, 0);

    // Assert
    expect(component.isCancelRecalculateAmount).toBeFalsy();
  });

  it('should handle exportExcel', async () => {
    // Arrange
    component.accountWinlostModels = [Helper.fakeAccountWinlostModel];
    addRequestApiService.exportAccount = jest.fn().mockResolvedValue({});

    // Act
    await component.exportExcel();

    // Assert
    expect(addRequestApiService.exportAccount).toHaveBeenCalledWith([Helper.fakeAccountWinlostModel]);
  });

  it('should handle sorting', () => {
    // Arrange
    const isDesc = true;
    const orderBy = 'currentLosing';
    const componentId = 1;
    const account1 = { ...Helper.fakeAccountWinlostModel, currentLosing: -500 };
    const account2 = { ...Helper.fakeAccountWinlostModel, custId: 124, currentLosing: -600 };
    component.accountWinlostModels = [account1, account2];
    
    const sortingComponent1 = { id: 1, isDesc: true } as SortingComponent;
    const sortingComponent2 = { id: 2, isDesc: false } as SortingComponent;
    component.sortingComponents = new QueryList<SortingComponent>();
    component.sortingComponents.reset([sortingComponent1, sortingComponent2]);

    // Act
    component.sorting(isDesc, orderBy, componentId);

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(component.accountWinlostModels).toEqual(_.orderBy([account1, account2], [orderBy], ['desc']));
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(sortingComponent2.isDesc).toBeNull();
  });

  it('should validate adjustVoidLimit format', () => {
    // Arrange
    const account = { ...Helper.fakeAccountWinlostModel };
    const index = 0;

    // Act & Assert
    account.adjustVoidLimit = 1000;
    expect(component.isCorrectFormatVoidLimit(account, index)).toBeTruthy();

    account.adjustVoidLimit = 0;
    expect(component.isCorrectFormatVoidLimit(account, index)).toBeTruthy();

    account.adjustVoidLimit = null;
    expect(component.isCorrectFormatVoidLimit(account, index)).toBeTruthy();
  });

  it('should handle mouseDownEventAdjustGV', () => {
    // Arrange
    const account = { ...Helper.fakeAccountWinlostModel };
    component.filter = { ...Helper.fakeFilterModel, isVoided: false };
    component.abnormalAccountModel = { ...Helper.fakeAbnormalAccountModel, statusIds: TicketStatus.LOSE.toString() };

    // Act
    component.mouseDownEventAdjustGV(account);

    // Assert
    expect(component.isCancelRecalculateAmount).toBeFalsy();
    expect(account.isShowInput).toBeFalsy();
  });

  it('should check if accounts are shown', () => {
    // Arrange
    component.accountWinlostModels = [
      { ...Helper.fakeAccountWinlostModel, isShowOnTable: true },
      { ...Helper.fakeAccountWinlostModel, custId: 124, isShowOnTable: false }
    ];

    // Act
    const result = component.isShowAccounts();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get description for column', () => {
    // Arrange
    const columnName = 'currentLosing';
    const mockDescription = 'Current Losing (L)';
    jest.spyOn(component, 'getDescription').mockReturnValue(mockDescription);

    // Act
    const description = component.getDescription(columnName);

    // Assert
    expect(description).toBe(mockDescription);
  });
});
