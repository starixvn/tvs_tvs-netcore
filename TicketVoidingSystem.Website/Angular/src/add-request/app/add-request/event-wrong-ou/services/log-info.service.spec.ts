import * as _ from 'lodash';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOuService } from './event-wrong-ou.service';
import { LogInfoService } from './log-info.service';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoWrongOu: LogInfoWrongOu = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWrongOu: new FilterWrongOuModel(),
    logInfoDetail: null,
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false
  };
  static readonly fakeWrongOuModel: WrongOuModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    actualMarket: '',
    wrongMarket: '',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    isPoolHouseAffected: true,
    liveIndicator: 1,
    poolHouseCheckedBetTypes: ''
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
      isPoolHouseAffected: false
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
  static readonly fakeValidation: Validation = {
    isInvalidTotalTickets: true,
    isExistedInOtherRequest: true,
    isPoolHouseAffected: false
  } as Validation;
}

describe('LogInfoService', () => {
  let service: LogInfoService;

  beforeEach(() => {
    service = new LogInfoService(null, null);
  });

  it('#getLogInfo should call expected method', async () => {
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(new GetLogInfoViewModel()));
    const eventWrongOuService = new EventWrongOuService(null);
    eventWrongOuService.getWrongOuModel = jest.fn();
    const logInfoService = new LogInfoService(commonService, eventWrongOuService);
    logInfoService['initGetLogInfoWrongOuQuery'] = jest.fn();
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();

    await logInfoService.getLogInfo(null, null, null, null, new PrimitiveProperty());

    expect(logInfoService['initGetLogInfoWrongOuQuery']).toHaveBeenCalledTimes(1);
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });


  it('#initGetLogInfoWrongOuQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_OU;
    const eventWrongOuService = new EventWrongOuService(null);
    eventWrongOuService.getWrongOuModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongOuService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoWrongOuQuery'](true, 123, filter, [Helper.fakeLogInfoWrongOu]);

    expect(actual).toBeDefined();
  });

  it('#initGetLogInfoWrongOuQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_1ST_OU;
    const eventWrongOuService = new EventWrongOuService(null);
    eventWrongOuService.getWrongOuModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongOuService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoWrongOuQuery'](false, 123, filter, [Helper.fakeLogInfoWrongOu]);

    expect(actual).toBeDefined();
  });

  it('#assignResultLogInfoToEvents should update model', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoWrongOu]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = matchId;
    logInfoModels[0].logInfoDetail.matchId = matchId;
    const eventWrongOuService = new EventWrongOuService(null);
    eventWrongOuService.getWrongOuModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongOuService);

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(events.every(x => x.poolHouseCheckedBetTypes === PoolHouseTicketValue.NOT_AFFECTED)).toBeTruthy();
  });

  it('#assignResultLogInfoToEvents should not update model', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoWrongOu]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = 11111;
    logInfoModels[0].logInfoDetail.matchId = 11111;
    const eventWrongOuService = new EventWrongOuService(null);
    eventWrongOuService.getWrongOuModel = jest.fn();
    const logInfoService = new LogInfoService(null, eventWrongOuService);
    logInfoService['getValidationMessageList'] = jest.fn();

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(logInfoService['getValidationMessageList']).toHaveBeenCalledTimes(0);
  });

  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep([Helper.fakeLogInfoWrongOu]);

    service['resetLogInfoOfEvent'](events);

    expect(events[0].logInfoDetail).toBeNull();
    expect(events[0].messageValidationLogInfo).toBeNull();
  });
});
