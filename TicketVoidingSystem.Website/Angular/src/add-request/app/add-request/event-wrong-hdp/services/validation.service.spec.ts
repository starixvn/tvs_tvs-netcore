import * as _ from 'lodash';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TeamFavorite, TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongHdpModel } from '../../models/event-wrong-hdp.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWithHdpComponent } from '../filter-with-hdp/filter-with-hdp.component';
import { LogInfoWrongHdpComponent } from '../log-info-wrong-hdp/log-info-wrong-hdp.component';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.362 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.363 PM';
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
  };
  static readonly fakeWrongHdpModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    hdpValue: '',
    logInfoDetail: null,
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    isPoolHouseAffected: false,
    liveIndicator: 0,
    poolHouseCheckedBetTypes: '',
    sportType: 0
  } as WrongHdpModel;
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when invalid match', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => false);

    const actual = service.validateCommonData(eventLeagueComponent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when invalid match', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);

    const logInfoWrongHdpComponent = new LogInfoWrongHdpComponent(null, null, null, null, null, null, null);
    logInfoWrongHdpComponent.filterWithHdpComponent = new FilterWithHdpComponent(null, null);
    logInfoWrongHdpComponent.filterWithHdpComponent.isValid = jest.fn().mockImplementation(() => false);

    const actual = service.validateCommonData(eventLeagueComponent, [logInfoWrongHdpComponent]);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const eventLeagueComponent = new EventLeagueComponent(null, null, null);
    eventLeagueComponent.isMatchIdValid = jest.fn().mockImplementation(() => true);

    const logInfoWrongHdpComponent = new LogInfoWrongHdpComponent(null, null, null, null, null, null, null);
    logInfoWrongHdpComponent.filterWithHdpComponent = new FilterWithHdpComponent(null, null);
    logInfoWrongHdpComponent.filterWithHdpComponent.isValid = jest.fn().mockImplementation(() => true);

    const actual = service.validateCommonData(eventLeagueComponent, [logInfoWrongHdpComponent]);

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
    const matchId = Helper.fakeLogInfoWrongHdp.matchId;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidInputRelatedEvent(matchId, '', [Helper.fakeLogInfoWrongHdp], tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return false', async () => {
    const matchId = 100000;
    const event = new LogInfoWrongHdp();
    event.matchId = matchId;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidInputRelatedEvent(matchId, '', [Helper.fakeLogInfoWrongHdp, event], tooltip);

    expect(actual).toBeFalsy();
    expect(tooltip.display).toHaveBeenCalledTimes(1);
  });

  it('#isValidInputRelatedEvent should return true', async () => {
    const actual = service.isValidInputRelatedEvent(10000, '', [Helper.fakeLogInfoWrongHdp], null);

    expect(actual).toBeTruthy();
  });

  it('#isAllEventsValid should return false', async () => {
    const events = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    events.messageValidationLogInfo.push({isError: true, reason: ''});
    const actual = service.isAllEventsValid([events]);

    expect(actual).toBeFalsy();
  });

  it('#isAllEventsValid should return true', async () => {
    const events = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    events.messageValidationLogInfo = [];
    const actual = service.isAllEventsValid([events]);

    expect(actual).toBeTruthy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return false when invalid homeFavorite', async () => {
    const model = new FilterWithHdpModel();
    model.homeFavorite = null;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.HOME, model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return false when invalid awayFavorite', async () => {
    const model = new FilterWithHdpModel();
    model.awayFavorite = null;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.AWAY, model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return false when invalid actualMarket', async () => {
    const model = new FilterWithHdpModel();
    model.awayFavorite = '12';
    model.actualMarket = null;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.AWAY, model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return false when awayFavorite invalid', async () => {
    const model = new FilterWithHdpModel();
    model.homeFavorite = '12a';
    model.actualMarket = '11a';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.HOME, model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return false when awayFavorite invalid', async () => {
    const model = new FilterWithHdpModel();
    model.awayFavorite = '12a';
    model.actualMarket = '11a';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.AWAY, model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeWrongHdpOrWrong1stHdp should return true', async () => {
    const model = new FilterWithHdpModel();
    model.awayFavorite = '12';
    model.actualMarket = '11';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(TeamFavorite.AWAY, model, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#isValidHdpWithSubTypeHomeAwayVirtualHedReverse should return false', async () => {
    const model = new FilterWithHdpModel();
    model.hdpValue = null;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service.isValidHdpWithSubTypeHomeAwayVirtualHedReverse(model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeHomeAwayVirtualHedReverse should return false when hdpValue invalid', async () => {
    const model = new FilterWithHdpModel();
    model.hdpValue = '12a';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdpWithSubTypeHomeAwayVirtualHedReverse(model, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidHdpWithSubTypeHomeAwayVirtualHedReverse should return true', async () => {
    const model = new FilterWithHdpModel();
    model.hdpValue = '12';
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();

    const actual = service.isValidHdpWithSubTypeHomeAwayVirtualHedReverse(model, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmation should return true', async () => {
    const arg = new SaveRequestArg();
    arg.filter = new FilterModel();
    arg.filter.isVoided = false;
    const event = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    const validation: ValidationMessage = {
      isError: false,
      reason: ''
    };
    event.messageValidationLogInfo = [validation];
    arg.allEvents = [event];

    const actual = service.checkCanShowConfirmation(arg);

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
    const event = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    event.logInfoDetail.settleCount = 0;
    arg.allEvents = [event];
    const element = document.createElement('section');
    element.setAttribute("user-id", "1");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const actual = service.checkCanShowConfirmation(arg);

    expect(actual).toBeFalsy();
  });

  it('#isSubTypeWrongHdpOrWrong1stHdp should return true', async () => {
    const actual = service.isSubTypeWrongHdpOrWrong1stHdp(SubIssueTypeConstant.WRONG_HDP.toString());

    expect(actual).toBeTruthy();
  });

  it('#isSubTypeWrongHdpOrWrong1stHdp should return false', async () => {
    const actual = service.isSubTypeWrongHdpOrWrong1stHdp(SubIssueTypeConstant.GOAL.toString());

    expect(actual).toBeFalsy();
  });

  it('#isSubTypeWrongHdp should return false', async () => {
    const actual = service['isSubTypeWrongHdp'](SubIssueTypeConstant.GOAL.toString());

    expect(actual).toBeFalsy();
  });

  it('#isSubTypeWrong1stHdp should return false', async () => {
    const actual = service['isSubTypeWrong1stHdp'](SubIssueTypeConstant.GOAL.toString());

    expect(actual).toBeFalsy();
  });
});