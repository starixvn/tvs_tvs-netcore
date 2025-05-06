import { TestBed } from '@angular/core/testing';
import { EventWrongScoreService } from './event-wrong-score.service';
import { ValidationService } from './validation.service';
import { WrongScoreService } from './wrong-score.service';
import { MatchModel } from '../../../../../utility/models/match.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { AcceptType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { PrimitiveProperty } from '../event-wrong-score.model';
describe('EventWrongScoreService', () => {
  let service: EventWrongScoreService;
  let validationService: jest.Mocked<ValidationService>;
  let wrongScoreService: jest.Mocked<WrongScoreService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventWrongScoreService,
        { provide: ValidationService, useValue: {
          isSubTypeFilterByAcceptedTime: jest.fn(),
          isSubTypeFilterByTransTimeAndAcceptedTime: jest.fn()
        } },
        { provide: WrongScoreService, useValue: {
          callApiGetWrongScores: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongScoreService);
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    wrongScoreService = TestBed.inject(WrongScoreService) as jest.Mocked<WrongScoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllWrongScoreModels', () => {
    it('should get all wrong score models and update the input array', async () => {
      const mockWrongScoreModels: WrongScoreModel[] = [];
      const mockMatchId = 123;
      const mockApiResponse: WrongScoreModel[] = [
        { matchId: 123, eventDate: new Date(), sportType: 1 } as WrongScoreModel
      ];

      wrongScoreService.callApiGetWrongScores.mockResolvedValue(mockApiResponse);

      const result = await service.getAllWrongScoreModels(mockWrongScoreModels, mockMatchId);

      expect(result).toEqual(mockApiResponse);
      expect(mockWrongScoreModels).toEqual(mockApiResponse);
      expect(wrongScoreService.callApiGetWrongScores).toHaveBeenCalledWith(mockMatchId);
    });
  });

  describe('updateMainMatch', () => {
    it('should update main event with selected match data', () => {
      const mainEvent: WrongScoreModel = {} as WrongScoreModel;
      const selectedMatch: MatchModel = {
        matchId: 123,
        eventDate: new Date(),
        sportType: 1
      } as MatchModel;

      service.updateMainMatch(mainEvent, selectedMatch);

      expect(mainEvent.matchId).toBe(selectedMatch.matchId);
      expect(mainEvent.eventDate).toBe(selectedMatch.eventDate);
      expect(mainEvent.sportType).toBe(selectedMatch.sportType);
    });
  });

  describe('resetPrimitiveProperty', () => {
    it('should reset primitive property with correct filter by value', () => {
      const primitiveProps: PrimitiveProperty = {} as PrimitiveProperty;
      const subIssueTypeId = '123';

      validationService.isSubTypeFilterByAcceptedTime.mockReturnValue(true);
      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);

      service.resetPrimitiveProperty(primitiveProps, subIssueTypeId);

      expect(primitiveProps.filterBy).toBe(TVSRequestFilterBy.CHECK_TIME);
      expect(primitiveProps.isCheckedVar).toBeNull();
      expect(primitiveProps.isHighLightVarCheck).toBeNull();
      expect(primitiveProps.isShowRelatedEvents).toBeFalsy();
    });
  });

  describe('getTvDetectionModel', () => {
    it('should convert WrongScoreModel to TvDetectionModel', () => {
      const inputModel = {
        serviceAcceptTime: new Date(),
        actualTime: new Date(),
        tvDetectionValue: 1,
        minuteOffset: 5,
        secondOffset: 30,
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: '123',
        matchId: 1,
        eventDate: new Date(),
        sportType: 1
      } as unknown as WrongScoreModel;

      const result = service.getTvDetectionModel(inputModel);

      expect(result).toEqual({
        serviceAcceptTime: inputModel.serviceAcceptTime,
        actualTime: inputModel.actualTime,
        tvDetectionValue: inputModel.tvDetectionValue,
        minuteOffset: inputModel.minuteOffset,
        secondOffset: inputModel.secondOffset
      } as TvDetectionModel);
    });
  });

  describe('getFilterByBaseOnSubIssueType', () => {
    it('should return correct filter by value based on sub issue type', () => {
      const subIssueTypeId = '123';

      validationService.isSubTypeFilterByAcceptedTime.mockReturnValue(true);
      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);
      expect(service.getFilterByBaseOnSubIssueType(subIssueTypeId)).toBe(TVSRequestFilterBy.CHECK_TIME);

      validationService.isSubTypeFilterByAcceptedTime.mockReturnValue(false);
      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(true);
      expect(service.getFilterByBaseOnSubIssueType(subIssueTypeId)).toBe(TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME);

      validationService.isSubTypeFilterByAcceptedTime.mockReturnValue(false);
      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);
      expect(service.getFilterByBaseOnSubIssueType(subIssueTypeId)).toBe(TVSRequestFilterBy.TRANS_TIME);
    });
  });

  describe('getHighlightMinTimeClass', () => {
    it('should return correct highlight class based on accept type', () => {
      const minTime = new Date();

      expect(service.getHighlightMinTimeClass(AcceptType.AUTO_ACCEPT, minTime))
        .toEqual({ acceptTypeName: 'AA', highlightTimeClass: 'highlight-min-aa' });

      expect(service.getHighlightMinTimeClass(AcceptType.SECOND_ACCEPT, minTime))
        .toEqual({ acceptTypeName: 'SA', highlightTimeClass: 'highlight-min-sa' });

      expect(service.getHighlightMinTimeClass(AcceptType.PENDING_ACCEPT, minTime))
        .toEqual({ acceptTypeName: 'PA', highlightTimeClass: 'highlight-min-pa' });

      expect(service.getHighlightMinTimeClass(0, undefined))
        .toEqual({ acceptTypeName: '', highlightTimeClass: '' });
    });
  });

  describe('updateCheckRelatedEvent', () => {
    it('should filter related events correctly', () => {
      const selectedRelatedEvents: ChildMatchModel[] = [
        { matchId: 1 } as ChildMatchModel
      ];
      const allRelatedEvents: LogInfoRelatedEvent[] = [
        { matchId: 1 } as LogInfoRelatedEvent,
        { matchId: 2 } as LogInfoRelatedEvent
      ];
      const relatedEvents: ChildMatchModel[] = [
        { matchId: 2, matchType: 1 } as ChildMatchModel
      ];
      const matchType = 1;

      const result = service.updateCheckRelatedEvent(selectedRelatedEvents, allRelatedEvents, relatedEvents, matchType);

      expect(result.length).toBe(1);
      expect(result[0].matchId).toBe(1);
    });
  });
});
