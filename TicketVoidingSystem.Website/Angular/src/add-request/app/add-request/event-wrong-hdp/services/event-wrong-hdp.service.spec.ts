import * as _ from 'lodash';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongHdpModel } from '../../models/event-wrong-hdp.model';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { ValidationService } from './validation.service';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: null,
    messageValidationLogInfo: [],
    linkedLogsViewModel: new LinkedLogsViewModel(),
    isPoolHouseAffected: true,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
  };  
  static readonly fakeWrongHdpModel: WrongHdpModel = {
    matchId: 122,
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    hdpValue: '',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    isPoolHouseAffected: true,
    poolHouseCheckedBetTypes: '',
    liveIndicator: 0,
    sportType: 0
  };
}

describe('EventWrongHdpService', () => {
  let service: EventWrongHdpService;

  beforeEach(() => {
    service = new EventWrongHdpService(null, null);
  });

  it('#assignModelsToEvents should push data to #allEvents', async () => {
    const allEvents = [];

    service.assignModelsToEvents(allEvents, [Helper.fakeWrongHdpModel]);

    expect(allEvents.length).toBe(1);
  });
  
  it('#initDefaultFilter should update filter data', async () => {
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoWrongHdp);

    service.initDefaultFilter(mainEvent);

    expect(mainEvent.filterWithHdp.actualMarket).toBe('');
    expect(mainEvent.filterWithHdp.awayFavorite).toBe('');
    expect(mainEvent.filterWithHdp.homeFavorite).toBe('');
    expect(mainEvent.filterWithHdp.hdpValue).toBe('');
  });
  
  it('#initDefaultMainEvent should call #initDefaultFilter', async () => {
    service.initDefaultFilter = jest.fn();
    const actual = service.initDefaultMainEvent([]);

    expect(actual.isMainMatch).toBeTruthy();
  });

  it('#getLinkedLog should call #addRequestApiService.getLinkedLogs', async () => {
    const mockAddRequestApiService = new AddRequestApiService(null);
    mockAddRequestApiService.getLinkedLogs = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakeLogInfoWrongHdp.linkedLogsViewModel));
    const mockService = new EventWrongHdpService(mockAddRequestApiService, null);

    mockService.getLinkedLog(Helper.fakeLogInfoWrongHdp, new FilterModel());

    expect(mockAddRequestApiService.getLinkedLogs).toHaveBeenCalledTimes(1);
  });

  it('#getWrongHdpModel should return models', async () => {
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    mainEvent.isMainMatch = true;
    const childEvent = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    childEvent.isMainMatch = false;
    const validationService = new ValidationService();

    [true, false].forEach(x => {
      validationService.isSubTypeWrongHdpOrWrong1stHdp = jest.fn().mockImplementation(() => x);
      const mockService = new EventWrongHdpService(null, validationService);

      const actual = mockService.getWrongHdpModel(new FilterModel(), [mainEvent, childEvent]);

      expect(actual.length).toBe(2);
    });
  });
});