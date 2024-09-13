import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeMatchId = 1;
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
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 1,
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
    matchId: Helper.fakeMatchId,
    filterWrongOdds: new FilterWrongOddsModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: ''
  };
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: Helper.fakeMatchId,
    validation: {
      isInvalidTotalTickets: true,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: false
    },
    ticketRequest: [Helper.fakeTicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeGetLogInfoViewModel: GetLogInfoViewModel = {
    transInfoAddRequestModel: new TransInfoAddRequestModel(),
    getLogInfoModels: [Helper.fakeGetLogInfoModel],
  };
}

describe('LogInfoService', () => {
  it('#getLogInfo should call #eventWrongOddsService.getWrongOddsModel', async () => {
    const eventWrongOddsService = new EventWrongOddsSportsBookService(null);
    eventWrongOddsService.getWrongOddsModel = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeFilterWrongOddsModel));
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoWrongOdds, false, 1, Helper.fakeFilterModel, new PrimitiveProperty());

    expect(eventWrongOddsService.getWrongOddsModel).toHaveBeenCalledTimes(1);
  });

  it('#getLogInfo should call #eventWrongOddsService.getWrongOddsModel when isEdit', async () => {
    const eventWrongOddsService = new EventWrongOddsSportsBookService(null);
    eventWrongOddsService.getWrongOddsModel = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeFilterWrongOddsModel));
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeGetLogInfoViewModel));

    const mockService = new LogInfoService(commonService, eventWrongOddsService);
    await mockService.getLogInfo(Helper.fakeLogInfoWrongOdds, true, 1, Helper.fakeFilterModel, new PrimitiveProperty());

    expect(eventWrongOddsService.getWrongOddsModel).toHaveBeenCalledTimes(1);
  });

  it('#resetLogInfoOfEvent should update logInfoDetail to null', async () => {
    const mockService = new LogInfoService(null, null);
    mockService.resetLogInfoOfEvent(Helper.fakeLogInfoWrongOdds);

    expect(Helper.fakeLogInfoWrongOdds.logInfoDetail).toBeNull();
    expect(Helper.fakeLogInfoWrongOdds.messageValidationLogInfo).toBeNull();
  });
});