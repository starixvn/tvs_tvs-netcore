import { TestBed } from '@angular/core/testing';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { MatchType, SubIssueTypeGroup } from '../../../../../../utility/constants/config';
import { LABELS } from '../../../../../../utility/constants/labels';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../../../utility/modules/testing.module';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../../component/log-info-related-event/primitive-property.model';
import { AddRelatedEventArg } from '../../../../../models/add-related-event.model';
import { ChildMatchModel } from '../../../../../models/related-event.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { EventDangerAcceptedService } from './event-danger-accepted.service';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';

class Helper {
  static readonly fakeChildMatchModel = {
    matchId: 1,
    matchCode: 'matchCode',
    leagueName: 'leagueName',
    matchEvent: 'matchEvent',
    matchType: MatchType.LINK,
    sportType: 1,
  } as ChildMatchModel;

  static readonly fakeFilterTimeWithAllowance = {
    fromDateTime: '2025-07-01 10:00:00',
    toDateTime: '2024-011-01 11:00:00',
    aaTime: 5,
    paTime: 5,
    saTime: 5
  } as FilterTimeWithAllowance;

  static readonly fakeLogInfoRelatedEvent = {
    logInfoDetail: { matchId: 1 } as LogInfoDetail,
    messageValidationLogInfo: [],
    voidTimeArea: Helper.fakeFilterTimeWithAllowance,
    subIssueTypeId: 1
  } as unknown as LogInfoRelatedEvent;
}
describe('RelatedEventService', () => {
  let service: RelatedEventService;
  let validationService: ValidationService;
  let logInfoService: LogInfoService;
  let addRequestApiService: AddRequestApiService;
  let eventDangerAcceptedService: EventDangerAcceptedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [RelatedEventService, AddRequestApiService, ValidationService, LogInfoService, EventDangerAcceptedService]
    });

    service = TestBed.inject(RelatedEventService);
    validationService = TestBed.inject(ValidationService);
    logInfoService = TestBed.inject(LogInfoService);
    addRequestApiService = TestBed.inject(AddRequestApiService);
    eventDangerAcceptedService = TestBed.inject(EventDangerAcceptedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('assignChildMatchToLogInfoModel', () => {
    it('should return empty array when models is empty', () => {
      const result = service.assignChildMatchToLogInfoModel([], null, 1);
      expect(result.length).toEqual(0);
    });

    it('should return list of LogInfoRelatedEvent expected', () => {
      // Arrange
      const models = [Helper.fakeChildMatchModel];
      const expected = [
        {
          matchId: 1,
          matchCode: 'matchCode',
          leagueName: 'leagueName',
          eventName: '1 - matchEvent',
          isMainMatch: false,
          subIssueTypeId: 1,
          voidTimeArea: Helper.fakeFilterTimeWithAllowance,
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: 1
        }] as unknown as LogInfoRelatedEvent[];

      // Act
      const result = service.assignChildMatchToLogInfoModel(models, Helper.fakeFilterTimeWithAllowance, 1);

      // Assert
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(expected[0]);
    });
  });

  describe('isAutoSelectMatch', () => {
    it('should return true when subIssueTypeId is in SUBTYPE_AUTO_SELECT_LIST and matchType is ChildMatch', () => {
      // Arrange
      const subIssueTypeAutoSelectList = SubIssueTypeGroup.SUBTYPE_AUTO_SELECT_LIST;

      // Act & Assert
      subIssueTypeAutoSelectList.forEach(subIssueTypeId => {
        const result = service['isAutoSelectMatch'](subIssueTypeId.toString(), MatchType.CHILD, new LogInfoRelatedEvent(), true);
        expect(result).toEqual(true);
      });
    });

    it('should return true when matchInput is child match and matchType is LinkMatch', () => {
      // Arrange
      const mainEvent = { parentId: 1, matchId: 2 } as LogInfoRelatedEvent;

      // Act
      const result = service['isAutoSelectMatch']('1', MatchType.LINK, mainEvent, false);

      // Assert
      expect(result).toEqual(true);
    });

    it('should return false when matchInput is main match and subIssueTypeId not in SUBTYPE_AUTO_SELECT_LIST', () => {
      // Arrange
      const mainEvent = { parentId: 1, matchId: 1 } as LogInfoRelatedEvent;
      const matchType = [MatchType.NORMAL, MatchType.CHILD, MatchType.LINK];

      // Act & Assert
      matchType.forEach(matchType => {
        const result = service['isAutoSelectMatch']('1', matchType, mainEvent, false);
        expect(result).toEqual(false);
      });
    });
  });

  describe('addNewRelatedEventHaveTicketOrUpdateExistedEvent', () => {
    it('should add new event when event does not exist and has logInfoDetail', () => {
      // Arrange
      const eventsGetLogInfo = [Helper.fakeLogInfoRelatedEvent] as LogInfoRelatedEvent[];
      const originalAllEvents = [];

      // Act
      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      // Assert
      expect(originalAllEvents.length).toEqual(1);
      expect(originalAllEvents).toEqual(eventsGetLogInfo);
    });

    it('should update existed event when event exists and has logInfoDetail', () => {
      // Arrange
      const eventsGetLogInfo = [Helper.fakeLogInfoRelatedEvent] as LogInfoRelatedEvent[];
      eventsGetLogInfo[0].logInfoDetail.matchId = 2;
      const originalAllEvents = [Helper.fakeLogInfoRelatedEvent] as LogInfoRelatedEvent[];
      originalAllEvents[0].logInfoDetail.matchId = 2;

      // Act
      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'](eventsGetLogInfo, originalAllEvents);

      // Assert
      expect(originalAllEvents[0].logInfoDetail.matchId).toEqual(2);
    });
  });

  describe('preparingModelGetLogInfo', () => {
    it('should only prepare model for old events when not have new event need auto select', async () => {
      // Arrange
      const relatedEvents = [Helper.fakeChildMatchModel] as ChildMatchModel[];
      const arg = {
        allEvents: [Helper.fakeLogInfoRelatedEvent],
        filter: {},
        mainEvent: Helper.fakeLogInfoRelatedEvent,
        defaultFilterTimeWithAllowance: Helper.fakeFilterTimeWithAllowance
      } as AddRelatedEventArg;

      eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime = jest.fn();

      // Test case 1: matchId = 1 (same as existing event), subIssueTypeId = 1 (not in auto select list)
      arg.filter.subIssueTypeId = '1';
      relatedEvents[0].matchId = 1;

      const result1 = await service['preparingModelGetLogInfo'](relatedEvents, arg);
      expect(result1.length).toEqual(1);
      expect(result1[0].logInfoDetail.matchId).toEqual(2);

      // Test case 2: matchId = 2 (different from existing event), subIssueTypeId = 1 (not in auto select list)
      arg.filter.subIssueTypeId = '1';
      relatedEvents[0].matchId = 2;

      const result2 = await service['preparingModelGetLogInfo'](relatedEvents, arg);
      expect(result2.length).toEqual(1);
      expect(result2[0].logInfoDetail.matchId).toEqual(2);
    });

    it('should prepare model for new event when have new event need auto select', async () => {
      // Arrange
      const relatedEvents = [Helper.fakeChildMatchModel] as ChildMatchModel[];
      relatedEvents[0].matchId = 2;
      relatedEvents[0].matchType = MatchType.CHILD;

      const arg = {
        allEvents: [Helper.fakeLogInfoRelatedEvent],
        filter: { subIssueTypeId: '4' }, // 4 is in SUBTYPE_AUTO_SELECT_LIST
        mainEvent: Helper.fakeLogInfoRelatedEvent,
        defaultFilterTimeWithAllowance: Helper.fakeFilterTimeWithAllowance
      } as AddRelatedEventArg;

      eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime = jest.fn();

      // Act
      const result = await service['preparingModelGetLogInfo'](relatedEvents, arg);

      // Assert
      expect(result.length).toEqual(1);
      expect(result[0].logInfoDetail.matchId).toEqual(2);
    });
  });

  describe('getDataWhenSearch', () => {
    it('should call functions expected', async () => {
      // Arrange
      service['preparingModelGetLogInfo'] = jest.fn().mockResolvedValue([Helper.fakeLogInfoRelatedEvent]);
      logInfoService.getLogInfo = jest.fn();
      service['addNewRelatedEventHaveTicketOrUpdateExistedEvent'] = jest.fn();

      // Act
      await service.getDataWhenSearch([Helper.fakeChildMatchModel], {} as AddRelatedEventArg);

      // Assert
      expect(service['preparingModelGetLogInfo']).toHaveBeenCalled();
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(service['addNewRelatedEventHaveTicketOrUpdateExistedEvent']).toHaveBeenCalled();
    });
  });

  describe('addRelatedEventByInput', () => {
    it('should display required message when inputRelatedMatchId is empty', async () => {
      const arg = {
        primitiveProps: { inputRelatedMatchId: null } as PrimitiveProperty,
        tooltip: { display: jest.fn() } as unknown as Tooltip,
        inputMatchIdClass: 'test-class'
      } as AddRelatedEventArg;

      await service.addRelatedEventByInput(arg);

      expect(arg.tooltip.display).toHaveBeenCalledWith('test-class', LABELS.REQUIRED_MATCHID);
    });

    it('should not getLogInfo when InValidInputRelatedEvent', async () => {
      // Arrange
      const arg = {
        primitiveProps: { inputRelatedMatchId: 123 },
      } as unknown as AddRelatedEventArg;
      validationService.isValidInputRelatedEvent = jest.fn().mockReturnValue(false);
      logInfoService.getLogInfo = jest.fn();

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(logInfoService.getLogInfo).not.toHaveBeenCalled();
    });

    it('should display invalid message when getChildMatches returns empty array', async () => {
      // Arrange
      const arg = {
        tooltip: { display: jest.fn() },
        primitiveProps: { inputRelatedMatchId: 123 },
        inputMatchIdClass: 'test-class',
        mainEvent: {},
        filter: { issueTypeId: '1' }
      } as unknown as AddRelatedEventArg;
      arg.mainEvent = {} as LogInfoRelatedEvent;
      validationService.isValidInputRelatedEvent = jest.fn().mockReturnValue(true);
      const resultGetChildMatches = [[], null, undefined];

      // Act & Assert
      resultGetChildMatches.forEach(async x => {
        addRequestApiService.getChildMatches = jest.fn().mockResolvedValue(x);
        await service.addRelatedEventByInput(arg);

        expect(arg.tooltip.display).toHaveBeenCalledWith('test-class', LABELS.INVALID_MATCHID);
        expect(arg.primitiveProps.isBlock).toBe(false);
      });
    });

    it('should getLogInfo success when matchId input is valid', async () => {
      // Arrange
      const arg = {
        tooltip: { display: jest.fn() },
        primitiveProps: { inputRelatedMatchId: 123 },
        inputMatchIdClass: 'test-class',
        mainEvent: {},
        filter: { issueTypeId: '1' },
        allEvents: []
      } as unknown as AddRelatedEventArg;
      const resultGetChildMatches = [Helper.fakeChildMatchModel];

      validationService.isValidInputRelatedEvent = jest.fn().mockReturnValue(true);
      addRequestApiService.getChildMatches = jest.fn().mockResolvedValue(resultGetChildMatches);
      logInfoService.updateIsCheckedVar = jest.fn();
      eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime = jest.fn();
      logInfoService.getLogInfo = jest.fn();
      service['assignChildMatchToLogInfoModel'] = jest.fn().mockReturnValue([Helper.fakeLogInfoRelatedEvent]);

      // Act
      await service.addRelatedEventByInput(arg);

      // Assert
      expect(logInfoService.getLogInfo).toHaveBeenCalled();
      expect(arg.primitiveProps.inputRelatedMatchId).toBeNull();
    });
  });
});
