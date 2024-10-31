import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterWrongOddsSportsBookComponent } from '../filter-wrong-odds-sports-book/filter-wrong-odds-sports-book.component';
import { FilterOddsTypeConstant, FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { ValidationService } from './validation.service';

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
    cancelCashOutCount: 1,
    actionType: '1',
    isHasWarningRangeTime: false,
    minTransId: '1',
    transVoidToTime: new Date(Helper.fakeToDateTime),
  };
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
  } as LogInfoWrongOddsSportsBook;
}

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService(null);
  });

  it('#validateCommonData should return false when match invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, null);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return false when filterWrongOddsSportsBookComponent invalid', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsSportsBookComponent = new FilterWrongOddsSportsBookComponent(null, null);
    filterWrongOddsSportsBookComponent.isValidity = jest.fn().mockImplementation(() => false);
    const actual = service.validateCommonData(leagueEvent, filterWrongOddsSportsBookComponent);

    expect(actual).toBeFalsy();
  });

  it('#validateCommonData should return true', async () => {
    const leagueEvent = new EventLeagueComponent(null, null);
    leagueEvent.isMatchIdValid = jest.fn().mockImplementation(() => true);
    const filterWrongOddsSportsBookComponent = new FilterWrongOddsSportsBookComponent(null, null);
    filterWrongOddsSportsBookComponent.isValidity = jest.fn().mockImplementation(() => true);
    const actual = service.validateCommonData(leagueEvent, filterWrongOddsSportsBookComponent);

    expect(actual).toBeTruthy();
  });

  it('#isFromTimeSameOrBeforeToTime should return true', async () => {
    const filter = new FilterWrongOddsSportsBookModel();
    filter.fromDateTime = Helper.fakeFromDateTime;
    filter.toDateTime = Helper.fakeToDateTime;

    const actual = service.isFromTimeSameOrBeforeToTime(filter, new Tooltip());

    expect(actual).toBeTruthy();
  });

  it('#isValidFilterWrongOddsSportsBook should return false when isValidFilterOddsType false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsSportsBookModel();
    filter.filterOddsType = FilterOddsTypeConstant.RANGE;
    filter.fromOdds = '1';
    filter.toOdds = '1a';
    const actual = service.isValidFilterWrongOddsSportsBook(filter, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOddsSportsBook should return false when isValidFilterCorrectValue false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsSportsBookModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = null;
    const actual = service.isValidFilterWrongOddsSportsBook(filter, tooltip);

    expect(actual).toBeFalsy();
  });

  it('#isValidFilterWrongOddsSportsBook should return false when isValidFilterLiveIndicator false', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsSportsBookModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    [null, undefined].forEach(x => {
      filter.liveIndicator = x;
      const actual = service.isValidFilterWrongOddsSportsBook(filter, tooltip);

      expect(actual).toBeFalsy();
    });
  });

  it('#isValidFilterWrongOddsSportsBook should return true', async () => {
    const tooltip = new Tooltip();
    tooltip.display = jest.fn();
    const filter = new FilterWrongOddsSportsBookModel();
    filter.filterOddsType = FilterOddsTypeConstant.VALUE;
    filter.fromOdds = '1';
    filter.toOdds = '1';
    filter.oddsValue = '1';
    filter.correctOdds = '1';
    filter.liveIndicator = 1;
    const actual = service.isValidFilterWrongOddsSportsBook(filter, tooltip);

    expect(actual).toBeTruthy();
  });

  it('#isValidLogInfoEvent should return false', async () => {
    const errorMsg = new ValidationMessage();
    errorMsg.isError = true;
    const logInfo = new LogInfoWrongOddsSportsBook();
    logInfo.messageValidationLogInfo = [errorMsg];
    const actual = service.isValidLogInfoEvent(logInfo);

    expect(actual).toBeFalsy();
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
});