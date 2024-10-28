import { TemplateValue } from '../../../../../utility/components/template-message/template-message/template.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from "../../../../../utility/models/match.model";
import { VoidedReason } from '../../../../../utility/models/reason.model';
import { CommonService } from "../../../../../utility/services/common.service";
import { FilterModel } from "../../filter/filter.model";
import { WrongOfferedNameModel } from '../../models/event-wrong-offered-name.model';
import { GetLogInfoModel, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { FilterWrongOfferedNameModel } from '../models/filter-wrong-offered-name.model';
import { WrongOfferedNameGetLogInfoQuery } from '../models/get-log-info.query';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';
import { PrimitiveProperty } from "../models/primitive-property.model";
import { EventWrongOfferedNameService } from "./event-wrong-offered-name.service";
import { LogInfoService } from "./log-info.service";


class Helper {
  static readonly fakeWrongOfferedNameModel: WrongOfferedNameModel = {
    currencyIds: '1,2',
    licenseeNames: 'licensee1,licensee2',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    match: new MatchModel(),
    subIssueTypeId: 1
  } as WrongOfferedNameModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '26',
    subIssueTypeId: '1',
    action: '5'
  } as FilterModel;
  static readonly fakeLogInfoWrongOfferedName: LogInfoWrongOfferedName = {
    matchId: 1,
    matchModel: new MatchModel(),
    filterWrongOfferedName: new FilterWrongOfferedNameModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoWrongOfferedName;
  static readonly fakeFilterWrongOfferedName: FilterWrongOfferedNameModel = {
    currencyIds: [],
    licenseeNames: []
  } as FilterWrongOfferedNameModel;
  static readonly fakeGetLogInfoModels: GetLogInfoModel[] = [
    {
      matchId: 1,
      validation: new Validation(),
      logInfoDetail: new LogInfoDetail()
    } as GetLogInfoModel
  ]
}

describe('LogInfoService', () => {
  let mockService: LogInfoService;
  let mockCommonService: CommonService;
  let mockEventWrongOfferedNameService: EventWrongOfferedNameService;

  beforeEach(() => {
    mockCommonService = new CommonService(null);
    mockEventWrongOfferedNameService = new EventWrongOfferedNameService(null, null, null, null, null);
    mockService = new LogInfoService(mockCommonService, mockEventWrongOfferedNameService);
  });

  it('getLogInfo should call #commonService.getLogInfo', async () => {
    const transInfoAddRequest = new TransInfoAddRequestModel();
    const primitiveProps = new PrimitiveProperty();
    mockService['initGetLogInfoWrongOfferedName'] = jest.fn();
    mockService.assignResultLogInfoToEvents = jest.fn();
    mockCommonService.getLogInfo = jest.fn().mockReturnValue({ transInfoAddRequestModel: transInfoAddRequest, getLogInfoModels: [] });

    await mockService.getLogInfo(Helper.fakeLogInfoWrongOfferedName, true, 1, Helper.fakeFilterModel, primitiveProps);

    expect(mockService['initGetLogInfoWrongOfferedName']).toHaveBeenCalledTimes(1);
    expect(mockService.assignResultLogInfoToEvents).toHaveBeenCalledTimes(1);
    expect(mockCommonService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(primitiveProps.transInfoAddRequest).toEqual(transInfoAddRequest);
  });

  it('assignResultLogInfoToEvents should call #commonService.getLogInfo', async () => {
    const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    const logInfoModels = Helper.fakeGetLogInfoModels;
    logInfoEvent.matchId = 1;
    logInfoModels[0].matchId = 1;
    mockEventWrongOfferedNameService.getAffectedTickets = jest.fn().mockReturnValue(new TicketsModel());
    mockEventWrongOfferedNameService.getTemplateMessageValue = jest.fn().mockReturnValue(new TemplateValue());
    mockEventWrongOfferedNameService.getTitleTableTicket = jest.fn().mockReturnValue('title');
    mockService.getVoidedReason = jest.fn().mockReturnValue(new VoidedReason());

    await mockService.assignResultLogInfoToEvents(Helper.fakeFilterModel, logInfoEvent, logInfoModels);

    expect(mockEventWrongOfferedNameService.getAffectedTickets).toHaveBeenCalledTimes(1);
    expect(mockEventWrongOfferedNameService.getTemplateMessageValue).toHaveBeenCalledTimes(1);
    expect(mockEventWrongOfferedNameService.getTitleTableTicket).toHaveBeenCalledTimes(1);
    expect(mockService.getVoidedReason).toHaveBeenCalledTimes(1);
    expect(logInfoEvent.tableTicketsModel).toEqual(new TicketsModel());
    expect(logInfoEvent.titleTableTicket ).toEqual('title');
    expect(logInfoEvent.voidReason).toEqual(new VoidedReason());
    expect(logInfoEvent.templateValue).toEqual(new TemplateValue());
  });

  it('getVoidedReason should return null', async () => {
    const actual = await mockService.getVoidedReason(true, 1, 1);

    expect(actual).toBeNull();
  });

  it('getVoidedReason should return voidedReason', async () => {
    mockCommonService.getVoidedReason = jest.fn().mockReturnValue(new VoidedReason());
    const actual = await mockService.getVoidedReason(false, 1, 1);

    expect(actual).toEqual(new VoidedReason())
  });

  it('resetLogInfoOfEvent should update messageValidationLogInfo to null', async () => {
    const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    logInfoEvent.messageValidationLogInfo = [];
    mockService.resetLogInfoOfEvent(logInfoEvent);

    expect(logInfoEvent.messageValidationLogInfo).toBeNull();
  });

  it('initGetLogInfoWrongOfferedName should return GetLogInfoQuery', async () => {
    [true, false].forEach(isEdit => {
      const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
      logInfoEvent.messageValidationLogInfo = [];
      mockService['initWrongMarketOfferedModelGetLogInfoQuery'] = jest.fn().mockReturnValue(new WrongOfferedNameGetLogInfoQuery());

      const actual = mockService['initGetLogInfoWrongOfferedName'](isEdit, 1, Helper.fakeFilterModel, logInfoEvent);

      expect(actual.actionId).toBe(Number(Helper.fakeFilterModel.action));
      expect(actual.issueTypeId).toBe(Number(Helper.fakeFilterModel.issueTypeId));
      expect(mockService['initWrongMarketOfferedModelGetLogInfoQuery']).toHaveBeenCalledTimes(1);
    });
  });

  it('initWrongMarketOfferedModelGetLogInfoQuery should return WrongOfferedNameGetLogInfoQuery', async () => {
    const logInfoEvent = Helper.fakeLogInfoWrongOfferedName;
    logInfoEvent.matchId = 1;
    logInfoEvent.filterWrongOfferedName.currencyIds = ['1', '2'];
    logInfoEvent.filterWrongOfferedName.licenseeNames = ['licensee1', 'licensee2'];

    const actual = mockService['initWrongMarketOfferedModelGetLogInfoQuery'](1, logInfoEvent);

    expect(actual.matchId).toBe(1);
    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.licenseeNames).toBe('licensee1,licensee2');
    expect(actual.currencyIds).toBe('1,2');
  });
});
