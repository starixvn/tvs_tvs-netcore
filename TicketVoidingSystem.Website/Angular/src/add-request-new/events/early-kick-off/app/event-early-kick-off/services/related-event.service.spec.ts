import { TestBed } from '@angular/core/testing';
import { MatchType } from '../../../../../../utility/constants/config';
import { TEXT} from '../../../../../../utility/constants/text';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { GetChildMatchQuery } from '../../../../../models/get-child-match.query';
import { GetLogInfoModel, GetLogInfoViewModel, Validation } from '../../../../../models/get-log-info.model';
import { ChildMatchModel } from '../../../../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let addRequestApiService: AddRequestApiService;
  let validationService: ValidationService;
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
          provide: LogInfoService,
          useValue: {
            getLogInfo: jest.fn(),
            assignResultLogInfoToEvents: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(RelatedEventService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    validationService = TestBed.inject(ValidationService);
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
          isChecked: false
        } as ChildMatchModel
      ] as ChildMatchModel [];

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await service.getChildMatches(query);

      // Assert
      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('mapChildMatchesToEvents', () => {
    it('should map child matches to events correctly', () => {
      // Arrange
      const models = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        } as ChildMatchModel
      ] as ChildMatchModel [];

      const mainEvent = {
        matchId: 456,
        kickOffTime: '2024-03-20T10:00:00',
        sportType: 1
      } as LogInfoEarlyKickOff;

      // Act
      const result = service.mapChildMatchesToEvents(models, mainEvent);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].isMainMatch).toBe(false);
      expect(result[0].eventName).toBe('123 - Team A vs Team B');
      expect(result[0].kickOffTime).toBe(mainEvent.kickOffTime);
      expect(result[0].sportType).toBe(1);
      expect(result[0].isCollapse).toBe(true);
      expect(result[0].isShowValidation).toBe(false);
      expect(result[0].tableTicketsModel).toBeDefined();
      expect(result[0].pagingModel).toBeDefined();
      expect(result[0].matchModel).toBeDefined();
    });
  });

  describe('mapChildMatchToMatchModel', () => {
    it('should map child match to match model correctly', () => {
      // Arrange
      const childMatch = {
        matchId: 123,
        matchCode: 'MATCH123',
        matchEvent: 'Team A vs Team B',
        leagueName: 'League 1',
        sportType: 1,
        matchType: MatchType.NORMAL,
        isChecked: false,
        sportTypeName: 'Football',
        sportTypeNameTraditional: 'Football',
        sportTypeNameSimplified: 'Football',
        sportTypeNameNewSimplified: 'Football',
        homeId: 1,
        homeName: 'Team A',
        homeNameTraditional: 'Team A',
        homeNameSimplified: 'Team A',
        homeNameNewSimplified: 'Team A',
        awayId: 2,
        awayName: 'Team B',
        awayNameTraditional: 'Team B',
        awayNameSimplified: 'Team B',
        awayNameNewSimplified: 'Team B',
        leagueId: 1,
        leagueNameTraditional: 'League 1',
        leagueNameSimplified: 'League 1',
        leagueNameNewSimplified: 'League 1',
        leagueGroupId: 1,
        parentId: 456
      } as ChildMatchModel;

      const eventDate = '2024-03-20T10:00:00';

      // Act
      const result = service.mapChildMatchToMatchModel(childMatch, eventDate);

      // Assert
      expect(result.matchId).toBe(123);
      expect(result.matchCode).toBe('MATCH123');
      expect(result.sportType).toBe(1);
      expect(result.sportTypeName).toBe('Football');
      expect(result.homeName).toBe('Team A');
      expect(result.awayName).toBe('Team B');
      expect(result.leagueName).toBe('League 1');
      expect(result.kickOffTime).toBe(eventDate);
      expect(result.leagueGroupId).toBe(1);
      expect(result.parentId).toBe(456);
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
      expect(arg.tooltip.display).toHaveBeenCalledWith('input-match-id', TEXT.REQUIRED_MATCHID);
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
          matchModel: {
            eventDate: '2024-03-20'
          }
        } as unknown as LogInfoEarlyKickOff,
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        }
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
          matchModel: {
            eventDate: '2024-03-20'
          }
        } as unknown as LogInfoEarlyKickOff,
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        },
        isEdit: false,
        requestId: 1
      } as unknown as AddRelatedEventArg;

      const childMatches = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        } as ChildMatchModel
      ] as ChildMatchModel [];

      const mockLogInfoResponse = {
        getLogInfoModels: [{
          matchId: 123,
          logInfoDetail: {} as LogInfoDetail,
          validation: {} as Validation
        } as GetLogInfoModel]
      } as GetLogInfoViewModel;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(childMatches);
      (logInfoService.getLogInfo as jest.Mock).mockResolvedValue(mockLogInfoResponse);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
      expect(arg.allEvents.length).toBe(1);
      expect(arg.allEvents[0].matchId).toBe(123);
      expect(arg.allEvents[0].isMainMatch).toBe(false);
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(logInfoService.assignResultLogInfoToEvents).toHaveBeenCalled();
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
          matchModel: {
            eventDate: '2024-03-20'
          }
        } as unknown as LogInfoEarlyKickOff,
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        addRequestStore: {
          changeBlockingUiStatus: jest.fn()
        }
      } as unknown as AddRelatedEventArg;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue([]);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.tooltip.display).toHaveBeenCalledWith('input-match-id', TEXT.INVALID_MATCHID);
    });
  });
});
