import { TestBed } from '@angular/core/testing';
import { MatchType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event-arg.model';
import { FilterBetType, FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let addRequestApiService: AddRequestApiService;
  let validationService: ValidationService;

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
        }
      ]
    });

    service = TestBed.inject(RelatedEventService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    validationService = TestBed.inject(ValidationService);
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
        }
      ] as ChildMatchModel[];

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await service.getChildMatches(query);

      // Assert
      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateEvents', () => {
    it('should update events with default filter when filter times are not provided', () => {
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
        }
      ] as ChildMatchModel[];

      const defaultFilter = new FilterWithHdpModel();
      defaultFilter.filterFromTransTime = null;
      defaultFilter.filterToTransTime = null;
      defaultFilter.filterBetType = new FilterBetType();

      // Act
      const result = service.updateEvents(models, defaultFilter);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].isMainMatch).toBe(false);
      expect(result[0].eventName).toBe('123 - Team A vs Team B');
      expect(result[0].filterWithHdp.filterFromTransTime).toBeDefined();
      expect(result[0].filterWithHdp.filterToTransTime).toBeDefined();
    });

    it('should update events with provided filter times', () => {
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
        }
      ] as ChildMatchModel[];

      const defaultFilter = new FilterWithHdpModel();
      defaultFilter.filterFromTransTime = '2024-03-20T00:00:00';
      defaultFilter.filterToTransTime = '2024-03-20T23:59:59';
      defaultFilter.filterBetType = new FilterBetType('X', 'Y', '1');

      // Act
      const result = service.updateEvents(models, defaultFilter);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].matchId).toBe(123);
      expect(result[0].isMainMatch).toBe(false);
      expect(result[0].eventName).toBe('123 - Team A vs Team B');
      expect(result[0].filterWithHdp.filterFromTransTime).toBe('2024-03-20T00:00:00');
      expect(result[0].filterWithHdp.filterToTransTime).toBe('2024-03-20T23:59:59');
      expect(result[0].filterWithHdp.filterBetType.filterBetIdX).toBe('X');
      expect(result[0].filterWithHdp.filterBetType.filterBetIdY).toBe('Y');
      expect(result[0].filterWithHdp.filterBetType.filterBetTypeId).toBe('1');
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
          eventDate: '2024-03-20'
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
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
          eventDate: '2024-03-20'
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        },
        defaultFilterWithHdpModel: new FilterWithHdpModel()
      } as unknown as AddRelatedEventArg;

      arg.defaultFilterWithHdpModel.filterBetType = new FilterBetType();

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
        }
      ] as ChildMatchModel[];

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(childMatches);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.primitiveProps.isBlock).toBe(false);
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
      expect(arg.allEvents.length).toBe(1);
      expect(arg.allEvents[0].matchId).toBe(123);
      expect(arg.allEvents[0].isMainMatch).toBe(false);
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
          eventDate: '2024-03-20'
        },
        allEvents: [],
        inputMatchIdClass: 'input-match-id',
        filter: {
          issueTypeId: '1'
        }
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
});
