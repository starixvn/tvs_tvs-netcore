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
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { QueryList } from '@angular/core';
import { LogInfoRelatedEventComponent } from '../../components/log-info-related-event/log-info-related-event.component';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';

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
      expect(tooltip.display).toHaveBeenCalledWith('from-date-time', LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isFromTimeSameOrAfterDefaultValue(wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('from-date-time', LABELS.FROM_TIME_MUST_GREATER_THAN_DEFAULT);
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
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
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [originWrongScoreModel1, originWrongScoreModel2];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isToTimeSmallerThanFromTimeNextScore(0, wrongScoreModel, originWrongScoreModels, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith('to-date-time', LABELS.TO_TIME_MUST_SMALLER_THAN_FOLLOWING_CONSECUTIVE_FROM_TIME);
    });
  });

  describe('isValidAllScores', () => {
    it('should return true when at least one score has no errors', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const wrongScores = [wrongScoreModel];

      // Act
      const result = service.isValidAllScores(wrongScores);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when all scores have errors', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: true, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const wrongScores = [wrongScoreModel];

      // Act
      const result = service.isValidAllScores(wrongScores);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasWarningEditTakeNoteRequest', () => {
    it('should return true when editing take note request', () => {
      // Arrange
      const isEdit = true;
      const currentActionId = TVSRequestActionType.TAKE_NOTE_ID.toString();
      const actionIdOfFirstTime = '1';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when not editing take note request', () => {
      // Arrange
      const isEdit = true;
      const currentActionId = '1';
      const actionIdOfFirstTime = '1';

      // Act
      const result = service.isHasWarningEditTakeNoteRequest(isEdit, currentActionId, actionIdOfFirstTime);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isValidationHasWarningTicket', () => {
    it('should return true when at least one score has validation messages', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: true, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const wrongScoreModels = [wrongScoreModel];

      // Act
      const result = service.isValidationHasWarningTicket(wrongScoreModels);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no scores have validation messages', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [],
        logInfoDetail: null
      } as WrongScoreModel;

      const wrongScoreModels = [wrongScoreModel];

      // Act
      const result = service.isValidationHasWarningTicket(wrongScoreModels);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasWarningSettledTicket', () => {
    it('should return true when at least one score has settled tickets', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [],
      } as WrongScoreModel;
      wrongScoreModel.logInfoDetail = {
        matchId: 1,
        liveScores: [],
        voidFromTime: '',
        voidToTime: '',
        settleCount: 1,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [],
        isActive: true,
        isChecked: false,
        isDisabled: false,
        isEdit: false,
        isMainMatch: false,
        leagueName: '',
        eventName: '',
        subIssueTypeId: 1,
        voidTimeArea: { aaTime: null, paTime: null, saTime: null }
      } as unknown as LogInfoDetail;
      const wrongScoreModels = [wrongScoreModel];

      // Act
      const result = service.isHasWarningSettledTicket(wrongScoreModels);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when no scores have settled tickets', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [],
        logInfoDetail: {
          matchId: 1,
          liveScores: [],
          voidFromTime: '',
          voidToTime: '',
          settleCount: 0,
          aaTime: null,
          paTime: null,
          saTime: null,
          messageValidationLogInfo: [],
          isActive: true,
          isChecked: false,
          isDisabled: false,
          isEdit: false,
          isMainMatch: false,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 1,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null } as FilterTimeWithAllowance
        } as unknown as LogInfoDetail
      } as WrongScoreModel;

      const wrongScoreModels = [wrongScoreModel];

      // Act
      const result = service.isHasWarningSettledTicket(wrongScoreModels);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isHasAllowanceTime', () => {
    it('should return true when event has allowance time', () => {
      // Arrange
      const event: LogInfoRelatedEvent = {
        voidTimeArea: {
          aaTime: 1,
          paTime: 2,
          saTime: 3
        }
      } as LogInfoRelatedEvent;

      // Act
      const result = service.isHasAllowanceTime(event);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return true when all allowance times are 0', () => {
      // Arrange
      const event: LogInfoRelatedEvent = {
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
      const event: LogInfoRelatedEvent = {
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

  describe('isValidAllSubIssueType', () => {
    it('should return true when all components have subIssueTypeId', () => {
      // Arrange
      const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
      const components = [
        {
          isEdit: false,
          requestId: 1,
          isMainMatch: false,
          isDisabled: false,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 1,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null } as FilterTimeWithAllowance,
          logInfo: { subIssueTypeId: 1 },
          showTooltipSubType: jest.fn()
        } as unknown as LogInfoRelatedEventComponent,
        {
          isEdit: false,
          requestId: 1,
          isMainMatch: false,
          isDisabled: false,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 2,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null },
          logInfo: { subIssueTypeId: 2 },
          showTooltipSubType: jest.fn()
        } as unknown as LogInfoRelatedEventComponent
      ];
      logInfoComponents.reset(components);

      // Act
      const result = service.isValidAllSubIssueType(logInfoComponents);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false and show tooltip when a component is missing subIssueTypeId', () => {
      // Arrange
      const logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
      const components = [
        {
          isEdit: false,
          requestId: 1,
          isMainMatch: false,
          isDisabled: false,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 1,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null },
          logInfo: { subIssueTypeId: 1 },
          showTooltipSubType: jest.fn()
        } as unknown as LogInfoRelatedEventComponent,
        {
          isEdit: false,
          requestId: 1,
          isMainMatch: false,
          isDisabled: false,
          leagueName: '',
          eventName: '',
          subIssueTypeId: null,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null },
          logInfo: { subIssueTypeId: null },
          showTooltipSubType: jest.fn()
        } as unknown as LogInfoRelatedEventComponent
      ];
      logInfoComponents.reset(components);

      // Act
      const result = service.isValidAllSubIssueType(logInfoComponents);

      // Assert
      expect(result).toBeFalsy();
      expect(components[1].showTooltipSubType).toHaveBeenCalled();
    });
  });

  describe('isSubTypeFilterByAcceptedTime', () => {
    it('should return true when subIssueTypeId is in the map', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS;

      // Act
      const result = service.isSubTypeFilterByAcceptedTime(subIssueTypeId.toString());

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when subIssueTypeId is not in the map', () => {
      // Arrange
      const subIssueTypeId = '999';

      // Act
      const result = service.isSubTypeFilterByAcceptedTime(subIssueTypeId);

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('isSubTypeFilterByTransTimeAndAcceptedTime', () => {
    it('should return true for valid sub issue types', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS.toString();

      // Act
      const result = service.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false for invalid sub issue types', () => {
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
      const wrongScoreModel = {
        scoreId: 2,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [
        {
          scoreId: 1,
          isActive: true,
          wrongScore: '',
          subIssueTypeId: 1,
          filterFromTransTime: '',
          filterToTransTime: '',
          isChecked: false,
          aaTime: null,
          paTime: null,
          saTime: null,
          messageValidationLogInfo: [],
          logInfoDetail: null
        } as WrongScoreModel,
        {
          scoreId: 2,
          isActive: true,
          wrongScore: '',
          subIssueTypeId: 1,
          filterFromTransTime: '',
          filterToTransTime: '',
          isChecked: false,
          aaTime: null,
          paTime: null,
          saTime: null,
          messageValidationLogInfo: [{ isError: false, reason: '' }],
          logInfoDetail: null
        } as WrongScoreModel
      ];

      // Act
      const result = service.isLastScore(wrongScoreModel, originWrongScoreModels);

      // Assert
      expect(result).toBeTruthy();
    });

    it('should return false when score is not the last one', () => {
      // Arrange
      const wrongScoreModel = {
        scoreId: 1,
        isActive: true,
        wrongScore: '',
        subIssueTypeId: 1,
        filterFromTransTime: '',
        filterToTransTime: '',
        isChecked: false,
        aaTime: null,
        paTime: null,
        saTime: null,
        messageValidationLogInfo: [{ isError: false, reason: '' }],
        logInfoDetail: null
      } as WrongScoreModel;

      const originWrongScoreModels = [
        {
          scoreId: 1,
          isActive: true,
          wrongScore: '',
          subIssueTypeId: 1,
          filterFromTransTime: '',
          filterToTransTime: '',
          isChecked: false,
          aaTime: null,
          paTime: null,
          saTime: null,
          messageValidationLogInfo: [],
          logInfoDetail: null
        } as WrongScoreModel,
        {
          scoreId: 2,
          isActive: true,
          wrongScore: '',
          subIssueTypeId: 1,
          filterFromTransTime: '',
          filterToTransTime: '',
          isChecked: false,
          aaTime: null,
          paTime: null,
          saTime: null,
          messageValidationLogInfo: [{ isError: false, reason: '' }],
          logInfoDetail: null
        } as WrongScoreModel
      ];

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
  });

  describe('isValidInputRelatedEvent', () => {
    it('should return false when input matchId equals main matchId', () => {
      // Arrange
      const inputMatchId = 1;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith(inputMatchIdClass, LABELS.INVALID_MATCHID);
    });

    it('should return false when matchId exists in list', () => {
      // Arrange
      const inputMatchId = 2;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [
        {
          isMainMatch: false,
          matchId: 2,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 1,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null }
        } as LogInfoRelatedEvent
      ];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeFalsy();
      expect(tooltip.display).toHaveBeenCalledWith(inputMatchIdClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
    });

    it('should return true when input is valid', () => {
      // Arrange
      const inputMatchId = 2;
      const inputMatchIdClass = 'input-match-id';
      const mainMatchId = 1;
      const allEvents = [
        {
          isMainMatch: false,
          matchId: 3,
          leagueName: '',
          eventName: '',
          subIssueTypeId: 1,
          voidTimeArea: { aaTime: null, paTime: null, saTime: null }
        } as LogInfoRelatedEvent
      ];
      const tooltip = { display: jest.fn() } as unknown as Tooltip;

      // Act
      const result = service.isValidInputRelatedEvent(inputMatchId, inputMatchIdClass, mainMatchId, allEvents, tooltip);

      // Assert
      expect(result).toBeTruthy();
      expect(tooltip.display).not.toHaveBeenCalled();
    });
  });
});
