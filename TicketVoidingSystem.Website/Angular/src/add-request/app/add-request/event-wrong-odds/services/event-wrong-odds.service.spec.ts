import { TestBed } from '@angular/core/testing';
import { AllowanceRate } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { FilterFavoriteTypeConstant, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeSubIssueTypeId = 1;
  static readonly fakeSportType = 1;

  static getFakeLogInfoWrongOdds(): LogInfoWrongOdds {
    const event = new LogInfoWrongOdds();
    event.matchId = Helper.fakeMatchId;
    event.sportType = Helper.fakeSportType;
    event.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    event.isPoolHouseAffected = false;
    event.filterWrongOdds = new FilterWrongOddsModel();
    event.filterWrongOdds.spread = '0.5';
    event.linkedLogsViewModel = {
      isLinkGroup1X2: false,
      isLinkGroupAIO: false,
      result: null
    } as LinkedLogsViewModel;
    return event;
  }

  static getFakeWrongOddsModel(): WrongOddsModel {
    const model = new WrongOddsModel();
    model.matchId = Helper.fakeMatchId;
    model.subIssueTypeId = Helper.fakeSubIssueTypeId;
    model.sportType = Helper.fakeSportType;
    model.filterFromTransTime = '2024-03-20T10:00:00';
    model.filterToTransTime = '2024-03-20T11:00:00';
    model.liveIndicator = 1;
    model.spread = '0.5';
    model.allowanceRate = AllowanceRate.Twenty;
    model.correctOddsHomeOver = '1.5';
    model.correctOddsAwayUnder = '2.5';
    model.fromOddsNotVoidHomeOver = '1.0';
    model.toOddsNotVoidHomeOver = '2.0';
    model.fromOddsNotVoidAwayUnder = '2.0';
    model.toOddsNotVoidAwayUnder = '3.0';
    model.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    model.isPoolHouseAffected = false;
    model.isLinkGroup1X2 = false;
    model.isLinkGroupAIO = false;
    model.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
    model.favoriteValue = '1.5';
    return model;
  }

  static getFakeFilterModel(): FilterModel {
    const filter = new FilterModel();
    filter.issueTypeId = '2';
    filter.subIssueTypeId = Helper.fakeSubIssueTypeId.toString();
    return filter;
  }

  static getFakeWrongOddsModelForOu(): WrongOddsModel {
    const model = Helper.getFakeWrongOddsModel();
    model.wrongOU = '2.5';
    return model;
  }

  static getFakeLinkedLogsViewModel(): LinkedLogsViewModel {
    return {
      isLinkGroup1X2: true,
      isLinkGroupAIO: false,
      result: null
    } as LinkedLogsViewModel;
  }
}

