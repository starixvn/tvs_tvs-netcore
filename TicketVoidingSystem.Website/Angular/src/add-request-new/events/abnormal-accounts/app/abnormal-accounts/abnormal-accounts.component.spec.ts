import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AbnormalAccountsComponent } from './abnormal-accounts.component';
import { AddRequestStore } from '../../../../services/add-request.store';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { FilterModel } from '../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../component/filter/issue-types.model';
import { OthersModel } from '../../../../component/others/others.model';
import { AbnormalAccountModel } from '../../../../models/abnormal-account.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { AccountTableComponent } from './account-table/account-table.component';
import { AccountWinlostModel } from './models/account-winlost.model';
import { AdjustedAccountModel } from './account-affected-ticket/account-affected-ticket.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString(),
    isTest: true,
    isChangeSubTypeManual: true
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeAbnormalAccountModel = new AbnormalAccountModel();
  static readonly fakePrimitiveProps = new PrimitiveProperty();

  static createMockAccountWinlostModel(overrides: Partial<AccountWinlostModel> = {}): AccountWinlostModel {
    return {
      custId: 1,
      username: 'testUser',
      adjustVoidLimitString: '0',
      isShowOnTable: true,
      transInfoAccountJson: '',
      isEditedTicket: false,
      isCanEditTicket: true,
      isHighlight: false,
      isShowInput: true,
      ...overrides
    } as AccountWinlostModel;
  }

  static createMockAdjustedAccountModel(overrides: Partial<AdjustedAccountModel> = {}): AdjustedAccountModel {
    return {
      custId: 1,
      accountWinlostTables: [],
      ticketTableViewModel: {} as any,
      ...overrides
    };
  }
}

