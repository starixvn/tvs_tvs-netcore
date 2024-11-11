import * as _ from 'lodash';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from "../../../../../utility/services/common.service";
import { FilterModel } from "../../filter/filter.model";
import { OtherIssuesModel } from '../../models/event-other-issues.model';
import { GetLogInfoModel, Validation } from '../../models/get-log-info.model';
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { OtherIssuesGetLogInfoQuery } from '../models/get-log-info.query';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';
import { PrimitiveProperty } from "../models/primitive-property.model";
import { EventOtherIssuesService } from './event-other-issues.service';
import { LogInfoService } from "./log-info.service";

class Helper {
  static readonly fakeOtherIssuesModel: OtherIssuesModel = {
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as OtherIssuesModel;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '26',
    subIssueTypeId: '1',
    action: '5'
  } as FilterModel;
  static readonly fakeLogInfoOtherIssues: LogInfoOtherIssues = {
    matchId: 1,
    filterOtherIssues: new FilterOtherIssuesModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  } as LogInfoOtherIssues;
  static readonly fakeFilterOtherIssues: FilterOtherIssuesModel = {
    fromDateTime: '2024-10-08 09:44:46.361 PM',
    toDateTime: '2024-10-08 09:44:46.362 PM',
  } as FilterOtherIssuesModel;
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
  let mockEventOtherIssuesService: EventOtherIssuesService;

  beforeEach(() => {
    mockCommonService = new CommonService(null);
    mockEventOtherIssuesService = new EventOtherIssuesService(null, null);
    mockService = new LogInfoService(mockCommonService, mockEventOtherIssuesService);
  });

  it('getLogInfo should call #commonService.getLogInfo', async () => {
    const transInfoAddRequest = new TransInfoAddRequestModel();
    const primitiveProps = new PrimitiveProperty();
    mockService['assignResultLogInfoToEvents'] = jest.fn();
    mockService['initGetLogInfoOtherIssuesQuery'] = jest.fn().mockReturnValue(new OtherIssuesGetLogInfoQuery());
    mockCommonService.getLogInfo = jest.fn().mockReturnValue({ transInfoAddRequestModel: transInfoAddRequest, getLogInfoModels: [] });

    await mockService.getLogInfo(Helper.fakeLogInfoOtherIssues, 1, Helper.fakeFilterModel, primitiveProps);

    expect(mockService['initGetLogInfoOtherIssuesQuery']).toHaveBeenCalledTimes(1);
    expect(mockService['assignResultLogInfoToEvents']).toHaveBeenCalledTimes(1);
    expect(mockCommonService.getLogInfo).toHaveBeenCalledTimes(1);
    expect(primitiveProps.transInfoAddRequestModel).toEqual(transInfoAddRequest);
  });

  it('assignResultLogInfoToEvents should call #commonService.getLogInfo', async () => {
    const logInfoEvent = Helper.fakeLogInfoOtherIssues;
    const logInfoModels = Helper.fakeGetLogInfoModels;
    logInfoEvent.matchId = 1;
    logInfoModels[0].matchId = 1;

    mockService['assignResultLogInfoToEvents'](logInfoEvent, logInfoModels);

    expect(logInfoEvent.isHasSettledTicket).toEqual(logInfoModels[0].validation.isHasSettledTicket);
    expect(logInfoEvent.isHasInstantlySettledTicket).toEqual(logInfoModels[0].validation.isHasInstantlySettledTicket);
    expect(logInfoEvent.logInfoDetail).toEqual(logInfoModels[0].logInfoDetail);
  });

  it('initGetLogInfoOtherIssuesQuery should return GetLogInfoQuery', async () => {
    const logInfoEvent = Helper.fakeLogInfoOtherIssues;
    logInfoEvent.messageValidationLogInfo = [];
    mockEventOtherIssuesService.initOtherIssuesGetLogInfoModel = jest.fn().mockReturnValue(new OtherIssuesGetLogInfoQuery());

    const actual = mockService['initGetLogInfoOtherIssuesQuery'](1, Helper.fakeFilterModel, logInfoEvent);

    expect(actual.actionId).toBe(Number(Helper.fakeFilterModel.action));
    expect(actual.issueTypeId).toBe(Number(Helper.fakeFilterModel.issueTypeId));
    expect(mockEventOtherIssuesService.initOtherIssuesGetLogInfoModel).toHaveBeenCalledTimes(1);
  });


  it('#resetLogInfoOfEvent should update model to null', async () => {
    const events = _.cloneDeep(Helper.fakeLogInfoOtherIssues);

    mockService['resetLogInfoOfEvent'](events);

    expect(events[0].logInfoDetail).toBeNull();
    expect(events[0].messageValidationLogInfo).toBeNull();
  });
});
