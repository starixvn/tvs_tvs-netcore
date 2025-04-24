import * as _ from 'lodash';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { RecoverTicketModel } from '../../models/recover-ticket.model';
import { CheckRecoverTicketResult } from '../models/check-recover-ticket-result.model';
import { ValidationService } from './validation.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LABELS } from '../../../../../utility/constants/labels';

class Helper {
  static readonly fakeCheckRecoverTicketResult: CheckRecoverTicketResult = {
    invalidTransIds: '12345',
    unsupportedDateRangeTransIds: '34567',
    transInfoJson: '',
    existingReqTransIds: '',
    unMarkTransIds: ''
  };
}

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

  describe('checkBusinessRule', () => {
    it('should return invalid when no bet IDs', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => false
      } as unknown as BetIdsComponent;

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: '',
        productIds: []
      } as unknown as RecoverTicketModel;

      const mockFilter = {} as FilterModel;
      const mockPermission = {} as PermissionAddRequest;

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        mockFilter,
        123,
        mockPermission
      );

      // Assert
      expect(result.isValid).toBeFalsy();
    });

    it('should return invalid when API returns null', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: jest.fn(),
          checkDuplicatedItems: jest.fn()
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: 'filter1',
        productIds: ['1', '2']
      } as unknown as RecoverTicketModel;

      const mockFilter = {
        subIssueTypeId: '1'
      } as FilterModel;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(null);

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        mockFilter,
        123,
        mockPermission
      );

      // Assert
      expect(result.isValid).toBeFalsy();
      expect(mockBetIdsComponent.groupNumber.resetAllItemsToValid).toHaveBeenCalled();
      expect(mockBetIdsComponent.groupNumber.checkDuplicatedItems).toHaveBeenCalled();
    });

    it('should highlight invalid trans IDs and return valid result', async () => {
      // Arrange
      const mockBetIdsComponent = {
        isHasBetId: () => true,
        groupNumber: {
          resetAllItemsToValid: jest.fn(),
          checkDuplicatedItems: jest.fn(),
          updateInvalidItems: jest.fn(),
          updateMoved: jest.fn()
        },
        isAllBetIdsValid: () => true,
        getAllBetIds: () => ['123', '456']
      } as unknown as BetIdsComponent;

      const mockRecoverTicketModel = {
        transIds: [],
        subIssueTypeId: 1,
        filterBy: 'filter1',
        productIds: ['1', '2']
      } as unknown as RecoverTicketModel;

      const mockFilter = {
        subIssueTypeId: '1'
      } as FilterModel;

      const mockPermission = {
        isVoidAllArchivedTickets: false
      } as PermissionAddRequest;

      const mockValidationResult = {
        existingReqTransIds: '123',
        invalidTransIds: '456',
        unsupportedDateRangeTransIds: '789',
        transInfoJson: '{"info": "test"}',
        unMarkTransIds: '111'
      } as CheckRecoverTicketResult;

      jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(mockValidationResult);

      // Act
      const result = await service.checkBusinessRule(
        mockBetIdsComponent,
        mockRecoverTicketModel,
        mockFilter,
        123,
        mockPermission
      );

      // Assert
      expect(result.isValid).toBeTruthy();
      expect(result.transInfoJson).toBe('{"info": "test"}');
      expect(result.unMarkTransIds).toBe('111');
      expect(mockBetIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledWith('123', LABELS.INVALID_EXISTING_ON_OTHER_REQUEST);
      expect(mockBetIdsComponent.groupNumber.updateInvalidItems).toHaveBeenCalledWith('456', LABELS.INVALID_TICKETS);
      expect(mockBetIdsComponent.groupNumber.updateMoved).toHaveBeenCalledWith('789');
    });
  });

  it('#checkBusinessRule should return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => false);
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    service['highlightInvalidTransIds'] = jest.fn();
    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #checkTickets14 return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    const addRequestApiService = {} as AddRequestApiService;
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => null);
    service['highlightInvalidTransIds'] = jest.fn();

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #updateInvalidItems return validation model with invalid', async () => {
    const results = _.cloneDeep(Helper.fakeCheckRecoverTicketResult);
    results.invalidTransIds = '123445';
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockIsAllBetIdsValid = jest.fn().mockImplementation(() => false);
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    const addRequestApiService = {} as AddRequestApiService;
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => results);
    service['highlightInvalidTransIds'] = jest.fn();

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should return validation model with valid', async () => {
    const results = _.cloneDeep(Helper.fakeCheckRecoverTicketResult);
    results.invalidTransIds = null;
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn().mockImplementation(() => ['123', '456']);
    const mockIsAllBetIdsValid = jest.fn().mockImplementation(() => true);
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    betIdsComponent.groupNumber.updateMoved = jest.fn();

    jest.spyOn(addRequestApiService, 'checkRecoverTicket').mockResolvedValue(results);

    const result = await service.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(true);
  });

  it('#highlightInvalidTransIds should call #updateInvalidItems', async () => {
    const model = new CheckRecoverTicketResult();
    model.existingReqTransIds = '12344';
    model.invalidTransIds = '12345';
    model.unsupportedDateRangeTransIds = '23456';
    const mockUpdateInvalidItems = jest.fn();
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = mockUpdateInvalidItems;
    service['highlightInvalidTransIds'](model, betIdsComponent);

    expect(mockUpdateInvalidItems).toHaveBeenCalledTimes(2);
  });

  it('#highlightInvalidTransIds should not call #updateInvalidItems', async () => {
    const model = new CheckRecoverTicketResult();
    const mockUpdateInvalidItems = jest.fn();
    const betIdsComponent = {} as BetIdsComponent;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = mockUpdateInvalidItems;

    ['', null].forEach(x => {
      model.invalidTransIds = x;
      model.unsupportedDateRangeTransIds = x;
      service['highlightInvalidTransIds'](model, betIdsComponent);

      expect(mockUpdateInvalidItems).toHaveBeenCalledTimes(0);
    });
  });
});