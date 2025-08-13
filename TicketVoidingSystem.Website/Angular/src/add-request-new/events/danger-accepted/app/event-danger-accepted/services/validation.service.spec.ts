import { QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../../utility/constants/labels';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { FilterTimeAreaComponent } from '../../../../red-card/app/event-red-card/filter-time-area/filter-time-area.component';
import { AddRequestStore } from '../../../../services/add-request.store';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;
  let eventLeagueComponent: EventLeagueComponent;
  let filterTimeAreaComponent: FilterTimeAreaComponent;
  let tvDetectionComponent: TvDetectionComponent;
  let addRequestStore: AddRequestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ValidationService,
        {
          provide: EventLeagueComponent,
          useValue: { isMatchIdValid: jest.fn().mockReturnValue(true) }
        },
        {
          provide: FilterTimeAreaComponent,
          useValue: { isValid: jest.fn().mockReturnValue(true) }
        },
        {
          provide: TvDetectionComponent,
          useValue: { isValid: jest.fn().mockReturnValue(true) }
        },
        {
          provide: AddRequestStore,
          useValue: { checkValidSubIssueTypeInFilter: jest.fn() }
        }
      ]
    });

    service = TestBed.inject(ValidationService);
    eventLeagueComponent = TestBed.inject(EventLeagueComponent);
    filterTimeAreaComponent = TestBed.inject(FilterTimeAreaComponent);
    tvDetectionComponent = TestBed.inject(TvDetectionComponent);
    addRequestStore = TestBed.inject(AddRequestStore);
  });

  describe('isHasAllowanceTime', () => {
    it('should return true when all time values are 0', () => {
      const event: LogInfoRelatedEvent = {
        voidTimeArea: { paTime: 0, aaTime: 0, saTime: 0 }
      } as LogInfoRelatedEvent;

      expect(service.isHasAllowanceTime(event)).toBe(true);
    });

    it('should return true when any time value is set', () => {
      const event: LogInfoRelatedEvent = {
        voidTimeArea: { paTime: 5, aaTime: 0, saTime: 0 }
      } as LogInfoRelatedEvent;

      expect(service.isHasAllowanceTime(event)).toBe(true);
    });

    it('should return false when all time values are null', () => {
      const event: LogInfoRelatedEvent = {
        voidTimeArea: { paTime: null, aaTime: null, saTime: null }
      } as LogInfoRelatedEvent;

      expect(service.isHasAllowanceTime(event)).toBe(false);
    });
  });

  describe('validateCommonData', () => {
    it('should return true when all validations pass', () => {
      const filter = {
        subIssueTypeId: '1',
        action: '',
        isTest: false,
        isAbnormal: false,
        isVoided: false,
        actions: []
      } as FilterModel;
      const logInfoComponents = {
        toArray: () => [{
          filterTimeWithAllowanceComponent: { isValid: () => true }
        }]
      } as QueryList<LogInfoRelatedEventComponent>;
      const result = service.validateCommonData(
        filter,
        eventLeagueComponent,
        filterTimeAreaComponent,
        logInfoComponents,
        addRequestStore,
        tvDetectionComponent
      );

      expect(result).toBe(true);
    });

    it('should return false when subIssueTypeId is missing', () => {
      const filter = {
        subIssueTypeId: undefined,
        action: '',
        isTest: false,
        isAbnormal: false,
        isVoided: false,
        actions: []
      } as FilterModel;
      const logInfoComponents = {
        toArray: () => [{
          filterTimeWithAllowanceComponent: { isValid: () => true }
        }]
      } as QueryList<LogInfoRelatedEventComponent>;

      const result = service.validateCommonData(
        filter,
        eventLeagueComponent,
        filterTimeAreaComponent,
        logInfoComponents,
        addRequestStore,
        tvDetectionComponent
      );

      expect(!result).toBe(true);
    });
  });

  describe('isAllEventsValid', () => {
    it('should return true when all events are valid', () => {
      const events: LogInfoRelatedEvent[] = [
        {
          isMainMatch: true,
          messageValidationLogInfo: [{ isError: false }]
        } as LogInfoRelatedEvent,
        {
          isMainMatch: false,
          messageValidationLogInfo: [{ isError: false }]
        } as LogInfoRelatedEvent
      ];

      expect(service.isAllEventsValid(events)).toBe(true);
    });

    it('should return false when main match has errors', () => {
      const events: LogInfoRelatedEvent[] = [
        {
          isMainMatch: true,
          messageValidationLogInfo: [{ isError: true }]
        } as LogInfoRelatedEvent
      ];

      expect(service.isAllEventsValid(events)).toBe(false);
    });
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input matchId equals main match', () => {
      const allEvents: LogInfoRelatedEvent[] = [
        { isMainMatch: true, matchId: 1 } as LogInfoRelatedEvent
      ];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;
      const result = service.isValidInputRelatedEvent(1, 'test-class', allEvents, tooltip);

      expect(result).toBe(false);
      expect(tooltip.display).toHaveBeenCalledWith('test-class', LABELS.INVALID_MATCHID);
    });

    it('should return false when matchId exists in non-main matches', () => {
      const allEvents: LogInfoRelatedEvent[] = [
        { isMainMatch: true, matchId: 1 } as LogInfoRelatedEvent,
        { isMainMatch: false, matchId: 2 } as LogInfoRelatedEvent
      ];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;
      const result = service.isValidInputRelatedEvent(2, 'test-class', allEvents, tooltip);

      expect(result).toBe(false);
      expect(tooltip.display).toHaveBeenCalledWith('test-class', LABELS.MATCH_ID_EXISTS_IN_LIST);
    });
  });

  describe('isEditingByAnotherUser', () => {
    it('should return true when editing by different user', () => {
      expect(service.isEditingByAnotherUser(true, 1, 2)).toBe(true);
    });

    it('should return false when editing by same user', () => {
      expect(service.isEditingByAnotherUser(true, 1, 1)).toBe(false);
    });

    it('should return false when not editing', () => {
      expect(service.isEditingByAnotherUser(false, 1, 2)).toBe(false);
    });
  });

  describe('isHasWarningRangeTime', () => {
    it('should return false when inputs are null or empty', () => {
      expect(service.isHasWarningRangeTime(null, null)).toBe(false);
      expect(service.isHasWarningRangeTime('', null)).toBe(false);
      expect(service.isHasWarningRangeTime(null, new Date())).toBe(false);
    });

    it('should return true when time difference is more than 1 minute', () => {
      const fromDateTime = '2024-01-01 10:00:00';
      const toDateTime = new Date('2024-01-01 10:02:00');

      expect(service.isHasWarningRangeTime(fromDateTime, toDateTime)).toBe(true);
    });

    it('should return false when time difference is less than 1 minute', () => {
      const fromDateTime = '2024-01-01 10:00:00';
      const toDateTime = new Date('2024-01-01 10:00:30');

      expect(service.isHasWarningRangeTime(fromDateTime, toDateTime)).toBe(false);
    });
  });
});
