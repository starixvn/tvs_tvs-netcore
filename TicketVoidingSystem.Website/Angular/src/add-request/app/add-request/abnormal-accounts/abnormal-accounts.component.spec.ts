import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AbnormalAccountsComponent } from './abnormal-accounts.component';
import { AddRequestStore } from '../add-request.store';
import { AddRequestApiService } from '../add-request-api.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { AbnormalAccountService } from './services/abnormal-account.service';
import { FilterModel } from '../filter/filter.model';
import { IssueTypes } from '../filter/issue-types.model';
import { OthersModel } from '../others/others.model';
import { AbnormalAccountModel } from '../models/abnormal-account.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { AccountTableComponent } from './account-table/account-table.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString(),
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeAbnormalAccountModel = new AbnormalAccountModel();
  static readonly fakePrimitiveProps = new PrimitiveProperty();
}

describe('AbnormalAccountsComponent', () => {
  let component: AbnormalAccountsComponent;
  let fixture: ComponentFixture<AbnormalAccountsComponent>;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;
  let saveRequestService: SaveRequestService;
  let validationService: ValidationService;
  let abnormalAccountService: AbnormalAccountService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestStore,
        AddRequestApiService,
        SaveRequestService,
        ValidationService,
        AbnormalAccountService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AbnormalAccountsComponent);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    validationService = fixture.debugElement.injector.get(ValidationService);
    abnormalAccountService = fixture.debugElement.injector.get(AbnormalAccountService);
    component = fixture.componentInstance;
    
    // Khởi tạo các giá trị mặc định cho component
    component.filter = Helper.fakeFilterModel;
    component.issueTypes = new IssueTypes();
    component.others = Helper.fakeOthersModel;
    component.abnormalAccountModel = Helper.fakeAbnormalAccountModel;
    component.primitiveProps = Helper.fakePrimitiveProps;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with edit mode and auto void policy', async () => {
    // Arrange
    component.isEdit = true;
    component.requestId = Helper.fakeRequestId;
    validationService.isAutoVoidWithPolicy = jest.fn().mockReturnValue(true);
    addRequestApiService.getAccountWinLost = jest.fn().mockResolvedValue([]);
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({ isVoidAllArchivedTickets: false });
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(addRequestApiService.getAccountWinLost).toHaveBeenCalledWith(Helper.fakeRequestId);
    expect(addRequestApiService.getPermissionAddRequest).toHaveBeenCalled();
  });

  it('should skip validation if isCancelValidate is true', async () => {
    // Arrange
    component.primitiveProps.isCancelValidate = true;
    validationService.checkBusinessRule = jest.fn();

    // Act
    await component.focusOutUsernames();

    // Assert
    expect(validationService.checkBusinessRule).not.toHaveBeenCalled();
    expect(component.primitiveProps.isCancelValidate).toBeFalsy();
  });

  it('should call validation service when isCancelValidate is false', async () => {
    // Arrange
    component.primitiveProps.isCancelValidate = false;
    validationService.checkBusinessRule = jest.fn().mockResolvedValue({});

    // Act
    await component.focusOutUsernames();

    // Assert
    expect(validationService.checkBusinessRule).toHaveBeenCalled();
  });

  it('should not save if account table is invalid', async () => {
    // Arrange
    component.accountTableComponent = {
      isValid: () => false
    } as AccountTableComponent;
    addRequestStore.changeSavingRequestStatus = jest.fn();
    saveRequestService.saveRequest = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    expect(saveRequestService.saveRequest).not.toHaveBeenCalled();
  });

  it('should call saveRequest service when account table is valid', async () => {
    // Arrange
    component.accountTableComponent = {
      isValid: () => true
    } as AccountTableComponent;
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);
    validationService.isAutoVoidWithPolicy = jest.fn().mockReturnValue(true);

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('should not proceed search if account table is invalid', async () => {
    // Arrange
    component.accountTableComponent = {
      isValid: () => false,
      isCancelRecalculateAmount: false
    } as AccountTableComponent;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    validationService.checkBusinessRule = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(validationService.checkBusinessRule).not.toHaveBeenCalled();
  });

  it('should process search event when account table is valid', async () => {
    // Arrange
    component.accountTableComponent = {
      isValid: () => true,
      isCancelRecalculateAmount: false
    } as AccountTableComponent;
    validationService.checkBusinessRule = jest.fn().mockResolvedValue({
      accountWinlostModels: [],
      transInfoAddRequestModel: {}
    });
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.checkBusinessRule).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });

  describe('changeShowAdjustAccount', () => {
    it('should show only editable accounts when isCheckedShowAdjustAccount is true', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        {
          custId: 1,
          username: 'test1',
          givenCredit: 0,
          adjustVoidLimit: 0,
          currentWinning: 0,
          currentLosing: 0,
          isEditedTicket: false,
          isCanEditTicket: false,
          transInfoAccountJson: '',
          isShowOnTable: false,
          estimateVoidAmount: 0,
          estimateVoidAmountUnEditableTickets: 0,
          winLostAfterVoid: 0,
          isHighlight: false,
          adjustVoidLimitString: '0',
          isShowInput: false
        },
        {
          custId: 2,
          username: 'test2',
          givenCredit: 0,
          adjustVoidLimit: 0,
          currentWinning: 0,
          currentLosing: 0,
          isEditedTicket: false,
          isCanEditTicket: true,
          transInfoAccountJson: '',
          isShowOnTable: false,
          estimateVoidAmount: 0,
          estimateVoidAmountUnEditableTickets: 0,
          winLostAfterVoid: 0,
          isHighlight: false,
          adjustVoidLimitString: '0',
          isShowInput: false
        }
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = true;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeFalsy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
    });

    it('should show all accounts when isCheckedShowAdjustAccount is false', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        {
          custId: 1,
          username: 'test1',
          givenCredit: 0,
          adjustVoidLimit: 0,
          currentWinning: 0,
          currentLosing: 0,
          isEditedTicket: false,
          isCanEditTicket: false,
          transInfoAccountJson: '',
          isShowOnTable: true,
          estimateVoidAmount: 0,
          estimateVoidAmountUnEditableTickets: 0,
          winLostAfterVoid: 0,
          isHighlight: false,
          adjustVoidLimitString: '0',
          isShowInput: false
        },
        {
          custId: 2,
          username: 'test2',
          givenCredit: 0,
          adjustVoidLimit: 0,
          currentWinning: 0,
          currentLosing: 0,
          isEditedTicket: false,
          isCanEditTicket: true,
          transInfoAccountJson: '',
          isShowOnTable: true,
          estimateVoidAmount: 0,
          estimateVoidAmountUnEditableTickets: 0,
          winLostAfterVoid: 0,
          isHighlight: false,
          adjustVoidLimitString: '0',
          isShowInput: false
        }
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = false;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeTruthy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
    });
  });

  it('should return true for AUTO_VOID_INSTANT_WITH_POLICY_ID action', () => {
    // Act
    const result = component.isShowUserInfo();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for other actions', () => {
    // Arrange
    component.filter.action = 'OTHER_ACTION';

    // Act
    const result = component.isShowUserInfo();

    // Assert
    expect(result).toBeFalsy();
  });
});
