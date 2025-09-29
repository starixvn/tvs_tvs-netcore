import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { BetIdsComponent } from '../../../../../../utility/components/bet-ids/bet-ids.component';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../../../utility/constants/config';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { CheckDuplicateTicketsViewModel, ValidationDuplicateTickets } from '../models/check-duplicate-tickets.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { PermissionAddRequest } from '../../../../../models/permission-add-request.model';

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

  describe('isFilterMixParlay', () => {
    it('should return true when filterBy is MIX_PARLAY', () => {
      expect(service.isFilterMixParlay(AbnormalFilterBy.MIX_PARLAY)).toBeTruthy();
    });

    it('should return false when filterBy is not MIX_PARLAY', () => {
      expect(service.isFilterMixParlay(AbnormalFilterBy.SINGLE)).toBeFalsy();
    });
  });

  describe('checkCanShowConfirmation', () => {
    it('should return false when filter is voided', () => {
      const arg: SaveRequestArg = {
        filter: { isVoided: true } as any
      } as SaveRequestArg;

      expect(service.checkCanShowConfirmation(arg)).toBeFalsy();
    });

    it('should return true for edit take note request', () => {
      const arg: SaveRequestArg = {
        filter: { 
          isVoided: false,
          action: TVSRequestActionType.TAKE_NOTE_ID.toString()
        } as any,
        isEdit: true,
        actionIdOfFirstTimeAccess: 'different_id'
      } as SaveRequestArg;

      expect(service.checkCanShowConfirmation(arg)).toBeTruthy();
    });
  });

  describe('validateCommonData', () => {
    it('should return true when has bet IDs', () => {
      const mockBetIdsComponent = {
        isHasBetId: () => true
      } as unknown as BetIdsComponent;

      const primitiveProps = {} as PrimitiveProperty;

      expect(service.validateCommonData(mockBetIdsComponent, primitiveProps)).toBeTruthy();
    });

    it('should return false and update primitiveProps when no bet IDs', () => {
      const mockBetIdsComponent = {
        isHasBetId: () => false,
        getAllBetIdsAreNotNumber: () => ['invalid1', 'invalid2']
      } as unknown as BetIdsComponent;

      const primitiveProps = {} as PrimitiveProperty;

      expect(service.validateCommonData(mockBetIdsComponent, primitiveProps)).toBeFalsy();
      expect(primitiveProps.isShowButtonRemoveInvalid).toBeTruthy();
      expect(primitiveProps.invalidTransIds).toEqual(['invalid1', 'invalid2']);
    });
  });

  describe('checkValidBusinessRule', () => {
    it('should return false when validateCommonData fails', async () => {
      const mockBetIdsComponent = {
        isHasBetId: () => false,
        getAllBetIdsAreNotNumber: () => ['invalid1']
      } as unknown as BetIdsComponent;

      const args: SaveRequestArg = {
        betIdsComponent: mockBetIdsComponent,
        primitiveProps: {} as PrimitiveProperty
      } as SaveRequestArg;

      expect(await service.checkValidBusinessRule(args)).toBeFalsy();
    });

    it('should return true when all validations pass', async () => {
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          items: [],
          resetAllItemsToValid: () => {},
          checkDuplicatedItems: () => {},
          updateMoved: () => {},
          updateDifferent: () => {},
          updateInvalidItems: () => {}
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456'],
        getAllBetIdsAreNotNumber: () => [],
        getInvalidItems: () => []
      } as unknown as BetIdsComponent;

      const mockValidationViewModel: CheckDuplicateTicketsViewModel = {
        validation: {
          movedTransIds: '',
          differentMatchTransIds: '',
          invalidTransIds: '',
          unsupportedTransIds: '',
          existingReqTransIds: '',
          settledTransIds: ''
        } as ValidationDuplicateTickets,
        match: {
          matchId: '123',
          name: 'Test Match',
          leagueName: 'Test League'
        },
        transInfoAddRequestModel: {
          transInfoJson: '',
          unMarkTransIds: '',
          markTransIds: '',
          removeTransIds: ''
        }
      } as unknown as CheckDuplicateTicketsViewModel;

      jest.spyOn(addRequestApiService, 'checkDuplicateTickets').mockResolvedValue(mockValidationViewModel);

      const args: SaveRequestArg = {
        betIdsComponent: mockBetIdsComponent,
        primitiveProps: {} as PrimitiveProperty,
        duplicateTicketsModel: {
          filterBy: AbnormalFilterBy.SINGLE
        } as any,
        filter: {
          action: 'action1',
          subIssueTypeId: 1
        } as any,
        permission: {
          isAddSettledTickets: true
        } as PermissionAddRequest
      } as SaveRequestArg;

      expect(await service.checkValidBusinessRule(args)).toBeTruthy();
    });
  });

  describe('isHasWarningEditTakeNoteRequest', () => {
    it('should return true for edit take note request', () => {
      expect(service.isHasWarningEditTakeNoteRequest(
        true,
        TVSRequestActionType.TAKE_NOTE_ID.toString(),
        'different_id'
      )).toBeTruthy();
    });

    it('should return false for non-edit request', () => {
      expect(service.isHasWarningEditTakeNoteRequest(
        false,
        TVSRequestActionType.TAKE_NOTE_ID.toString(),
        'different_id'
      )).toBeFalsy();
    });

    it('should return false when current action is not take note', () => {
      expect(service.isHasWarningEditTakeNoteRequest(
        true,
        'other_action',
        'different_id'
      )).toBeFalsy();
    });

    it('should return false when current action equals first time action', () => {
      expect(service.isHasWarningEditTakeNoteRequest(
        true,
        TVSRequestActionType.TAKE_NOTE_ID.toString(),
        TVSRequestActionType.TAKE_NOTE_ID.toString()
      )).toBeFalsy();
    });
  });
});
