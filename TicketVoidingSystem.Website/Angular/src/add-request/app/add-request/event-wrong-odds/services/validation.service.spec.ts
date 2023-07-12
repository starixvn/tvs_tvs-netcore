import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { Tooltip } from '../../../../../utility/modules/tooltip/tooltip.model';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';
import { FilterOddsTypeConstant, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOddsModel = new WrongOddsModel();
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    result: new Result(),
    poolHouseLinkedLogsData: [
      {
        groupName: '1X2',
        isShow: true,
        logsData: []
      },
      {
        groupName: 'AIO',
        isShow: true,
        logsData: []
      },
    ]
  };
  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    instantlySettleCount: 2,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    cancelCashOutCount: 1
  };
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    betTeam: 'h',
    correctOdds: '1',
    favoriteValue: '1',
    filterFavoriteType: 'h',
    filterOddsType: 'value',
    filterOuType: 'h',
    fromOdds: '1',
    oddsValue: '1',
    ouValue: '1',
    liveIndicator: 0,
    toOdds: '1'
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: new FilterWrongOddsModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: ''
  };
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  it('#validateCommonData should return false when match invalid', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterWrongOddsComponent invalid', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsComponent = new FilterWrongOddsComponent(null, null);
    filterWrongOddsComponent.isValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, filterWrongOddsComponent);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new LeagueEventRedCardComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsComponent = new FilterWrongOddsComponent(null, null);
    filterWrongOddsComponent.isValid = jest.fn().mockImplementation(() => true);
    const actual = service.validateCommonData(leagueEvent, filterWrongOddsComponent);

    expect(actual).toBeTruthy();
  });

  it('#isFromTimeSameOrBeforeToTime should return true', async () => {
    const filter = new FilterWrongOddsModel();
    filter.filterFromTransTime = Helper.fakeFromDateTime;
    filter.filterToTransTime = Helper.fakeToDateTime;

    const actual = service.isFromTimeSameOrBeforeToTime(filter, new Tooltip());

    expect(actual).toBeTruthy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterOddsType false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.RANGE;
    filter.fromOdds = '1';
    filter.toOdds = '1a';
    const actual = service.isValidFilterWrongOdds(filter, tooltip, null);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterCorrectValue false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = null;
    const actual = service.isValidFilterWrongOdds(filter, tooltip, null);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterFavorite false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.favoriteValue = null;
    const actual = service.isValidFilterWrongOdds(filter, tooltip, '1');

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterOu false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.favoriteValue = '1';
    filter.ouValue = null;
    const actual = service.isValidFilterWrongOdds(filter, tooltip, SubIssueTypeConstant.OVER_UNDER.toString());

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterLiveIndicator false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.favoriteValue = '1';
    filter.ouValue = '1';
    [null, undefined].forEach(x => {
      filter.liveIndicator = x;
      const actual = service.isValidFilterWrongOdds(filter, tooltip, '1');

      expect(actual).toBeFalsy();
    });
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterBetTeam false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.favoriteValue = '1';
    filter.ouValue = '1';
    filter.liveIndicator = 1;
    [null, undefined, ''].forEach(x => {
      filter.betTeam = x;
      const actual = service.isValidFilterWrongOdds(filter, tooltip, '1');

      expect(actual).toBeFalsy();
    });
  });

  it('#isValidFilterWrongOdds should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.favoriteValue = '1';
    filter.ouValue = '1';
    filter.liveIndicator = 1;
    filter.betTeam = 'h';
    const actual = service.isValidFilterWrongOdds(filter, tooltip, '1');

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfo = new LogInfoWrongOdds();
    logInfo.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfo);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOu should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.hide = jest.fn();
    const filter = new FilterWrongOddsModel();
    filter.ouValue = '1';
    const actual = service['isValidFilterOu'](filter, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#isValidFilterOddsValue should return false when oddsValue null', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsValue'](null, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsValue should return false when isCorrectFormatMultipleDecimal', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsValue']('1a', tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsValue should return false when have 0', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsValue']('0', tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsRange should return false when fromOdds null', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsRange'](null, '0', tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsRange should return false when toOdds null', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsRange']('1', null, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsRange should return false when fromOdds > toOdds', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsRange']('1', '0', tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterOddsRange should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const actual = service['isValidFilterOddsRange']('1', '2', tooltip);

    expect(actual).toBeTruthy();
  });

  it('#checkCanShowConfirmationWrongOdds should return false', async () => {
    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoWrongOdds();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = null;
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationWrongOdds(saveRequestArg);

    expect(actual).toBeFalsy();
  });

  it('#checkCanShowConfirmationWrongOdds should return true', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = false;

    const element = document.createElement('body');
    element.setAttribute("user-id", "2");
    document.getElementById = jest.fn().mockImplementation(() => element);
    const saveRequestArg = new SaveRequestArg();
    saveRequestArg.logInfoEvent = new LogInfoWrongOdds();
    saveRequestArg.logInfoEvent.messageValidationLogInfo = [errorMsg];
    saveRequestArg.isEdit = true;
    saveRequestArg.userId = 2;
    saveRequestArg.filter = new FilterModel();
    saveRequestArg.filter.action = TVSRequestActionType.TAKE_NOTE_ID.toString();
    saveRequestArg.actionIdOfFirstTimeAccess = TVSRequestActionType.TAKE_NOTE_ID.toString();
    const actual = service.checkCanShowConfirmationWrongOdds(saveRequestArg);

    expect(actual).toBeTruthy();
  });
});