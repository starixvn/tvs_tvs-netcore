import { TestBed } from '@angular/core/testing';
import { EventWrongOuService } from './event-wrong-ou.service';
import { ValidationService } from './validation.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { FilterModel } from '../../filter/filter.model';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { SportType } from '../../../../../utility/constants/sport.constant';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeWrongOuModel = {
    matchId: 122,
    matchCode: 'TEST123',
    leagueName: 'Test League',
    name: 'Test Event',
    subIssueTypeId: 12,
    isMainMatch: true,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    actualMarket: 'MARKET',
    wrongMarket: 'WRONG_MARKET',
    logInfoDetail: null,
    isLinkGroup1X2: true,
    isLinkGroupAIO: false,
    isPoolHouseAffected: true,
    liveIndicator: 1,
    poolHouseCheckedBetTypes: 'All',
    filterBetIdX: 'X',
    filterBetIdY: 'Y',
    filterBetTypeId: '1',
    sportType: SportType.SOCCER,
    eventDate: new Date()
  } as WrongOuModel;

  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: SubIssueTypeConstant.WRONG_OU.toString(),
    action: '1',
    isTest: true,
    isVoided: false
  } as FilterModel;
}

describe('EventWrongOuService', () => {
  let service: EventWrongOuService;
  let validationService: ValidationService;
  let addRequestApiService: jest.Mocked<AddRequestApiService>;

  beforeEach(() => {
    const mockValidationService = {
      isSubTypeWrongOuOrWrong1stOu: jest.fn().mockReturnValue(false)
    };

    TestBed.configureTestingModule({
      providers: [
        EventWrongOuService,
        { provide: ValidationService, useValue: mockValidationService },
        { provide: AddRequestApiService, useValue: {
          getLinkedLogs: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongOuService);
    validationService = TestBed.inject(ValidationService);
    addRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events correctly', () => {
      // Arrange
      const allEvents: LogInfoWrongOu[] = [];
      const inputModels = [Helper.fakeWrongOuModel];

      // Act
      service.assignModelsToEvents(allEvents, inputModels);

      // Assert
      expect(allEvents.length).toBe(1);
      expect(allEvents[0].matchId).toBe(Helper.fakeWrongOuModel.matchId);
      expect(allEvents[0].matchCode).toBe(Helper.fakeWrongOuModel.matchCode);
      expect(allEvents[0].leagueName).toBe(Helper.fakeWrongOuModel.leagueName);
      expect(allEvents[0].isMainMatch).toBe(Helper.fakeWrongOuModel.isMainMatch);
      expect(allEvents[0].eventName).toBe(Helper.fakeWrongOuModel.name);
      expect(allEvents[0].logInfoDetail).toBe(Helper.fakeWrongOuModel.logInfoDetail);
      expect(allEvents[0].poolHouseCheckedBetTypes).toBe(Helper.fakeWrongOuModel.poolHouseCheckedBetTypes);
      expect(allEvents[0].isPoolHouseAffected).toBe(Helper.fakeWrongOuModel.isPoolHouseAffected);
      expect(allEvents[0].linkedLogsViewModel.isLinkGroup1X2).toBe(Helper.fakeWrongOuModel.isLinkGroup1X2);
      expect(allEvents[0].linkedLogsViewModel.isLinkGroupAIO).toBe(Helper.fakeWrongOuModel.isLinkGroupAIO);
      expect(allEvents[0].filterWrongOu.filterFromTransTime).toBe(Helper.fakeWrongOuModel.filterFromTransTime);
      expect(allEvents[0].filterWrongOu.filterToTransTime).toBe(Helper.fakeWrongOuModel.filterToTransTime);
      expect(allEvents[0].filterWrongOu.actualMarket).toBe(Helper.fakeWrongOuModel.actualMarket);
      expect(allEvents[0].filterWrongOu.wrongMarket).toBe(Helper.fakeWrongOuModel.wrongMarket);
      expect(allEvents[0].filterWrongOu.liveIndicator).toBe(Helper.fakeWrongOuModel.liveIndicator);
      expect(allEvents[0].filterWrongOu.filterBetType.filterBetIdX).toBe(Helper.fakeWrongOuModel.filterBetIdX);
      expect(allEvents[0].filterWrongOu.filterBetType.filterBetIdY).toBe(Helper.fakeWrongOuModel.filterBetIdY);
      expect(allEvents[0].filterWrongOu.filterBetType.filterBetTypeId).toBe(Helper.fakeWrongOuModel.filterBetTypeId);
      expect(allEvents[0].eventDate).toBe(Helper.fakeWrongOuModel.eventDate);
      expect(allEvents[0].sportType).toBe(Helper.fakeWrongOuModel.sportType);
    });
  });

  describe('initDefaultFilter', () => {
    it('should initialize default filter with correct values', () => {
      // Arrange
      const mainEvent = new LogInfoWrongOu();

      // Act
      service.initDefaultFilter(mainEvent);

      // Assert
      expect(mainEvent.filterWrongOu).toBeDefined();
      expect(mainEvent.filterWrongOu.actualMarket).toBe('');
      expect(mainEvent.filterWrongOu.wrongMarket).toBe('');
      expect(mainEvent.filterWrongOu.filterBetType).toBeDefined();
      expect(mainEvent.filterWrongOu.filterFromTransTime).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M/);
      expect(mainEvent.filterWrongOu.filterToTransTime).toMatch(/\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M/);
    });
  });

  describe('initDefaultMainEvent', () => {
    it('should initialize default main event with correct values', () => {
      // Arrange
      const allSelectedEvents: LogInfoWrongOu[] = [];

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

  describe('getWrongOuModel', () => {
    it('should get wrong OU model for wrong OU sub type', () => {
      // Arrange
      const events: LogInfoWrongOu[] = [{
        matchId: 123,
        isMainMatch: true,
        poolHouseCheckedBetTypes: 'All',
        filterWrongOu: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          wrongMarket: 'WRONG_MARKET',
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
      } as LogInfoWrongOu];

      (validationService as any).isSubTypeWrongOuOrWrong1stOu.mockReturnValue(true);

      // Act
      const result = service.getWrongOuModel(Helper.fakeFilterModel, events);

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
      expect(result[0].wrongMarket).toBe('WRONG_MARKET');
    });

    it('should get wrong OU model for other sub types', () => {
      // Arrange
      const events: LogInfoWrongOu[] = [{
        matchId: 123,
        isMainMatch: true,
        poolHouseCheckedBetTypes: 'All',
        filterWrongOu: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          wrongMarket: 'WRONG_MARKET',
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
      } as LogInfoWrongOu];

      (validationService as any).isSubTypeWrongOuOrWrong1stOu.mockReturnValue(false);

      // Act
      const result = service.getWrongOuModel(Helper.fakeFilterModel, events);

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
      expect(result[0].wrongMarket).toBe('WRONG_MARKET');
    });
  });

  describe('getLinkedLog', () => {
    it('should return empty LinkedLogsViewModel for non-soccer sport type', async () => {
      // Arrange
      const logInfoWrongOu = {
        sportType: SportType.BASKETBALL,
        matchId: 123,
        filterWrongOu: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          wrongMarket: 'WRONG_MARKET',
          liveIndicator: 1
        }
      } as LogInfoWrongOu;

      // Act
      const result = await service.getLinkedLog(logInfoWrongOu, Helper.fakeFilterModel);

      // Assert
      expect(result).toEqual(new LinkedLogsViewModel());
      expect(addRequestApiService.getLinkedLogs).not.toHaveBeenCalled();
    });

    it('should call getLinkedLogs for soccer sport type', async () => {
      // Arrange
      const logInfoWrongOu = {
        sportType: SportType.SOCCER,
        matchId: 123,
        filterWrongOu: {
          filterFromTransTime: Helper.fakeFromDateTime,
          filterToTransTime: Helper.fakeToDateTime,
          wrongMarket: 'WRONG_MARKET',
          liveIndicator: 1
        }
      } as LogInfoWrongOu;
      const expectedViewModel = new LinkedLogsViewModel();
      expectedViewModel.isLinkGroup1X2 = true;
      expectedViewModel.isLinkGroupAIO = false;
      addRequestApiService.getLinkedLogs.mockResolvedValue(expectedViewModel);

      // Act
      const result = await service.getLinkedLog(logInfoWrongOu, Helper.fakeFilterModel);

      // Assert
      expect(result).toBe(expectedViewModel);
      expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledWith({
        matchId: 123,
        issueTypeId: Number(Helper.fakeFilterModel.issueTypeId),
        subIssueTypeId: Number(Helper.fakeFilterModel.subIssueTypeId),
        filterFromTransTime: Helper.fakeFromDateTime,
        filterToTransTime: Helper.fakeToDateTime,
        wrongMarket: 'WRONG_MARKET',
        liveIndicator: 1
      });
    });
  });
});