describe('AbnormalAccountsComponent', () => {
  let component: AbnormalAccountsComponent;
  let fixture: ComponentFixture<AbnormalAccountsComponent>;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;
  let saveRequestService: SaveRequestService;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AddRequestStore,
        AddRequestApiService,
        SaveRequestService,
        ValidationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AbnormalAccountsComponent);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    validationService = fixture.debugElement.injector.get(ValidationService);
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

  describe('handleSearchEvent', () => {
    beforeEach(() => {
      addRequestStore.changeBlockingUiStatus = jest.fn();
      validationService.checkBusinessRule = jest.fn();
      component.primitiveProps = {} as PrimitiveProperty;
      validationService.checkBusinessRule = jest.fn();
    });

    it('should not proceed search if account table is invalid', async () => {
      // Arrange
      component.accountTableComponent = {
        isValid: () => false,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
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

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });

    it('should set isCancelRecalculateAmount to true when account table exists', async () => {
      // Arrange
      const mockAccountTable = {
        isValid: () => true,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;
      component.accountTableComponent = mockAccountTable;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        accountWinlostModels: [],
        transInfoAddRequestModel: {}
      });

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(mockAccountTable.isCancelRecalculateAmount).toBe(true);
    });

    it('should set isCheckedShowAdjustAccount to false', async () => {
      // Arrange
      component.primitiveProps.isCheckedShowAdjustAccount = true;
      component.accountTableComponent = {
        isValid: () => true,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        accountWinlostModels: [],
        transInfoAddRequestModel: {}
      });

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(component.primitiveProps.isCheckedShowAdjustAccount).toBe(false);
    });

    it('should update validAccountWinlostModels and transInfoAddRequestModel from validation result', async () => {
      // Arrange
      const mockValidationResult = {
        accountWinlostModels: [
          { custId: 1, username: 'test1', isEditedTicket: false },
          { custId: 2, username: 'test2', isEditedTicket: false }
        ],
        transInfoAddRequestModel: { transInfoJson: 'test' }
      };
      component.accountTableComponent = {
        isValid: () => true,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue(mockValidationResult);

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels).toEqual(mockValidationResult.accountWinlostModels);
      expect(component.primitiveProps.transInfoAddRequestModel).toEqual(mockValidationResult.transInfoAddRequestModel);
    });

    it('should handle isShowUserInfo case when action is AUTO_VOID_INSTANT_WITH_POLICY_ID', async () => {
      // Arrange
      component.filter.action = TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
      component.accountAffectedTicketModel.adjustedAccounts = [Helper.createMockAdjustedAccountModel({ custId: 1 })];
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({ custId: 1, isEditedTicket: false }),
        Helper.createMockAccountWinlostModel({ custId: 2, isEditedTicket: false })
      ];
      component.accountTableComponent = {
        isValid: () => true,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        accountWinlostModels: [],
        transInfoAddRequestModel: {}
      });

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(component.accountAffectedTicketModel.adjustedAccounts).toEqual([]);
    });

    it('should not handle isShowUserInfo case when action is not AUTO_VOID_INSTANT_WITH_POLICY_ID', async () => {
      // Arrange
      component.filter.action = 'OTHER_ACTION';
      component.accountAffectedTicketModel.adjustedAccounts = [Helper.createMockAdjustedAccountModel({ custId: 1 })];
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({ custId: 1, isEditedTicket: true }),
        Helper.createMockAccountWinlostModel({ custId: 2, isEditedTicket: true })
      ];
      component.accountTableComponent = {
        isValid: () => true,
        isCancelRecalculateAmount: false
      } as AccountTableComponent;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        accountWinlostModels: [],
        transInfoAddRequestModel: {}
      });

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(component.accountAffectedTicketModel.adjustedAccounts).toEqual([Helper.createMockAdjustedAccountModel({ custId: 1 })]);
    });

    it('should handle case when accountTableComponent is null', async () => {
      // Arrange
      component.accountTableComponent = null;
      validationService.checkBusinessRule = jest.fn().mockResolvedValue({
        accountWinlostModels: [],
        transInfoAddRequestModel: {}
      });

      // Act
      await component.handleSearchEvent();

      // Assert
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
      expect(validationService.checkBusinessRule).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    });
  });

  describe('changeShowAdjustAccount', () => {
    it('should show only editable accounts when isCheckedShowAdjustAccount is true', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({
          custId: 1,
          username: 'test1',
          isCanEditTicket: false,
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 2,
          username: 'test2',
          isCanEditTicket: true,
          transInfoAccountJson: '',
          estimateVoidAmount: 0,
          adjustVoidLimitString: '0'
        })
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
        Helper.createMockAccountWinlostModel({
          custId: 1,
          username: 'test1',
          isCanEditTicket: false,
          transInfoAccountJson: '',
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 2,
          username: 'test2',
          isCanEditTicket: true,
          transInfoAccountJson: '',
          adjustVoidLimitString: '0'
        })
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = false;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeTruthy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
    });

    it('should handle empty validAccountWinlostModels array', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [];
      component.primitiveProps.isCheckedShowAdjustAccount = true;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels).toEqual([]);
    });

    it('should handle null validAccountWinlostModels', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = null;
      component.primitiveProps.isCheckedShowAdjustAccount = true;

      // Act & Assert - should not throw error
      expect(() => component.changeShowAdjustAccount()).not.toThrow();
    });

    it('should handle mixed account types with isCheckedShowAdjustAccount true', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({
          custId: 1,
          username: 'test1',
          isCanEditTicket: false,
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 2,
          username: 'test2',
          isCanEditTicket: true,
          transInfoAccountJson: '',
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 3,
          username: 'test3',
          isCanEditTicket: false,
          adjustVoidLimitString: '0'
        })
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = true;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeFalsy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
      expect(component.primitiveProps.validAccountWinlostModels[2].isShowOnTable).toBeFalsy();
    });

    it('should handle mixed account types with isCheckedShowAdjustAccount false', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({
          custId: 1,
          username: 'test1',
          isCanEditTicket: false,
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 2,
          username: 'test2',
          isCanEditTicket: true,
          transInfoAccountJson: '',
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 3,
          username: 'test3',
          isCanEditTicket: false,
          adjustVoidLimitString: '0'
        })
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = false;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeTruthy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
      expect(component.primitiveProps.validAccountWinlostModels[2].isShowOnTable).toBeTruthy();
    });

    it('should handle accounts with undefined isCanEditTicket property', () => {
      // Arrange
      component.primitiveProps.validAccountWinlostModels = [
        Helper.createMockAccountWinlostModel({
          custId: 1,
          username: 'test1',
          isCanEditTicket: undefined,
          adjustVoidLimitString: '0'
        }),
        Helper.createMockAccountWinlostModel({
          custId: 2,
          username: 'test2',
          isCanEditTicket: true,
          transInfoAccountJson: '',
          adjustVoidLimitString: '0'
        })
      ];
      component.primitiveProps.isCheckedShowAdjustAccount = true;

      // Act
      component.changeShowAdjustAccount();

      // Assert
      expect(component.primitiveProps.validAccountWinlostModels[0].isShowOnTable).toBeFalsy();
      expect(component.primitiveProps.validAccountWinlostModels[1].isShowOnTable).toBeTruthy();
    });
  });

  it('should return true for AUTO_VOID_INSTANT_WITH_POLICY_ID action', () => {
    // Arrange
    component.filter.action = TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();

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
