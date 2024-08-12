import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
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
    groupLinkedLogs: [
      {
        groupName: '1X2',
        isAffectedGroup: true,
        logsData: []
      },
      {
        groupName: 'AIO',
        isAffectedGroup: true,
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
  } as LogInfoDetail;
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    favoriteValue: '1',
    filterFavoriteType: 'h',
    liveIndicator: 1,
    spread: '0.2',
    maxBet: 0,
    allowanceRate: '20',
    correctOddsHomeOver: '0.8',
    correctOddsAwayUnder: '0.9',
    fromOddsNotVoidHomeOver: '0.65',
    toOddsNotVoidHomeOver: '0.85',
    fromOddsNotVoidAwayUnder: '0.5',
    toOddsNotVoidAwayUnder: '0.9',
    maxBetAndSpreadInfo: []
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: Helper.fakeFilterWrongOddsModel,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: '',
    isShowValidation: false
  };
}

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

  it('#validateCommonData should return false when filterWrongOddsComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsComponent = new FilterWrongOddsComponent(null, null, null);
    filterWrongOddsComponent.isValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, filterWrongOddsComponent);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsComponent = new FilterWrongOddsComponent(null, null, null);
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

  it('#isValidFilterWrongOdds should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = Helper.fakeFilterWrongOddsModel;
    const actual = service.isValidFilterWrongOdds(filter, tooltip, "7");

    expect(actual).toBeTruthy();
  });

  it('#isValidFilterWrongOdds should return false when not ValidFilterLiveIndicator', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["isValidFilterLiveIndicator"] = jest.fn().mockReturnValue(false);
    service["isValidFilterFavorite"] = jest.fn().mockReturnValue(true);
    const actual = service.isValidFilterWrongOdds(filter, tooltip, "7");

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when not ValidSpread', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["isValidSpread"] = jest.fn().mockReturnValue(false);
    service["isValidFilterFavorite"] = jest.fn().mockReturnValue(true);
    service["isValidFilterLiveIndicator"] = jest.fn().mockReturnValue(true);
    const actual = service.isValidFilterWrongOdds(filter, tooltip, "7");

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when not ValidFilterCorrectOdds', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["isValidFilterCorrectOdds"] = jest.fn().mockReturnValue(false);
    service["isValidFilterFavorite"] = jest.fn().mockReturnValue(true);
    service["isValidFilterLiveIndicator"] = jest.fn().mockReturnValue(true);
    service["isValidSpread"] = jest.fn().mockReturnValue(true);
    const actual = service.isValidFilterWrongOdds(filter, tooltip, "7");

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterFavorite false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["isValidFilterFavorite"] = jest.fn().mockReturnValue(false);
    const actual = service.isValidFilterWrongOdds(filter, tooltip, "7");

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when ValidFilterOu false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["ValidFilterOu"] = jest.fn().mockReturnValue(false);
    const actual = service.isValidFilterWrongOdds(filter, tooltip, SubIssueTypeConstant.OVER_UNDER.toString());

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOdds should return false when isValidFilterLiveIndicator false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsModel();
    service["isValidFilterFavorite"] = jest.fn().mockReturnValue(true);
    [null, undefined].forEach(x => {
      filter.liveIndicator = x;
      const actual = service.isValidFilterWrongOdds(filter, tooltip, '1');

      expect(actual).toBeFalsy();
    });
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfo = new LogInfoWrongOdds();
    logInfo.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfo);

    expect(actual).toBeFalsy();
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

  it('#isValidFilterWrongOdds should return true for valid filterWrongOddsModel', () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const result = service.isValidFilterCorrectOdds("0.7", "0.2", tooltip);

    expect(result).toBeTruthy();
  });
  
  it('#isValidFilterWrongOdds should return false for invalid filterWrongOddsModel', () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const inputTests = [{homeCorrectOdds: "0.7&0.1", spread: "0.2"},
      {homeCorrectOdds: "2", spread: "0.2"},
      {homeCorrectOdds: "0.2", spread: "0.6"},
      {homeCorrectOdds: "-2", spread: "0.6"}
    ];
    inputTests.forEach(x => {
      const result = service.isValidFilterCorrectOdds(x.homeCorrectOdds, x.spread, tooltip);
      expect(result).toBeFalsy();
    })
    
  });

  it('#isValidFilterOu should return true for valid filter', () => {
    const filter = Helper.fakeFilterWrongOddsModel;
    filter.wrongOU = '1.5';
    const tooltip = new Tooltip();
    const result = service["isValidFilterOu"](filter, tooltip);

    expect(result).toBeTruthy();
  });

  it('#isValidFilterOu should return false', () => {
    const filter = Helper.fakeFilterWrongOddsModel;
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const inputTests = [null, "", "0.", "0.75&0.2"];
    inputTests.forEach(x => {
      filter.wrongOU = x;
      const result = service["isValidFilterOu"](filter, tooltip);
      expect(result).toBeFalsy();
    });
    })
    
  it('#isValidSpread should return true for valid filter', () => {
    const tooltip = new Tooltip();
    const result = service.isValidSpread("0.2", tooltip);

    expect(result).toBeTruthy();
  });

  it('#isValidSpread should return false', () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const inputTests = [null, "", "0.", "0.75&0.2"];
    inputTests.forEach(x => {
      const result = service.isValidSpread(x, tooltip);
      expect(result).toBeFalsy();
    });
    })

    it('#isValidFilterLiveIndicator should return true for valid filter', () => {
      const filter = Helper.fakeFilterWrongOddsModel;
      filter.liveIndicator = 1;
      const tooltip = new Tooltip();
      const result = service["isValidFilterLiveIndicator"](filter, tooltip);
  
      expect(result).toBeTruthy();
    });

    it('#isValidFilterLiveIndicator should return false', () => {
      const filter = Helper.fakeFilterWrongOddsModel;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();
      const inputTests = [null, undefined];
      inputTests.forEach(x => {
        filter.liveIndicator = x;
        const result = service["isValidFilterLiveIndicator"](filter, tooltip);
        expect(result).toBeFalsy();
      });
    });
    
    it('#isValidFilterFavorite should return true for valid filter', () => {
      const filter = Helper.fakeFilterWrongOddsModel;
      filter.favoriteValue = "0.7";
      const tooltip = new Tooltip();
      const result = service["isValidFilterFavorite"](filter, tooltip);
  
      expect(result).toBeTruthy();
    });

    it('#isValidFilterFavorite should return false', () => {
      const filter = Helper.fakeFilterWrongOddsModel;
      const tooltip = new Tooltip();
      tooltip.display = jest.fn();
      const inputTests = [null, undefined, ""];
      inputTests.forEach(x => {
        filter.favoriteValue = x;
        const result = service["isValidFilterFavorite"](filter, tooltip);
        expect(result).toBeFalsy();
      });
    });
  
});