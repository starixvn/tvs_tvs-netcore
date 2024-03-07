import * as _ from 'lodash';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckTickets14Result } from '../models/check-tickets14-result.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeCheckValidTransIdsResult: CheckTickets14Result = {
    invalidTransIds: '12345',
    unsupportedDateRangeTransIds: '34567',
    transInfoJson: ''
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
    const result = await validationService.checkBusinessRule(betIdsComponent, '17', new PermissionAddRequest());

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
    addRequestApiService.checkTickets14 = jest.fn().mockImplementation(() => null);
    addRequestApiService.getPermissionAddRequest = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, '17', new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should call #updateInvalidItems return validation model with invalid', async () => {
    const results = _.cloneDeep(Helper.fakeCheckValidTransIdsResult);
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
    addRequestApiService.checkTickets14 = jest.fn().mockImplementation(() => results);
    addRequestApiService.getPermissionAddRequest = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, '17', new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(false);
  });

  it('#checkBusinessRule should return validation model with valid', async () => {
    const results = _.cloneDeep(Helper.fakeCheckValidTransIdsResult);
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
    addRequestApiService.checkTickets14 = jest.fn().mockImplementation(() => results);
    addRequestApiService.getPermissionAddRequest = jest.fn().mockImplementation(() => true);
    validationService = new ValidationService(addRequestApiService);
    validationService['highlightInvalidTransIds'] = jest.fn();

    const result = await validationService.checkBusinessRule(betIdsComponent, '17', new PermissionAddRequest());

    expect(mockIsHasBetId).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberResetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberCheckDuplicatedItems).toHaveBeenCalledTimes(1);
    expect(mockGroupNumberGetAllBetIds).toHaveBeenCalledTimes(1);
    expect(result.isValid).toBe(true);
  });

  it('#highlightInvalidTransIds should call #updateInvalidItems', async () => {
    const model = new CheckTickets14Result();
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
    const model = new CheckTickets14Result();
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