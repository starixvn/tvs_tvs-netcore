import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeMatchId = 1;
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
    matchId: Helper.fakeMatchId,
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
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 1,
    createdBy: 'admin',
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
    matchId: Helper.fakeMatchId,
    filterWrongOddsSportsBook: new FilterWrongOddsSportsBookModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    betTeamsResult: [],
    checkedBetTypes: []
  };
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: Helper.fakeMatchId,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true,
    } as Validation,
    ticketRequest: [Helper.fakeTicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
}

describe('LogInfoService', () => {
  it('#getLogInfo should call #eventWrongOddsSportsBookService.getWrongOddsSportsBookModel', async () => {
    const eventWrongOddsSportsBookService = new EventWrongOddsSportsBookService();
    eventWrongOddsSportsBookService.getWrongOddsSportsBookGetLogInfoModel = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeFilterWrongOddsSportsBookModel));
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    const mockService = new LogInfoService(commonService, eventWrongOddsSportsBookService);
    await mockService.getLogInfo(Helper.fakeLogInfoWrongOddsSportsBook, false, 1, Helper.fakeFilterModel, new PrimitiveProperty());

    expect(eventWrongOddsSportsBookService.getWrongOddsSportsBookGetLogInfoModel).toHaveBeenCalledTimes(1);
  });

  it('#resetLogInfoOfEvent should update logInfoDetail to null', async () => {
    const mockService = new LogInfoService(null, null);
    mockService.resetLogInfoOfEvent(Helper.fakeLogInfoWrongOddsSportsBook);

    expect(Helper.fakeLogInfoWrongOddsSportsBook.logInfoDetail).toBeNull();
    expect(Helper.fakeLogInfoWrongOddsSportsBook.messageValidationLogInfo).toBeNull();
  });
});