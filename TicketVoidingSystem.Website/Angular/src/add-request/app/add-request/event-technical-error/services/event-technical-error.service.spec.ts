import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { TechnicalErrorModel } from '../../models/event-technical-error.model';
import { FilterTechnicalErrorModel } from '../models/filter-technical-error.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { EventTechnicalErrorService } from './event-technical-error.service';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterTechnicalErrorModel: FilterTechnicalErrorModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
  static readonly fakeLogInfoTechnicalError: LogInfoTechnicalError = {
    matchId: 1,
    filterTechnicalErrorModel: Helper.fakeFilterTechnicalErrorModel,
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTypeCount: [],
    betTeamsResult: []
  } as LogInfoTechnicalError;
  static readonly fakeTechnicalErrorModel: TechnicalErrorModel = {
    betTypeCount: [],
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
  } as TechnicalErrorModel;
}

describe('EventTechnicalErrorService', () => {
  let service: EventTechnicalErrorService;

  beforeEach(() => {
    service = new EventTechnicalErrorService();
  });

  it('#getTechnicalErrorGetLogInfoModel should return TechnicalErrorGetLogInfoQuery with correct props', async () => {
    const actual = service.getTechnicalErrorGetLogInfoModel(1, Helper.fakeLogInfoTechnicalError);

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoTechnicalError.filterTechnicalErrorModel.fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoTechnicalError.filterTechnicalErrorModel.toDateTime);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoTechnicalError.betTeamsResult);
  });

  it('#getTechnicalErrorModel should return TechnicalErrorModel with correct props', async () => {
    const actual = service.getTechnicalErrorModel(1, Helper.fakeLogInfoTechnicalError);

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoTechnicalError.filterTechnicalErrorModel.fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoTechnicalError.filterTechnicalErrorModel.toDateTime);
    expect(actual.betTypeCount).toBe(Helper.fakeLogInfoTechnicalError.betTypeCount);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoTechnicalError.betTeamsResult);
  });

  it('#assignModelsToEvents should return LogInfoTechnicalError with correct props', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeTechnicalErrorModel);

    expect(actual.matchId).toBe(Helper.fakeTechnicalErrorModel.matchId);
    expect(actual.logInfoDetail).toEqual(Helper.fakeTechnicalErrorModel.logInfoDetail);
  });
});
