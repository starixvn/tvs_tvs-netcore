import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketValue } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { EventWrongOddsService } from './event-wrong-odds.service';

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
  } as LogInfoDetail;
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

describe('EventWrongOddsService', () => {
  let service: EventWrongOddsService;

  beforeEach(() => {
    service = new EventWrongOddsService(null);
  });

  it('#assignModelsToEvents should return expected model', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeWrongOddsModel);

    expect(actual.matchId).toBe(Helper.fakeWrongOddsModel.matchId);
    expect(actual.poolHouseCheckedBetTypes).toBe(Helper.fakeWrongOddsModel.poolHouseCheckedBetTypes);
  });

  it('#getWrongOddsModel should return expected model', async () => {
    const actual = service.getWrongOddsModel(Helper.fakeFilterModel, Helper.fakeLogInfoWrongOdds);

    expect(actual.matchId).toBe(Helper.fakeLogInfoWrongOdds.matchId);
    expect(actual.subIssueTypeId ).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
  });

  it('#getLinkedLog should call #addRequestApiService.getLinkedLogs', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getLinkedLogs = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeLinkedLogsViewModel));
    const mockService = new EventWrongOddsService(addRequestApiService);
    const actual = await mockService.getLinkedLog(Helper.fakeLogInfoWrongOdds, Helper.fakeFilterModel);

    expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });

  it('#initDefaultLogInfoWrongOdds should return expected model', async () => {
    const actual = service.initDefaultLogInfoWrongOdds();

    expect(actual.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
  });
});