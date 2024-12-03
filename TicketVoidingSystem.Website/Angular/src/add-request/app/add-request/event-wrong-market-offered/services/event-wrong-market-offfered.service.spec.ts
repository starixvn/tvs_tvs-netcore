import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { WrongMarketOfferedModel } from '../../models/event-wrong-market-offered.model';
import { FilterWrongMarketOfferedModel } from '../models/filter-wrong-market-offered.model';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeFilterWrongMarketOfferedModel: FilterWrongMarketOfferedModel[] = [{
    fromDateTime: Helper.fromDate,
    toDateTime: Helper.toDate,
  }] as FilterWrongMarketOfferedModel[];
  static readonly fakeLogInfoWrongMarketOffered = {
    matchId: 1,
    filterWrongMarketOfferedModels: Helper.fakeFilterWrongMarketOfferedModel,
    betTeamsResult: []
  } as LogInfoWrongMarketOffered;
  static readonly fakeWrongMarketOfferedModel: WrongMarketOfferedModel = {
    betTypeCount: [],
    filterFromTransTime: Helper.fromDate,
    filterToTransTime: Helper.toDate,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    matchId: 1,
  } as WrongMarketOfferedModel;
}

describe('EventWrongMarketOfferedService', () => {
  let service: EventWrongMarketOfferedService;

  beforeEach(() => {
    service = new EventWrongMarketOfferedService();
  });

  it('#getWrongMarketOfferedGetLogInfoModel should return WrongMarketOfferedGetLogInfoQuery with correct props', async () => {
    const actual = service.getWrongMarketOfferedGetLogInfoModel(1, Helper.fakeLogInfoWrongMarketOffered)[0];

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModels[0].fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModels[0].toDateTime);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoWrongMarketOffered.betTeamsResult);
  });

  it('#getWrongMarketOfferedModel should return WrongMarketOfferedModel with correct props', async () => {
    const actual = service.getWrongMarketOfferedModel(1, Helper.fakeLogInfoWrongMarketOffered)[0];

    expect(actual.subIssueTypeId).toBe(1);
    expect(actual.filterFromTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModels[0].fromDateTime);
    expect(actual.filterToTransTime).toBe(Helper.fakeLogInfoWrongMarketOffered.filterWrongMarketOfferedModels[0].toDateTime);
    expect(actual.betTeamsResult).toBe(Helper.fakeLogInfoWrongMarketOffered.betTeamsResult);
  });

  it('#assignModelsToEvents should return LogInfoWrongMarketOffered with correct props', async () => {
    const actual = service.assignModelsToEvents([Helper.fakeWrongMarketOfferedModel]);

    expect(actual.matchId).toBe(Helper.fakeWrongMarketOfferedModel.matchId);
    expect(actual.logInfoItems[0].logInfoDetail).toEqual(Helper.fakeWrongMarketOfferedModel.logInfoDetail);
  });
});
