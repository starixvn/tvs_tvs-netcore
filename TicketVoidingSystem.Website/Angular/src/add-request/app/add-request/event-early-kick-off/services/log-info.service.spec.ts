import * as _ from 'lodash';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { HttpService } from '../../../../../utility/services/http.service';
import { FilterModel } from '../../filter/filter.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { GetLogInfoModel, GetLogInfoViewModel, TicketRequest, Validation } from '../../models/get-log-info.model';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
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
    eventName: '',
    isCollapse: false,
    isMainMatch: true,
    isShowValidation: false,
    kickOffTime: '',
    leagueName: '',
    matchModel: new MatchModel(),
    pagingModel: new PagingModel(),
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel(),
    isHasSettledTicket: false,
    isHasInstantlySettledTicket: false,
    sportType: 0
  };
  static readonly fakeEarlyKickOffModel: EarlyKickOffModel = {
    eventDate: new Date(),
    isMainMatch: true,
    kickOffTime: '',
    matchId: 1,
    subIssueTypeId: 1,
    sportType: 0
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
    service = new LogInfoService(null, null, null, null);
  });

  it('#getLogInfo should call expected method', async () => {
    const commonService = new CommonService(null);
    commonService.getLogInfo = jest.fn().mockImplementation(() => Promise.resolve(new GetLogInfoViewModel()));
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, commonService, eventEarlyKickOffService, null);
    logInfoService['initGetLogInfoEarlyKickOffQuery'] = jest.fn();

    await logInfoService.getLogInfo(null, null, null, null);

    expect(logInfoService['initGetLogInfoEarlyKickOffQuery']).toHaveBeenCalledTimes(1);
    expect(commonService.getLogInfo).toHaveBeenCalledTimes(1);
  });


  it('#initGetLogInfoEarlyKickOffQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_HDP;
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, null, eventEarlyKickOffService, null);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoEarlyKickOffQuery'](true, 123, filter, [Helper.fakeLogInfoEarlyKickOff]);

    expect(actual).toBeDefined();
  });

  it('#initGetLogInfoEarlyKickOffQuery should return expected', async () => {
    const filter = new FilterModel();
    filter.issueTypeId = IssueTypeConstant.WRONG_1ST_HDP;
    const eventEarlyKickOffService = new EventEarlyKickOffService();
    eventEarlyKickOffService.getEarlyKickOffModel = jest.fn();
    const logInfoService = new LogInfoService(null, null, eventEarlyKickOffService, null);
    logInfoService['getTransInfo'] = jest.fn();

    const actual = logInfoService['initGetLogInfoEarlyKickOffQuery'](false, 123, filter, [Helper.fakeLogInfoEarlyKickOff]);

    expect(actual).toBeDefined();
  });

  it('#assignResultLogInfoToEvents should not update messageValidationLogInfo', async () => {
    const matchId = 1234;
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    events[0].matchId = matchId;
    const logInfoModels = _.cloneDeep([Helper.fakeGetLogInfoModel]);
    logInfoModels[0].matchId = 11111;
    logInfoModels[0].logInfoDetail.matchId = 11111;
    const logInfoService = new LogInfoService(null, null, null, null);

    logInfoService['assignResultLogInfoToEvents'](events, logInfoModels);

    expect(events.every(x => x.messageValidationLogInfo === undefined)).toBeTruthy();
  });

  it('#assignResultLogInfoToEvents should update messageValidationLogInfo when have log', async () => {
    const mainMatchId = 1234;
    const childMatchId = 1235;
    const childEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    childEvent.matchId = childMatchId;
    childEvent.isMainMatch = false;
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    mainEvent.matchId = mainMatchId;
    mainEvent.isMainMatch = true;
    const events = [childEvent, mainEvent];
    const logInfoModelsMain = _.cloneDeep(Helper.fakeGetLogInfoModel);
    logInfoModelsMain.matchId = mainMatchId;
    logInfoModelsMain.logInfoDetail.matchId = mainMatchId;
    const logInfoModelsChild = _.cloneDeep(Helper.fakeGetLogInfoModel);
    logInfoModelsChild.matchId = childMatchId;
    logInfoModelsChild.logInfoDetail.matchId = childMatchId;
    logInfoModelsChild.validation.isInvalidTotalTickets = true
    const logInfoService = new LogInfoService(null, null, null, null);

    logInfoService['assignResultLogInfoToEvents'](events, [logInfoModelsMain, logInfoModelsChild]);

    expect(events.every(x => x.messageValidationLogInfo !== undefined)).toBeTruthy();
  });

  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep([Helper.fakeLogInfoEarlyKickOff]);
    service['resetLogInfoOfEvent'](events);

    expect(events[0].messageValidationLogInfo).toBeNull();
  });

  it('#getTickets should call mockService.getLogInfo', async () => {
    const gtLogInfoViewModel = new GetLogInfoViewModel();
    gtLogInfoViewModel.transInfoAddRequestModel = new TransInfoAddRequestModel();
    const event = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    const primitiveProperty = new PrimitiveProperty();
    primitiveProperty.transInfoAddRequestModel = new TransInfoAddRequestModel();
    const httpService = new HttpService(null);
    httpService.postJson = jest.fn().mockReturnValue(new TableTicketsModel());
    const mockService = new LogInfoService(httpService, null, null, null);
    mockService.getLogInfo = jest.fn().mockReturnValue(gtLogInfoViewModel);
    mockService.assignResultLogInfoToEvents = jest.fn();

    await mockService.getTickets(new GetTicketsQuery(), event, true, 1, new FilterModel());

    expect(mockService.assignResultLogInfoToEvents).toHaveBeenCalledTimes(1);
    expect(mockService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(event.isCollapse).toBeFalsy();
  });

  it('#initQuery should return GetTicketsQuery', async () => {
    const actual = service.initQuery(1, 1, Helper.fakeLogInfoEarlyKickOff, new FilterModel());

    expect(actual.pageIndex).toBe(1);
    expect(actual.pageSize).toBe(1);
    expect(actual.match).toEqual(Helper.fakeLogInfoEarlyKickOff.matchModel);
    expect(actual.requestId ).toBeNull();
  });
});
