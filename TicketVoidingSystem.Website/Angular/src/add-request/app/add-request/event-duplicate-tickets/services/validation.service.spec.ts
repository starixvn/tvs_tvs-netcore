import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { ValidationDuplicateTickets } from '../models/check-duplicate-tickets.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService(null);
  });

  it('#isFilterMixParlay should return true', async () => {
    const actual = service.isFilterMixParlay(1);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmation should return false when request not voided', async () => {
    const model = new SaveRequestArg();
    model.filter = new FilterModel();
    model.filter.isVoided = false;
    const actual = service.checkCanShowConfirmation(model);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmation should return false when request voided', async () => {
    const model = new SaveRequestArg();
    model.filter = new FilterModel();
    model.filter.isVoided = false;
    service.isHasWarningEditTakeNoteRequest = jest.fn().mockReturnValue(false);
    const actual = service.checkCanShowConfirmation(model);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmation should return true when request voided and isHasWarningEditTakeNoteRequest true', async () => {
    const model = new SaveRequestArg();
    model.filter = new FilterModel();
    model.filter.isVoided = false;
    model.isEdit = true;
    model.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    model.actionIdOfFirstTimeAccess = TVSRequestActionType.MANUAL_VOID_ID.toString();
    const actual = service.checkCanShowConfirmation(model);

    expect(actual).toBeTruthy();
  });

  it('#validateCommonData should return true when betIdsComponent.isHasBetId', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = jest.fn().mockReturnValue(true);
    const actual = service.validateCommonData(betIdsComponent, null);

    expect(actual).toBeTruthy();
  });

  it('#validateCommonData should called #updateUndefinedMatchAndLeague and return false', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = jest.fn().mockReturnValue(false);
    betIdsComponent.getAllBetIdsAreNotNumber = jest.fn().mockReturnValue([]);
    const duplicateTicketsModel = new DuplicateTicketsModel();
    duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    const mockService = new ValidationService(null);
    const actual = mockService.validateCommonData(betIdsComponent, new PrimitiveProperty());

    expect(actual).toBeFalsy();
  });

  it('#checkValidBusinessRule should return false when validateCommonData is false', async () => {
    const arg = new SaveRequestArg();
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    service.validateCommonData = jest.fn().mockReturnValue(false);
    const actual = await service.checkValidBusinessRule(arg);

    expect(service.validateCommonData).toHaveBeenCalledTimes(1);
    expect(actual).toBeFalsy();
  });

  it('#checkValidBusinessRule should return true when betIdsComponent.isAllBetIdsValid is true', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isAllBetIdsValid = jest.fn().mockReturnValue(true);
    const arg = new SaveRequestArg();
    arg.betIdsComponent = betIdsComponent;
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    arg.filter = new FilterModel();
    service['updateBetIdsBeforeCallApi'] = jest.fn();
    service['updateModelAfterCallApi'] = jest.fn();
    service['callApiCheckDuplicateTickets'] = jest.fn();
    service.validateCommonData = jest.fn().mockReturnValue(true);
    const actual = await service.checkValidBusinessRule(arg);

    expect(service.validateCommonData).toHaveBeenCalledTimes(1);
    expect(service['updateBetIdsBeforeCallApi']).toHaveBeenCalledTimes(1);
    expect(service['updateModelAfterCallApi']).toHaveBeenCalledTimes(1);
    expect(service['callApiCheckDuplicateTickets']).toHaveBeenCalledTimes(1);
    expect(actual).toBeTruthy();
  });

  it('#updateBetIdsBeforeCallApi should called #resetAllItemsToValid', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.resetAllItemsToValid = jest.fn();
    betIdsComponent.groupNumber.checkDuplicatedItems = jest.fn();
    service['updateBetIdsBeforeCallApi'](betIdsComponent);

    expect(betIdsComponent.groupNumber.resetAllItemsToValid).toHaveBeenCalledTimes(1);
    expect(betIdsComponent.groupNumber.checkDuplicatedItems).toHaveBeenCalledTimes(1);
  });

  it('#callApiCheckDuplicateTickets should called #addRequestApiService.checkDuplicateTickets when filter parly ticket', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.getAllBetIds = jest.fn();
    const arg = new SaveRequestArg();
    arg.betIdsComponent = betIdsComponent;
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    arg.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;
    arg.filter = new FilterModel();
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkDuplicateTickets = jest.fn();
    const mockService = new ValidationService (addRequestApiService);

    await mockService['callApiCheckDuplicateTickets'](arg);

    expect(addRequestApiService.checkDuplicateTickets).toHaveBeenCalledTimes(1);
  });

  it('#checkCanShowButtonRemove should called #resetAllItemsToValid', async () => {
    const validation = new ValidationDuplicateTickets();
    validation.invalidTransIds = null;
    validation.settledTransIds = '1231';
    const actual = service['checkCanShowButtonRemove'](validation, false, '');

    expect(actual).toBeTruthy();
  });
});
