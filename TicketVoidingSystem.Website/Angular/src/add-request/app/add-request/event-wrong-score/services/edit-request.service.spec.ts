import { TestBed } from '@angular/core/testing';
import { EditRequestService } from './edit-request.service';
import { RelatedEventService } from './related-event.service';
import { WrongScoreService } from './wrong-score.service';
import { EventWrongScoreService } from './event-wrong-score.service';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import _ from 'lodash';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { SubIssueTypeRelatedEvent } from '../models/subIssue-type-related-event.model';

class Helper {
  static readonly fakeMatchId = 12345;
  static readonly fakeScoreId = 1;
  static readonly fakeSubIssueTypeId = 1;

  static getFakeWrongScoreModel(): WrongScoreModel {
    const model = new WrongScoreModel();
    model.scoreId = Helper.fakeScoreId;
    model.isActive = true;
    model.wrongScore = '2-1';
    model.subIssueTypeId = Helper.fakeSubIssueTypeId;
    model.actualScore = '1-0';
    model.matchId = Helper.fakeMatchId;
    model.isChecked = false;
    model.isCheckedVar = false;
    model.filterBy = TVSRequestFilterBy.CHECK_TIME;
    model.sportType = 1;
    model.isMainMatch = true;
    model.eventDate = new Date('2024-03-20T10:00:00');
    return model;
  }

  static getFakePrimitiveProperty(): PrimitiveProperty {
    const primitiveProps = new PrimitiveProperty();
    primitiveProps.filterBy = TVSRequestFilterBy.CHECK_TIME;
    primitiveProps.isBlock = false;
    primitiveProps.actualScore = '';
    primitiveProps.isShowActualScore = false;
    primitiveProps.isCheckedVar = false;
    primitiveProps.isHighLightVarCheck = false;
    primitiveProps.isShowRelatedEvents = false;
    return primitiveProps;
  }

  static getFakeChildMatchModel(): ChildMatchModel {
    const model = new ChildMatchModel();
    model.matchId = Helper.fakeMatchId;
    model.matchCode = 'TEST001';
    model.leagueName = 'Test League';
    model.matchEvent = 'Test Event';
    model.eventDate = new Date('2024-03-20T10:00:00');
    model.sportType = 1;
    model.isChecked = false;
    model.matchType = 1;
    return model;
  }

  static getFakeLogInfoRelatedEvent(): LogInfoRelatedEvent {
    const event = new LogInfoRelatedEvent();
    event.matchId = Helper.fakeMatchId;
    event.matchCode = 'TEST001';
    event.leagueName = 'Test League';
    event.eventName = 'Test Event';
    event.eventDate = new Date('2024-03-20T10:00:00');
    event.sportType = 1;
    event.isMainMatch = true;
    return event;
  }

  static getFakeWrongScoreModels(): WrongScoreModel[] {
    return [
      Helper.getFakeWrongScoreModel(),
      {
        ...Helper.getFakeWrongScoreModel(),
        scoreId: 2,
        isMainMatch: false
      }
    ];
  }

  static getFakeWrongScoreModelForMock(): WrongScoreModel {
    const model = new WrongScoreModel();
    model.scoreId = 1;
    model.isActive = true;
    model.wrongScore = '2-1';
    model.subIssueTypeId = 1;
    model.filterFromTransTime = '2024-03-20T10:00:00';
    model.filterToTransTime = '2024-03-20T11:00:00';
    model.actualScore = '1-0';
    model.matchId = 12345;
    model.isChecked = false;
    model.isCheckedVar = false;
    model.filterBy = TVSRequestFilterBy.CHECK_TIME;
    model.sportType = 1;
    model.isMainMatch = true;
    model.eventDate = new Date('2024-03-20T10:00:00');
    return model;
  }
}

