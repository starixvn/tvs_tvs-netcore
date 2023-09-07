import { PermissionManage } from '../../../../../manage-request/app/models/permission-manage.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { GroupNumber } from '../../../../../utility/components/bet-ids/bet-ids.model';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { LeagueEventAbnormalComponent } from '../../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../../filter/filter.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { CheckDuplicateTicketsViewModel, ValidationDuplicateTickets } from '../models/check-duplicate-tickets.model';
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
    model.actionIdOfFirstTimeAccess = TVSRequestActionType.MANUAL_VOID;
    const actual = service.checkCanShowConfirmation(model);

    expect(actual).toBeTruthy();
  });

  it('#validateCommonData should return true when betIdsComponent.isHasBetId', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = jest.fn().mockReturnValue(true);
    const actual = service.validateCommonData(betIdsComponent, null, null, null);

    expect(actual).toBeTruthy();
  });

  it('#validateCommonData should called #updateUndefinedMatchAndLeague and return false', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.isHasBetId = jest.fn().mockReturnValue(false);
    betIdsComponent.getAllBetIdsAreNotNumber = jest.fn().mockReturnValue([]);
    const leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    leagueEventComponent.updateUndefinedMatchAndLeague = jest.fn();
    const duplicateTicketsModel = new DuplicateTicketsModel();
    duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    const mockService = new ValidationService(null);
    const actual = mockService.validateCommonData(betIdsComponent, leagueEventComponent, new PrimitiveProperty(), duplicateTicketsModel);

    expect(leagueEventComponent.updateUndefinedMatchAndLeague).toHaveBeenCalledTimes(1);
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

  it('#checkValidBusinessRule should called #leagueEventComponent.updateInfoWithOnlyOneMatch', async () => {
    const viewModel = new CheckDuplicateTicketsViewModel();
    viewModel.validation = new ValidationDuplicateTickets();
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.groupNumber = new GroupNumber();
    betIdsComponent.groupNumber.updateMoved = jest.fn();
    betIdsComponent.groupNumber.updateDifferent = jest.fn();
    betIdsComponent.groupNumber.updateInvalidItems = jest.fn();
    betIdsComponent.getAllBetIdsAreNotNumber = jest.fn();

    const permissionManage = new PermissionManage();
    permissionManage.manageRequestSettledTicketsHost = true;
    const leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    leagueEventComponent.updateInfoWithOnlyOneMatch = jest.fn();
    const arg = new SaveRequestArg();
    arg.leagueEventComponent = leagueEventComponent;
    arg.betIdsComponent = betIdsComponent;
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    arg.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    arg.filter = new FilterModel();
    arg.primitiveProps = new PrimitiveProperty();
    arg.permission = permissionManage;
    service.validateCommonData = jest.fn().mockReturnValue(true);
    service['updateModelAfterCallApi'](arg, viewModel);

    expect(leagueEventComponent.updateInfoWithOnlyOneMatch).toHaveBeenCalledTimes(1);
  });

  it('#callApiCheckDuplicateTickets should called #addRequestApiService.checkDuplicateTickets when filter single ticket', async () => {
    const leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    const betIdsComponent = new BetIdsComponent(null);
    betIdsComponent.getAllBetIds = jest.fn();
    const arg = new SaveRequestArg();
    arg.betIdsComponent = betIdsComponent;
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    arg.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;
    arg.filter = new FilterModel();
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.checkDuplicateTickets = jest.fn();
    const mockService = new ValidationService (addRequestApiService);

    [leagueEventComponent, null].forEach(async x => {
      arg.leagueEventComponent = x;
      await mockService['callApiCheckDuplicateTickets'](arg);

      expect(addRequestApiService.checkDuplicateTickets).toHaveBeenCalled();
    });
  });

  it('#callApiCheckDuplicateTickets should called #addRequestApiService.checkDuplicateTickets when filter parly ticket', async () => {
    const betIdsComponent = new BetIdsComponent(null);
    const leagueEventComponent = new LeagueEventAbnormalComponent(null, null);
    betIdsComponent.getAllBetIds = jest.fn();
    const arg = new SaveRequestArg();
    arg.betIdsComponent = betIdsComponent;
    arg.duplicateTicketsModel = new DuplicateTicketsModel();
    arg.duplicateTicketsModel.filterBy = AbnormalFilterBy.MIX_PARLAY;
    arg.leagueEventComponent = leagueEventComponent;
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
