import { TestBed } from '@angular/core/testing';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';
import { LogInfoService } from './log-info.service';
import { AddRequestStore } from '../../add-request.store';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../../models/add-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { FilterModel } from '../../filter/filter.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { MatchType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RelatedEventService,
        {
          provide: ValidationService,
          useValue: {
            isValidInputRelatedEvent: jest.fn(),
            isHasAllowanceTime: jest.fn()
          }
        },
        {
          provide: LogInfoService,
          useValue: {
            getLogInfo: jest.fn(),
            updateIsCheckedVar: jest.fn()
          }
        },
        {
          provide: AddRequestStore,
          useValue: {}
        },
        {
          provide: AddRequestApiService,
          useValue: {
            getChildMatches: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(RelatedEventService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
  });

  describe('addRelatedEventByInput', () => {
    it('should display required message when inputRelatedMatchId is empty', async () => {
      const arg = {
        primitiveProps: {
          inputRelatedMatchId: null,
          isBlock: false,
          filterBy: 1
        } as PrimitiveProperty,
        tooltip: { display: jest.fn() } as unknown as Tooltip,
        inputMatchIdClass: 'test-class',
        allEvents: [],
        filter: {
          issueTypeId: '1'
        } as FilterModel,
        mainEvent: {
          eventDate: new Date('2024-01-01'),
          sportType: 1,
          subIssueTypeId: 1,
          isCheckedVar: true,
          isMainMatch: true
        } as LogInfoRelatedEvent,
        isEdit: false,
        requestId: 1,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        addRequestStore: {} as any,
        originalRelatedEvents: [],
        subIssueTypeId: '1'
      } as AddRelatedEventArg;

      await service.addRelatedEventByInput(arg);

      expect(arg.tooltip.display).toHaveBeenCalledWith('test-class', LABELS.REQUIRED_MATCHID);
      expect(arg.primitiveProps.isBlock).toBe(false);
    });

    it('should display invalid message when getChildMatches returns empty array', async () => {
      const arg = {
        primitiveProps: {
          inputRelatedMatchId: 123,
          isBlock: false,
          filterBy: 1
        } as PrimitiveProperty,
        tooltip: { display: jest.fn() } as unknown as Tooltip,
        inputMatchIdClass: 'test-class',
        allEvents: [],
        filter: {
          issueTypeId: '1'
        } as FilterModel,
        mainEvent: {
          eventDate: new Date('2024-01-01'),
          sportType: 1,
          subIssueTypeId: 1,
          isCheckedVar: true,
          isMainMatch: true
        } as LogInfoRelatedEvent,
        isEdit: false,
        requestId: 1,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        addRequestStore: {} as any,
        originalRelatedEvents: [],
        subIssueTypeId: '1'
      } as AddRelatedEventArg;

      jest.spyOn(validationService, 'isValidInputRelatedEvent').mockReturnValue(true);
      jest.spyOn(service as any, 'getChildMatches').mockResolvedValue([]);

      await service.addRelatedEventByInput(arg);

      expect(arg.tooltip.display).toHaveBeenCalledWith('test-class', LABELS.INVALID_MATCHID);
      expect(arg.primitiveProps.isBlock).toBe(false);
    });

    it('should add new events when getChildMatches returns valid data', async () => {
      const arg = {
        primitiveProps: {
          inputRelatedMatchId: 123,
          isBlock: false,
          filterBy: 1
        } as PrimitiveProperty,
        tooltip: { display: jest.fn() } as unknown as Tooltip,
        inputMatchIdClass: 'test-class',
        allEvents: [],
        filter: {
          issueTypeId: '1'
        } as FilterModel,
        mainEvent: {
          eventDate: new Date('2024-01-01'),
          sportType: 1,
          subIssueTypeId: 1,
          isCheckedVar: true,
          isMainMatch: true
        } as LogInfoRelatedEvent,
        isEdit: false,
        requestId: 1,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        addRequestStore: {} as any,
        originalRelatedEvents: [],
        subIssueTypeId: '1'
      } as AddRelatedEventArg;

      const mockChildMatches = [
        {
          matchId: 123,
          matchCode: 'TEST123',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        }
      ] as ChildMatchModel[];

      jest.spyOn(validationService, 'isValidInputRelatedEvent').mockReturnValue(true);
      jest.spyOn(service as any, 'getChildMatches').mockResolvedValue(mockChildMatches);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(logInfoService, 'updateIsCheckedVar');

      await service.addRelatedEventByInput(arg);

      expect(arg.allEvents.length).toBe(1);
      expect(arg.allEvents[0].matchId).toBe(123);
      expect(arg.allEvents[0].matchCode).toBe('TEST123');
      expect(arg.primitiveProps.isBlock).toBe(false);
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.updateIsCheckedVar).toHaveBeenCalled();
    });
  });

  describe('getDataWhenSearch', () => {
    it('should add new events and update existing events', async () => {
      const relatedEvents = [
        {
          matchId: 1,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        },
        {
          matchId: 2,
          matchCode: 'TEST2',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        }
      ] as ChildMatchModel[];

      const arg = {
        allEvents: [
          {
            matchId: 1,
            logInfoDetail: null,
            messageValidationLogInfo: null,
            voidTimeArea: null,
            subIssueTypeId: 1,
            leagueName: 'Test League',
            isMainMatch: true,
            eventName: 'Test Event',
            tvDetectionModel: null,
            sportType: 1
          }
        ],
        primitiveProps: {
          isShowLogInfoMainMatch: false,
          filterBy: 1
        } as PrimitiveProperty,
        filter: {
          issueTypeId: '1'
        } as FilterModel,
        mainEvent: {
          eventDate: new Date('2024-01-01'),
          sportType: 1,
          subIssueTypeId: 1,
          leagueName: 'Test League',
          isMainMatch: true
        } as LogInfoRelatedEvent,
        isEdit: false,
        requestId: 1,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        addRequestStore: {} as any,
        originalRelatedEvents: [],
        subIssueTypeId: '1'
      } as AddRelatedEventArg;

      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue();
      jest.spyOn(service as any, 'preparingModelGetLogInfo').mockResolvedValue([
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            liveScores: '',
            singleCount: 0,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            voidFromTime: new Date('2024-01-01 10:00:00'),
            voidToTime: new Date('2024-01-01 11:00:00'),
            transVoidToTime: new Date('2024-01-01 11:00:00'),
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0',
            actionType: ''
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              type: 'error',
              content: 'test',
              isError: true,
              reason: 'test'
            } as ValidationMessage
          ],
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          } as FilterTimeWithAllowance,
          subIssueTypeId: 1,
          leagueName: 'Test League',
          isMainMatch: true,
          eventName: 'Test Event',
          tvDetectionModel: null,
          sportType: 1
        },
        {
          matchId: 2,
          logInfoDetail: {
            matchId: 2,
            liveScores: '',
            singleCount: 0,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            voidFromTime: new Date('2024-01-01 10:00:00'),
            voidToTime: new Date('2024-01-01 11:00:00'),
            transVoidToTime: new Date('2024-01-01 11:00:00'),
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0',
            actionType: ''
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              type: 'error',
              content: 'test',
              isError: true,
              reason: 'test'
            } as ValidationMessage
          ],
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          } as FilterTimeWithAllowance,
          subIssueTypeId: 1,
          leagueName: 'Test League',
          isMainMatch: true,
          eventName: 'Test Event',
          tvDetectionModel: null,
          sportType: 1
        }
      ]);

      await service.getDataWhenSearch(relatedEvents, arg);

      expect(arg.allEvents.length).toBe(2);
      expect(arg.allEvents[0].logInfoDetail).toBeDefined();
      expect(arg.allEvents[1].logInfoDetail).toBeDefined();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
    });
  });

  describe('preparingModelGetLogInfo', () => {
    it('should return events with new child events', async () => {
      const relatedEvents = [
        {
          matchId: 1,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        },
        {
          matchId: 2,
          matchCode: 'TEST2',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        }
      ] as ChildMatchModel[];

      const arg = {
        allEvents: [
          {
            matchId: 1,
            leagueName: 'Test League',
            isMainMatch: true,
            eventName: 'Test Event',
            tvDetectionModel: null,
            sportType: 1
          }
        ],
        mainEvent: {
          subIssueTypeId: 1
        } as LogInfoRelatedEvent,
        defaultFilterTimeWithAllowance: {} as FilterTimeWithAllowance,
        addRequestStore: {} as any,
        originalRelatedEvents: [],
        subIssueTypeId: '1'
      } as AddRelatedEventArg;

      const result = await service['preparingModelGetLogInfo'](relatedEvents, arg);

      expect(result.length).toBe(2);
      expect(result[0].matchId).toBe(1);
      expect(result[1].matchId).toBe(2);
    });
  });

  describe('addNewRelatedEventHaveTicketOrUpdateExistedEvent', () => {
    it('should add new event when event does not exist and has logInfoDetail', () => {
      const eventsGetLogInfo = [
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0'
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              type: 'error',
              content: 'test',
              isError: true,
              reason: 'test'
            } as ValidationMessage
          ],
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          } as FilterTimeWithAllowance,
          subIssueTypeId: 1,
          isMainMatch: true,
          sportType: 1,
          leagueName: '',
          eventName: '',
          tvDetectionModel: null
        }
      ] as LogInfoRelatedEvent[];

      const originalAllEvents: LogInfoRelatedEvent[] = [];

      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      expect(originalAllEvents.length).toBe(1);
      expect(originalAllEvents[0].matchId).toBe(1);
      expect(originalAllEvents[0].logInfoDetail).toBeDefined();
    });

    it('should update existing event when event exists', () => {
      const eventsGetLogInfo = [
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0'
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              type: 'error',
              content: 'new',
              isError: true,
              reason: 'new'
            } as ValidationMessage
          ],
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          } as FilterTimeWithAllowance,
          subIssueTypeId: 2,
          isMainMatch: true,
          sportType: 1,
          leagueName: '',
          eventName: '',
          tvDetectionModel: null
        }
      ] as LogInfoRelatedEvent[];

      const originalAllEvents: LogInfoRelatedEvent[] = [
        {
          matchId: 1,
          logInfoDetail: {
            matchId: 1,
            isHasWarningRangeTime: false,
            scoreNormalTicket: '0',
            scoreOfMatch: '0',
            minTransId: '0'
          } as LogInfoDetail,
          messageValidationLogInfo: [
            {
              type: 'error',
              content: 'old',
              isError: true,
              reason: 'old'
            } as ValidationMessage
          ],
          voidTimeArea: {
            fromDateTime: '2024-01-01 10:00:00',
            toDateTime: '2024-01-01 11:00:00',
            aaTime: 5,
            paTime: 5,
            saTime: 5
          } as FilterTimeWithAllowance,
          subIssueTypeId: 1,
          isMainMatch: true,
          sportType: 1,
          leagueName: '',
          eventName: '',
          tvDetectionModel: null
        }
      ];

      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      expect(originalAllEvents.length).toBe(1);
      expect(originalAllEvents[0].logInfoDetail).toBeDefined();
      expect(originalAllEvents[0].voidTimeArea).toBeDefined();
      expect(originalAllEvents[0].subIssueTypeId).toBe(2);
    });
  });

  describe('getChildMatches', () => {
    it('should call addRequestApiService.getChildMatches with correct parameters and return result', async () => {
      const query = {
        matchId: 123,
        issueTypeId: 1,
        subIssueTypeId: '2',
        isMainMatch: true,
        eventDate: '2024-01-01',
        sportType: 1
      } as GetChildMatchQuery;

      const expectedResult = [
        {
          matchId: 1,
          matchCode: 'TEST1',
          leagueName: 'Test League',
          matchEvent: 'Test Event',
          matchType: MatchType.LINK,
          isChecked: true
        }
      ] as ChildMatchModel[];

      jest.spyOn(addRequestApiService, 'getChildMatches').mockResolvedValue(expectedResult);

      const result = await service.getChildMatches(query);

      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });

    it('should handle empty result from addRequestApiService.getChildMatches', async () => {
      const query = {
        matchId: 123,
        issueTypeId: 1,
        subIssueTypeId: '2',
        isMainMatch: true,
        eventDate: '2024-01-01',
        sportType: 1
      } as GetChildMatchQuery;

      jest.spyOn(addRequestApiService, 'getChildMatches').mockResolvedValue([]);

      const result = await service.getChildMatches(query);

      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual([]);
    });

    it('should propagate error from addRequestApiService.getChildMatches', async () => {
      const query = {
        matchId: 123,
        issueTypeId: 1,
        subIssueTypeId: '2',
        isMainMatch: true,
        eventDate: '2024-01-01',
        sportType: 1
      } as GetChildMatchQuery;

      const error = new Error('API Error');
      jest.spyOn(addRequestApiService, 'getChildMatches').mockRejectedValue(error);

      await expect(service.getChildMatches(query)).rejects.toThrow('API Error');
    });
  });
});
