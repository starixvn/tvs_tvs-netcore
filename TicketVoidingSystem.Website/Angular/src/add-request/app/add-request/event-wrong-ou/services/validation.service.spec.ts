import * as _ from 'lodash';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWrongOuComponent } from '../filter-wrong-ou/filter-wrong-ou.component';
import { LogInfoWrongOuComponent } from '../log-info-wrong-ou/log-info-wrong-ou.component';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.362 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.363 PM';
  static readonly fakeLogInfoWrongOu: LogInfoWrongOu = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWrongOu: new FilterWrongOuModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
  };
  static readonly fakeWrongOuModel: WrongOuModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    actualMarket: '',
    wrongMarket: '',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    isPoolHouseAffected: true,
    liveIndicator: 1,
    poolHouseCheckedBetTypes: '',
    sportType: 0
  };
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when invalid match', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);

    const actual = service.validateCommonData(eventLeagueComponent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when invalid match', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);


    const logInfoComponent = new LogInfoWrongOuComponent(null, null, null, null, null, null);
    logInfoComponent.filterWrongOuComponent = new FilterWrongOuComponent(null, null);
    logInfoComponent.filterWrongOuComponent.isValid = jest.fn().mockImplementation(() => false);

    const actual = service.validateCommonData(eventLeagueComponent, [logInfoComponent]);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);

    const logInfoComponent = new LogInfoWrongOuComponent(null, null, null, null, null, null);
    logInfoComponent.filterWrongOuComponent = new FilterWrongOuComponent(null, null);
    logInfoComponent.filterWrongOuComponent.isValid = jest.fn().mockImplementation(() => true);

    const actual = service.validateCommonData(eventLeagueComponent, [logInfoComponent]);

    expect(actual).toBeTruthy();
  });

  it('#isFromTimeSameOrBeforeToTime should return false', async () => {
    const fakeFromDateTime = '2020-10-10 09:44:46.361 PM';
    const fakeToDateTime = '2020-10-09 09:44:46.361 PM';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isFromTimeSameOrBeforeToTime(fakeFromDateTime, fakeToDateTime, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isFromTimeSameOrBeforeToTime should return true', async () => {
    const fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
    const fakeToDateTime = '2020-10-09 09:44:46.361 PM';
    const tooltip = new Tooltip();

    const actual = service.isFromTimeSameOrBeforeToTime(fakeFromDateTime, fakeToDateTime, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#isValidInputRelatedEvent should return false', async () => {
    const matchId = Helper.fakeLogInfoWrongOu.matchId;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidInputRelatedEvent(matchId, '', [Helper.fakeLogInfoWrongOu], tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return false', async () => {
    const matchId = 100000;
    const event = new LogInfoWrongOu();
    event.matchId = matchId;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidInputRelatedEvent(matchId, '', [Helper.fakeLogInfoWrongOu, event], tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return true', async () => {
    const actual = service.isValidInputRelatedEvent(10000, '', [Helper.fakeLogInfoWrongOu], null);

    expect(actual).toBeTruthy();
  });

  it('#isAllEventsValid should return false', async () => {
    const events = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    events.messageValidationLogInfo.push({isError: true, reason: ''});
    const actual = service.isAllEventsValid([events]);

    expect(actual).toBeFalsy();
  });

  it('#isAllEventsValid should return true', async () => {
    const events = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    events.messageValidationLogInfo = [];
    const actual = service.isAllEventsValid([events]);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmation should return true', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    const event = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    const validation: ValidationMessage = {
      isError: false,
      reason: ''
    };
    event.messageValidationLogInfo = [validation];
    arg.allEvents = [event];

    const actual = service.checkCanShowConfirmationWrongOu(arg);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmation should return false', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    arg.isEdit = false;
    arg.userId = 1;
    arg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    arg.actionIdOfFirstTimeAccess = "1";
    const event = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    event.logInfoDetail.settleCount = 0;
    event.messageValidationLogInfo.push({isError: true, reason: ''});
    arg.allEvents = [event];
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);

    const actual = service.checkCanShowConfirmationWrongOu(arg);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdp should return false when wrongMarket null', async () => {
    const model = new FilterWrongOuModel();
    model.wrongMarket = null;

    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdp(model, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidHdp should return false when actualMarket null', async () => {
    const model = new FilterWrongOuModel();
    model.wrongMarket = '123';
    model.actualMarket = null;

    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdp(model, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidHdp should return false when wrongMarket is not not number', async () => {
    const model = new FilterWrongOuModel();
    model.wrongMarket = 'aaa';
    model.actualMarket = '123123';

    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdp(model, tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidHdp should return true', async () => {
    const model = new FilterWrongOuModel();
    model.wrongMarket = '12312';
    model.actualMarket = '12312';

    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdp(model, tooltip);

    expect(actual).toBeTruthy();
  });
});