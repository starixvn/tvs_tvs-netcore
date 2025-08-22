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
import { ConfirmWrongScoreModel } from '../confirm-wrong-score/confirm-wrong-score.model';
import { UpdateConfirmInfoArgs } from '../models/confirm-wrong-score.model';
import { TEXT } from '../../../../../utility/constants/text';

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
          isSubTypeFilterByTransTimeAndAcceptedTime: jest.fn(),
          isHasWarningSettledTicket: jest.fn(),
          isValidationHasWarningTicket: jest.fn(),
          isHasWarningEditTakeNoteRequest: jest.fn(),
          isEditingByAnotherUser: jest.fn()
        } },
        { provide: WrongScoreService, useValue: {
          callApiGetWrongScores: jest.fn()
        } }
      ]
    });

    service = TestBed.inject(EventWrongScoreService);
    validationService = TestBed.inject(ValidationService) as jest.Mocked<ValidationService>;
    wrongScoreService = TestBed.inject(WrongScoreService) as jest.Mocked<WrongScoreService>;

    // Mock document.body
    document.body.innerHTML = '<div id="body" user-id="789"></div>';
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
      const mainEvent = {} as LogInfoRelatedEvent;
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
      const subIssueTypeId = '1111';

      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);

      service.resetPrimitiveProperty(primitiveProps, subIssueTypeId);

      expect(primitiveProps.filterBy).toBe(TVSRequestFilterBy.TRANS_TIME);
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

      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);
      expect(service.getFilterByBaseOnSubIssueType('3')).toBe(TVSRequestFilterBy.TRANS_TIME);

      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(true);
      expect(service.getFilterByBaseOnSubIssueType('2')).toBe(TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME);

      validationService.isSubTypeFilterByTransTimeAndAcceptedTime.mockReturnValue(false);
      expect(service.getFilterByBaseOnSubIssueType('3')).toBe(TVSRequestFilterBy.TRANS_TIME);
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

  describe('updateWarningConfirm', () => {
    it('should update warning confirm with correct values', () => {
      const confirmWrongScoreModel = {
        warningExcludedScores: [],
        warningRelatedEvents: [],
        isHasSettledTicket: false,
        isHasWarningForWrongScore: false,
        isHasWarningEditTakeNoteRequest: false
      } as ConfirmWrongScoreModel;

      const args = {
        wrongScoreModels: [
          { isChecked: true, wrongScore: '1-0', messageValidationLogInfo: [] },
          { isChecked: false, wrongScore: '2-0', messageValidationLogInfo: [] }
        ],
        filter: { isVoided: false, action: 'action' },
        relatedEvents: [
          { 
            eventName: 'Event 1',
            messageValidationLogInfo: [{ reason: TEXT.NO_VALID_TICKETS_IN_RANGE }]
          }
        ],
        mainEvent: { messageValidationLogInfo: [] },
        isEdit: false,
        actionIdOfFirstTimeAccess: '123'
      } as UpdateConfirmInfoArgs;

      validationService.isHasWarningSettledTicket.mockReturnValue(true);
      validationService.isValidationHasWarningTicket.mockReturnValue(true);
      validationService.isHasWarningEditTakeNoteRequest.mockReturnValue(true);

      service['updateWarningConfirm'](confirmWrongScoreModel, args, '123');

      expect(confirmWrongScoreModel.warningRelatedEvents).toContain('Event 1');
      expect(confirmWrongScoreModel.isHasSettledTicket).toBe(true);
      expect(confirmWrongScoreModel.isHasWarningForWrongScore).toBe(true);
      expect(confirmWrongScoreModel.isHasWarningEditTakeNoteRequest).toBe(true);
    });

    it('should not update warnings when isVoided is true', () => {
      const confirmWrongScoreModel = {
        warningExcludedScores: [],
        warningRelatedEvents: [],
        isHasSettledTicket: false,
        isHasWarningForWrongScore: false,
        isHasWarningEditTakeNoteRequest: false
      } as ConfirmWrongScoreModel;

      const args = {
        wrongScoreModels: [],
        filter: { isVoided: true, action: 'action' },
        relatedEvents: [],
        mainEvent: {},
        isEdit: false,
        actionIdOfFirstTimeAccess: '123'
      } as UpdateConfirmInfoArgs;

      service['updateWarningConfirm'](confirmWrongScoreModel, args, '123');

      expect(confirmWrongScoreModel.warningRelatedEvents).toHaveLength(0);
      expect(confirmWrongScoreModel.warningExcludedScores).toHaveLength(0);
      expect(confirmWrongScoreModel.isHasSettledTicket).toBe(false);
      expect(confirmWrongScoreModel.isHasWarningForWrongScore).toBe(false);
      expect(confirmWrongScoreModel.isHasWarningEditTakeNoteRequest).toBe(false);
    });
  });

  describe('updateInfoConfirm', () => {
    it('should update confirm info with correct values', () => {
      const confirmWrongScoreModel = {
        isOpenDialog: false
      } as ConfirmWrongScoreModel;

      const args = {
        actionIdOfFirstTimeAccess: '123',
        isEdit: true,
        userId: 456,
        requestId: 789,
        requestedBy: 'User',
        issueTypes: {
          issueTypes: [{ issueTypeId: 1, issueTypeName: 'Issue 1' }],
          selectedSubIssueTypes: [{ 
            subIssueTypeId: 2, 
            subIssueTypeName: 'Sub Issue 1',
            issueTypeId: 1,
            subIssueTypeNameCS: 'Sub Issue 1 CS'
          }],
          subIssueTypes: [],
          issueId: 1,
          subIssueId: 2
        },
        filter: {
          issueTypeId: '1',
          subIssueTypeId: '2'
        },
        relatedEvents: [],
        mainEvent: {},
        wrongScoreModels: []
      } as UpdateConfirmInfoArgs;

      validationService.isEditingByAnotherUser.mockReturnValue(false);

      service.updateInfoConfirm(confirmWrongScoreModel, args);

      expect(confirmWrongScoreModel.isOpenDialog).toBe(true);
      expect(confirmWrongScoreModel.isEditingByAnotherUser).toBe(false);
      expect(confirmWrongScoreModel.requestId).toBe(789);
      expect(confirmWrongScoreModel.requestedBy).toBe('User');
      expect(confirmWrongScoreModel.issueTypeName).toBe('Issue 1');
      expect(confirmWrongScoreModel.subIssueTypeName).toBe('Sub Issue 1');
    });
  });
});
