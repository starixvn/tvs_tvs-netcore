import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { UsernamesComponent } from '../../../../../utility/components/user-names/user-names.component';
import { ProductFilterComponent } from '../product-filter/product-filter.component';
import { EventDateFilterComponent } from '../event-date-filter/event-date-filter.component';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { CheckUsernamesViewModel, ValidationAbnormalAccount } from '../models/check-username.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { AbnormalAccountModel } from '../../models/abnormal-account.model';
import { PrimitiveProperty } from '../models/primitive-property.model';

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
  let usernamesComponent: jest.Mocked<UsernamesComponent>;
  let productFilterComponent: jest.Mocked<ProductFilterComponent>;
  let eventDateFilterComponent: jest.Mocked<EventDateFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        { provide: AddRequestApiService, useValue: {
          checkValidUsernames: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
    
    // Mock các component
    usernamesComponent = {
      groupUsername: {
        getAllValue: jest.fn().mockReturnValue(Helper.fakeUsernames),
        resetAllValue: jest.fn(),
        getDuplicatedItems: jest.fn().mockReturnValue([]),
        updateDuplicatedItems: jest.fn(),
        updateInvalid: jest.fn(),
        isExceededTotalUsernames: false
      },
      checkValidItems: jest.fn().mockReturnValue(true),
      showErrorTicketLimitExceeded: jest.fn()
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
  });

  describe('checkBusinessRule', () => {
    it('should call checkValidUsernames and set isShowAccountWinLost to true', async () => {
      // Arrange
      const args = {
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

      // Act
      await service.checkBusinessRule(args);

      // Assert
      expect(args.primitiveProps.isShowAccountWinLost).toBe(true);
    });
  });

  describe('checkValidUsernames', () => {
    it('should return invalid when isCancelValidate is true', async () => {
      // Arrange
      const args = {
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
        primitiveProps: {
          isShowAccountWinLost: false,
          isShowError: false,
          isCancelValidate: true,
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

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(args.primitiveProps.isCancelValidate).toBe(false);
    });

    it('should handle ticket limit exceeded case', async () => {
      // Arrange
      const args = {
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

      const mockResponse: CheckUsernamesViewModel = {
        validation: {
          isTicketLimitExceeded: true,
          invalidUserName: null,
          isExceededTotalUsernames: false,
          isBeingMoveBetDate: false,
          isInvalidTotalTicket: false,
          numberOfTickets: 0,
          isExistedInOtherRequest: false,
          matchIds: '',
          transInfo: null
        } as unknown as ValidationAbnormalAccount,
        accountWinlostModels: [],
        transInfoAddRequestModel: null
      };

      addRequestApiService.checkValidUsernames.mockResolvedValue(mockResponse);
      productFilterComponent.isValidComponent.mockReturnValue(true);
      eventDateFilterComponent.isValidEventDate.mockReturnValue(true);

      // Act
      const result = await service.checkValidUsernames(args);

      // Assert
      expect(result.isValid).toBe(false);
      expect(usernamesComponent.showErrorTicketLimitExceeded).toHaveBeenCalled();
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
  });
});
