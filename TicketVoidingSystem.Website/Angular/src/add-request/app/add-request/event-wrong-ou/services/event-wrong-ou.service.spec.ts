import * as _ from 'lodash';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
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
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
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
    poolHouseCheckedBetTypes: '',
    sportType: 0
  };
  static readonly fakeFilterModel: FilterModel = {
    subIssueTypeId: '',
    action: '',
    isTest: false,
    isAbnormal: false,
    isVoided: false
  } as FilterModel;
}

describe('EventWrongOuService', () => {
  let service: EventWrongOuService;

  beforeEach(() => {
    service = new EventWrongOuService(null);
  });

  it('#getLinkedLog should return LinkedLogsViewModel', async () => {
    const mainEvent = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    let viewModel: LinkedLogsViewModel = {
      groupLinkedLogs: [
        {
          groupName: '1X2',
          isAffectedGroup: true,
          logsData: []
        },
        {
          groupName: 'AIO',
          isAffectedGroup: true,
          logsData: []
        },
      ],
      isLinkGroup1X2: false,
      isLinkGroupAIO: false,
      result: undefined
    }
    let addRequestApiService = new AddRequestApiService(null)
    addRequestApiService.getLinkedLogs = jest.fn().mockReturnValue(viewModel);
    service = new EventWrongOuService(addRequestApiService);
    let actual = await service.getLinkedLog(mainEvent, Helper.fakeFilterModel);

    expect(actual).toBe(viewModel);
  });

  it('#getWrongOuModel should return WrongOuGetLogInfoQuery[]', async () => {
    let logInfoWrongOu: LogInfoWrongOu = {
      matchId: 0,
      leagueName: '',
      isMainMatch: true,
      eventName: '',
      isPoolHouseAffected: false,
      poolHouseCheckedBetTypes: '',
      filterWrongOu: new FilterWrongOuModel,
      logInfoDetail: new LogInfoDetail,
      linkedLogsViewModel: new LinkedLogsViewModel,
      isShowValidation: false,
      sportType: 0
    }
    let actual = await service.getWrongOuModel(Helper.fakeFilterModel, [logInfoWrongOu]);

    expect(actual.length).toBe(1);
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