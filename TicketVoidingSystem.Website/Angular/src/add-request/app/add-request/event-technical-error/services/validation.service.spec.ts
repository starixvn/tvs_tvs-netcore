import { AdvancedModeAddRequestComponent } from '../../../../..//utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { FilterModel } from '../../filter/filter.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeTechnicalErrorComponent } from '../filter-time-technical-error/filter-time-technical-error.component';
import { LogInfoTechnicalError } from '../models/log-info-wrong-market-offered.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when match invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, null, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterTechnicalErrorComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeTechnicalErrorComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(false);

    const actual = service.validateCommonData(leagueEvent, filterTime, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterTechnicalErrorComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeTechnicalErrorComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(true);
    const advancedMode = new AdvancedModeAddRequestComponent();
    advancedMode.isValidity = jest.fn().mockReturnValue(false);
    const actual = service.validateCommonData(leagueEvent, filterTime, advancedMode);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeTechnicalErrorComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(true);
    const advancedMode = new AdvancedModeAddRequestComponent();
    advancedMode.isValidity = jest.fn().mockReturnValue(true);
    const actual = service.validateCommonData(leagueEvent, filterTime, advancedMode);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmationWrongOdds should return false', async () => {
    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoTechnicalError();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationTechnicalError(saveRequestArg);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmationWrongOdds should return true', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = false;

    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoTechnicalError();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = [errorMsg];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationTechnicalError(saveRequestArg);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfoEvent = new LogInfoTechnicalError();
    logInfoEvent.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });
});
