import * as _ from 'lodash';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { FilterModel } from '../../filter/filter.model';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { EventEarlyKickOffService } from './event-eko.service';

class Helper {
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
}

describe('EventEarlyKickOffService', () => {
  let service: EventEarlyKickOffService;

  beforeEach(() => {
    service = new EventEarlyKickOffService();
  });

  it('#getEarlyKickOffModel should return list objects EarlyKickOffGetLogInfoQuery with correct length', async () => {
    const models = [_.cloneDeep(Helper.fakeLogInfoEarlyKickOff)]
    const actual = service.getEarlyKickOffModel(new FilterModel(), models);

    expect(actual.length).toBe(1);
  });

  it('#initDefaultMainEvent should return mainEevent with isMainMatch = true and has kickOffTime', async () => {
    const allEvents = [];
    const actual = service.initDefaultMainEvent(allEvents, '1');

    expect(actual).toBeDefined();
    expect(actual.isMainMatch).toBeTruthy();
    expect(actual.isShowValidation).toBeFalsy();
    expect(actual.kickOffTime).toBeDefined();
  });

  it('#assignModelsToEvents should assign new item to allEvents', async () => {
    const allEvents = [_.cloneDeep(Helper.fakeLogInfoEarlyKickOff)]
    service.assignModelsToEvents(allEvents, [Helper.fakeEarlyKickOffModel], new FilterModel());

    expect(allEvents.length).toBe(2);
  });
});