describe('EventWrongOddsService', () => {
  let service: EventWrongOddsService;
  let addRequestApiService: jest.Mocked<AddRequestApiService>;
  let validationService: jest.Mocked<ValidationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventWrongOddsService,
        { provide: AddRequestApiService, useValue: {
          getLinkedLogs: jest.fn()
        } },
        { provide: ValidationService, useValue: {
          isSubTypeOuOr1stOu: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongOddsService);
    addRequestApiService = TestBed.inject(AddRequestApiService) as jest.Mocked<AddRequestApiService>;
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultFilter', () => {
    it('should initialize default filter with correct values', () => {
      // Arrange
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();

      // Act
      service.initDefaultFilter(logInfoEvent);

      // Assert
      expect(logInfoEvent.filterWrongOdds).toBeDefined();
      expect(logInfoEvent.filterWrongOdds.filterFavoriteType).toBe(FilterFavoriteTypeConstant.HOME);
      expect(logInfoEvent.filterWrongOdds.allowanceRate).toBe(AllowanceRate.ALLOWANCE_RATE[0].value);
      expect(logInfoEvent.filterWrongOdds.filterToTransTime).toMatch(
        /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3} [AP]M$/
      );
    });
  });

  describe('initDefaultLogInfoWrongOdds', () => {
    it('should initialize default log info wrong odds with correct values', () => {
      // Act
      const result = service.initDefaultLogInfoWrongOdds();

      // Assert
      expect(result).toBeDefined();
      expect(result.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
      expect(result.filterWrongOdds).toBeDefined();
      expect(result.filterWrongOdds.filterFavoriteType).toBe(FilterFavoriteTypeConstant.HOME);
      expect(result.filterWrongOdds.allowanceRate).toBe(AllowanceRate.ALLOWANCE_RATE[0].value);
    });
  });

  describe('getLinkedLog', () => {
    it('should get linked log for non-OU sub type', async () => {
      // Arrange
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();
      const filter = Helper.getFakeFilterModel();
      const mockLinkedLogsViewModel = Helper.getFakeLinkedLogsViewModel();
      
      logInfoEvent.filterWrongOdds.filterFromTransTime = '2024-03-20T10:00:00';
      logInfoEvent.filterWrongOdds.filterToTransTime = '2024-03-20T11:00:00';
      logInfoEvent.filterWrongOdds.liveIndicator = 1;
      logInfoEvent.filterWrongOdds.spread = '0.5';
      logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.Twenty;
      logInfoEvent.filterWrongOdds.correctOddsAwayUnder = '2.5';
      logInfoEvent.filterWrongOdds.correctOddsHomeOver = '1.5';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder = '2.0';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver = '1.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder = '3.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver = '2.0';
      logInfoEvent.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
      logInfoEvent.filterWrongOdds.favoriteValue = '1.5';

      validationService.isSubTypeOuOr1stOu.mockReturnValue(false);
      addRequestApiService.getLinkedLogs.mockResolvedValue(mockLinkedLogsViewModel);

      // Act
      const result = await service.getLinkedLog(logInfoEvent, filter);

      // Assert
      expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledWith({
        matchId: logInfoEvent.matchId,
        issueTypeId: Number(filter.issueTypeId),
        subIssueTypeId: Number(filter.subIssueTypeId),
        filterFromTransTime: logInfoEvent.filterWrongOdds.filterFromTransTime,
        filterToTransTime: logInfoEvent.filterWrongOdds.filterToTransTime,
        liveIndicator: logInfoEvent.filterWrongOdds.liveIndicator,
        spread: logInfoEvent.filterWrongOdds.spread.toString(),
        allowanceRate: logInfoEvent.filterWrongOdds.allowanceRate,
        correctOddsAwayUnder: logInfoEvent.filterWrongOdds.correctOddsAwayUnder,
        correctOddsHomeOver: logInfoEvent.filterWrongOdds.correctOddsHomeOver,
        fromOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder,
        fromOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver,
        toOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder,
        toOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver,
        filterFavoriteType: logInfoEvent.filterWrongOdds.filterFavoriteType,
        favoriteValue: logInfoEvent.filterWrongOdds.favoriteValue
      });
      expect(result).toBe(mockLinkedLogsViewModel);
    });

    it('should get linked log for OU sub type', async () => {
      // Arrange
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();
      const filter = Helper.getFakeFilterModel();
      const mockLinkedLogsViewModel = Helper.getFakeLinkedLogsViewModel();
      
      logInfoEvent.filterWrongOdds.wrongOU = '2.5';
      logInfoEvent.filterWrongOdds.filterFromTransTime = '2024-03-20T10:00:00';
      logInfoEvent.filterWrongOdds.filterToTransTime = '2024-03-20T11:00:00';
      logInfoEvent.filterWrongOdds.liveIndicator = 1;
      logInfoEvent.filterWrongOdds.spread = '0.5';
      logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.Twenty;
      logInfoEvent.filterWrongOdds.correctOddsAwayUnder = '2.5';
      logInfoEvent.filterWrongOdds.correctOddsHomeOver = '1.5';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder = '2.0';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver = '1.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder = '3.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver = '2.0';

      validationService.isSubTypeOuOr1stOu.mockReturnValue(true);
      addRequestApiService.getLinkedLogs.mockResolvedValue(mockLinkedLogsViewModel);

      // Act
      const result = await service.getLinkedLog(logInfoEvent, filter);

      // Assert
      expect(addRequestApiService.getLinkedLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          wrongOU: logInfoEvent.filterWrongOdds.wrongOU
        })
      );
      expect(result).toBe(mockLinkedLogsViewModel);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();
      const filter = Helper.getFakeFilterModel();
      
      logInfoEvent.filterWrongOdds.filterFromTransTime = '2024-03-20T10:00:00';
      logInfoEvent.filterWrongOdds.filterToTransTime = '2024-03-20T11:00:00';
      logInfoEvent.filterWrongOdds.liveIndicator = 1;
      logInfoEvent.filterWrongOdds.spread = '0.5';
      logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.Twenty;
      logInfoEvent.filterWrongOdds.correctOddsAwayUnder = '2.5';
      logInfoEvent.filterWrongOdds.correctOddsHomeOver = '1.5';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder = '2.0';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver = '1.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder = '3.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver = '2.0';

      validationService.isSubTypeOuOr1stOu.mockReturnValue(false);
      addRequestApiService.getLinkedLogs.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(service.getLinkedLog(logInfoEvent, filter))
        .rejects.toThrow('API error');
    });
  });

  describe('getWrongOddsModel', () => {
    it('should get wrong odds model for non-OU sub type', () => {
      // Arrange
      const filter = Helper.getFakeFilterModel();
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();
      logInfoEvent.linkedLogsViewModel = Helper.getFakeLinkedLogsViewModel();
      logInfoEvent.filterWrongOdds.filterFromTransTime = '2024-03-20T10:00:00';
      logInfoEvent.filterWrongOdds.filterToTransTime = '2024-03-20T11:00:00';
      logInfoEvent.filterWrongOdds.liveIndicator = 1;
      logInfoEvent.filterWrongOdds.spread = '0.5';
      logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.Twenty;
      logInfoEvent.filterWrongOdds.correctOddsAwayUnder = '2.5';
      logInfoEvent.filterWrongOdds.correctOddsHomeOver = '1.5';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder = '2.0';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver = '1.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder = '3.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver = '2.0';
      logInfoEvent.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
      logInfoEvent.filterWrongOdds.favoriteValue = '1.5';

      validationService.isSubTypeOuOr1stOu.mockReturnValue(false);

      // Act
      const result = service.getWrongOddsModel(filter, logInfoEvent);

      // Assert
      expect(result).toBeDefined();
      expect(result.matchId).toBe(logInfoEvent.matchId);
      expect(result.subIssueTypeId).toBe(Number(filter.subIssueTypeId));
      expect(result.poolHouseCheckedBetTypes).toBe(logInfoEvent.poolHouseCheckedBetTypes);
      expect(result.filterFromTransTime).toBe(logInfoEvent.filterWrongOdds.filterFromTransTime);
      expect(result.filterToTransTime).toBe(logInfoEvent.filterWrongOdds.filterToTransTime);
      expect(result.liveIndicator).toBe(logInfoEvent.filterWrongOdds.liveIndicator);
      expect(result.isLinkGroup1X2).toBe(logInfoEvent.linkedLogsViewModel.isLinkGroup1X2);
      expect(result.isLinkGroupAIO).toBe(logInfoEvent.linkedLogsViewModel.isLinkGroupAIO);
      expect(result.spread).toBe(logInfoEvent.filterWrongOdds.spread.toString());
      expect(result.allowanceRate).toBe(logInfoEvent.filterWrongOdds.allowanceRate);
      expect(result.correctOddsAwayUnder).toBe(logInfoEvent.filterWrongOdds.correctOddsAwayUnder);
      expect(result.correctOddsHomeOver).toBe(logInfoEvent.filterWrongOdds.correctOddsHomeOver);
      expect(result.fromOddsNotVoidAwayUnder).toBe(logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder);
      expect(result.fromOddsNotVoidHomeOver).toBe(logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver);
      expect(result.toOddsNotVoidAwayUnder).toBe(logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder);
      expect(result.toOddsNotVoidHomeOver).toBe(logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver);
      expect(result.filterFavoriteType).toBe(logInfoEvent.filterWrongOdds.filterFavoriteType);
      expect(result.favoriteValue).toBe(logInfoEvent.filterWrongOdds.favoriteValue);
      expect(result.wrongOU).toBeUndefined();
    });

    it('should get wrong odds model for OU sub type', () => {
      // Arrange
      const filter = Helper.getFakeFilterModel();
      const logInfoEvent = Helper.getFakeLogInfoWrongOdds();
      logInfoEvent.linkedLogsViewModel = Helper.getFakeLinkedLogsViewModel();
      logInfoEvent.filterWrongOdds.wrongOU = '2.5';
      logInfoEvent.filterWrongOdds.filterFromTransTime = '2024-03-20T10:00:00';
      logInfoEvent.filterWrongOdds.filterToTransTime = '2024-03-20T11:00:00';
      logInfoEvent.filterWrongOdds.liveIndicator = 1;
      logInfoEvent.filterWrongOdds.spread = '0.5';
      logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.Twenty;
      logInfoEvent.filterWrongOdds.correctOddsAwayUnder = '2.5';
      logInfoEvent.filterWrongOdds.correctOddsHomeOver = '1.5';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder = '2.0';
      logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver = '1.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder = '3.0';
      logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver = '2.0';

      validationService.isSubTypeOuOr1stOu.mockReturnValue(true);

      // Act
      const result = service.getWrongOddsModel(filter, logInfoEvent);

      // Assert
      expect(result).toBeDefined();
      expect(result.wrongOU).toBe(logInfoEvent.filterWrongOdds.wrongOU);
      expect(result.filterFavoriteType).toBeUndefined();
      expect(result.favoriteValue).toBeUndefined();
    });
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events for non-OU sub type', () => {
      // Arrange
      const inputModels = Helper.getFakeWrongOddsModel();
      validationService.isSubTypeOuOr1stOu.mockReturnValue(false);

      // Act
      const result = service.assignModelsToEvents(inputModels);

      // Assert
      expect(result).toBeDefined();
      expect(result.matchId).toBe(inputModels.matchId);
      expect(result.sportType).toBe(inputModels.sportType);
      expect(result.poolHouseCheckedBetTypes).toBe(inputModels.poolHouseCheckedBetTypes);
      expect(result.isPoolHouseAffected).toBe(inputModels.isPoolHouseAffected);
      expect(result.linkedLogsViewModel.isLinkGroup1X2).toBe(inputModels.isLinkGroup1X2);
      expect(result.linkedLogsViewModel.isLinkGroupAIO).toBe(inputModels.isLinkGroupAIO);
      expect(result.filterWrongOdds.filterFromTransTime).toBe(inputModels.filterFromTransTime);
      expect(result.filterWrongOdds.filterToTransTime).toBe(inputModels.filterToTransTime);
      expect(result.filterWrongOdds.liveIndicator).toBe(inputModels.liveIndicator);
      expect(result.filterWrongOdds.spread).toBe(inputModels.spread);
      expect(result.filterWrongOdds.allowanceRate).toBe(inputModels.allowanceRate);
      expect(result.filterWrongOdds.correctOddsHomeOver).toBe(inputModels.correctOddsHomeOver);
      expect(result.filterWrongOdds.correctOddsAwayUnder).toBe(inputModels.correctOddsAwayUnder);
      expect(result.filterWrongOdds.fromOddsNotVoidHomeOver).toBe(inputModels.fromOddsNotVoidHomeOver);
      expect(result.filterWrongOdds.toOddsNotVoidHomeOver).toBe(inputModels.toOddsNotVoidHomeOver);
      expect(result.filterWrongOdds.fromOddsNotVoidAwayUnder).toBe(inputModels.fromOddsNotVoidAwayUnder);
      expect(result.filterWrongOdds.toOddsNotVoidAwayUnder).toBe(inputModels.toOddsNotVoidAwayUnder);
      expect(result.filterWrongOdds.filterFavoriteType).toBe(inputModels.filterFavoriteType);
      expect(result.filterWrongOdds.favoriteValue).toBe(inputModels.favoriteValue);
      expect(result.filterWrongOdds.wrongOU).toBeUndefined();
    });

    it('should assign models to events for OU sub type', () => {
      // Arrange
      const inputModels = Helper.getFakeWrongOddsModelForOu();
      validationService.isSubTypeOuOr1stOu.mockReturnValue(true);

      // Act
      const result = service.assignModelsToEvents(inputModels);

      // Assert
      expect(result).toBeDefined();
      expect(result.filterWrongOdds.wrongOU).toBe(inputModels.wrongOU);
      expect(result.filterWrongOdds.filterFavoriteType).toBe(FilterFavoriteTypeConstant.HOME);
      expect(result.filterWrongOdds.favoriteValue).toBeUndefined();
    });

    it('should handle missing optional properties gracefully', () => {
      // Arrange
      const inputModels = Helper.getFakeWrongOddsModel();
      inputModels.filterFavoriteType = undefined;
      inputModels.favoriteValue = undefined;
      inputModels.wrongOU = undefined;
      validationService.isSubTypeOuOr1stOu.mockReturnValue(false);

      // Act
      const result = service.assignModelsToEvents(inputModels);

      // Assert
      expect(result).toBeDefined();
      expect(result.filterWrongOdds.filterFavoriteType).toBeUndefined();
      expect(result.filterWrongOdds.favoriteValue).toBeUndefined();
      expect(result.filterWrongOdds.wrongOU).toBeUndefined();
    });
  });
});
