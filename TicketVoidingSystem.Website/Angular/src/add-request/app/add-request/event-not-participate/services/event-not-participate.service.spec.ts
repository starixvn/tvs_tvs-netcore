import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { NotParticipateModel } from '../../models/event-not-participate.model';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { EventNotParticipateService } from './event-not-participate.service';

class Helper {
  static readonly fakeFilterNotParticipateModel: FilterNotParticipateModel = {
    playerId: 1,
    groupBetTypeIds: [],
    groupBetTypeMultipleSelection: new MultipleSelection()
  };
  static readonly fakeLogInfoNotParticipate: LogInfoNotParticipate = {
    matchId: 1,
    filterNotParticipates: [Helper.fakeFilterNotParticipateModel],
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: []
  };
  static readonly fakeNotParticipateModels: NotParticipateModel[] = [
    {
      betTypeId: 1,
      playerIds: '1',
      subIssueTypeId: 1,
      logInfoDetail: new LogInfoDetail(),
      matchId: 1,
      playerNames: ''
    }
  ];
}

describe('EventNotParticipateService', () => {
  let service: EventNotParticipateService;

  beforeEach(() => {
    service = new EventNotParticipateService();
  });

  it('#getNotParticipateGetLogInfoModel should return list objects NotParticipateGetLogInfoQuery with correct length', async () => {
    const actual = service.getNotParticipateGetLogInfoModel(1, 1, [Helper.fakeFilterNotParticipateModel]);

    expect(actual.length).toBe(1);
  });

  it('#getNotParticipateModel should return list objects NotParticipateModel with correct length', async () => {
    const actual = service.getNotParticipateModel(1, Helper.fakeLogInfoNotParticipate);

    expect(actual.length).toBe(1);
  });

  it('#assignModelsToEvents should return LogInfoNotParticipate with correct props', async () => {
    const actual = service.assignModelsToEvents(Helper.fakeNotParticipateModels);

    expect(actual.matchId).toBe(Helper.fakeNotParticipateModels[0].matchId);
    expect(actual.logInfoDetail).toEqual(Helper.fakeNotParticipateModels[0].logInfoDetail);
  });
});
