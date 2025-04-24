import { TestBed } from '@angular/core/testing';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterOddsTypeConstant } from '../models/filter-wrong-odds-sports-book.model';
import { WrongOddsSportsBookModel } from '../../models/event-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';

describe('EventWrongOddsSportsBookService', () => {
  let service: EventWrongOddsSportsBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [EventWrongOddsSportsBookService]
    });

    service = TestBed.inject(EventWrongOddsSportsBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initDefaultFilter', () => {
    it('should initialize filter with default values', () => {
      // Arrange
      const logInfoEvent = new LogInfoWrongOddsSportsBook();

      // Act
      service.initDefaultFilter(logInfoEvent);

      // Assert
      expect(logInfoEvent.filterWrongOddsSportsBook).toBeDefined();
      expect(logInfoEvent.filterWrongOddsSportsBook.filterOddsType).toBe(FilterOddsTypeConstant.VALUE);
      expect(logInfoEvent.filterWrongOddsSportsBook.fromDateTime).toBeDefined();
      expect(logInfoEvent.filterWrongOddsSportsBook.toDateTime).toBeDefined();
    });
  });

  describe('initDefaultLogInfoWrongOddsSportsBook', () => {
    it('should create new LogInfoWrongOddsSportsBook with default filter', () => {
      // Act
      const result = service.initDefaultLogInfoWrongOddsSportsBook();

      // Assert
      expect(result).toBeDefined();
      expect(result.filterWrongOddsSportsBook).toBeDefined();
      expect(result.filterWrongOddsSportsBook.filterOddsType).toBe(FilterOddsTypeConstant.VALUE);
    });
  });

  describe('getWrongOddsSportsBookModel', () => {
    it('should return correct model when filterOddsType is VALUE', () => {
      // Arrange
      const logInfo = new LogInfoWrongOddsSportsBook();
      logInfo.matchId = 123;
      logInfo.filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
      logInfo.filterWrongOddsSportsBook.filterOddsType = FilterOddsTypeConstant.VALUE;
      logInfo.filterWrongOddsSportsBook.oddsValue = '1.5';

      // Act
      const result = service.getWrongOddsSportsBookModel(logInfo, '1');

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.subIssueTypeId).toBe(1);
      expect(result.filterOddsType).toBe(FilterOddsTypeConstant.VALUE);
      expect(result.oddsValue).toBe('1.5');
    });

    it('should return correct model when filterOddsType is RANGE', () => {
      // Arrange
      const logInfo = new LogInfoWrongOddsSportsBook();
      logInfo.matchId = 123;
      logInfo.filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
      logInfo.filterWrongOddsSportsBook.filterOddsType = FilterOddsTypeConstant.RANGE;
      logInfo.filterWrongOddsSportsBook.fromOdds = '1.5';
      logInfo.filterWrongOddsSportsBook.toOdds = '2.5';

      // Act
      const result = service.getWrongOddsSportsBookModel(logInfo, '1');

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.subIssueTypeId).toBe(1);
      expect(result.filterOddsType).toBe(FilterOddsTypeConstant.RANGE);
      expect(result.fromOdds).toBe('1.5');
      expect(result.toOdds).toBe('2.5');
    });
  });

  describe('assignModelsToEvents', () => {
    it('should correctly assign model properties to event', () => {
      // Arrange
      const inputModel = new WrongOddsSportsBookModel();
      inputModel.matchId = 123;
      inputModel.filterFromTransTime = '2024-01-01';
      inputModel.filterToTransTime = '2024-01-02';
      inputModel.filterOddsType = FilterOddsTypeConstant.VALUE;
      inputModel.oddsValue = '1.5';
      inputModel.correctOdds = '2.0';
      inputModel.liveIndicator = 1;

      // Act
      const result = service.assignModelsToEvents(inputModel);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.filterWrongOddsSportsBook.fromDateTime).toBe('2024-01-01');
      expect(result.filterWrongOddsSportsBook.toDateTime).toBe('2024-01-02');
      expect(result.filterWrongOddsSportsBook.filterOddsType).toBe(FilterOddsTypeConstant.VALUE);
      expect(result.filterWrongOddsSportsBook.oddsValue).toBe('1.5');
      expect(result.filterWrongOddsSportsBook.correctOdds).toBe('2.0');
      expect(result.filterWrongOddsSportsBook.liveIndicator).toBe(1);
    });
  });

  describe('getWrongOddsSportsBookGetLogInfoModel', () => {
    it('should return correct query model when filterOddsType is VALUE', () => {
      // Arrange
      const logInfo = new LogInfoWrongOddsSportsBook();
      logInfo.matchId = 123;
      logInfo.filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
      logInfo.filterWrongOddsSportsBook.filterOddsType = FilterOddsTypeConstant.VALUE;
      logInfo.filterWrongOddsSportsBook.oddsValue = '1.5';
      logInfo.filterWrongOddsSportsBook.fromDateTime = '2024-01-01';
      logInfo.filterWrongOddsSportsBook.toDateTime = '2024-01-02';
      logInfo.filterWrongOddsSportsBook.correctOdds = '2.0';
      logInfo.filterWrongOddsSportsBook.liveIndicator = 1;

      // Act
      const result = service.getWrongOddsSportsBookGetLogInfoModel(1, logInfo);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.subIssueTypeId).toBe(1);
      expect(result.filterFromTransTime).toBe('2024-01-01');
      expect(result.filterToTransTime).toBe('2024-01-02');
      expect(result.filterOddsType).toBe(FilterOddsTypeConstant.VALUE);
      expect(result.oddsValue).toBe('1.5');
      expect(result.correctOdds).toBe('2.0');
      expect(result.liveIndicator).toBe(1);
    });

    it('should return correct query model when filterOddsType is RANGE', () => {
      // Arrange
      const logInfo = new LogInfoWrongOddsSportsBook();
      logInfo.matchId = 123;
      logInfo.filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
      logInfo.filterWrongOddsSportsBook.filterOddsType = FilterOddsTypeConstant.RANGE;
      logInfo.filterWrongOddsSportsBook.fromOdds = '1.5';
      logInfo.filterWrongOddsSportsBook.toOdds = '2.5';
      logInfo.filterWrongOddsSportsBook.fromDateTime = '2024-01-01';
      logInfo.filterWrongOddsSportsBook.toDateTime = '2024-01-02';
      logInfo.filterWrongOddsSportsBook.correctOdds = '2.0';
      logInfo.filterWrongOddsSportsBook.liveIndicator = 1;

      // Act
      const result = service.getWrongOddsSportsBookGetLogInfoModel(1, logInfo);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.subIssueTypeId).toBe(1);
      expect(result.filterFromTransTime).toBe('2024-01-01');
      expect(result.filterToTransTime).toBe('2024-01-02');
      expect(result.filterOddsType).toBe(FilterOddsTypeConstant.RANGE);
      expect(result.fromOdds).toBe('1.5');
      expect(result.toOdds).toBe('2.5');
      expect(result.correctOdds).toBe('2.0');
      expect(result.liveIndicator).toBe(1);
    });
  });
});