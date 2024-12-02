import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { CommonService } from '../../../../../utility/services/common.service';
import { OtherIssuesModel } from "../../models/event-other-issues.model";
import { FilterOtherIssuesModel } from "../models/filter-other-isssues.model";
import { LogInfoOtherIssues } from "../models/log-info-other-issues.model";
import { EventOtherIssuesService } from "./event-other-issues.service";
import { ValidationService } from "./validation.service";

class Helper {
  static readonly fakeOtherIssuesModel: OtherIssuesModel = {
    filterFromTransTime: '2024-10-08 09:44:46.363 PM',
    filterToTransTime: '2024-10-08 09:44:46.364 PM',
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
    subIssueTypeId: 1
  } as OtherIssuesModel;
  static readonly fakeLogInfoOtherIssues: LogInfoOtherIssues = {
    matchId: 1,
    filterOtherIssues: new FilterOtherIssuesModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
  } as LogInfoOtherIssues;
  static readonly fakeFilterOtherIssues: FilterOtherIssuesModel = {
    fromDateTime: '2024-10-08 09:44:46.361 PM',
    toDateTime: '2024-10-08 09:44:46.362 PM',
  } as FilterOtherIssuesModel;
}

describe('EventOtherIssuesService', () => {
  let mockService: EventOtherIssuesService;
  let mockCommonService: CommonService;
  let mockValidationService: ValidationService;

  beforeEach(() => {
    mockCommonService = new CommonService(null);
    mockValidationService = new ValidationService(null);
    mockService = new EventOtherIssuesService(mockCommonService, mockValidationService);
  });

  it('initDefaultLogInfoOtherIssues should return LogInfoOtherIssues', async () => {
    const logInfo = new LogInfoOtherIssues();
    logInfo.filterOtherIssues = new FilterOtherIssuesModel();
    mockService.initDefaultFilter = jest.fn().mockReturnValue(logInfo.filterOtherIssues);
    const actual = mockService.initDefaultLogInfoOtherIssues();

    expect(actual).toEqual(logInfo);
  });

  it('initDefaultFilter should return FilterOtherIssuesModel', async () => {
    const actual = mockService.initDefaultFilter();

    expect(actual).toBeDefined();
  });

  it('initWrongMarketOfferedModel should return OtherIssuesModel', async () => {
    [true, false].forEach((isSubTypeRestart) => {
      const logInfo = new LogInfoOtherIssues();
      logInfo.filterOtherIssues = new FilterOtherIssuesModel();
      logInfo.matchId = 1;
      mockValidationService.isSubTypeRestart = jest.fn().mockReturnValue(isSubTypeRestart);
      const actual = mockService.getOtherIssuesModel(logInfo, '1');

      expect(actual.matchId).toEqual(logInfo.matchId);
      expect(actual.betTeamsResult).toEqual(logInfo.betTeamsResult);
      expect(actual.logInfoDetail).toEqual(logInfo.logInfoDetail);
      expect(actual.subIssueTypeId).toEqual(1);
    });
  });

  it('assignModelsToEvents should return LogInfoOtherIssues', async () => {
    const actual = mockService.assignModelsToEvents(Helper.fakeOtherIssuesModel);

    expect(actual.matchId).toBe(Helper.fakeOtherIssuesModel.matchId);
    expect(actual.logInfoDetail).toBe(Helper.fakeOtherIssuesModel.logInfoDetail);
    expect(actual.filterOtherIssues.fromDateTime).toBe(Helper.fakeOtherIssuesModel.filterFromTransTime);
    expect(actual.filterOtherIssues.toDateTime).toBe(Helper.fakeOtherIssuesModel.filterToTransTime);
  });

  it('initOtherIssuesGetLogInfoModel should return OtherIssuesGetLogInfoQuery ', async () => {
    [true, false].forEach((isSubTypeRestart) => {
      mockValidationService.isSubTypeRestart = jest.fn().mockReturnValue(isSubTypeRestart);
      const actual = mockService.initOtherIssuesGetLogInfoModel(1, Helper.fakeLogInfoOtherIssues);

      expect(actual.matchId).toBe(Helper.fakeOtherIssuesModel.matchId);
      expect(actual.subIssueTypeId).toBe(1);
      expect(actual.betTeamsResult).toBe(Helper.fakeOtherIssuesModel.betTeamsResult);
    });
  });
});