describe('EditRequestService', () => {
  let service: EditRequestService;
  let relatedEventService: jest.Mocked<RelatedEventService>;
  let wrongScoreService: jest.Mocked<WrongScoreService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditRequestService,
        { provide: RelatedEventService, useValue: {
          getGetInfoChildMatch: jest.fn(),
          assignModelsToEvents: jest.fn()
        } },
        { provide: WrongScoreService, useValue: {
          callApiGetWrongScores: jest.fn()
        } },
        { provide: EventWrongScoreService, useValue: {
          isHasRelatedEvent: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EditRequestService);
    relatedEventService = TestBed.inject(RelatedEventService) as jest.Mocked<RelatedEventService>;
    wrongScoreService = TestBed.inject(WrongScoreService) as jest.Mocked<WrongScoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignPrimitivePropsEditRequest', () => {
    it('should assign primitive properties from main event', () => {
      // Arrange
      const mainEvent = Helper.getFakeWrongScoreModel();
      const primitiveProps = Helper.getFakePrimitiveProperty();
      const mockIsHasRelatedEvent = true;
      jest.spyOn(SubIssueTypeRelatedEvent, 'isHasRelatedEvent').mockReturnValue(mockIsHasRelatedEvent);

      // Act
      service.assignPrimitivePropsEditRequest(mainEvent, primitiveProps);

      // Assert
      expect(primitiveProps.actualScore).toBe(mainEvent.actualScore);
      expect(primitiveProps.filterBy).toBe(mainEvent.filterBy);
      expect(primitiveProps.isShowActualScore).toBe(true);
      expect(primitiveProps.isCheckedVar).toBe(mainEvent.isCheckedVar);
      expect(primitiveProps.isShowRelatedEvents).toBe(mockIsHasRelatedEvent);
      expect(SubIssueTypeRelatedEvent.isHasRelatedEvent).toHaveBeenCalledWith(Number(mainEvent.subIssueTypeId));
    });

    it('should handle isCheckedVar as true', () => {
      // Arrange
      const mainEvent = Helper.getFakeWrongScoreModel();
      mainEvent.isCheckedVar = true;
      const primitiveProps = Helper.getFakePrimitiveProperty();
      jest.spyOn(SubIssueTypeRelatedEvent, 'isHasRelatedEvent').mockReturnValue(false);

      // Act
      service.assignPrimitivePropsEditRequest(mainEvent, primitiveProps);

      // Assert
      expect(primitiveProps.isCheckedVar).toBe(true);
    });

    it('should handle isCheckedVar as false', () => {
      // Arrange
      const mainEvent = Helper.getFakeWrongScoreModel();
      mainEvent.isCheckedVar = false;
      const primitiveProps = Helper.getFakePrimitiveProperty();
      jest.spyOn(SubIssueTypeRelatedEvent, 'isHasRelatedEvent').mockReturnValue(false);

      // Act
      service.assignPrimitivePropsEditRequest(mainEvent, primitiveProps);

      // Assert
      expect(primitiveProps.isCheckedVar).toBe(false);
    });
  });

  describe('getMainWrongScoreModel', () => {
    it('should return first model when array has only one element', () => {
      // Arrange
      const wrongScoreModels = [Helper.getFakeWrongScoreModel()];

      // Act
      const result = service.getMainWrongScoreModel(wrongScoreModels);

      // Assert
      expect(result).toBe(wrongScoreModels[0]);
    });

    it('should return first model when first model filterBy is not CHECK_TIME', () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      wrongScoreModels[0].filterBy = TVSRequestFilterBy.TRANS_TIME;

      // Act
      const result = service.getMainWrongScoreModel(wrongScoreModels);

      // Assert
      expect(result).toBe(wrongScoreModels[0]);
    });

    it('should return main match when first model filterBy is CHECK_TIME', () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      wrongScoreModels[0].filterBy = TVSRequestFilterBy.CHECK_TIME;
      wrongScoreModels[0].isMainMatch = false;
      wrongScoreModels[1].isMainMatch = true;

      // Act
      const result = service.getMainWrongScoreModel(wrongScoreModels);

      // Assert
      expect(result).toBe(wrongScoreModels[1]);
    });

    it('should return undefined when no main match found', () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      wrongScoreModels[0].filterBy = TVSRequestFilterBy.CHECK_TIME;
      wrongScoreModels[0].isMainMatch = false;
      wrongScoreModels[1].isMainMatch = false;

      // Act
      const result = service.getMainWrongScoreModel(wrongScoreModels);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('getAllRelatedEvents', () => {
    it('should get all related events successfully', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const mainEvent = Helper.getFakeLogInfoRelatedEvent();
      const childEvents: ChildMatchModel[] = [];
      const mockChildMatches = [Helper.getFakeChildMatchModel()];
      const mockRelatedEvents = [
        {
          matchId: 1,
          matchCode: 'A001',
          leagueName: 'Test League 1',
          eventName: 'Test Event 1',
          isMainMatch: false,
          subIssueTypeId: 1,
          eventDate: new Date('2024-03-20T10:00:00'),
          sportType: 1
        } as LogInfoRelatedEvent,
        {
          matchId: 2,
          matchCode: 'B002',
          leagueName: 'Test League 2',
          eventName: 'Test Event 2',
          isMainMatch: false,
          subIssueTypeId: 1,
          eventDate: new Date('2024-03-20T10:00:00'),
          sportType: 1
        } as LogInfoRelatedEvent,
        {
          matchId: 1,
          matchCode: 'A001',
          leagueName: 'Test League 1',
          eventName: 'Test Event 1',
          isMainMatch: false,
          subIssueTypeId: 1,
          eventDate: new Date('2024-03-20T10:00:00'),
          sportType: 1
        } as LogInfoRelatedEvent // Duplicate to test uniqBy
      ];

      relatedEventService.getGetInfoChildMatch.mockResolvedValue(mockChildMatches);
      relatedEventService.assignModelsToEvents.mockImplementation(async (relatedEvents, wrongScoreModels, childEvents, eventDate) => {
        // Simulate adding events to relatedEvents array
        relatedEvents.push(...mockRelatedEvents);
      });

      // Act
      const result = await service.getAllRelatedEvents(wrongScoreModels, mainEvent, childEvents);

      // Assert
      expect(relatedEventService.getGetInfoChildMatch).toHaveBeenCalledWith(
        mainEvent.matchId, 
        true, 
        mainEvent.sportType, 
        mainEvent.eventDate.toString()
      );
      expect(childEvents).toContain(mockChildMatches[0]);
      expect(relatedEventService.assignModelsToEvents).toHaveBeenCalledWith(
        expect.any(Array), 
        wrongScoreModels, 
        childEvents, 
        mainEvent.eventDate
      );
      // After lodash operations, we should have unique events sorted by matchCode
      expect(result).toHaveLength(2); // 2 unique events after uniqBy
      expect(result[0]).toEqual(expect.objectContaining({ matchId: 1, matchCode: 'A001' }));
      expect(result[1]).toEqual(expect.objectContaining({ matchId: 2, matchCode: 'B002' }));
    });

    it('should handle empty child matches', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const mainEvent = Helper.getFakeLogInfoRelatedEvent();
      const childEvents: ChildMatchModel[] = [];

      relatedEventService.getGetInfoChildMatch.mockResolvedValue([]);
      relatedEventService.assignModelsToEvents.mockResolvedValue(undefined);

      // Act
      const result = await service.getAllRelatedEvents(wrongScoreModels, mainEvent, childEvents);

      // Assert
      expect(childEvents).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const mainEvent = Helper.getFakeLogInfoRelatedEvent();
      const childEvents: ChildMatchModel[] = [];

      relatedEventService.getGetInfoChildMatch.mockRejectedValue(new Error('Service error'));

      // Act & Assert
      await expect(service.getAllRelatedEvents(wrongScoreModels, mainEvent, childEvents))
        .rejects.toThrow('Service error');
    });
  });

  describe('getScoreWrongScoreModels', () => {
    it('should update existing models and add new ones', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const mockModelScores = [
        Helper.getFakeWrongScoreModelForMock(),
        { ...Helper.getFakeWrongScoreModelForMock(), scoreId: 3, isActive: true }
      ];

      wrongScoreService.callApiGetWrongScores.mockResolvedValue(mockModelScores);

      // Act
      const result = await service.getScoreWrongScoreModels(wrongScoreModels, Helper.fakeMatchId);

      // Assert
      expect(wrongScoreService.callApiGetWrongScores).toHaveBeenCalledWith(Helper.fakeMatchId);
      expect(wrongScoreModels[0].isActive).toBe(true); // Updated
      expect(wrongScoreModels).toHaveLength(3); // Original 2 + 1 new
      expect(result).toEqual(mockModelScores);
    });

    it('should handle empty model scores', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const originalLength = wrongScoreModels.length;

      wrongScoreService.callApiGetWrongScores.mockResolvedValue([]);

      // Act
      const result = await service.getScoreWrongScoreModels(wrongScoreModels, Helper.fakeMatchId);

      // Assert
      expect(wrongScoreModels).toHaveLength(originalLength); // No new models added
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();

      wrongScoreService.callApiGetWrongScores.mockRejectedValue(new Error('API error'));

      // Act & Assert
      await expect(service.getScoreWrongScoreModels(wrongScoreModels, Helper.fakeMatchId))
        .rejects.toThrow('API error');
    });

    it('should not add duplicate models', async () => {
      // Arrange
      const wrongScoreModels = Helper.getFakeWrongScoreModels();
      const mockModelScores = [
        { ...Helper.getFakeWrongScoreModelForMock(), isActive: false }, // Update existing only
        { ...Helper.getFakeWrongScoreModelForMock(), scoreId: 2, isActive: true }   // Update existing only
      ];

      wrongScoreService.callApiGetWrongScores.mockResolvedValue(mockModelScores);

      // Act
      const result = await service.getScoreWrongScoreModels(wrongScoreModels, Helper.fakeMatchId);

      // Assert
      expect(wrongScoreModels).toHaveLength(2); // No new models added
      expect(wrongScoreModels[0].isActive).toBe(false);
      expect(wrongScoreModels[1].isActive).toBe(true);
      expect(result).toEqual(mockModelScores);
    });
  });
});
