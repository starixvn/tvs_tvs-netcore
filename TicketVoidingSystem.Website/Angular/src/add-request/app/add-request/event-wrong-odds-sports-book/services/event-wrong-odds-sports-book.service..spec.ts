import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';

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
    isAbnormal: false,
    actions: []
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
  static readonly fakeFilterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel = {
    fromDateTime: Helper.fakeFromDateTime,
    toDateTime: Helper.fakeToDateTime,
    correctOdds: '1',
    filterOddsType: 'value',
    fromOdds: '1',
    oddsValue: '1',
    liveIndicator: 0,
    toOdds: '1'
  };
  static readonly fakeLogInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook = {
    matchId: 12345,
    filterWrongOddsSportsBook: new FilterWrongOddsSportsBookModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    betTeamsResult: [],
    checkedBetTypes: []
  };
}

describe('EventWrongOddsSportsBookService', () => {
  let service: EventWrongOddsSportsBookService;

  beforeEach(() => {
    service = new EventWrongOddsSportsBookService();
  });

  it('#assignModelsToEvents should return expected model', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeWrongOddsSportsBookModel);

    expect(actual.matchId).toBe(Helper.fakeWrongOddsSportsBookModel.matchId);
  });

  it('#getWrongOddsSportsBookModel should return expected model', async () => {
    const actual = service.getWrongOddsSportsBookModel(Helper.fakeLogInfoWrongOddsSportsBook, '1');

    expect(actual.matchId).toBe(Helper.fakeLogInfoWrongOddsSportsBook.matchId);
    expect(actual.subIssueTypeId ).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
  });
});