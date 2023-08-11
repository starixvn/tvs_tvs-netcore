import * as _ from 'lodash';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { EventWrongOuService } from './event-wrong-ou.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoWrongOu: LogInfoWrongOu = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWrongOu: new FilterWrongOuModel(),
    logInfoDetail: null,
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: ''
  };  
  static readonly fakeWrongOuModel: WrongOuModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    actualMarket: '',
    wrongMarket: '',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    isPoolHouseAffected: true,
    liveIndicator: 1,
    poolHouseCheckedBetTypes: ''
  };
}

describe('EventWrongOuService', () => {
  let service: EventWrongOuService;

  beforeEach(() => {
    service = new EventWrongOuService(null);
  });

  it('#assignModelsToEvents should push data to #allEvents', async () => {
    const allEvents = [];

    service.assignModelsToEvents(allEvents, [Helper.fakeWrongOuModel]);

    expect(allEvents.length).toBe(1);
  });
  
  it('#initDefaultFilter should update filter data', async () => {
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoWrongOu);

    service.initDefaultFilter(mainEvent);

    expect(mainEvent.filterWrongOu.actualMarket).toBe('');
    expect(mainEvent.filterWrongOu.wrongMarket).toBe('');
  });
  
  it('#initDefaultMainEvent should call #initDefaultFilter', async () => {
    service.initDefaultFilter = jest.fn();
    const actual = service.initDefaultMainEvent([]);

    expect(actual.isMainMatch).toBeTruthy();
  });
});