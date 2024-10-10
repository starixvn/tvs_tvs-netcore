import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { WrongMarketOfferedModel } from '../../models/event-wrong-market-offered.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongMarketOfferedModel: FilterWrongMarketOfferedModel = {
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate
  };
  static readonly fakeLogInfoWrongMarketOffered: LogInfoWrongMarketOffered = {
    matchId: 1,
    filterWrongMarketOfferedModel: Helper.fakeFilterWrongMarketOfferedModel,
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTypeCount: [],
    betTeamsResult: [],
    checkedBetTypes: []
  };
  static readonly fakeWrongMarketOfferedModel: WrongMarketOfferedModel = {
    betTypeCount: [],
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
  };
}

describe('EventWrongMarketOfferedService', () => {
  let service: EventWrongMarketOfferedService;

  beforeEach(() => {
    service = new EventWrongMarketOfferedService();
  });

  it('#getWrongMarketOfferedGetLogInfoModel should return WrongMarketOfferedGetLogInfoQuery with correct props', async () => {
    const actual = service.getWrongMarketOfferedGetLogInfoModel(1, Helper.fakeLogInfoWrongMarketOffered);

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModel.fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModel.toDateTime);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoWrongMarketOffered.betTeamsResult);
  });

  it('#getWrongMarketOfferedModel should return WrongMarketOfferedModel with correct props', async () => {
    const actual = service.getWrongMarketOfferedModel(1, Helper.fakeLogInfoWrongMarketOffered);

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModel.fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModel.toDateTime);
    expect(actual.betTypeCount).toBe(Helper.fakeLogInfoWrongMarketOffered.betTypeCount);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoWrongMarketOffered.betTeamsResult);
  });

  it('#assignModelsToEvents should return LogInfoWrongMarketOffered with correct props', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeWrongMarketOfferedModel);

    expect(actual.matchId).toBe(Helper.fakeWrongMarketOfferedModel.matchId);
    expect(actual.logInfoDetail).toEqual(Helper.fakeWrongMarketOfferedModel.logInfoDetail);
  });
});
