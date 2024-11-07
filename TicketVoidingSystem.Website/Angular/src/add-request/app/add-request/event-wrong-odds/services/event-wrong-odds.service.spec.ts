import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOddsModel: WrongOddsModel = {
    matchId: 0,
    subIssueTypeId: 1,
    filterFromTransTime: '',
    filterToTransTime: '',
    logInfoDetail: new LogInfoDetail,
    poolHouseCheckedBetTypes: '',
    isPoolHouseAffected: false,
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    liveIndicator: 0,
    oddsInfo: new OddsInfo(),
    sportType: 0
  };
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
    issueTypeId: '11',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  } as FilterModel;
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
    isShowValidation: false,
    sportType: 0
  };
}

describe('EventWrongOddsService', () => {
  let service: EventWrongOddsService;
  let validationService: ValidationService;
  beforeEach(() => {
    validationService = new ValidationService();
    service = new EventWrongOddsService(null, validationService);
  });

  it('#assignModelsToEvents should return expected model', async () => {
    const inputTest = [SubIssueTypeConstant.OVER_UNDER, SubIssueTypeConstant.HANDICAP]
    inputTest.forEach(x => {
      let inputModel = Helper.fakeWrongOddsModel;
      inputModel.subIssueTypeId = x;
      const actual = service.assignModelsToEvents(inputModel);
      expect(actual.matchId).toBe(Helper.fakeWrongOddsModel.matchId);
      expect(actual.poolHouseCheckedBetTypes).toBe(Helper.fakeWrongOddsModel.poolHouseCheckedBetTypes);
    })
  });

  it('#getWrongOddsModel should return expected model', async () => {
    const inputTest = [SubIssueTypeConstant.OVER_UNDER, SubIssueTypeConstant.HANDICAP]
    inputTest.forEach(x => {
      let filter = Helper.fakeFilterModel;
      filter.subIssueTypeId = x.toString();
      const actual = service.getWrongOddsModel(filter, Helper.fakeLogInfoWrongOdds);

    expect(actual.matchId).toBe(Helper.fakeLogInfoWrongOdds.matchId);
    expect(actual.subIssueTypeId ).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
    });
  });

  it('#getLinkedLog should call #addRequestApiService.getLinkedLogs', async () => {
    const inputTest = [SubIssueTypeConstant.OVER_UNDER, SubIssueTypeConstant.HANDICAP]
    inputTest.forEach(async x => {
      let filter = Helper.fakeFilterModel;
      filter.subIssueTypeId = x.toString();
      const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getLinkedLogs = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeLinkedLogsViewModel));
    const mockService = new EventWrongOddsService(addRequestApiService, validationService);
    const actual = await mockService.getLinkedLog(Helper.fakeLogInfoWrongOdds, filter);

    expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
    });
  });
});