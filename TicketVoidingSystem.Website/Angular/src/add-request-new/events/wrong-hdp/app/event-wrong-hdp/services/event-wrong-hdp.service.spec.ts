import { TestBed } from '@angular/core/testing';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { ValidationService } from './validation.service';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';
import { WrongHdpModel } from '../../../../../models/event-wrong-hdp.model';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { PoolHouseTicketValue } from '../../../../../component/pool-house-ticket/pool-house-ticket.constant';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongHdpModel = {
    matchId: 122,
    matchCode: 'TEST123',
    leagueName: 'Test League',
    name: 'Test Event',
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeFromDateTime,
    homeFavorite: 'HOME',
    awayFavorite: 'AWAY',
    actualMarket: 'MARKET',
    hdpValue: '1.5',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: false,
    isPoolHouseAffected: true,
    liveIndicator: 1,
    poolHouseCheckedBetTypes: 'All',
    filterBetIdX: 'X',
    filterBetIdY: 'Y',
    filterBetTypeId: '1',
    sportType: 1,
    eventDate: new Date()
  } as WrongHdpModel;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: SubIssueTypeConstant.WRONG_HDP.toString(),
    action: '1',
    isTest: true,
    isVoided: false
  } as FilterModel;
}

describe('EventWrongHdpService', () => {
  let service: EventWrongHdpService;
  let validationService: jest.Mocked<ValidationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventWrongHdpService,
        { provide: ValidationService, useValue: {
          isSubTypeWrongHdpOrWrong1stHdp: jest.fn()
        } },
        { provide: AddRequestApiService, useValue: {
          getLinkedLogs: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongHdpService);
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events correctly', () => {
      // Arrange
      const allEvents: LogInfoWrongHdp[] = [];
      const inputModels = [Helper.fakeWrongHdpModel];

      // Act
      service.assignModelsToEvents(allEvents, inputModels);

      // Assert
      expect(allEvents.length).toBe(1);
      expect(allEvents[0].matchId).toBe(Helper.fakeWrongHdpModel.matchId);
      expect(allEvents[0].matchCode).toBe(Helper.fakeWrongHdpModel.matchCode);
      expect(allEvents[0].leagueName).toBe(Helper.fakeWrongHdpModel.leagueName);
      expect(allEvents[0].isMainMatch).toBe(Helper.fakeWrongHdpModel.isMainMatch);
      expect(allEvents[0].eventName).toBe(Helper.fakeWrongHdpModel.name);
      expect(allEvents[0].logInfoDetail).toBe(Helper.fakeWrongHdpModel.logInfoDetail);
      expect(allEvents[0].poolHouseCheckedBetTypes).toBe(Helper.fakeWrongHdpModel.poolHouseCheckedBetTypes);
      expect(allEvents[0].isPoolHouseAffected).toBe(Helper.fakeWrongHdpModel.isPoolHouseAffected);
      expect(allEvents[0].linkedLogsViewModel.isLinkGroup1X2).toBe(Helper.fakeWrongHdpModel.isLinkGroup1X2);
      expect(allEvents[0].linkedLogsViewModel.isLinkGroupAIO).toBe(Helper.fakeWrongHdpModel.isLinkGroupAIO);
      expect(allEvents[0].filterWithHdp.filterFromTransTime).toBe(Helper.fakeWrongHdpModel.filterFromTransTime);
      expect(allEvents[0].filterWithHdp.filterToTransTime).toBe(Helper.fakeWrongHdpModel.filterToTransTime);
      expect(allEvents[0].filterWithHdp.homeFavorite).toBe(Helper.fakeWrongHdpModel.homeFavorite);
      expect(allEvents[0].filterWithHdp.awayFavorite).toBe(Helper.fakeWrongHdpModel.awayFavorite);
      expect(allEvents[0].filterWithHdp.actualMarket).toBe(Helper.fakeWrongHdpModel.actualMarket);
      expect(allEvents[0].filterWithHdp.hdpValue).toBe(Helper.fakeWrongHdpModel.hdpValue);
      expect(allEvents[0].filterWithHdp.liveIndicator).toBe(Helper.fakeWrongHdpModel.liveIndicator);
      expect(allEvents[0].filterWithHdp.filterBetType.filterBetIdX).toBe(Helper.fakeWrongHdpModel.filterBetIdX);
      expect(allEvents[0].filterWithHdp.filterBetType.filterBetIdY).toBe(Helper.fakeWrongHdpModel.filterBetIdY);
      expect(allEvents[0].filterWithHdp.filterBetType.filterBetTypeId).toBe(Helper.fakeWrongHdpModel.filterBetTypeId);
      expect(allEvents[0].eventDate).toBe(Helper.fakeWrongHdpModel.eventDate);
      expect(allEvents[0].sportType).toBe(Helper.fakeWrongHdpModel.sportType);
    });
  });

  describe('initDefaultFilter', () => {
    it('should initialize default filter with correct values', () => {
      // Arrange
      const mainEvent = new LogInfoWrongHdp();

      // Act
      service.initDefaultFilter(mainEvent);

      // Assert
      expect(mainEvent.filterWithHdp).toBeDefined();
      expect(mainEvent.filterWithHdp.actualMarket).toBe('');
      expect(mainEvent.filterWithHdp.awayFavorite).toBe('');
      expect(mainEvent.filterWithHdp.homeFavorite).toBe('');
      expect(mainEvent.filterWithHdp.hdpValue).toBe('');
      expect(mainEvent.filterWithHdp.filterBetType).toBeDefined();
      expect(mainEvent.filterWithHdp.filterFromTransTime).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M/);
      expect(mainEvent.filterWithHdp.filterToTransTime).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M/);
    });
  });

  describe('initDefaultMainEvent', () => {
    it('should initialize default main event with correct values', () => {
      // Arrange
      const allSelectedEvents: LogInfoWrongHdp[] = [];

      // Act
      const result = service.initDefaultMainEvent(allSelectedEvents);

      // Assert
      expect(result).toBeDefined();
      expect(result.isMainMatch).toBe(true);
      expect(result.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
      expect(allSelectedEvents.length).toBe(1);
      expect(allSelectedEvents[0]).toBe(result);
    });
  });

  describe('getWrongHdpModel', () => {
    it('should get wrong HDP model for wrong HDP sub type', () => {
      // Arrange
      const events: LogInfoWrongHdp[] = [{
        matchId: 123,
        isMainMatch: true,
        poolHouseCheckedBetTypes: 'All',
        filterWithHdp: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          homeFavorite: 'HOME',
          awayFavorite: 'AWAY',
          liveIndicator: 1,
          filterBetType: {
            filterBetIdX: 'X',
            filterBetIdY: 'Y',
            filterBetTypeId: '1'
          }
        },
        linkedLogsViewModel: {
          isLinkGroup1X2: true,
          isLinkGroupAIO: false
        }
      } as LogInfoWrongHdp];

      validationService.isSubTypeWrongHdpOrWrong1stHdp.mockReturnValue(true);

      // Act
      const result = service.getWrongHdpModel(Helper.fakeFilterModel, events);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].subIssueTypeId).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
      expect(result[0].poolHouseCheckedBetTypes).toBe('All');
      expect(result[0].isMainMatch).toBe(true);
      expect(result[0].filterFromTransTime).toBe(Helper.fakeFromDateTime);
      expect(result[0].filterToTransTime).toBe(Helper.fakeToDateTime);
      expect(result[0].liveIndicator).toBe(1);
      expect(result[0].filterBetTypeId).toBe('1');
      expect(result[0].filterBetIdX).toBe('X');
      expect(result[0].filterBetIdY).toBe('Y');
      expect(result[0].isLinkGroup1X2).toBe(true);
      expect(result[0].isLinkGroupAIO).toBe(false);
      expect(result[0].homeFavorite).toBe('HOME');
      expect(result[0].awayFavorite).toBe('AWAY');
    });

    it('should get wrong HDP model for other sub types', () => {
      // Arrange
      const events: LogInfoWrongHdp[] = [{
        matchId: 123,
        isMainMatch: true,
        poolHouseCheckedBetTypes: 'All',
        filterWithHdp: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          hdpValue: '1.5',
          liveIndicator: 1,
          filterBetType: {
            filterBetIdX: 'X',
            filterBetIdY: 'Y',
            filterBetTypeId: '1'
          }
        },
        linkedLogsViewModel: {
          isLinkGroup1X2: true,
          isLinkGroupAIO: false
        }
      } as LogInfoWrongHdp];

      validationService.isSubTypeWrongHdpOrWrong1stHdp.mockReturnValue(false);

      // Act
      const result = service.getWrongHdpModel(Helper.fakeFilterModel, events);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].subIssueTypeId).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
      expect(result[0].poolHouseCheckedBetTypes).toBe('All');
      expect(result[0].isMainMatch).toBe(true);
      expect(result[0].filterFromTransTime).toBe(Helper.fakeFromDateTime);
      expect(result[0].filterToTransTime).toBe(Helper.fakeToDateTime);
      expect(result[0].liveIndicator).toBe(1);
      expect(result[0].filterBetTypeId).toBe('1');
      expect(result[0].filterBetIdX).toBe('X');
      expect(result[0].filterBetIdY).toBe('Y');
      expect(result[0].isLinkGroup1X2).toBe(true);
      expect(result[0].isLinkGroupAIO).toBe(false);
      expect(result[0].hdpValue).toBe('1.5');
    });
  });
});
