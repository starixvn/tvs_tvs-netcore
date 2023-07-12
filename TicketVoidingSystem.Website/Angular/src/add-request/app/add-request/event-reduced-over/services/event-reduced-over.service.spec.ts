import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MultipleSelection } from '../../../../../utility/modules/multiple-selection/multiple-selection';
import { NgSelectMixtureModel } from '../../../../../utility/modules/ng-select-mixture/ng-select-mixture.model';
import { ReducedOverModel } from '../../models/event-reduced-over.model';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { EventReducedOverService } from './event-reduced-over.service';

class Helper {
  static readonly fakeFilterReducedOverModel: FilterReducedOverModel = {
    betTypeIds: [],
    playerIds: [],
    live: true,
    nonLive: true,
    runs: '',
    wicketOver: '',
    betTypeNgSelectMixtureModel: new NgSelectMixtureModel(),
    playerMultipleSelection: new MultipleSelection()
  };
  static readonly fakeLogInfoReducedOver: LogInfoReducedOver = {
    matchId: 1,
    filterReducedOvers: [Helper.fakeFilterReducedOverModel],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
  static readonly fakeReducedOverModels: ReducedOverModel[] = [
    {
      betTypeIds: '1,2',
      live: true,
      nonLive: true,
      matchId: 1,
      playerIds: '1',
      wicketOver: '1',
      filterWicketOver: '1',
      runs: '1',
      subIssueTypeId: 1,
      logInfoDetail: new LogInfoDetail()
    }
  ];
}

describe('EventReducedOverService', () => {
  let service: EventReducedOverService;

  beforeEach(() => {
    service = new EventReducedOverService();
  });

  it('#getReducedOverGetLogInfoModel should return list objects ReducedOverGetLogInfoQuery with correct length', async () => {
    const actual = service.getReducedOverGetLogInfoModel(1, 1, [Helper.fakeFilterReducedOverModel]);

    expect(actual.length).toBe(1);
  });

  it('#getReducedOverModel should return list objects ReducedOverModel with correct length', async () => {
    const actual = service.getReducedOverModel(1, Helper.fakeLogInfoReducedOver);

    expect(actual.length).toBe(1);
  });

  it('#assignModelsToEvents should return LogInfoReducedOver with correct props', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeReducedOverModels);

    expect(actual.matchId).toBe(Helper.fakeReducedOverModels[0].matchId);
    expect(actual.logInfoDetail).toEqual(Helper.fakeReducedOverModels[0].logInfoDetail);
  });
});
