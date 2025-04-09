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

describe('EditRequestService', () => {
  let service: EditRequestService;
  let relatedEventService: jest.Mocked<RelatedEventService>;
  let wrongScoreService: jest.Mocked<WrongScoreService>;
  let eventWrongScoreService: jest.Mocked<EventWrongScoreService>;

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
    eventWrongScoreService = TestBed.inject(EventWrongScoreService) as jest.Mocked<EventWrongScoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignPrimitivePropsEditRequest', () => {
    it('should assign primitive properties correctly', () => {
      const mainEvent = {
        actualScore: '1-0',
        filterBy: TVSRequestFilterBy.CHECK_TIME,
        isCheckedVar: true,
        subIssueTypeId: '123'
      } as unknown as WrongScoreModel;

      const primitiveProps = {} as PrimitiveProperty;

      eventWrongScoreService.isHasRelatedEvent.mockReturnValue(true);

      service.assignPrimitivePropsEditRequest(mainEvent, primitiveProps);

      expect(primitiveProps.actualScore).toBe(mainEvent.actualScore);
      expect(primitiveProps.filterBy).toBe(mainEvent.filterBy);
      expect(primitiveProps.isShowActualScore).toBeTruthy();
      expect(primitiveProps.isCheckedVar).toBe(mainEvent.isCheckedVar);
      expect(primitiveProps.isHighLightVarCheck).toBe(!mainEvent.isCheckedVar);
      expect(primitiveProps.isShowRelatedEvents).toBeTruthy();
    });
  });

  describe('getMainWrongScoreModel', () => {
    it('should return first model when array has one item', () => {
      const wrongScoreModels: WrongScoreModel[] = [
        { scoreId: 1 } as WrongScoreModel
      ];

      const result = service.getMainWrongScoreModel(wrongScoreModels);

      expect(result).toBe(wrongScoreModels[0]);
    });

    it('should return first model when filterBy is not CHECK_TIME', () => {
      const wrongScoreModels: WrongScoreModel[] = [
        { scoreId: 1, filterBy: TVSRequestFilterBy.TRANS_TIME } as WrongScoreModel,
        { scoreId: 2, filterBy: TVSRequestFilterBy.TRANS_TIME } as WrongScoreModel
      ];

      const result = service.getMainWrongScoreModel(wrongScoreModels);

      expect(result).toBe(wrongScoreModels[0]);
    });

    it('should return model with isMainMatch when filterBy is CHECK_TIME', () => {
      const wrongScoreModels: WrongScoreModel[] = [
        { scoreId: 1, filterBy: TVSRequestFilterBy.CHECK_TIME, isMainMatch: false } as WrongScoreModel,
        { scoreId: 2, filterBy: TVSRequestFilterBy.CHECK_TIME, isMainMatch: true } as WrongScoreModel
      ];

      const result = service.getMainWrongScoreModel(wrongScoreModels);

      expect(result).toBe(wrongScoreModels[1]);
    });
  });

  describe('getAllRelatedEvents', () => {
    it('should get and process related events correctly', async () => {
      const wrongScoreModels: WrongScoreModel[] = [
        { matchId: 1, sportType: 1, eventDate: new Date() } as WrongScoreModel
      ];
      const mainEvent = wrongScoreModels[0];
      const relatedEvents: ChildMatchModel[] = [];
      const mockChildMatches = [
        { matchId: 2, matchCode: 'B' } as ChildMatchModel,
        { matchId: 3, matchCode: 'A' } as ChildMatchModel
      ];

      relatedEventService.getGetInfoChildMatch.mockResolvedValue(mockChildMatches);
      relatedEventService.assignModelsToEvents.mockResolvedValue(undefined);

      const result = await service.getAllRelatedEvents(wrongScoreModels, mainEvent, relatedEvents);

      expect(relatedEvents).toEqual(mockChildMatches);
      expect(relatedEventService.getGetInfoChildMatch).toHaveBeenCalledWith(
        mainEvent.matchId,
        true,
        mainEvent.sportType,
        mainEvent.eventDate.toString()
      );
      expect(relatedEventService.assignModelsToEvents).toHaveBeenCalled();
      expect(result).toEqual(_.orderBy(_.uniqBy(result, x => x.matchId), ['matchCode'], ['asc']));
    });
  });

  describe('getScoreWrongScoreModels', () => {
    it('should update existing models and add new ones', async () => {
      const wrongScoreModels: WrongScoreModel[] = [
        { scoreId: 1, isActive: false } as WrongScoreModel
      ];
      const matchId = 123;
      const mockApiResponse: WrongScoreModel[] = [
        { scoreId: 1, isActive: true } as WrongScoreModel,
        { scoreId: 2, isActive: true } as WrongScoreModel
      ];

      wrongScoreService.callApiGetWrongScores.mockResolvedValue(mockApiResponse);

      const result = await service.getScoreWrongScoreModels(wrongScoreModels, matchId);

      expect(wrongScoreModels.length).toBe(2);
      expect(wrongScoreModels[0].isActive).toBeTruthy();
      expect(wrongScoreModels[1].scoreId).toBe(2);
      expect(result).toEqual(mockApiResponse);
      expect(wrongScoreService.callApiGetWrongScores).toHaveBeenCalledWith(matchId);
    });
  });
});
