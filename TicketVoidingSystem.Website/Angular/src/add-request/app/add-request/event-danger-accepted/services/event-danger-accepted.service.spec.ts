import { TestBed } from '@angular/core/testing';
import { MatchType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { RedCardModel } from '../../models/event-red-card.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { EventDangerAcceptedService } from './event-danger-accepted.service';
import { ValidationService } from './validation.service';

describe('EventDangerAcceptedService', () => {
  let service: EventDangerAcceptedService;
  let addRequestApiService: AddRequestApiService;
  let addRequestStore: AddRequestStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventDangerAcceptedService,
        {
          provide: ValidationService,
          useValue: {
            isHasWarningRangeTime: jest.fn().mockReturnValue(false)
          }
        },
        {
          provide: AddRequestApiService,
          useValue: {
            getSubIssueTypeLinkMatch: jest.fn().mockResolvedValue([])
          }
        },
        {
          provide: AddRequestStore,
          useValue: {
            changeAllowanceTime: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(EventDangerAcceptedService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    addRequestStore = TestBed.inject(AddRequestStore);
  });

  describe('assignModelsToEvents', () => {
    it('should assign models to events and update store', () => {
      const allEvents: LogInfoRelatedEvent[] = [];
      const inputModels: RedCardModel[] = [
        {
          matchId: 1,
          matchCode: 'TEST1',
          matchEvent: 'Test Event',
          leagueName: 'Test League',
          filterBy: 1,
          isMainMatch: true,
          filterFromTransTime: '2024-01-01 10:00:00',
          filterToTransTime: '2024-01-01 11:00:00',
          name: 'Test Event',
          subIssueTypeId: 1,
          subIssueTypeName: 'Test Sub Issue Type',
          matchType: MatchType.LINK,
          isCheckedVar: true,
          logInfoDetail: {} as LogInfoDetail,
          voidFromTime: '2024-01-01 10:00:00',
          voidToTime: '2024-01-01 11:00:00',
          aaTime: 5,
          paTime: 5,
          saTime: 5,
          serviceAcceptTime: '2024-01-01 10:00:00',
          actualTime: '2024-01-01 10:00:00',
          tvDetectionValue: 1,
          minuteOffset: '1',
          secondOffset: '30',
          eventDate: new Date('2024-01-01'),
          sportType: 1
        }
      ];
      const primitiveProps = {} as PrimitiveProperty;

      service.assignModelsToEvents(allEvents, inputModels, primitiveProps, addRequestStore);

      expect(allEvents.length).toBe(1);
      expect(allEvents[0].matchId).toBe(1);
      expect(allEvents[0].matchCode).toBe('TEST1');
      expect(allEvents[0].leagueName).toBe('Test League');
      expect(allEvents[0].subIssueTypeId).toBe(1);
      expect(allEvents[0].isCheckedVar).toBe(true);
      expect(allEvents[0].isMainMatch).toBe(true);
      expect(allEvents[0].eventName).toBe('Test Event');
      expect(allEvents[0].logInfoDetail.isHasWarningRangeTime).toBe(false);
      expect(allEvents[0].voidTimeArea).toEqual({
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      });
      expect(allEvents[0].tvDetectionModel).toEqual({
        serviceAcceptTime: '2024-01-01 10:00:00',
        actualTime: '2024-01-01 10:00:00',
        tvDetectionValue: 1,
        minuteOffset: '1',
        secondOffset: '30'
      });
      expect(allEvents[0].eventDate).toEqual(new Date('2024-01-01'));
      expect(allEvents[0].sportType).toBe(1);
      expect(addRequestStore.changeAllowanceTime).toHaveBeenCalledWith({
        aaTime: 5,
        paTime: 5,
        saTime: 5
      });
      expect(primitiveProps.filterBy).toBe(1);
    });
  });

  describe('getVoidTimeModel', () => {
    it('should return void time model', () => {
      const inputModel: RedCardModel = {
        voidFromTime: '2024-01-01 10:00:00',
        voidToTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as RedCardModel;

      const result = service.getVoidTimeModel(inputModel);

      expect(result).toEqual({
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      });
    });
  });

  describe('getTvDetectionModel', () => {
    it('should return tv detection model', () => {
      const inputModel: RedCardModel = {
        serviceAcceptTime: '2024-01-01 10:00:00',
        actualTime: '2024-01-01 10:00:00',
        tvDetectionValue: 1,
        minuteOffset: '1',
        secondOffset: '30'
      } as RedCardModel;

      const result = service.getTvDetectionModel(inputModel);

      expect(result).toEqual({
        serviceAcceptTime: '2024-01-01 10:00:00',
        actualTime: '2024-01-01 10:00:00',
        tvDetectionValue: 1,
        minuteOffset: '1',
        secondOffset: '30'
      });
    });
  });

  describe('updateDefaultFilterTime', () => {
    it('should update default filter time from main event', () => {
      const defaultFilter = {} as FilterTimeWithAllowance;
      const inputModels: RedCardModel[] = [
        {
          matchId: 1,
          matchEvent: 'Test Event',
          leagueName: 'Test League',
          filterBy: 1,
          isMainMatch: true,
          filterFromTransTime: '2024-01-01 10:00:00',
          filterToTransTime: '2024-01-01 11:00:00',
          name: 'Test Event',
          subIssueTypeId: 1,
          subIssueTypeName: 'Test Sub Issue Type',
          matchType: MatchType.LINK,
          isCheckedVar: true,
          logInfoDetail: {} as LogInfoDetail,
          voidFromTime: '2024-01-01 10:00:00',
          voidToTime: '2024-01-01 11:00:00',
          aaTime: 5,
          paTime: 5,
          saTime: 5,
          serviceAcceptTime: '2024-01-01 10:00:00',
          actualTime: '2024-01-01 10:00:00',
          tvDetectionValue: 1,
          minuteOffset: '1',
          secondOffset: '30',
          eventDate: new Date('2024-01-01'),
          sportType: 1
        }
      ];

      service.updateDefaultFilterTime(defaultFilter, inputModels);

      expect(defaultFilter.fromDateTime).toBe('2024-01-01 10:00:00');
      expect(defaultFilter.toDateTime).toBe('2024-01-01 11:00:00');
    });
  });

  describe('initDefaultFilterTime', () => {
    it('should initialize default filter time with current time', () => {
      const defaultFilter = {} as FilterTimeWithAllowance;

      service.initDefaultFilterTime(defaultFilter);

      expect(defaultFilter.fromDateTime).toBeDefined();
      expect(defaultFilter.toDateTime).toBeDefined();
    });
  });

  describe('initDefaultMainEvent', () => {
    it('should initialize default main event', () => {
      const allSelectedEvents: LogInfoRelatedEvent[] = [];

      const result = service.initDefaultMainEvent(allSelectedEvents);

      expect(allSelectedEvents.length).toBe(1);
      expect(result.isMainMatch).toBe(true);
    });
  });

  describe('updateSubIssueTypeAndAllowanceTime', () => {
    it('should update sub issue type and allowance time for link events', async () => {
      const allEvents: LogInfoRelatedEvent[] = [
        {
          matchId: 1,
          subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER
        },
        {
          matchId: 2,
          subIssueTypeId: SubIssueTypeConstant.MAIN_CORNER
        }
      ] as LogInfoRelatedEvent[];

      const mainEvent = allEvents[0];
      const relatedEvents = [
        {
          matchId: 2,
          matchType: MatchType.LINK,
          isChecked: true,
          matchCode: 'TEST2',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          isSpecialChildMatch: false
        }
      ] as ChildMatchModel[];

      const defaultFilter = {
        fromDateTime: '2024-01-01 10:00:00',
        toDateTime: '2024-01-01 11:00:00',
        aaTime: 5,
        paTime: 5,
        saTime: 5
      } as FilterTimeWithAllowance;

      await service.updateSubIssueTypeAndAllowanceTime(allEvents, mainEvent, relatedEvents, defaultFilter);

      expect(addRequestApiService.getSubIssueTypeLinkMatch).toHaveBeenCalled();
      expect(allEvents[0].subIssueTypeId).toBe(SubIssueTypeConstant.MAIN_CORNER);
      expect(allEvents[1].subIssueTypeId).toBe(SubIssueTypeConstant.MAIN_CORNER);
      expect(allEvents[0].voidTimeArea).toBeDefined();
      expect(allEvents[1].voidTimeArea).toBeDefined();
    });
  });

  describe('getSubIssueTypeId', () => {
    it('should return subIssueTypeId from subTypeLinkMatches when handlingMatchId is link event and has subIssueTypeId', () => {
      const handlingMatchId = 2;
      const subTypeLinkMatches = [
        {
          matchId: 2,
          subIssueTypeId: 3
        }
      ];
      const linkEvents = [
        {
          matchId: 2
        }
      ] as LogInfoRelatedEvent[];
      const mainEvent = {
        subIssueTypeId: 1
      } as LogInfoRelatedEvent;

      const result = service['getSubIssueTypeId'](handlingMatchId, subTypeLinkMatches, linkEvents, mainEvent);

      expect(result).toBe(3);
    });

    it('should return mainEvent.subIssueTypeId when handlingMatchId is link event but no subIssueTypeId in subTypeLinkMatches', () => {
      const handlingMatchId = 2;
      const subTypeLinkMatches = [
        {
          matchId: 2,
          subIssueTypeId: 0
        }
      ];
      const linkEvents = [
        {
          matchId: 2
        }
      ] as LogInfoRelatedEvent[];
      const mainEvent = {
        subIssueTypeId: 1
      } as LogInfoRelatedEvent;

      const result = service['getSubIssueTypeId'](handlingMatchId, subTypeLinkMatches, linkEvents, mainEvent);

      expect(result).toBe(1);
    });

    it('should return mainEvent.subIssueTypeId when handlingMatchId is not link event', () => {
      const handlingMatchId = 2;
      const subTypeLinkMatches = [
        {
          matchId: 2,
          subIssueTypeId: 3
        }
      ];
      const linkEvents = [
        {
          matchId: 3
        }
      ] as LogInfoRelatedEvent[];
      const mainEvent = {
        subIssueTypeId: 1
      } as LogInfoRelatedEvent;

      const result = service['getSubIssueTypeId'](handlingMatchId, subTypeLinkMatches, linkEvents, mainEvent);

      expect(result).toBe(1);
    });
  });
});
