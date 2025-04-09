import { TestBed } from '@angular/core/testing';
import { RelatedEventService } from './related-event.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { SubIssueTypeLinkMatch } from '../../models/sub-type-link-match.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { LABELS } from '../../../../../utility/constants/labels';

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
            getChildMatches: jest.fn(),
            getSubIssueTypeLinkMatch: jest.fn()
          }
        },
        {
          provide: LogInfoService,
          useValue: {
            getLogInfo: jest.fn(),
            mapRelatedEventToWrongScoreModel: jest.fn()
          }
        },
        {
          provide: ValidationService,
          useValue: {
            isValidInputRelatedEvent: jest.fn(),
            isHasAllowanceTime: jest.fn(),
            isHasAllowanceTimeWrongScoreModel: jest.fn()
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

      const expectedResult: ChildMatchModel[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        }
      ];

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(expectedResult);

      // Act
      const result = await service.getChildMatches(query);

      // Assert
      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('assignChildMatchToLogInfoModel', () => {
    it('should map child matches to wrong score models correctly', () => {
      // Arrange
      const models: ChildMatchModel[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        }
      ];

      const defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
      defaultFilterTimeWithAllowance.fromDateTime = '2024-03-20T00:00:00';
      defaultFilterTimeWithAllowance.toDateTime = '2024-03-20T23:59:59';

      // Act
      const result = service.assignChildMatchToLogInfoModel(models, defaultFilterTimeWithAllowance);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        matchId: 123,
        filterBy: TVSRequestFilterBy.CHECK_TIME,
        filterFromTransTime: defaultFilterTimeWithAllowance.fromDateTime,
        filterToTransTime: defaultFilterTimeWithAllowance.toDateTime,
        matchType: MatchType.NORMAL
      } as WrongScoreModel);
    });
  });

  describe('getChildMatchSubIssueType', () => {
    it('should return correct sub issue type for no indication home goal no onwards', () => {
      // Act
      const result = service.getChildMatchSubIssueType(SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS);

      // Assert
      expect(result).toBe(SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME);
    });

    it('should return null for unknown sub issue type', () => {
      // Act
      const result = service.getChildMatchSubIssueType(999);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('updateChildMatchSubIssueType', () => {
    it('should update wrong score model with correct sub issue type', () => {
      // Arrange
      const wrongScoreModel: WrongScoreModel = {
        matchId: 123,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: null,
        isCheckedVar: false,
        tvDetectionValue: 0,
        isMainMatch: true,
        scoreId: 1,
        isActive: true,
        wrongScore: '1-0',
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        aaTime: undefined,
        paTime: undefined,
        saTime: undefined,
        voidFromTime: '2024-03-20T00:00:00',
        voidToTime: '2024-03-20T23:59:59',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        sportType: 1,
        eventDate: new Date('2024-03-20'),
        matchType: MatchType.NORMAL,
        isChecked: true,
        serviceAcceptTime: '2024-03-20T00:00:00',
        actualTime: '2024-03-20T00:00:00',
        minuteOffset: '0',
        secondOffset: '0'
      };

      // Act
      service.updateChildMatchSubIssueType(wrongScoreModel, SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS);

      // Assert
      expect(wrongScoreModel.subIssueTypeId).toBe(SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME);
    });
  });

  describe('updateAllowanceTime', () => {
    it('should update wrong score model with allowance time from config', () => {
      // Arrange
      const wrongScoreModel: WrongScoreModel = {
        matchId: 123,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME,
        isCheckedVar: false,
        tvDetectionValue: 0,
        isMainMatch: true,
        scoreId: 1,
        isActive: true,
        wrongScore: '1-0',
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        aaTime: undefined,
        paTime: undefined,
        saTime: undefined,
        voidFromTime: '2024-03-20T00:00:00',
        voidToTime: '2024-03-20T23:59:59',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        sportType: 1,
        eventDate: new Date('2024-03-20'),
        matchType: MatchType.NORMAL,
        isChecked: true,
        serviceAcceptTime: '2024-03-20T00:00:00',
        actualTime: '2024-03-20T00:00:00',
        minuteOffset: '0',
        secondOffset: '0'
      };

      // Act
      service.updateAllowanceTime(wrongScoreModel);

      // Assert
      expect(wrongScoreModel.aaTime).toBeDefined();
      expect(wrongScoreModel.paTime).toBeDefined();
      expect(wrongScoreModel.saTime).toBeDefined();
    });

    it('should not update allowance time if sub issue type is missing', () => {
      // Arrange
      const wrongScoreModel: WrongScoreModel = {
        matchId: 123,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: null,
        isCheckedVar: false,
        tvDetectionValue: 0,
        isMainMatch: true,
        scoreId: 1,
        isActive: true,
        wrongScore: '1-0',
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        aaTime: undefined,
        paTime: undefined,
        saTime: undefined,
        voidFromTime: '2024-03-20T00:00:00',
        voidToTime: '2024-03-20T23:59:59',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        sportType: 1,
        eventDate: new Date('2024-03-20'),
        matchType: MatchType.NORMAL,
        isChecked: true,
        serviceAcceptTime: '2024-03-20T00:00:00',
        actualTime: '2024-03-20T00:00:00',
        minuteOffset: '0',
        secondOffset: '0'
      };

      // Act
      service.updateAllowanceTime(wrongScoreModel);

      // Assert
      expect(wrongScoreModel.aaTime).toBeUndefined();
      expect(wrongScoreModel.paTime).toBeUndefined();
      expect(wrongScoreModel.saTime).toBeUndefined();
    });
  });

  describe('updateChildMatchSubIssueTypeAndAllowanceTime', () => {
    it('should update sub issue type and allowance time for non-link matches', () => {
      // Arrange
      const wrongScoreModels: WrongScoreModel[] = [
        {
          matchId: 123,
          actualScore: '1-0',
          filterBy: 1,
          subIssueTypeId: null,
          isCheckedVar: false,
          tvDetectionValue: 0,
          isMainMatch: false,
          matchType: MatchType.NORMAL,
          scoreId: 1,
          isActive: true,
          wrongScore: '1-0',
          filterFromTransTime: '2024-03-20T00:00:00',
          filterToTransTime: '2024-03-20T23:59:59',
          aaTime: undefined,
          paTime: undefined,
          saTime: undefined,
          voidFromTime: '2024-03-20T00:00:00',
          voidToTime: '2024-03-20T23:59:59',
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: 1,
          eventDate: new Date('2024-03-20'),
          isChecked: true,
          serviceAcceptTime: '2024-03-20T00:00:00',
          actualTime: '2024-03-20T00:00:00',
          minuteOffset: '0',
          secondOffset: '0'
        }
      ];

      // Act
      service.updateChildMatchSubIssueTypeAndAllowanceTime(wrongScoreModels, SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS);

      // Assert
      expect(wrongScoreModels[0].subIssueTypeId).toBe(SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME);
      expect(wrongScoreModels[0].aaTime).toBeDefined();
      expect(wrongScoreModels[0].paTime).toBeDefined();
      expect(wrongScoreModels[0].saTime).toBeDefined();
    });

    it('should not update main match', () => {
      // Arrange
      const wrongScoreModels: WrongScoreModel[] = [
        {
          matchId: 123,
          actualScore: '1-0',
          filterBy: 1,
          subIssueTypeId: null,
          isCheckedVar: false,
          tvDetectionValue: 0,
          isMainMatch: true,
          matchType: MatchType.NORMAL,
          scoreId: 1,
          isActive: true,
          wrongScore: '1-0',
          filterFromTransTime: '2024-03-20T00:00:00',
          filterToTransTime: '2024-03-20T23:59:59',
          aaTime: undefined,
          paTime: undefined,
          saTime: undefined,
          voidFromTime: '2024-03-20T00:00:00',
          voidToTime: '2024-03-20T23:59:59',
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: 1,
          eventDate: new Date('2024-03-20'),
          isChecked: true,
          serviceAcceptTime: '2024-03-20T00:00:00',
          actualTime: '2024-03-20T00:00:00',
          minuteOffset: '0',
          secondOffset: '0'
        }
      ];

      // Act
      service.updateChildMatchSubIssueTypeAndAllowanceTime(wrongScoreModels, SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS);

      // Assert
      expect(wrongScoreModels[0].subIssueTypeId).toBeNull();
      expect(wrongScoreModels[0].aaTime).toBeUndefined();
      expect(wrongScoreModels[0].paTime).toBeUndefined();
      expect(wrongScoreModels[0].saTime).toBeUndefined();
    });
  });

  describe('updateSubIssueTypeAndAllowanceTime', () => {
    it('should update both child matches and link matches', async () => {
      // Arrange
      const wrongScoreModels: WrongScoreModel[] = [
        {
          matchId: 123,
          actualScore: '1-0',
          filterBy: 1,
          subIssueTypeId: null,
          isCheckedVar: false,
          tvDetectionValue: 0,
          isMainMatch: false,
          matchType: MatchType.NORMAL,
          scoreId: 1,
          isActive: true,
          wrongScore: '1-0',
          filterFromTransTime: '2024-03-20T00:00:00',
          filterToTransTime: '2024-03-20T23:59:59',
          aaTime: undefined,
          paTime: undefined,
          saTime: undefined,
          voidFromTime: '2024-03-20T00:00:00',
          voidToTime: '2024-03-20T23:59:59',
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: 1,
          eventDate: new Date('2024-03-20'),
          isChecked: true,
          serviceAcceptTime: '2024-03-20T00:00:00',
          actualTime: '2024-03-20T00:00:00',
          minuteOffset: '0',
          secondOffset: '0'
        },
        {
          matchId: 456,
          actualScore: '1-0',
          filterBy: 1,
          subIssueTypeId: null,
          isCheckedVar: false,
          tvDetectionValue: 0,
          isMainMatch: false,
          matchType: MatchType.LINK,
          scoreId: 2,
          isActive: true,
          wrongScore: '1-0',
          filterFromTransTime: '2024-03-20T00:00:00',
          filterToTransTime: '2024-03-20T23:59:59',
          aaTime: undefined,
          paTime: undefined,
          saTime: undefined,
          voidFromTime: '2024-03-20T00:00:00',
          voidToTime: '2024-03-20T23:59:59',
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: 1,
          eventDate: new Date('2024-03-20'),
          isChecked: true,
          serviceAcceptTime: '2024-03-20T00:00:00',
          actualTime: '2024-03-20T00:00:00',
          minuteOffset: '0',
          secondOffset: '0'
        }
      ];

      const subTypeLinkMatches: SubIssueTypeLinkMatch[] = [
        {
          matchId: 456,
          subIssueTypeId: SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME
        }
      ];

      (addRequestApiService.getSubIssueTypeLinkMatch as jest.Mock).mockResolvedValue(subTypeLinkMatches);

      // Act
      await service.updateSubIssueTypeAndAllowanceTime(wrongScoreModels, SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS);

      // Assert
      expect(wrongScoreModels[0].subIssueTypeId).toBe(SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME);
      expect(wrongScoreModels[1].subIssueTypeId).toBe(SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME);
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
        }
      } as unknown as AddRelatedEventArg;

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.tooltip.display).toHaveBeenCalledWith(arg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
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
        allEvents: []
      } as unknown as AddRelatedEventArg;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(false);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(validationService.isValidInputRelatedEvent).toHaveBeenCalledWith(
        123,
        arg.inputMatchIdClass,
        arg.mainEvent.matchId,
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
        defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
        filter: {
          subIssueTypeId: SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS
        }
      } as unknown as AddRelatedEventArg;

      const childMatches: ChildMatchModel[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        }
      ];

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(childMatches);
      (addRequestApiService.getSubIssueTypeLinkMatch as jest.Mock).mockResolvedValue([]);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(arg.primitiveProps.isBlock).toBe(false);
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
      expect(arg.allEvents.length).toBe(1);
    });
  });

  describe('getLogInfoRelatedEvent', () => {
    it('should create log info related event with correct data', async () => {
      // Arrange
      const model: WrongScoreModel = {
        matchId: 123,
        actualScore: '1-0',
        filterBy: 1,
        subIssueTypeId: SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME,
        isCheckedVar: false,
        tvDetectionValue: 0,
        isMainMatch: true,
        scoreId: 1,
        isActive: true,
        wrongScore: '1-0',
        filterFromTransTime: '2024-03-20T00:00:00',
        filterToTransTime: '2024-03-20T23:59:59',
        aaTime: 5,
        paTime: 10,
        saTime: 15,
        voidFromTime: '2024-03-20T00:00:00',
        voidToTime: '2024-03-20T23:59:59',
        logInfoDetail: null,
        messageValidationLogInfo: null,
        sportType: 1,
        eventDate: new Date('2024-03-20'),
        matchType: MatchType.NORMAL,
        isChecked: true,
        serviceAcceptTime: '2024-03-20T00:00:00',
        actualTime: '2024-03-20T00:00:00',
        minuteOffset: '0',
        secondOffset: '0'
      };

      const allEventChild: ChildMatchModel[] = [
        {
          matchId: 123,
          matchCode: 'MATCH123',
          matchEvent: 'Team A vs Team B',
          leagueName: 'League 1',
          sportType: 1,
          matchType: MatchType.NORMAL,
          isChecked: false
        }
      ];

      (validationService.isHasAllowanceTimeWrongScoreModel as jest.Mock).mockReturnValue(true);

      // Act
      const result = await service.getLogInfoRelatedEvent(model, allEventChild);

      // Assert
      expect(result).toEqual({
        logInfoDetail: model.logInfoDetail,
        messageValidationLogInfo: model.messageValidationLogInfo,
        voidTimeArea: {
          fromDateTime: model.voidFromTime,
          toDateTime: model.voidToTime,
          aaTime: model.aaTime,
          paTime: model.paTime,
          saTime: model.saTime
        },
        matchId: model.matchId,
        subIssueTypeId: model.subIssueTypeId,
        matchCode: allEventChild[0].matchCode,
        leagueName: allEventChild[0].leagueName,
        eventName: `${allEventChild[0].matchId} - ${allEventChild[0].matchEvent}`,
        sportType: allEventChild[0].sportType
      } as LogInfoRelatedEvent);
    });
  });
});
