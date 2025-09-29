import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { TVSRequestActionType, CheckboxType } from '../../../../../utility/constants/config';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { CheckUsernamesViewModel, ValidationAbnormalAccount } from '../models/check-username.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { UserNameService } from '../../../../../utility/components/user-names/user-name.service';

class Helper {
  static readonly fakeUsernames = 'user1,user2,user3';
  static readonly fakeProductIds = '1,2';
  static readonly fakeStatusIds = '1,2';
  static readonly fakeFromDate = '2024-03-20 00:00:00';
  static readonly fakeToDate = '2024-03-21 00:00:00';
  static readonly fakeRequestId = 123;
  static readonly fakeActionId = 1;
}

describe('ValidationService', () => {
  let service: ValidationService;
  let addRequestApiService: jest.Mocked<AddRequestApiService>;
  let userNameService: jest.Mocked<UserNameService>;
  let usernamesComponent: jest.Mocked<UsernamesComponent>;
  let productFilterComponent: jest.Mocked<ProductFilterComponent>;
  let eventDateFilterComponent: jest.Mocked<EventDateFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        { provide: AddRequestApiService, useValue: {
          checkValidUsernames: jest.fn()
        } },
        { provide: UserNameService, useValue: {
          getAllValue: jest.fn().mockReturnValue(Helper.fakeUsernames),
          resetAllValue: jest.fn(),
          getDuplicatedItems: jest.fn().mockReturnValue([]),
          updateDuplicatedItems: jest.fn(),
          updateInvalid: jest.fn(),
          updateWarningSiteDBDown: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
    userNameService = TestBed.inject(UserNameService) as jest.Mocked<UserNameService>;
    
    // Mock các component
    usernamesComponent = {
      groupUsername: {
        items: [
          { value: 'user1', isValid: true, cssClass: 'valid', defaultClass: 'valid', isSelected: false, isShowTooltip: false, tooltipText: '' },
          { value: 'user2', isValid: true, cssClass: 'valid', defaultClass: 'valid', isSelected: false, isShowTooltip: false, tooltipText: '' },
          { value: 'user3', isValid: true, cssClass: 'valid', defaultClass: 'valid', isSelected: false, isShowTooltip: false, tooltipText: '' }
        ],
        isSelectedAll: false,
        isExceededTotalUsernames: false,
        isSelected: false,
        cssClass: '',
        defaultClass: ''
      },
      checkValidItems: jest.fn().mockReturnValue(true),
      showErrorTicketLimitExceeded: jest.fn(),
      isAllUsernamesOffSiteDbDown: jest.fn().mockReturnValue(false)
    } as unknown as jest.Mocked<UsernamesComponent>;

    productFilterComponent = {
      isValidComponent: jest.fn().mockReturnValue(true)
    } as unknown as jest.Mocked<ProductFilterComponent>;

    eventDateFilterComponent = {
      isValidEventDate: jest.fn().mockReturnValue(true)
    } as unknown as jest.Mocked<EventDateFilterComponent>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isValidCommonData', () => {
    it('should return true when both components are valid', () => {
      // Arrange
      productFilterComponent.isValidComponent.mockReturnValue(true);
      eventDateFilterComponent.isValidEventDate.mockReturnValue(true);

      // Act
      const result = service.isValidCommonData(productFilterComponent, eventDateFilterComponent);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when product filter is invalid', () => {
      // Arrange
      productFilterComponent.isValidComponent.mockReturnValue(false);
      eventDateFilterComponent.isValidEventDate.mockReturnValue(true);

      // Act
      const result = service.isValidCommonData(productFilterComponent, eventDateFilterComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when event date filter is invalid', () => {
      // Arrange
      productFilterComponent.isValidComponent.mockReturnValue(true);
      eventDateFilterComponent.isValidEventDate.mockReturnValue(false);

      // Act
      const result = service.isValidCommonData(productFilterComponent, eventDateFilterComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when both components are invalid', () => {
      // Arrange
      productFilterComponent.isValidComponent.mockReturnValue(false);
      eventDateFilterComponent.isValidEventDate.mockReturnValue(false);

      // Act
      const result = service.isValidCommonData(productFilterComponent, eventDateFilterComponent);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('checkBusinessRule', () => {
    it('should call checkValidUsernames and set isShowAccountWinLost to true', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkBusinessRule(args);

      // Assert
      expect(args.primitiveProps.isShowAccountWinLost).toBe(true);
      expect(addRequestApiService.checkValidUsernames).toHaveBeenCalled();
    });

    it('should return the result from checkValidUsernames', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkBusinessRule(args);

      // Assert
      expect(result).toBeDefined();
      expect(result.isValid).toBeDefined();
    });
  });

  describe('checkValidUsernames', () => {
    it('should return invalid when isCancelValidate is true', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      args.primitiveProps.isCancelValidate = true;

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(args.primitiveProps.isCancelValidate).toBe(false);
    });

    it('should return invalid when common data is invalid', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      productFilterComponent.isValidComponent.mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
    });

    it('should handle empty usernames', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      userNameService.getAllValue.mockReturnValue('');
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
    });

    it('should handle duplicated usernames', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      userNameService.getDuplicatedItems.mockReturnValue(['user1']);
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(userNameService.updateDuplicatedItems).toHaveBeenCalled();
    });

    it('should handle ticket limit exceeded case', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.isTicketLimitExceeded = true;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(usernamesComponent.showErrorTicketLimitExceeded).toHaveBeenCalled();
    });

    it('should handle invalid usernames', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.invalidUserName = 'invalidUser1,invalidUser2';
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(userNameService.updateInvalid).toHaveBeenCalled();
    });

    it('should handle exceeded total usernames', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.isExceededTotalUsernames = true;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(usernamesComponent.groupUsername.isExceededTotalUsernames).toBe(true);
      expect(result.isValid).toBe(false);
    });

    it('should handle move bet date case', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.isBeingMoveBetDate = true;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(args.primitiveProps.isShowError).toBe(true);
      expect(args.primitiveProps.isBeingMoveBetDate).toBe(true);
    });

    it('should handle invalid total ticket case', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.isInvalidTotalTicket = true;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(args.primitiveProps.isShowError).toBe(true);
      expect(args.primitiveProps.isInvalidTotalTicket).toBe(true);
    });

    it('should handle site DB down case', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.infoSiteDBDownModel = {
        usernames: 'user1,user2'
      } as any;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(args.primitiveProps.infoSiteDBDownModel).toBe(mockResponse.infoSiteDBDownModel);
      expect(userNameService.updateWarningSiteDBDown).toHaveBeenCalled();
    });

    it('should handle all usernames off site DB down', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.infoSiteDBDownModel = {
        usernames: 'user1,user2'
      } as any;
      usernamesComponent.isAllUsernamesOffSiteDbDown.mockReturnValue(true);
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
    });

    it('should return successful validation result', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      const mockResponse = createMockCheckUsernamesViewModel();
      mockResponse.validation.numberOfTickets = 5;
      mockResponse.validation.usernamesOfCreditCashService = 'user1';
      mockResponse.transInfoAddRequestModel = {} as any;
      mockResponse.accountWinlostModels = [{ id: 1 }] as any;
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(true);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.numberOfTicketsExistedInRequest).toBe(5);
      expect(result.usernamesOfCreditCashService).toBe('user1');
      expect(result.transInfoAddRequestModel).toBe(mockResponse.transInfoAddRequestModel);
      expect(result.accountWinlostModels).toBe(mockResponse.accountWinlostModels);
    });

    it('should handle API error gracefully', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      addRequestApiService.checkValidUsernames.mockRejectedValue(new Error('API Error'));
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(false);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
    });

    it('should set isBlockUsernames to false in finally block', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      args.primitiveProps.isBlockUsernames = true;
      addRequestApiService.checkValidUsernames.mockResolvedValue(createMockCheckUsernamesViewModel());
      (usernamesComponent.checkValidItems as jest.Mock).mockReturnValue(true);

      // Act
      await service.checkValidUsernames(args);

      // Assert
      expect(args.primitiveProps.isBlockUsernames).toBe(false);
    });
  });

  describe('getValidation', () => {
    it('should include accountWinlostModels for auto void with policy', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      args.actionId = TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString();
      args.abnormalAccountModel.accountWinlostModels = [{ id: 1 }] as any;
      const mockResponse = createMockCheckUsernamesViewModel();
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      await service.getValidation(args);

      // Assert
      expect(addRequestApiService.checkValidUsernames).toHaveBeenCalledWith(
        expect.objectContaining({
          accountWinlostModels: [{ id: 1 }]
        })
      );
    });

    it('should handle validation from confirm popup', async () => {
      // Arrange
      const args = createMockValidationBusinessRuleArgs();
      args.isValidateFromConfirmPopup = true;
      args.confirmAbnormalAccountComponent = {
        model: {
          checkboxState: {
            [CheckboxType.CREDIT_CASH_SERVICE]: true
          }
        }
      } as any;
      const mockResponse = createMockCheckUsernamesViewModel();
      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);

      // Act
      await service.getValidation(args);

      // Assert
      expect(addRequestApiService.checkValidUsernames).toHaveBeenCalledWith(
        expect.objectContaining({
          isRemoveCreditCashService: true
        })
      );
    });
  });

  describe('isAutoVoidWithPolicy', () => {
    it('should return true for AUTO_VOID_INSTANT_WITH_POLICY_ID action', () => {
      // Act
      const result = service.isAutoVoidWithPolicy(TVSRequestActionType.AUTO_VOID_INSTANT_WITH_POLICY_ID.toString());

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for other actions', () => {
      // Act
      const result = service.isAutoVoidWithPolicy('OTHER_ACTION');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for empty action', () => {
      // Act
      const result = service.isAutoVoidWithPolicy('');

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for null action', () => {
      // Act
      const result = service.isAutoVoidWithPolicy(null as any);

      // Assert
      expect(result).toBe(false);
    });
  });

  // Helper functions
  function createMockValidationBusinessRuleArgs(): ValidationBusinessRuleArgs {
    return {
      usernamesComponent,
      productFilterComponent,
      eventDateFilterComponent,
      abnormalAccountModel: {
        usernames: Helper.fakeUsernames,
        productIds: Helper.fakeProductIds,
        statusIds: Helper.fakeStatusIds,
        fromDate: Helper.fakeFromDate,
        toDate: Helper.fakeToDate,
        subIssueTypeId: 1,
        adjustedTickets: [],
        accountWinlostModels: []
      } as unknown as AbnormalAccountModel,
      requestId: Helper.fakeRequestId,
      actionId: Helper.fakeActionId.toString(),
      issueTypeId: '1',
      accountTableComponent: null,
      isValidateFromConfirmPopup: false,
      confirmAbnormalAccountComponent: null,
      primitiveProps: {
        isShowAccountWinLost: false,
        isShowError: false,
        isCancelValidate: false,
        isBeingMoveBetDate: false,
        isInvalidTotalTicket: false,
        isBlockUsernames: false,
        permission: {
          isVoidAllArchivedTickets: false,
          isAddSettledTickets: false,
          isAddInstantlySettledTickets: false
        } as unknown as PermissionAddRequest,
        transInfoAddRequestModel: null,
        validAccountWinlostModels: [],
        minDate: null,
        numberOfTicketsExistedInRequest: 0,
        isCheckedShowAdjustAccount: false
      } as unknown as PrimitiveProperty
    } as unknown as ValidationBusinessRuleArgs;
  }

  function createMockCheckUsernamesViewModel(): CheckUsernamesViewModel {
    return {
      validation: {
        isTicketLimitExceeded: false,
        invalidUserName: null,
        isExceededTotalUsernames: false,
        isBeingMoveBetDate: false,
        isInvalidTotalTicket: false,
        numberOfTickets: 0,
        isExistedInOtherRequest: false,
        matchIds: '',
        transInfo: null,
        usernamesOfCreditCashService: ''
      } as unknown as ValidationAbnormalAccount,
      accountWinlostModels: [],
      transInfoAddRequestModel: null,
      infoSiteDBDownModel: null
    } as unknown as CheckUsernamesViewModel;
  }
});
