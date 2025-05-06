import { TestBed } from '@angular/core/testing';
import { EventWrongScoreService } from '../../event-wrong-score/services/event-wrong-score.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { ValidationService } from '../../event-wrong-score/services/validation.service';
import { WrongScoreService } from '../../event-wrong-score/services/wrong-score.service';
import { MatchModel } from '../../../../../utility/models/match.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { PrimitiveProperty } from '../../event-wrong-score/event-wrong-score.model';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { AcceptType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { ChildMatchModel } from '../../models/related-event.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';

describe('EventWrongScoreService', () => {
  let service: EventWrongScoreService;
  let validationService: ValidationService;
  let wrongScoreService: WrongScoreService;

  const mockMatchModel = {
    matchId: 123,
    eventDate: new Date(),
    sportType: 1
  } as MatchModel;

  const mockWrongScoreModel = {
    matchId: 123,
    eventDate: new Date(),
    sportType: 1,
    serviceAcceptTime: new Date(),
    actualTime: new Date(),
    tvDetectionValue: 1,
    minuteOffset: 5,
    secondOffset: 30,
    scoreId: 1,
    isActive: true,
    wrongScore: '1-0',
    subIssueTypeId: SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL,
    matchType: 1,
    matchStatus: 1,
    matchTime: new Date(),
    matchDate: new Date(),
    matchDateTime: new Date(),
    matchDateTimeUtc: new Date()
  } as unknown as WrongScoreModel;

  const mockPrimitiveProps = {
    filterBy: TVSRequestFilterBy.TRANS_TIME,
    isCheckedVar: null,
    isHighLightVarCheck: null,
    isShowRelatedEvents: false
  } as PrimitiveProperty;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        EventWrongScoreService,
        ValidationService,
        WrongScoreService
      ]
    });

    service = TestBed.inject(EventWrongScoreService);
    validationService = TestBed.inject(ValidationService);
    wrongScoreService = TestBed.inject(WrongScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllWrongScoreModels', () => {
    it('should get all wrong score models successfully', async () => {
      // Arrange
      const wrongScoreModels: WrongScoreModel[] = [];
      const mockApiResponse = [mockWrongScoreModel];
      wrongScoreService['callApiGetWrongScores'] = jest.fn().mockResolvedValue(mockApiResponse);

      // Act
      const result = await service.getAllWrongScoreModels(wrongScoreModels, 123);

      // Assert
      expect(result).toEqual(mockApiResponse);
      expect(wrongScoreModels).toEqual(mockApiResponse);
      expect(wrongScoreService['callApiGetWrongScores']).toHaveBeenCalledWith(123);
    });

    it('should not update models when API returns empty array', async () => {
      // Arrange
      const wrongScoreModels: WrongScoreModel[] = [];
      const mockApiResponse: WrongScoreModel[] = [];
      wrongScoreService['callApiGetWrongScores'] = jest.fn().mockResolvedValue(mockApiResponse);

      // Act
      const result = await service.getAllWrongScoreModels(wrongScoreModels, 123);

      // Assert
      expect(result).toEqual([]);
      expect(wrongScoreModels).toEqual([]);
    });
  });

  describe('updateMainMatch', () => {
    it('should update main match with selected match data', () => {
      // Arrange
      const mainEvent = { ...mockWrongScoreModel };

      // Act
      service.updateMainMatch(mainEvent, mockMatchModel);

      // Assert
      expect(mainEvent.matchId).toBe(mockMatchModel.matchId);
      expect(mainEvent.eventDate).toBe(mockMatchModel.eventDate);
      expect(mainEvent.sportType).toBe(mockMatchModel.sportType);
    });
  });

  describe('resetPrimitiveProperty', () => {
    it('should reset primitive property with correct filter by for accepted time', () => {
      // Arrange
      validationService['isSubTypeFilterByAcceptedTime'] = jest.fn().mockReturnValue(true);
      validationService['isSubTypeFilterByTransTimeAndAcceptedTime'] = jest.fn().mockReturnValue(false);

      // Act
      service.resetPrimitiveProperty(mockPrimitiveProps, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL.toString());

      // Assert
      expect(mockPrimitiveProps.filterBy).toBe(TVSRequestFilterBy.CHECK_TIME);
      expect(mockPrimitiveProps.isCheckedVar).toBeNull();
      expect(mockPrimitiveProps.isHighLightVarCheck).toBeNull();
      expect(mockPrimitiveProps.isShowRelatedEvents).toBeDefined();
    });

    it('should reset primitive property with correct filter by for trans time and accepted time', () => {
      // Arrange
      validationService['isSubTypeFilterByAcceptedTime'] = jest.fn().mockReturnValue(false);
      validationService['isSubTypeFilterByTransTimeAndAcceptedTime'] = jest.fn().mockReturnValue(true);

      // Act
      service.resetPrimitiveProperty(mockPrimitiveProps, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL.toString());

      // Assert
      expect(mockPrimitiveProps.filterBy).toBe(TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME);
      expect(mockPrimitiveProps.isCheckedVar).toBeNull();
      expect(mockPrimitiveProps.isHighLightVarCheck).toBeNull();
      expect(mockPrimitiveProps.isShowRelatedEvents).toBeDefined();
    });

    it('should reset primitive property with correct filter by for trans time', () => {
      // Arrange
      validationService['isSubTypeFilterByAcceptedTime'] = jest.fn().mockReturnValue(false);
      validationService['isSubTypeFilterByTransTimeAndAcceptedTime'] = jest.fn().mockReturnValue(false);

      // Act
      service.resetPrimitiveProperty(mockPrimitiveProps, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL.toString());

      // Assert
      expect(mockPrimitiveProps.filterBy).toBe(TVSRequestFilterBy.TRANS_TIME);
      expect(mockPrimitiveProps.isCheckedVar).toBeNull();
      expect(mockPrimitiveProps.isHighLightVarCheck).toBeNull();
      expect(mockPrimitiveProps.isShowRelatedEvents).toBeDefined();
    });
  });

  describe('getTvDetectionModel', () => {
    it('should return correct tv detection model', () => {
      // Act
      const result = service.getTvDetectionModel(mockWrongScoreModel);

      // Assert
      expect(result).toEqual({
        serviceAcceptTime: mockWrongScoreModel.serviceAcceptTime,
        actualTime: mockWrongScoreModel.actualTime,
        tvDetectionValue: mockWrongScoreModel.tvDetectionValue,
        minuteOffset: mockWrongScoreModel.minuteOffset,
        secondOffset: mockWrongScoreModel.secondOffset
      } as TvDetectionModel);
    });
  });

  describe('getHighlightMinTimeClass', () => {
    it('should return correct class for auto accept type', () => {
      // Act
      const result = service.getHighlightMinTimeClass(AcceptType.AUTO_ACCEPT, new Date());

      // Assert
      expect(result).toEqual({
        acceptTypeName: 'AA',
        highlightTimeClass: 'highlight-min-aa'
      });
    });

    it('should return correct class for second accept type', () => {
      // Act
      const result = service.getHighlightMinTimeClass(AcceptType.SECOND_ACCEPT, new Date());

      // Assert
      expect(result).toEqual({
        acceptTypeName: 'SA',
        highlightTimeClass: 'highlight-min-sa'
      });
    });

    it('should return correct class for pending accept type', () => {
      // Act
      const result = service.getHighlightMinTimeClass(AcceptType.PENDING_ACCEPT, new Date());

      // Assert
      expect(result).toEqual({
        acceptTypeName: 'PA',
        highlightTimeClass: 'highlight-min-pa'
      });
    });

    it('should return empty values when no min time', () => {
      // Act
      const result = service.getHighlightMinTimeClass(AcceptType.AUTO_ACCEPT, undefined);

      // Assert
      expect(result).toEqual({
        acceptTypeName: '',
        highlightTimeClass: ''
      });
    });
  });

  describe('updateCheckRelatedEvent', () => {
    it('should filter related events correctly', () => {
      // Arrange
      const selectedRelatedEvents: ChildMatchModel[] = [
        { matchId: 1, matchType: 1 } as ChildMatchModel
      ];
      const allRelatedEvents: LogInfoRelatedEvent[] = [
        { matchId: 1 } as LogInfoRelatedEvent,
        { matchId: 2 } as LogInfoRelatedEvent
      ];
      const relatedEvents: ChildMatchModel[] = [
        { matchId: 2, matchType: 2 } as ChildMatchModel
      ];
      const matchType = 1;

      // Act
      const result = service.updateCheckRelatedEvent(selectedRelatedEvents, allRelatedEvents, relatedEvents, matchType);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].matchId).toBe(1);
      expect(result[1].matchId).toBe(2);
    });
  });

  describe('isHasRelatedEvent', () => {
    it('should return true for sub issue type with related events', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS;

      // Act
      const result = service.isHasRelatedEvent(subIssueTypeId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for sub issue type without related events', () => {
      // Act
      const result = service.isHasRelatedEvent(999);

      // Assert
      expect(result).toBeFalsy();
    });
  });
});