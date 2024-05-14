import * as _ from 'lodash';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { RecoverTicketModel } from '../../models/recover-ticket.model';
import { CheckRecoverTicketResult } from '../models/check-recover-ticket-result.model';
import { ValidationService } from './validation.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';

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
  let validationService: ValidationService;

  beforeEach(() => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkTickets14 = jest.fn();
    validationService = new ValidationService(addRequestApiService);
  });

  it('#checkBusinessRule should return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => false);
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = mockIsHasBetId;
    validationService['highlightInvalidTransIds'] = jest.fn();
    const result = await validationService.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #checkTickets14 return validation model with invalid', async () => {
    const mockIsHasBetId = jest.fn().mockImplementation(() => true);
    const mockGroupNumberResetAllItemsToValid = jest.fn();
    const mockGroupNumberCheckDuplicatedItems = jest.fn();
    const mockGroupNumberGetAllBetIds = jest.fn();
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => null);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

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
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => results);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

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
    const mockGroupNumberGetAllBetIds = jest.fn();
    const mockIsAllBetIdsValid = jest.fn().mockImplementation(() => true);
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = mockIsHasBetId;
    betIdsComponent.getAllBetIds = mockGroupNumberGetAllBetIds;
    betIdsComponent.isAllBetIdsValid = mockIsAllBetIdsValid;
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = mockGroupNumberResetAllItemsToValid;
    betIdsComponent.groupNumber.checkDuplicatedItems = mockGroupNumberCheckDuplicatedItems;
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkRecoverTicket = jest.fn().mockImplementation(() => results);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, new RecoverTicketModel(), new FilterModel(), 1, new PermissionAddRequest());

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
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = mockUpdateInvalidItems;
    validationService['highlightInvalidTransIds'](model, betIdsComponent);

    expect(mockUpdateInvalidItems).toHaveBeenCalledTimes(2);
  });

  it('#highlightInvalidTransIds should not call #updateInvalidItems', async () => {
    const model = new CheckRecoverTicketResult();
    const mockUpdateInvalidItems = jest.fn();
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateInvalidItems = mockUpdateInvalidItems;

    ['', null].forEach(x => {
      model.invalidTransIds = x;
      model.unsupportedDateRangeTransIds = x;
      validationService['highlightInvalidTransIds'](model, betIdsComponent);

      expect(mockUpdateInvalidItems).toHaveBeenCalledTimes(0);
    });
  });
});