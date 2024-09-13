import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { EventWrongOddsSportsBookSportsBookService } from './event-wrong-odds-sports-book.service';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOddsSportsBookModel = new WrongOddsSportsBookModel();
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
  static readonly fakeFilterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
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
  static readonly fakeLogInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook = {
    matchId: 12345,
    filterWrongOddsSportsBook: new FilterWrongOddsSportsBookModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: []
  };
}

describe('EventWrongOddsSportsBookService', () => {
  let service: EventWrongOddsSportsBookSportsBookService;

  beforeEach(() => {
    service = new EventWrongOddsSportsBookSportsBookService(null);
  });

  it('#assignModelsToEvents should return expected model', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeWrongOddsSportsBookModel);

    expect(actual.matchId).toBe(Helper.fakeWrongOddsSportsBookModel.matchId);
    expect(actual.poolHouseCheckedBetTypes).toBe(Helper.fakeWrongOddsSportsBookModel.poolHouseCheckedBetTypes);
  });

  it('#getWrongOddsSportsBookModel should return expected model', async () => {
    const actual = service.getWrongOddsSportsBookModel(Helper.fakeFilterModel, Helper.fakeLogInfoWrongOddsSportsBook);

    expect(actual.matchId).toBe(Helper.fakeLogInfoWrongOddsSportsBook.matchId);
    expect(actual.subIssueTypeId ).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
  });

  it('#getLinkedLog should call #addRequestApiService.getLinkedLogs', async () => {
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.getLinkedLogs = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeLinkedLogsViewModel));
    const mockService = new EventWrongOddsSportsBookSportsBookService(addRequestApiService);
    const actual = await mockService.getLinkedLog(Helper.fakeLogInfoWrongOddsSportsBook, Helper.fakeFilterModel);

    expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });

  it('#initDefaultLogInfoWrongOddsSportsBook should return expected model', async () => {
    const actual = service.initDefaultLogInfoWrongOddsSportsBook();

    expect(actual.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
  });
});