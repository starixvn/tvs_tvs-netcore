import { QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../../utility/constants/labels';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let mockBodyElement: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ValidationService]
    });

    service = TestBed.inject(ValidationService);

    // Mock document.getElementById
    mockBodyElement = document.createElement('div');
    mockBodyElement.setAttribute('user-id', '2');
    document.body.appendChild(mockBodyElement);
    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'body') {
        return mockBodyElement;
      }
      return null;
    });
  });

  afterEach(() => {
    document.body.removeChild(mockBodyElement);
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    // Arrange & Act
    const service = TestBed.inject(ValidationService);

    // Assert
    expect(service).toBeTruthy();
  });

  describe('isHasAllowanceTime', () => {
    it('should return true when aaTime is set', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 10,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when paTime is set', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 0,
          paTime: 10,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when saTime is set', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 0,
          paTime: 0,
          saTime: 10
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when all times are 0', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 0,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when no allowance time is set', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: null,
          paTime: null,
          saTime: null
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '123' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => true } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => true } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => true } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => true } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe(true);
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });

    it('should return empty string when subIssueTypeId is missing', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => true } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => true } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => true } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => true } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe('');
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });

    it('should return false when matchId is invalid', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '123' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => false } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => true } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => true } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => true } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe(false);
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });

    it('should return false when tvDetection is invalid', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '123' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => true } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => true } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => true } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => false } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe(false);
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });

    it('should return false when filterTimeArea is invalid', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '123' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => true } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => false } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => true } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => true } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe(false);
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });

    it('should return false when any logInfo component is invalid', () => {
      // Arrange
      const mockFilter = { subIssueTypeId: '123' } as FilterModel;
      const mockEventLeagueComponent = { isMatchIdValid: () => true } as EventLeagueComponent;
      const mockFilterTimeAreaComponent = { isValid: () => true } as FilterTimeAreaComponent;
      const mockLogInfoComponent = { filterTimeWithAllowanceComponent: { isValid: () => false } } as LogInfoRelatedEventComponent;
      const mockLogInfoComponents = { toArray: () => [mockLogInfoComponent] } as QueryList<LogInfoRelatedEventComponent>;
      const mockAddRequestStore = { checkValidSubIssueTypeInFilter: jest.fn() } as unknown as AddRequestStore;
      const mockTvDetectionComponent = { isValid: () => true } as TvDetectionComponent;

      // Act
      const result = service.validateCommonData(
        mockFilter,
        mockEventLeagueComponent,
        mockFilterTimeAreaComponent,
        mockLogInfoComponents,
        mockAddRequestStore,
        mockTvDetectionComponent
      );

      // Assert
      expect(result).toBe(false);
      expect(mockAddRequestStore.checkValidSubIssueTypeInFilter).toHaveBeenCalled();
    });
  });

  describe('isAllEventsValid', () => {
    it('should return true when all events are valid', () => {
      // Arrange
      const events = [
        { isMainMatch: true, messageValidationLogInfo: [{ isError: false }] },
        { isMainMatch: false, messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoRelatedEvent[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when any event is invalid', () => {
      // Arrange
      const events = [
        { isMainMatch: true, messageValidationLogInfo: [{ isError: true }] },
        { isMainMatch: false, messageValidationLogInfo: [{ isError: false }] }
      ] as LogInfoRelatedEvent[];

      // Act
      const result = service.isAllEventsValid(events);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input matchId is same as main match', () => {
      // Arrange
      const inputMatchId = 123;
      const inputMatchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoRelatedEvent[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(inputMatchIdClass, LABELS.INVALID_MATCHID);
    });

    it('should return false when input matchId already exists in related events', () => {
      // Arrange
      const inputMatchId = 456;
      const inputMatchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoRelatedEvent[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(false);
      expect(mockTooltip.display).toHaveBeenCalledWith(inputMatchIdClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
    });

    it('should return true when input matchId is valid', () => {
      // Arrange
      const inputMatchId = 789;
      const inputMatchIdClass = 'input-match-id';
      const allEvents = [
        { matchId: 123, isMainMatch: true },
        { matchId: 456, isMainMatch: false }
      ] as LogInfoRelatedEvent[];
      const mockTooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, allEvents, mockTooltip);

      // Assert
      expect(result).toBe(true);
      expect(mockTooltip.display).not.toHaveBeenCalled();
    });
  });

  describe('isEventMatchValid', () => {
    it('should return false when main match has error messages', () => {
      // Arrange
      const event = {
        isMainMatch: true,
        messageValidationLogInfo: [{ isError: true, reason: 'Some error' }]
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isEventMatchValid(event);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when non-main match has error messages not related to NO_VALID_TICKETS_IN_RANGE', () => {
      // Arrange
      const event = {
        isMainMatch: false,
        messageValidationLogInfo: [{ isError: true, reason: 'Some error' }]
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isEventMatchValid(event);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when non-main match has error messages related to NO_VALID_TICKETS_IN_RANGE', () => {
      // Arrange
      const event = {
        isMainMatch: false,
        messageValidationLogInfo: [{ isError: true, reason: LABELS.NO_VALID_TICKETS_IN_RANGE }]
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isEventMatchValid(event);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true when event has no error messages', () => {
      // Arrange
      const event = {
        isMainMatch: true,
        messageValidationLogInfo: [{ isError: false, reason: 'No error' }]
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isEventMatchValid(event);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('isEditingByAnotherUser', () => {
    it('should return true when isEdit is true and editingBy is different from createdBy', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when isEdit is false', () => {
      // Arrange
      const isEdit = false;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when editingBy is same as createdBy', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 1;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isHasWarningRangeTime', () => {
    it('should return false when fromDateTime is missing', () => {
      // Arrange
      const fromDateTime = null;
      const toDateTime = new Date();

      // Act
      const result = service.isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when toDateTime is missing', () => {
      // Arrange
      const fromDateTime = '2024-03-20T10:00:00';
      const toDateTime = null;

      // Act
      const result = service.isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBe(false);
    });

    it('should return true when time difference is more than 1 minute', () => {
      // Arrange
      const fromDateTime = '2024-03-20T10:00:00';
      const toDateTime = new Date('2024-03-20T10:02:00');

      // Act
      const result = service.isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when time difference is less than 1 minute', () => {
      // Arrange
      const fromDateTime = '2024-03-20T10:00:00';
      const toDateTime = new Date('2024-03-20T10:00:30');

      // Act
      const result = service.isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false when time difference is exactly 1 minute', () => {
      // Arrange
      const fromDateTime = '2024-03-20T10:00:00';
      const toDateTime = new Date('2024-03-20T10:01:00');

      // Act
      const result = service.isHasWarningRangeTime(fromDateTime, toDateTime);

      // Assert
      expect(result).toBe(false);
    });
  });
});
