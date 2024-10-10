import * as _ from 'lodash';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongHdpModel } from '../../models/event-wrong-hdp.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { LogInfoService } from './log-info.service';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: null,
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    poolHouseCheckedBetTypes: '',
    linkedLogsViewModel: null,
    isShowValidation: false,
    sportType: 0
  };
  static readonly fakeWrongHdpModel: WrongHdpModel = {
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
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    isPoolHouseAffected: true,
    poolHouseCheckedBetTypes: '',
    liveIndicator: 0,
    sportType: 0
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 123,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    scoreOfMatch: '',
    scoreNormalTicket: '',
    instantlySettleCount: 2,
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: 123,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: true,
    } as Validation,
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    } as TicketRequest],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 123,
  } as TicketRequest;
}

describe('LogInfoService', () => {
  let service: LogInfoService;

  beforeEach(() => {
    service = new LogInfoService(null, null);
  });

  it('#getLogInfo should call expected method', async () => {
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(new GetLogInfoViewModel()));
    const eventWrongHdpService = new EventWrongHdpService(null, null);
    eventWrongHdpService.getWrongHdpModel = jest.fn();
    const logInfoService = new LogInfoService(commonService, eventWrongHdpService);
    logInfoService['initGetLogInfoWrongHdpQuery'] = jest.fn();
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();

    await logInfoService.getLogInfo(null, null, null, null, new PrimitiveProperty());

    expect(logInfoService['initGetLogInfoWrongHdpQuery']).toHaveBeenCalledTimes(1);
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });


  it('#initGetLogInfoWrongHdpQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_HDP;
    const eventWrongHdpService = new EventWrongHdpService(null, null);
    eventWrongHdpService.getWrongHdpModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongHdpService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoWrongHdpQuery'](true, 123, filter, [Helper.fakeLogInfoWrongHdp]);

    expect(actual).toBeDefined();
  });

  it('#initGetLogInfoWrongHdpQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_1ST_HDP;
    const eventWrongHdpService = new EventWrongHdpService(null, null);
    eventWrongHdpService.getWrongHdpModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongHdpService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoWrongHdpQuery'](false, 123, filter, [Helper.fakeLogInfoWrongHdp]);

    expect(actual).toBeDefined();
  });

  it('#assignResultLogInfoToEvents should update all events to PoolHouseTicketValue.NOT_AFFECTED', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoWrongHdp]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = matchId;
    logInfoModels[0].logInfoDetail.matchId = matchId;
    logInfoModels[0].validation.isPoolHouseAffected = false;
    const logInfoService = new LogInfoService(null, null);

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(events.every(x => x.poolHouseCheckedBetTypes === PoolHouseTicketValue.NOT_AFFECTED)).toBeTruthy();
  });

  it('#assignResultLogInfoToEvents should not update model', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoWrongHdp]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = 11111;
    logInfoModels[0].logInfoDetail.matchId = 11111;
    const logInfoService = new LogInfoService(null, null);
    logInfoService['createCheckProcessModel'] = jest.fn();

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(logInfoService['createCheckProcessModel']).toHaveBeenCalledTimes(0);
  });

  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep([Helper.fakeLogInfoWrongHdp]);

    service['resetLogInfoOfEvent'](events);

    expect(events[0].logInfoDetail).toBeNull();
    expect(events[0].messageValidationLogInfo).toBeNull();
  });
});
