import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterNotParticipateComponent } from '../filter-not-participate/filter-not-participate.component';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when match invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterNotParticipateComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterNotParticipateComponent = new FilterNotParticipateComponent(null);
    filterNotParticipateComponent.isValid = jest.fn().mockReturnValue(false);

    const actual = service.validateCommonData(leagueEvent, filterNotParticipateComponent);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterNotParticipateComponent = new FilterNotParticipateComponent(null);
    filterNotParticipateComponent.isValid = jest.fn().mockReturnValue(true);

    const actual = service.validateCommonData(leagueEvent, filterNotParticipateComponent);

    expect(actual).toBeTruthy();
  });

  it('#isAllFieldsHaveValue should return false when have not betTypeId', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterModel = new FilterNotParticipateModel();
    filterModel.playerId = null;
    const actual = service.isAllFieldsHaveValue(filterModel, 1, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return false when playerIds invalid', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterModel = new FilterNotParticipateModel();
    filterModel.playerId = 1;
    filterModel.betTypeIds = [];
    const actual = service.isAllFieldsHaveValue(filterModel, 1, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isAllFieldsHaveValue should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filterModel = new FilterNotParticipateModel();
    filterModel.playerId = 1;
    filterModel.betTypeIds = ['1'];
    const actual = service.isAllFieldsHaveValue(filterModel, 1, tooltip);

    expect(actual).toBeTruthy();
  })

  it('#checkCanShowConfirmationWrongOdds should return false', async () => {
    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoNotParticipate();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationNotParticipate(saveRequestArg);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmationWrongOdds should return true', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = false;

    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoNotParticipate();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = [errorMsg];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationNotParticipate(saveRequestArg);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfoEvent = new LogInfoNotParticipate();
    logInfoEvent.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });
});
