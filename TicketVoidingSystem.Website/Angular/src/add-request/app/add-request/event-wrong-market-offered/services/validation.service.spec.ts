import { AdvancedModeAddRequestComponent } from '../../../../..//utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeComponent } from '../filter-time/filter-time.component';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
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

  it('#validateCommonData should return false when filterWrongMarketOfferedComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(false);

    const actual = service.validateCommonData(leagueEvent, filterTime, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterWrongMarketOfferedComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(true);
    const advancedMode = new AdvancedModeAddRequestComponent();
    advancedMode.isValidity = jest.fn().mockReturnValue(false);
    const actual = service.validateCommonData(leagueEvent, filterTime, advancedMode);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new EventLeagueComponent(null, null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterTime = new FilterTimeComponent(null);
    filterTime.isValidity = jest.fn().mockReturnValue(true);
    const advancedMode = new AdvancedModeAddRequestComponent();
    advancedMode.isValidity = jest.fn().mockReturnValue(true);
    const actual = service.validateCommonData(leagueEvent, filterTime, advancedMode);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfoEvent = new LogInfoWrongMarketOffered();
    const actual = service.isValidLogInfoEvent(logInfoEvent);

    expect(actual).toBeFalsy();
  });
});
