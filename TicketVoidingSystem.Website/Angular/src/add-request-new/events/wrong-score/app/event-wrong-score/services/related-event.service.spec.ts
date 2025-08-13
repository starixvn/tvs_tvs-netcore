import { TestBed } from '@angular/core/testing';
import moment from 'moment-timezone';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, MatchType, TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { LABELS } from '../../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { WrongScoreModel } from '../../../../models/event-wrong-score.model';
import { GetChildMatchQuery } from '../../../../models/get-child-match.query';
import { ChildMatchModel } from '../../../../models/related-event.model';
import { SubIssueTypeLinkMatch } from '../../../../models/sub-type-link-match.model';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { CreateMapService } from './create-map.service';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeMatchId = 123;
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isChangeSubTypeManual: true,
    actions: []
  } as FilterModel;

  static getFakeWrongScoreModel(): WrongScoreModel {
    const model = new WrongScoreModel();
    model.scoreId = 1;
    model.isActive = true;
    model.wrongScore = '';
    model.subIssueTypeId = 1;
    model.filterFromTransTime = moment("2024-03-20 10:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterToTransTime = moment("2024-03-20 11:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.tvDetectionValue = 0;

    const logInfoDetail = new LogInfoDetail();
    logInfoDetail.matchId = 123;
    logInfoDetail.voidFromTime = new Date();
    logInfoDetail.voidToTime = new Date();
    logInfoDetail.transVoidToTime = new Date();
    model.logInfoDetail = logInfoDetail;
    model.messageValidationLogInfo = [];
    model.matchId = 123;
    model.eventDate = new Date();
    model.voidFromTime = moment("2024-03-20 10:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.voidToTime = moment("2024-03-20 11:00:00").format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.filterBy = 1;
    model.sportType = 1;
    model.isMainMatch = true;

    return model;
  }

  static getFakeChildMatchModel(): ChildMatchModel {
    return {
      matchId: 123,
      matchCode: 'MATCH123',
      matchEvent: 'Team A vs Team B',
      leagueName: 'League 1',
      sportType: 1,
      matchType: MatchType.NORMAL,
      isChecked: false
    } as ChildMatchModel;
  }

  static getFakeLogInfoRelatedEvent(): LogInfoRelatedEvent {
    return {
      matchId: 123,
      matchCode: 'MATCH123',
      leagueName: 'League 1',
      eventName: '123 - Team A vs Team B',
      sportType: 1,
      isMainMatch: false,
      subIssueTypeId: 1,
      voidTimeArea: null,
      logInfoDetail: null,
      tvDetectionModel: null
    };
  }

  static getFakeAddRelatedEventArg(): AddRelatedEventArg {
    return {
      primitiveProps: {
        filterBy: TVSRequestFilterBy.CHECK_TIME,
        actualScore: '',
        isShowActualScore: false,
        transInfoAddRequestModel: null,
        isShowRelatedEvents: false,
        inputRelatedMatchId: null,
        isBlock: false
      } as PrimitiveProperty,

      tooltip: {
        className: '',
        message: '',
        show: false,
        top: 0,
        left: 0,
        display: jest.fn(),
        element: null,
        hide: jest.fn(),
        severity: 'error'
      } as unknown as Tooltip,

      inputMatchIdClass: 'test-class',
      mainEvent: this.getFakeLogInfoRelatedEvent(),
      relatedEvents: [],
      filter: this.fakeFilterModel,
      defaultFilterTimeWithAllowance: new FilterTimeWithAllowance()
    } as AddRelatedEventArg;
  }
}

describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let addRequestApiService: AddRequestApiService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let createMapService: CreateMapService;

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
        },
        {
          provide: CreateMapService,
          useValue: {
            createNewLogInfoRelatedEvent: jest.fn(),
            createGetLogInfoParams: jest.fn(),
            assignMainEvent: jest.fn()
          }
        }
      ]
    });

    service = TestBed.inject(RelatedEventService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    createMapService = TestBed.inject(CreateMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getChildMatches', () => {
    it('should call addRequestApiService.getChildMatches with correct parameters', async () => {
      const query: GetChildMatchQuery = {
        issueTypeId: 1,
        eventDate: '2024-03-20',
        matchId: Helper.fakeMatchId,
        isMainMatch: true,
        sportType: 1
      };

      const expectedResult: ChildMatchModel[] = [Helper.getFakeChildMatchModel()];

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(expectedResult);

      const result = await service.getChildMatches(query);

      expect(addRequestApiService.getChildMatches).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('addRelatedEventByInput', () => {
    it('should display required message when inputRelatedMatchId is empty', async () => {
      const arg = Helper.getFakeAddRelatedEventArg();

      await service.addRelatedEventByInput(arg);

      expect(arg.tooltip.display).toHaveBeenCalledWith(arg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    });

    it('should validate and add related event when input is valid', async () => {
      const arg = Helper.getFakeAddRelatedEventArg();
      arg.primitiveProps.inputRelatedMatchId = 456;
      arg.mainEvent.eventDate = new Date('2024-03-20');

      const mockChildMatches: ChildMatchModel[] = [Helper.getFakeChildMatchModel()];
      mockChildMatches[0].matchId = 456;

      (validationService.isValidInputRelatedEvent as jest.Mock).mockReturnValue(true);
      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue(mockChildMatches);
      (createMapService.createNewLogInfoRelatedEvent as jest.Mock).mockReturnValue(Helper.getFakeLogInfoRelatedEvent());

      await service.addRelatedEventByInput(arg);

      expect(validationService.isValidInputRelatedEvent).toHaveBeenCalled();
      expect(addRequestApiService.getChildMatches).toHaveBeenCalled();
      expect(createMapService.createNewLogInfoRelatedEvent).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
    });
  });

  describe('updateEventAutoGetLinkMatch', () => {
    it('should add new link events that are not in relatedEvents', async () => {
      const childEvents = [{
        matchId: 789,
        matchCode: 'MATCH789',
        matchEvent: 'Team E vs Team F',
        leagueName: 'League 3',
        sportType: 1,
        matchType: MatchType.LINK,
        isChecked: false,
        isSpecialChildMatch: false
      }] as ChildMatchModel[];

      const arg = Helper.getFakeAddRelatedEventArg();

      const mockSubTypeLinkMatches: SubIssueTypeLinkMatch[] = [{
        matchId: 789,
        subIssueTypeId: SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME
      }];

      (addRequestApiService.getSubIssueTypeLinkMatch as jest.Mock).mockResolvedValue(mockSubTypeLinkMatches);
      (createMapService.createNewLogInfoRelatedEvent as jest.Mock).mockReturnValue({
        matchId: 789,
        matchCode: 'MATCH789'
      } as LogInfoRelatedEvent);

      await service.updateEventAutoGetLinkMatch(childEvents, arg);

      expect(addRequestApiService.getSubIssueTypeLinkMatch).toHaveBeenCalled();
      expect(createMapService.createNewLogInfoRelatedEvent).toHaveBeenCalled();
      expect(arg.relatedEvents.length).toBe(1);
    });
  });

  describe('assignLogInfoRelatedEvent', () => {
    it('should assign log info related event with existing child event', async () => {
      const model = Helper.getFakeWrongScoreModel();
      const allEventChild: ChildMatchModel[] = [Helper.getFakeChildMatchModel()];
      const mockLogInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();

      (createMapService.assignMainEvent as jest.Mock).mockReturnValue(mockLogInfoRelatedEvent);

      const result = await service.assignLogInfoRelatedEvent(model, allEventChild);

      expect(createMapService.assignMainEvent).toHaveBeenCalledWith(model);
      expect(result).toEqual(mockLogInfoRelatedEvent);
    });

    it('should fetch child event if not found in allEventChild', async () => {
      const model = Helper.getFakeWrongScoreModel();
      const allEventChild: ChildMatchModel[] = [];
      const mockChildMatch = Helper.getFakeChildMatchModel();
      const mockLogInfoRelatedEvent = Helper.getFakeLogInfoRelatedEvent();

      (addRequestApiService.getChildMatches as jest.Mock).mockResolvedValue([mockChildMatch]);
      (createMapService.assignMainEvent as jest.Mock).mockReturnValue(mockLogInfoRelatedEvent);

      const result = await service.assignLogInfoRelatedEvent(model, allEventChild);

      expect(addRequestApiService.getChildMatches).toHaveBeenCalled();
      expect(createMapService.assignMainEvent).toHaveBeenCalledWith(model);
      expect(result).toEqual(mockLogInfoRelatedEvent);
    });
  });
});
