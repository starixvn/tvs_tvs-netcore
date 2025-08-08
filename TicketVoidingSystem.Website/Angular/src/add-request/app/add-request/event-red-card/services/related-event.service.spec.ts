import { TestBed } from '@angular/core/testing';
import { MatchType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AddRelatedEventArg } from '../../models/add-related-event.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { EventRedCardService } from './event-red-card.service';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let addRequestApiService: AddRequestApiService;
  let validationService: ValidationService;
  let eventRedCardService: EventRedCardService;
  let logInfoService: LogInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        RelatedEventService,
        {
          provide: AddRequestApiService,
          useValue: {
            getChildMatches: jest.fn()
          }
        },
        {
          provide: ValidationService,
          useValue: {
            isValidInputRelatedEvent: jest.fn()
          }
        },
        {
          provide: EventRedCardService,
          useValue: {
            updateSubIssueTypeAndAllowanceTime: jest.fn()
          }
        },
        {
          provide: LogInfoService,
          useValue: {
            getLogInfo: jest.fn(),
            updateIsCheckedVar: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(RelatedEventService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    validationService = TestBed.inject(ValidationService);
    eventRedCardService = TestBed.inject(EventRedCardService);
    logInfoService = TestBed.inject(LogInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChildMatches', () => {
    it('should call addRequestApiService.getChildMatches with correct parameters', async () => {
      // Arrange
      const query: GetChildMatchQuery = {
        issueTypeId: 1,
        eventDate: '2024-03-20',
        matchId: 123,
        isMainMatch: true,
        sportType: 1
      };

      const expectedResult = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false,
          isSpecialChildMatch: false
      ] as ChildMatchModel[];

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await service.getChildMatches(query);

      // Assert
      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignChildMatchToLogInfoModel', () => {
    it('should correctly map ChildMatchModel to LogInfoRelatedEvent', () => {
      // Arrange
      const models = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false,
          isSpecialChildMatch: false
      ] as ChildMatchModel[];

      const defaultFilter: FilterTimeWithAllowance = {
        fromDateTime: '2024-03-20T00:00:00',
        toDateTime: '2024-03-20T23:59:59',
        aaTime: 30,
        paTime: 15,
        saTime: 5
      };

      const defaultSubIssueTypeId = 1;

      // Act
      const result = service.assignChildMatchToLogInfoModel(models, defaultFilter, defaultSubIssueTypeId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].matchCode).toBe('MATCH123');
      expect(result[0].leagueName).toBe('League 1');
      expect(result[0].isMainMatch).toBe(false);
      expect(result[0].eventName).toBe('123 - Team A vs Team B');
      expect(result[0].subIssueTypeId).toBe(defaultSubIssueTypeId);
      expect(result[0].voidTimeArea).toEqual(defaultFilter);
      expect(result[0].logInfoDetail).toBeNull();
      expect(result[0].messageValidationLogInfo).toBeNull();
      expect(result[0].sportType).toBe(1);
    });
  });

  describe('addRelatedEventByInput', () => {
    it('should show error when input match id is missing', async () => {
      // Arrange
      const arg: AddRelatedEventArg = {
        primitiveProps: {
          inputRelatedMatchId: null,
          isBlock: false
        },
        tooltip: {
          display: jest.fn()
        },
        inputMatchIdClass: 'input-match-id'
      } as unknown as AddRelatedEventArg;

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.tooltip.display).toHaveBeenCalledWith('input-match-id', LABELS.REQUIRED_MATCHID);
    });

    it('should validate input related event', async () => {
      // Arrange
      const arg: AddRelatedEventArg = {
        primitiveProps: {
          inputRelatedMatchId: '123',
          isBlock: false
        },
        tooltip: {
          display: jest.fn()
        },
        mainEvent: {
          matchId: 456,
          sportType: 1,
          eventDate: '2024-03-20',
          subIssueTypeId: 1,
          isCheckedVar: true
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        defaultFilterTimeWithAllowance: {
          fromDateTime: '2024-03-20T00:00:00',
          toDateTime: '2024-03-20T23:59:59',
          aaTime: 30,
          paTime: 15,
          saTime: 5
        },
        originalRelatedEvents: []
      } as unknown as AddRelatedEventArg;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(false);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledWith(
        123,
        'input-match-id',
        arg.allEvents,
        arg.tooltip
      );
    });

    it('should add new related event when validation passes', async () => {
      // Arrange
      const arg: AddRelatedEventArg = {
        primitiveProps: {
          inputRelatedMatchId: '123',
          isBlock: false
        },
        tooltip: {
          display: jest.fn()
        },
        mainEvent: {
          matchId: 456,
          sportType: 1,
          eventDate: '2024-03-20',
          subIssueTypeId: 1,
          isCheckedVar: true
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        defaultFilterTimeWithAllowance: {
          fromDateTime: '2024-03-20T00:00:00',
          toDateTime: '2024-03-20T23:59:59',
          aaTime: 30,
          paTime: 15,
          saTime: 5
        },
        originalRelatedEvents: []
      } as unknown as AddRelatedEventArg;

      const childMatches = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false,
          isSpecialChildMatch: false
      ] as ChildMatchModel[];

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(childMatches);
      (eventRedCardService.updateSubIssueTypeAndAllowanceTime as jest.Mock).mockResolvedValue(undefined);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);
      (logInfoService.updateIsCheckedVar as jest.Mock).mockReturnValue(undefined);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.primitiveProps.isBlock).toBe(false);
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
      expect(arg.allEvents.length).toBe(1);
      expect(arg.allEvents[0].matchId).toBe(123);
      expect(arg.allEvents[0].isMainMatch).toBe(false);
      expect(eventRedCardService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.updateIsCheckedVar).toHaveBeenCalled();
    });

    it('should show error when no child matches found', async () => {
      // Arrange
      const arg: AddRelatedEventArg = {
        primitiveProps: {
          inputRelatedMatchId: '123',
          isBlock: false
        },
        tooltip: {
          display: jest.fn()
        },
        mainEvent: {
          matchId: 456,
          sportType: 1,
          eventDate: '2024-03-20',
          subIssueTypeId: 1,
          isCheckedVar: true
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        defaultFilterTimeWithAllowance: {
          fromDateTime: '2024-03-20T00:00:00',
          toDateTime: '2024-03-20T23:59:59',
          aaTime: 30,
          paTime: 15,
          saTime: 5
        },
        originalRelatedEvents: []
      } as unknown as AddRelatedEventArg;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue([]);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.tooltip.display).toHaveBeenCalledWith('input-match-id', LABELS.INVALID_MATCHID);
      expect(arg.primitiveProps.isBlock).toBe(false);
    });
  });

  describe('getDataWhenSearch', () => {
    it('should process related events and update allEvents', async () => {
      // Arrange
      const relatedEvents = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.LINK,
          isChecked: false,
          isSpecialChildMatch: false
      ] as ChildMatchModel[];

      const arg: AddRelatedEventArg = {
        primitiveProps: {
          isBlock: false
        },
        mainEvent: {
          matchId: 456,
          sportType: 1,
          eventDate: '2024-03-20',
          subIssueTypeId: 1,
          isCheckedVar: true
        },
        allEvents: [],
        filter: {
          issueTypeId: '1'
        },
        defaultFilterTimeWithAllowance: {
          fromDateTime: '2024-03-20T00:00:00',
          toDateTime: '2024-03-20T23:59:59',
          aaTime: 30,
          paTime: 15,
          saTime: 5
        },
        originalRelatedEvents: []
      } as unknown as AddRelatedEventArg;

      const mockLogInfoRelatedEvent: LogInfoRelatedEvent = {
        matchId: 123,
        matchCode: 'MATCH123',
        leagueName: 'League 1',
        isMainMatch: false,
        eventName: '123 - Team A vs Team B',
        subIssueTypeId: 1,
        voidTimeArea: {
          fromDateTime: '2024-03-20T00:00:00',
          toDateTime: '2024-03-20T23:59:59',
          aaTime: 30,
          paTime: 15,
          saTime: 5
        },
        logInfoDetail: {
          matchId: 123,
          liveScores: '',
          voidFromTime: new Date(),
          voidToTime: new Date(),
          transVoidToTime: new Date(),
          singleCount: 1,
          cashOutCount: 0,
          settleCount: 0,
          instantlySettleCount: 0,
          mainParlayCount: 0,
          cancelCashOutCount: 0,
          scoreNormalTicket: '',
          scoreOfMatch: '',
          minTransId: '',
          actionType: '',
          isHasWarningRangeTime: false
        },
        messageValidationLogInfo: null,
        tvDetectionModel: {
          tvDetectionValue: 0,
          serviceAcceptTime: '',
          actualTime: '',
          minuteOffset: '',
          secondOffset: ''
        },
        sportType: 1
      };
      jest.spyOn(service as any, 'preparingModelGetLogInfo').mockResolvedValue([mockLogInfoRelatedEvent]);
      jest.spyOn(service as any, 'addNewRelatedEventHaveTicketOrUpdateExistedEvent').mockImplementation((events: LogInfoRelatedEvent[], originalEvents: LogInfoRelatedEvent[]) => {
        originalEvents.push(...events);
      });
      (eventRedCardService.updateSubIssueTypeAndAllowanceTime as jest.Mock).mockResolvedValue(undefined);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(undefined);

      // Act
      await service.getDataWhenSearch(relatedEvents, arg);

      // Assert
      expect(service['preparingModelGetLogInfo']).toHaveBeenCalledWith(relatedEvents, arg);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(service['addNewRelatedEventHaveTicketOrUpdateExistedEvent']).toHaveBeenCalled();
      expect(arg.allEvents.length).toBe(1);
      expect(arg.allEvents[0].matchId).toBe(123);
    });
  });

  describe('addNewRelatedEventHaveTicketOrUpdateExistedEvent', () => {
    it('should add new event when it does not exist in originalAllEvents', () => {
      // Arrange
      const eventsGetLogInfo: LogInfoRelatedEvent[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          leagueName: 'League 1',
          isMainMatch: false,
          eventName: '123 - Team A vs Team B',
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-03-20T00:00:00',
            toDateTime: '2024-03-20T23:59:59',
            aaTime: 30,
            paTime: 15,
            saTime: 5
          },
          logInfoDetail: {
            matchId: 123,
            liveScores: '',
            voidFromTime: new Date(),
            voidToTime: new Date(),
            transVoidToTime: new Date(),
            singleCount: 1,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            scoreNormalTicket: '',
            scoreOfMatch: '',
            minTransId: '',
            actionType: '',
            isHasWarningRangeTime: false
          },
          messageValidationLogInfo: null,
          sportType: 1
        }
      ] as unknown as LogInfoRelatedEvent[];

      const originalAllEvents: LogInfoRelatedEvent[] = [];

      // Act
      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      // Assert
      expect(originalAllEvents.length).toBe(1);
      expect(originalAllEvents[0].matchId).toBe(123);
      expect(originalAllEvents[0].logInfoDetail).toEqual({
        matchId: 123,
        liveScores: '',
        voidFromTime: expect.any(Date),
        voidToTime: expect.any(Date),
        transVoidToTime: expect.any(Date),
        singleCount: 1,
        cashOutCount: 0,
        settleCount: 0,
        instantlySettleCount: 0,
        mainParlayCount: 0,
        cancelCashOutCount: 0,
        scoreNormalTicket: '',
        scoreOfMatch: '',
        minTransId: '',
        actionType: '',
        isHasWarningRangeTime: false
      });
    });

    it('should update existing event when it exists in originalAllEvents', () => {
      // Arrange
      const eventsGetLogInfo: LogInfoRelatedEvent[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          leagueName: 'League 1',
          isMainMatch: false,
          eventName: '123 - Team A vs Team B',
          subIssueTypeId: 2,
          voidTimeArea: {
            fromDateTime: '2024-03-20T00:00:00',
            toDateTime: '2024-03-20T23:59:59',
            aaTime: 30,
            paTime: 15,
            saTime: 5
          },
          logInfoDetail: {
            matchId: 123,
            liveScores: '',
            voidFromTime: new Date(),
            voidToTime: new Date(),
            transVoidToTime: new Date(),
            singleCount: 2,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            scoreNormalTicket: '',
            scoreOfMatch: '',
            minTransId: '',
            actionType: '',
            isHasWarningRangeTime: false
          },
          messageValidationLogInfo: [{ isError: false, reason: 'Updated message' }],
          sportType: 1
        }
      ] as unknown as LogInfoRelatedEvent[];

      const originalAllEvents: LogInfoRelatedEvent[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          leagueName: 'League 1',
          isMainMatch: false,
          eventName: '123 - Team A vs Team B',
          subIssueTypeId: 1,
          voidTimeArea: {
            fromDateTime: '2024-03-20T00:00:00',
            toDateTime: '2024-03-20T23:59:59',
            aaTime: 30,
            paTime: 15,
            saTime: 5
          },
          logInfoDetail: {
            matchId: 123,
            liveScores: '',
            voidFromTime: new Date(),
            voidToTime: new Date(),
            transVoidToTime: new Date(),
            singleCount: 1,
            cashOutCount: 0,
            settleCount: 0,
            instantlySettleCount: 0,
            mainParlayCount: 0,
            cancelCashOutCount: 0,
            scoreNormalTicket: '',
            scoreOfMatch: '',
            minTransId: '',
            actionType: '',
            isHasWarningRangeTime: false
          },
          messageValidationLogInfo: [{ isError: false, reason: 'Old message' }],
          sportType: 1
        }
      ] as unknown as LogInfoRelatedEvent[];

      // Act
      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      // Assert
      expect(originalAllEvents.length).toBe(1);
      expect(originalAllEvents[0].matchId).toBe(123);
      expect(originalAllEvents[0].logInfoDetail).toEqual({
        matchId: 123,
        liveScores: '',
        voidFromTime: expect.any(Date),
        voidToTime: expect.any(Date),
        transVoidToTime: expect.any(Date),
        singleCount: 2,
        cashOutCount: 0,
        settleCount: 0,
        instantlySettleCount: 0,
        mainParlayCount: 0,
        cancelCashOutCount: 0,
        scoreNormalTicket: '',
        scoreOfMatch: '',
        minTransId: '',
        actionType: '',
        isHasWarningRangeTime: false
      });
      expect(originalAllEvents[0].messageValidationLogInfo).toEqual([{ isError: false, reason: 'Updated message' }]);
      expect(originalAllEvents[0].subIssueTypeId).toBe(2);
    });
  });
});
