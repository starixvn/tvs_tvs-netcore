import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { CheckboxType, TVSRequestActionType } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { ValidationAbnormalBet } from '../event-abnormal-bet.model';
import { ValidationBusinessRuleArgs } from './validation.model';

describe('ValidationService', () => {
  let service: ValidationService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initCheckAbnormalBetTransIdsQuery', () => {
    it('should initialize query with correct values', () => {
      // Arrange
      const mockBetIdsComponent = {
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockConfirmAbnormalBetComponent = {
        model: {
          checkboxState: {
            [CheckboxType.CUSTOMER_CLASS_201]: true,
            [CheckboxType.CUSTOMER_CLASS_4K]: false,
            [CheckboxType.CREDIT_CASH_SERVICE]: false
          }
        }
      };

      const mockPermission = {
        isAddSettledTickets: true,
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      const args: ValidationBusinessRuleArgs = {
        betIdsComponent: mockBetIdsComponent,
        requestId: 'req123',
        actionId: 'action1',
        abnormalBetModel: {
          filterBy: 'filter1',
          subIssueTypeId: '1'
        },
        issueTypeId: '1',
        isValidateFromConfirmPopup: true,
        confirmAbnormalBetComponent: mockConfirmAbnormalBetComponent,
        permission: mockPermission,
        primitiveProps: {}
      } as unknown as ValidationBusinessRuleArgs;

      // Act
      const result = service.initCheckAbnormalBetTransIdsQuery(args);

      // Assert
      expect(result).toEqual({
        transIds: ['123', '456'],
        requestId: 'req123',
        actionId: 'action1',
        filterBy: 'filter1',
        issueTypeId: 1,
        subIssueTypeId: 1,
        isRemoveCustomerClass201: true,
        isRemoveCustomerClass4K: false,
        isRemoveCreditCashService: false,
        isAddSettledTickets: true,
        isVoidAllArchivedTickets: false
      });
    });
  });

  describe('exportExcelAbnormalBetTickets', () => {
    it('should call API service with correct query', async () => {
      // Arrange
      const mockBetIdsComponent = {
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const args: ValidationBusinessRuleArgs = {
        betIdsComponent: mockBetIdsComponent,
        requestId: 'req123',
        actionId: 'action1',
        abnormalBetModel: {
          filterBy: 'filter1',
          subIssueTypeId: '1'
        },
        issueTypeId: '1',
        isValidateFromConfirmPopup: false,
        confirmAbnormalBetComponent: {
          model: {
            checkboxState: {
              [CheckboxType.CUSTOMER_CLASS_201]: false,
              [CheckboxType.CUSTOMER_CLASS_4K]: false,
              [CheckboxType.CREDIT_CASH_SERVICE]: false
            }
          }
        },
        permission: {
          isAddSettledTickets: true,
          isVoidAllArchivedTickets: false
        } as PermissionAddRequest,
        primitiveProps: {}
      } as unknown as ValidationBusinessRuleArgs;

      addRequestApiService['exportExcelAbnormalBetTickets'] = jest.fn().mockResolvedValue(Promise.resolve());

      // Act
      await service.exportExcelAbnormalBetTickets(args);

      // Assert
      expect(addRequestApiService.exportExcelAbnormalBetTickets).toHaveBeenCalled();
    });
  });

  describe('checkValidBusinessRule', () => {
    it('should return invalid when no bet IDs', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => false,
        getAllBetIdsAreNotNumber: () => ['abc']
      } as unknown as BetIdsComponent;

      const args: ValidationBusinessRuleArgs = {
        betIdsComponent: mockBetIdsComponent,
        primitiveProps: {}
      } as ValidationBusinessRuleArgs;

      // Act
      const result = await service.checkValidBusinessRule(args);

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(args.primitiveProps.isShowButtonRemoveInvalid).toBeTruthy();
      expect(args.primitiveProps.invalidTransIds).toEqual(['abc']);
    });

    it('should return invalid when API returns null', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: () => {},
          checkDuplicatedItems: () => {},
          updateInvalidItems: jest.fn(),
          updateMoved: jest.fn(),
          updateDifferent: jest.fn(),
          updateWarningSiteDBDown: jest.fn()
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456'],
        getAllBetIdsAreNotNumber: () => []
      } as unknown as BetIdsComponent;

      const args: ValidationBusinessRuleArgs = {
        betIdsComponent: mockBetIdsComponent,
        primitiveProps: {},
        requestId: 'req123',
        actionId: 'action1',
        abnormalBetModel: {
          filterBy: 'filter1',
          subIssueTypeId: '1',
          sendLetstalkModels: []
        },
        issueTypeId: '1',
        isValidateFromConfirmPopup: false,
        confirmAbnormalBetComponent: {
          model: {
            checkboxState: {
              [CheckboxType.CUSTOMER_CLASS_201]: false,
              [CheckboxType.CUSTOMER_CLASS_4K]: false,
              [CheckboxType.CREDIT_CASH_SERVICE]: false
            }
          }
        },
        permission: {
          isAddSettledTickets: true,
          isVoidAllArchivedTickets: false
        } as PermissionAddRequest
      } as unknown as ValidationBusinessRuleArgs;

      const mockResponse = {
        sendLetstalkModels: [],
        matches: [],
        validation: {
          invalidTransIds: [],
          movedTransIds: [],
          differentMatchTransIds: [],
          settledTransIds: [],
          unsupportedTransIds: [],
          existingReqTransIds: [],
          nonLiveTransIds: [],
          differentLiveScoreTransIds: [],
          abWhiteListTransIds: [],
          isHasUusTickets: false
        }
      };

      addRequestApiService['checkValidTransIdsForAbnormalBet'] = jest.fn().mockResolvedValue(mockResponse);

      // Act
      const result = await service.checkValidBusinessRule(args);

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(addRequestApiService['checkValidTransIdsForAbnormalBet']).toHaveBeenCalled();
    });
  });

  describe('isValidationHasWarningTicket', () => {
    it('should return true when has settled tickets and permission', () => {
      // Arrange
      const permission = { isAddSettledTickets: true } as PermissionAddRequest;
      const validationResult = {
        settledTransIds: ['123']
      } as unknown as ValidationAbnormalBet;

      // Act
      const result = service.isValidationHasWarningTicket(permission, validationResult);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when has VIP customer tickets', () => {
      // Arrange
      const permission = { isAddSettledTickets: false } as PermissionAddRequest;
      const validationResult = {
        transIdsOfVIPCustomer: ['123']
      } as unknown as ValidationAbnormalBet;

      // Act
      const result = service.isValidationHasWarningTicket(permission, validationResult);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isHasWarningEditTakeNoteRequest', () => {
    it('should return true for edit take note request', () => {
      // Arrange
      const isEdit = true;
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const actionIdOfFirstTime = 'different_id';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for non-edit request', () => {
      // Arrange
      const isEdit = false;
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const actionIdOfFirstTime = 'different_id';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isEditingByAnotherUser', () => {
    it('should return true when editing by different user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when editing by same user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 1;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
