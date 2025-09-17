import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterTimeComponent } from '../filter-time/filter-time.component';
import { AdvancedModeAddRequestComponent } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockFilterTimeComponent = {
        isValidity: () => true
      } as FilterTimeComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterTimeComponent);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when matchId is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => false
      } as EventLeagueComponent;

      const mockFilterTimeComponent = {
        isValidity: () => true
      } as FilterTimeComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterTimeComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when filterTime is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockFilterTimeComponent = {
        isValidity: () => false
      } as FilterTimeComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterTimeComponent);

      // Assert
      expect(result).toBe(false);
    });

    it('should validate advancedMode when provided', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockFilterTimeComponent = {
        isValidity: () => true
      } as FilterTimeComponent;

      const mockAdvancedMode = {
        isValidity: () => true
      } as AdvancedModeAddRequestComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterTimeComponent, mockAdvancedMode);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when advancedMode is invalid', () => {
      // Arrange
      const mockEventLeagueComponent = {
        isMatchIdValid: () => true
      } as EventLeagueComponent;

      const mockFilterTimeComponent = {
        isValidity: () => true
      } as FilterTimeComponent;

      const mockAdvancedMode = {
        isValidity: () => false
      } as AdvancedModeAddRequestComponent;

      // Act
      const result = service.validateCommonData(mockEventLeagueComponent, mockFilterTimeComponent, mockAdvancedMode);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidLogInfoEvent', () => {
    it('should return true when at least one logInfoItem has no errors', () => {
      // Arrange
      const mockLogInfoWrongMarketOffered = {
        logInfoItems: [
          {
            messageValidationLogInfo: [
              { isError: false },
              { isError: false }
            ]
          },
          {
            messageValidationLogInfo: [
              { isError: true },
              { isError: false }
            ]
          }
        ]
      } as LogInfoWrongMarketOffered;

      // Act
      const result = service.isValidLogInfoEvent(mockLogInfoWrongMarketOffered);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when all logInfoItems have errors', () => {
      // Arrange
      const mockLogInfoWrongMarketOffered = {
        logInfoItems: [
          {
            messageValidationLogInfo: [
              { isError: true },
              { isError: true }
            ]
          },
          {
            messageValidationLogInfo: [
              { isError: true },
              { isError: true }
            ]
          }
        ]
      } as LogInfoWrongMarketOffered;

      // Act
      const result = service.isValidLogInfoEvent(mockLogInfoWrongMarketOffered);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when logInfoItems is empty', () => {
      // Arrange
      const mockLogInfoWrongMarketOffered = {
        logInfoItems: []
      } as LogInfoWrongMarketOffered;

      // Act
      const result = service.isValidLogInfoEvent(mockLogInfoWrongMarketOffered);

      // Assert
      expect(result).toBe(false);
    });
  });
});
