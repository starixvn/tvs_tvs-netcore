import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../filter/filter.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from '../../add-request.store';
import { FilterWrongScoreComponent } from '../filter-wrong-score/filter-wrong-score.component';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { QueryList } from '@angular/core';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { PrimitiveProperty } from '../event-wrong-score.model';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        { provide: AddRequestStore, useValue: { checkValidSubIssueTypeInFilter: jest.fn() } },
        { provide: EventLeagueComponent, useValue: { isMatchIdValid: jest.fn() } },
        { provide: FilterWrongScoreComponent, useValue: { isValid: jest.fn() } },
        { provide: TvDetectionComponent, useValue: { isValid: jest.fn() } }
      ]
    });

    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateCommonData', () => {
    it('should return false when subIssueTypeId is missing', () => {
      // Arrange
      const filter = new FilterModel();
      filter.subIssueTypeId = null;
      const eventLeagueComponent = {
        isMatchIdValid: jest.fn()
      } as unknown as EventLeagueComponent;
      const addRequestStore = {
        checkValidSubIssueTypeInFilter: jest.fn()
      } as unknown as AddRequestStore;
      const filterWrongScoreComponent = {
        isValid: jest.fn()
      } as unknown as FilterWrongScoreComponent;
      // Act
      const result = service.validateCommonData(
        filter,
        eventLeagueComponent,
        addRequestStore,
        filterWrongScoreComponent,
        []
      );

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidityTvDetection', () => {
    it('should return true when component is not provided', () => {
      // Act
      const result = service.isValidityTvDetection();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return component isValid result when provided', () => {
      // Arrange
      const tvDetectionComponent = {
        isValid: jest.fn().mockReturnValue(true)
      } as unknown as TvDetectionComponent;

      // Act
      const result = service.isValidityTvDetection(tvDetectionComponent);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isFromTimeSameOrBeforeToTime', () => {
    it('should return true when from time is before to time', () => {
      // Arrange
      const filterFromTransTime = '2024-01-01 00:00:00';
      const filterToTransTime = '2024-01-01 01:00:00';
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrBeforeToTime(filterFromTransTime, filterToTransTime, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });

    it('should return false and display tooltip when from time is after to time', () => {
      // Arrange
      const filterFromTransTime = '2024-01-01 01:00:00';
      const filterToTransTime = '2024-01-01 00:00:00';
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrBeforeToTime(filterFromTransTime, filterToTransTime, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('from-date-time', TEXT.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
    });
  });

  describe('isFromTimeSameOrAfterDefaultValue', () => {
    it('should return true when from time is after default value', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        filterFromTransTime: '2024-01-01 01:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel = {
        scoreId: 1,
        filterFromTransTime: '2024-01-01 00:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrAfterDefaultValue(wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });

    it('should return false and display tooltip when from time is before default value', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        filterFromTransTime: '2024-01-01 00:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel = {
        scoreId: 1,
        filterFromTransTime: '2024-01-01 01:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrAfterDefaultValue(wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('from-date-time', TEXT.FROM_TIME_MUST_GREATER_THAN_DEFAULT);
    });
  });

  describe('isToTimeSmallerThanFromTimeNextScore', () => {
    it('should return true when it is the last score', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 2,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel1 = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel2 = {
        scoreId: 2,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel1, originWrongScoreModel2];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isToTimeSmallerThanFromTimeNextScore(1, wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });

    it('should return false when to time is not smaller than next score from time', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        filterToTransTime: '2024-01-01 01:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel1 = {
        scoreId: 1,
        filterToTransTime: '2024-01-01 01:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModel2 = {
        scoreId: 2,
        filterFromTransTime: '2024-01-01 00:00:00',
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterToTransTime: '',
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel1, originWrongScoreModel2];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isToTimeSmallerThanFromTimeNextScore(0, wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('to-date-time', TEXT.TO_TIME_MUST_SMALLER_THAN_FOLLOWING_CONSECUTIVE_FROM_TIME);
    });
  });

  describe('isAllWrongScoreModelsValid', () => {
    it('should return true when filterBy is CHECK_TIME and all events are valid', () => {
      // Arrange
      const args: ValidationBusinessRuleArgs = {
        primitiveProps: {
          filterBy: TVSRequestFilterBy.CHECK_TIME
        },
        mainEvent: {
          isMainMatch: true,
          messageValidationLogInfo: [{ isError: false }]
        } as LogInfoRelatedEvent,
        relatedEvents: [{
          isMainMatch: false,
          messageValidationLogInfo: [{ isError: false }]
        } as LogInfoRelatedEvent],
        wrongScoreModels: []
      } as unknown as ValidationBusinessRuleArgs;

      // Act
      const result = service.isAllWrongScoreModelsValid(args);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when filterBy is CHECK_TIME and main event has error', () => {
      // Arrange
      const args: ValidationBusinessRuleArgs = {
        primitiveProps: {
          filterBy: TVSRequestFilterBy.CHECK_TIME
        },
        mainEvent: {
          isMainMatch: true,
          messageValidationLogInfo: [{ isError: true }]
        } as LogInfoRelatedEvent,
        relatedEvents: [],
        wrongScoreModels: []
      } as unknown as ValidationBusinessRuleArgs;

      // Act
      const result = service.isAllWrongScoreModelsValid(args);

      // Assert
      expect(result).toBeFalsy();
    });

    it('isValidAllEventCheckTime should return false when filterBy is CHECK_TIME and child event has error', () => {
      // Arrange
      const mainEvent = {} as LogInfoRelatedEvent;
      const relatedEvents = [{ messageValidationLogInfo: [{ isError: true, reason: 'exit in another request' }] }, { messageValidationLogInfo: [{ isError: true, reason: 'No valid tickets found in the current range' }] }] as LogInfoRelatedEvent[];
      
      // Act
      const result = service['isValidAllEventCheckTime'](mainEvent, relatedEvents);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return true when filterBy is CHECK_TIME and child event has error No valid tickets', () => {
      // Arrange
      const args: ValidationBusinessRuleArgs = {
        primitiveProps: {
          filterBy: TVSRequestFilterBy.CHECK_TIME
        },
        mainEvent: {
          isMainMatch: true,
          messageValidationLogInfo: []
        } as LogInfoRelatedEvent,
        relatedEvents: [{ messageValidationLogInfo: [{ isError: true, reason: 'No valid tickets found in the current range' }]},] as unknown as LogInfoRelatedEvent[],
      } as unknown as ValidationBusinessRuleArgs;

      // Act
      const result = service.isAllWrongScoreModelsValid(args);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when filterBy is not CHECK_TIME and at least one score is valid', () => {
      // Arrange
      const args = {
        primitiveProps: {
          filterBy: TVSRequestFilterBy.TRANS_TIME
        } as unknown as PrimitiveProperty,
        mainEvent: null,
        relatedEvents: [],
        wrongScoreModels: [{
          messageValidationLogInfo: [{ isError: false }]
        }]
      } as unknown as ValidationBusinessRuleArgs;

      // Act
      const result = service.isAllWrongScoreModelsValid(args);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isValidAllScores', () => {
    it('should return true when at least one score has no errors', () => {
      // Arrange
      const wrongScores = [
        { messageValidationLogInfo: [{ isError: true }] },
        { messageValidationLogInfo: [{ isError: false }] }
      ] as WrongScoreModel[];

      // Act
      const result = service.isValidAllScores(wrongScores);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when all scores have errors', () => {
      // Arrange
      const wrongScores = [
        { messageValidationLogInfo: [{ isError: true }] },
        { messageValidationLogInfo: [{ isError: true }] }
      ] as WrongScoreModel[];

      // Act
      const result = service.isValidAllScores(wrongScores);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasWarningEditTakeNoteRequest', () => {
    it('should return true when editing take note request with different action ID', () => {
      // Arrange
      const isEdit = true;
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const actionIdOfFirstTime = '3';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when not editing', () => {
      // Arrange
      const isEdit = false;
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const actionIdOfFirstTime = '2';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidationHasWarningTicket', () => {
    it('should return true when wrong score models have validation messages', () => {
      // Arrange
      const wrongScoreModels = [{
        messageValidationLogInfo: [{ isError: true }]
      }] as WrongScoreModel[];
      const relatedEvents = [] as LogInfoRelatedEvent[];

      // Act
      const result = service.isValidationHasWarningTicket(wrongScoreModels, relatedEvents);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when related events have validation messages', () => {
      // Arrange
      const wrongScoreModels = [] as WrongScoreModel[];
      const relatedEvents = [{
        messageValidationLogInfo: [{ isError: true }]
      }] as LogInfoRelatedEvent[];

      // Act
      const result = service.isValidationHasWarningTicket(wrongScoreModels, relatedEvents);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isHasWarningSettledTicket', () => {
    it('should return true when wrong score models have settled tickets', () => {
      // Arrange
      const wrongScoreModels = [{
        logInfoDetail: { settleCount: 1 }
      }] as WrongScoreModel[];
      const relatedEvents = [] as LogInfoRelatedEvent[];

      // Act
      const result = service.isHasWarningSettledTicket(wrongScoreModels, relatedEvents);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when related events have settled tickets', () => {
      // Arrange
      const wrongScoreModels = [] as WrongScoreModel[];
      const relatedEvents = [{
        logInfoDetail: { settleCount: 1 }
      }] as LogInfoRelatedEvent[];

      // Act
      const result = service.isHasWarningSettledTicket(wrongScoreModels, relatedEvents);

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('isHasAllowanceTime', () => {
    it('should return true when event has allowance time', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 1,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when all allowance times are 0', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: 0,
          paTime: 0,
          saTime: 0
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no allowance time is set', () => {
      // Arrange
      const event = {
        voidTimeArea: {
          aaTime: null,
          paTime: null,
          saTime: null
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasAllowanceTimeWrongScoreModel', () => {
    it('should return true when model has allowance time', () => {
      // Arrange
      const model = {
        aaTime: 1,
        paTime: 0,
        saTime: 0
      } as WrongScoreModel;

      // Act
      const result = service.isHasAllowanceTimeWrongScoreModel(model);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when all allowance times are 0', () => {
      // Arrange
      const model = {
        aaTime: 0,
        paTime: 0,
        saTime: 0
      } as WrongScoreModel;

      // Act
      const result = service.isHasAllowanceTimeWrongScoreModel(model);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no allowance time is set', () => {
      // Arrange
      const model = {
        aaTime: null,
        paTime: null,
        saTime: null
      } as WrongScoreModel;

      // Act
      const result = service.isHasAllowanceTimeWrongScoreModel(model);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidAllSubIssueType', () => {
    it('should return true when all components have subIssueTypeId', () => {
      // Arrange
      const components = [
        { logInfo: { subIssueTypeId: 1 }, showTooltipSubType: jest.fn() },
        { logInfo: { subIssueTypeId: 2 }, showTooltipSubType: jest.fn() }
      ] as unknown as LogInfoRelatedEventComponent[];

      const queryList = new QueryList<LogInfoRelatedEventComponent>();
      queryList.reset(components);

      // Act
      const result = service.isValidAllSubIssueType(queryList);

      // Assert
      expect(result).toBeTruthy();
      components.forEach(comp => expect(comp.showTooltipSubType).not.toHaveBeenCalled());
    });

    it('should return false and show tooltip when any component is missing subIssueTypeId', () => {
      // Arrange
      const components = [
        { logInfo: { subIssueTypeId: 1 }, showTooltipSubType: jest.fn() },
        { logInfo: { subIssueTypeId: null }, showTooltipSubType: jest.fn() }
      ] as unknown as LogInfoRelatedEventComponent[];

      const queryList = new QueryList<LogInfoRelatedEventComponent>();
      queryList.reset(components);

      // Act
      const result = service.isValidAllSubIssueType(queryList);

      // Assert
      expect(result).toBeFalsy();
      expect(components[1].showTooltipSubType).toHaveBeenCalled();
    });
  });

  describe('isSubTypeFilterByTransTimeAndAcceptedTime', () => {
    it('should return true for WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS.toString();

      // Act
      const result = service.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true for WRONG_INDICATION_SWAP_TEAM_SCORE_ONWARDS', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_ONWARDS.toString();

      // Act
      const result = service.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for other sub issue types', () => {
      // Arrange
      const subIssueTypeId = '999';

      // Act
      const result = service.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isLastScore', () => {
    it('should return true when score is the last one', () => {
      // Arrange
      const wrongScoreModel = { scoreId: 2 } as WrongScoreModel;
      const originWrongScoreModels = [
        { scoreId: 1 },
        { scoreId: 2 }
      ] as WrongScoreModel[];

      // Act
      const result = service.isLastScore(wrongScoreModel, originWrongScoreModels);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when score is not the last one', () => {
      // Arrange
      const wrongScoreModel = { scoreId: 1 } as WrongScoreModel;
      const originWrongScoreModels = [
        { scoreId: 1 },
        { scoreId: 2 }
      ] as WrongScoreModel[];

      // Act
      const result = service.isLastScore(wrongScoreModel, originWrongScoreModels);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isEditingByAnotherUser', () => {
    it('should return true when editing by different user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when not editing', () => {
      // Arrange
      const isEdit = false;
      const editingBy = 1;
      const createdBy = 2;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBeFalsy();
    });

    it('should return false when editing by same user', () => {
      // Arrange
      const isEdit = true;
      const editingBy = 1;
      const createdBy = 1;

      // Act
      const result = service.isEditingByAnotherUser(isEdit, editingBy, createdBy);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input match ID equals main match ID', () => {
      // Arrange
      const inputMatchId = 1;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [] as LogInfoRelatedEvent[];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith(inputMatchIdClass, TEXT.INVALID_MATCHID);
    });

    it('should return false when input match ID exists in related events', () => {
      // Arrange
      const inputMatchId = 2;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [
        { isMainMatch: false, matchId: 2 }
      ] as LogInfoRelatedEvent[];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith(inputMatchIdClass, TEXT.MATCH_ID_EXISTS_IN_LIST);
    });

    it('should return true when input match ID is valid', () => {
      // Arrange
      const inputMatchId = 2;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [
        { isMainMatch: false, matchId: 3 }
      ] as LogInfoRelatedEvent[];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });
  });
});
