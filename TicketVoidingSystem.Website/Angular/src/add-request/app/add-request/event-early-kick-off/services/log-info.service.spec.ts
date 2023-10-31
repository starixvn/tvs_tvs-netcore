import * as _ from 'lodash';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { FilterModel } from '../../filter/filter.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest } from '../../models/get-log-info.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { EventEarlyKickOffService } from './event-eko.service';
import { LogInfoService } from './log-info.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoEarlyKickOff: LogInfoEarlyKickOff = {
    matchId: 1,
    messageValidationLogInfo: [],
    eventName: '',
    isCollapse: false,
    isMainMatch: true,
    isShowValidation: false,
    kickOffTime: '',
    leagueName: '',
    matchModel: new MatchModel(),
    pagingModel: new PagingModel(),
    subIssueTypeId: 1,
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel()
  };
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1
  }
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
  };
  static readonly fakeGetLogInfoModel: GetLogInfoModel = {
    matchId: 123,
    validation: {
      isInvalidTotalTickets: false,
      isExistedInOtherRequest: true,
      isPoolHouseAffected: true,
    },
    ticketRequest: [{
      transIds: '123456789',
      requestId: 123
    }],
    logInfoDetail: Helper.fakeLogInfoDetail
  };
  static readonly fakeTicketRequest: TicketRequest = {
    transIds: '123121,123122,123123,123124,123125,123126,123127,123128,123129',
    requestId: 123,
  };
}

describe('LogInfoService', () => {
  let service: LogInfoService;

  beforeEach(() => {
    service = new LogInfoService(null, null, null);
  });

  it('#getLogInfo should call expected method', async () => {
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(new GetLogInfoViewModel()));
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, commonService, eventEarlyKickOffService);
    logInfoService['initGetLogInfoEarlyKickOffQuery'] = jest.fn();
    logInfoService['assignResultLogInfoToEvents'] = jest.fn();

    await logInfoService.getLogInfo(null, null, null, null, new PrimitiveProperty());

    expect(logInfoService['initGetLogInfoEarlyKickOffQuery']).toHaveBeenCalledTimes(1);
    expect(logInfoService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });


  it('#initGetLogInfoEarlyKickOffQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_HDP;
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, null, eventEarlyKickOffService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoEarlyKickOffQuery'](true, 123, filter, [Helper.fakeLogInfoEarlyKickOff]);

    expect(actual).toBeDefined();
  });

  it('#initGetLogInfoEarlyKickOffQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_1ST_HDP;
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, null, eventEarlyKickOffService);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoEarlyKickOffQuery'](false, 123, filter, [Helper.fakeLogInfoEarlyKickOff]);

    expect(actual).toBeDefined();
  });

  it('#assignResultLogInfoToEvents should not update model', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = 11111;
    logInfoModels[0].logInfoDetail.matchId = 11111;
    const logInfoService = new LogInfoService(null, null, null);

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(events).toHaveBeenCalledTimes(0);
  });

  it('#assignResultLogInfoToEvents should update model when have log', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = matchId;
    logInfoModels[0].logInfoDetail.matchId = matchId;
    const logInfoService = new LogInfoService(null, null, null);

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(logInfoService['createCheckProcessModel']).toHaveBeenCalledTimes(0);
  });

  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);

    service['resetLogInfoOfEvent'](events);

    expect(events[0].messageValidationLogInfo).toBeNull();
  });

  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);

    service['resetLogInfoOfEvent'](events);

    expect(events[0].messageValidationLogInfo).toBeNull();
  });
});
