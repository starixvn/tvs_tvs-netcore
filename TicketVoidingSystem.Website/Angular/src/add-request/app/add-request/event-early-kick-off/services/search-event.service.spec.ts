import { TestBed } from '@angular/core/testing';
import { SearchEventService } from './search-event.service';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { LogInfoService } from './log-info.service';
import { RelatedEventService } from './related-event.service';
import { ValidationService } from './validation.service';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { MatchType } from '../../../../../utility/constants/config';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { FilterModel } from '../../filter/filter.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { GetLogInfoViewModel } from '../../models/get-log-info.model';
import { EventEarlyKickOffService } from './event-eko.service';

describe('SearchEventService', () => {
  let service: SearchEventService;
  let logInfoService: LogInfoService;
  let relatedEventService: RelatedEventService;
  let validationService: ValidationService;
  let checkPermissionService: CheckAddPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        SearchEventService,
        LogInfoService,
        RelatedEventService,
        ValidationService,
        CheckAddPermissionService,
        EventEarlyKickOffService
      ]
    });

    service = TestBed.inject(SearchEventService);
    logInfoService = TestBed.inject(LogInfoService);
    relatedEventService = TestBed.inject(RelatedEventService);
    validationService = TestBed.inject(ValidationService);
    checkPermissionService = TestBed.inject(CheckAddPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('searchEvents', () => {
    it('should return false when validation fails', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, isCollapse: false } as LogInfoEarlyKickOff,
        { isMainMatch: false, isCollapse: false } as LogInfoEarlyKickOff
      ];
      saveRequestArg.eventLeagueComponent = {} as EventLeagueComponent;
      saveRequestArg.kickOffTimeComponent = {} as DateFullTimeNewComponent;
      saveRequestArg.primitiveProps = { isShowLogInfoEvents: true } as PrimitiveProperty;
      saveRequestArg.filter = { action: '', subIssueTypeId: '', isTest: false, isAbnormal: false, isVoided: false, actions: [] } as unknown as FilterModel;
      saveRequestArg.permission = { isVoidAllArchivedTickets: false, isAddSettledTickets: false, isAddInstantlySettledTickets: false } as unknown as PermissionAddRequest;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(false);
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue({ getLogInfoModels: [], transInfoAddRequestModel: {} as TransInfoAddRequestModel });
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(checkPermissionService, 'isAccountHasAddRequestPermission').mockReturnValue(true);

      // Act
      const result = await service.searchEvents(saveRequestArg, []);

      // Assert
      expect(result).toBe(false);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(saveRequestArg.allEvents[1].isCollapse).toBe(true);
      expect(saveRequestArg.primitiveProps.isShowLogInfoEvents).toBe(true);
    });

    it('should return false when permission check fails', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, isCollapse: false, matchId: 1, matchCode: 'A', isHasInstantlySettledTicket: false, isHasSettledTicket: false } as LogInfoEarlyKickOff,
        { isMainMatch: false, isCollapse: false, matchId: 2, matchCode: 'B', isHasInstantlySettledTicket: false, isHasSettledTicket: false } as LogInfoEarlyKickOff
      ];
      saveRequestArg.eventLeagueComponent = {} as EventLeagueComponent;
      saveRequestArg.kickOffTimeComponent = {} as DateFullTimeNewComponent;
      saveRequestArg.primitiveProps = { isShowLogInfoEvents: true } as PrimitiveProperty;
      saveRequestArg.filter = { action: '', subIssueTypeId: '', isTest: false, isAbnormal: false, isVoided: false, actions: [] } as unknown as FilterModel;
      saveRequestArg.permission = { isVoidAllArchivedTickets: false, isAddSettledTickets: false, isAddInstantlySettledTickets: false } as unknown as PermissionAddRequest;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue({ 
        getLogInfoModels: [
          { 
            matchId: 1, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false,
              isPoolHouseAffected: false,
              isExistedInOtherRequest: false,
              isExistsSecondAccept: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }, 
          { 
            matchId: 2, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false,
              isPoolHouseAffected: false,
              isExistedInOtherRequest: false,
              isExistsSecondAccept: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }
        ], 
        transInfoAddRequestModel: {} as TransInfoAddRequestModel 
      });
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(checkPermissionService, 'isAccountHasAddRequestPermission').mockReturnValue(false);

      // Act
      const result = await service.searchEvents(saveRequestArg, []);

      // Assert
      expect(result).toBe(false);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(saveRequestArg.allEvents[1].isCollapse).toBe(true);
    });

    it('should return true and process events successfully', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, isCollapse: false, matchId: 1, matchCode: 'B', isHasInstantlySettledTicket: false, isHasSettledTicket: false } as LogInfoEarlyKickOff,
        { isMainMatch: false, isCollapse: false, matchId: 2, matchCode: 'A', isHasInstantlySettledTicket: false, isHasSettledTicket: false } as LogInfoEarlyKickOff
      ];
      saveRequestArg.eventLeagueComponent = {} as EventLeagueComponent;
      saveRequestArg.kickOffTimeComponent = {} as DateFullTimeNewComponent;
      saveRequestArg.primitiveProps = { isShowLogInfoEvents: true } as PrimitiveProperty;
      saveRequestArg.filter = { action: '', subIssueTypeId: '', isTest: false, isAbnormal: false, isVoided: false, actions: [] } as unknown as FilterModel;
      saveRequestArg.permission = { isVoidAllArchivedTickets: false, isAddSettledTickets: false, isAddInstantlySettledTickets: false } as unknown as PermissionAddRequest;

      jest.spyOn(validationService, 'validateCommonData').mockReturnValue(true);
      jest.spyOn(logInfoService, 'resetLogInfoOfEvent');
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue({ 
        getLogInfoModels: [
          { 
            matchId: 1, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false,
              isPoolHouseAffected: false,
              isExistedInOtherRequest: false,
              isExistsSecondAccept: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }, 
          { 
            matchId: 2, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false,
              isPoolHouseAffected: false,
              isExistedInOtherRequest: false,
              isExistsSecondAccept: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }
        ], 
        transInfoAddRequestModel: {} as TransInfoAddRequestModel 
      });
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');
      jest.spyOn(checkPermissionService, 'isAccountHasAddRequestPermission').mockReturnValue(true);

      // Act
      const result = await service.searchEvents(saveRequestArg, []);

      // Assert
      expect(result).toBe(true);
      expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
      expect(saveRequestArg.primitiveProps.isShowLogInfoEvents).toBe(true);
      expect(saveRequestArg.allEvents[0].matchCode).toBe('A');
      expect(saveRequestArg.allEvents[1].matchCode).toBe('B');
    });
  });

  describe('getLogInfoForAllEvents', () => {
    it('should process log info for all events', async () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, matchId: 1 } as LogInfoEarlyKickOff,
        { isMainMatch: false, matchId: 2 } as LogInfoEarlyKickOff
      ];
      saveRequestArg.isEdit = false;
      saveRequestArg.requestId = 123;
      saveRequestArg.filter = { action: '', subIssueTypeId: '', isTest: false, isAbnormal: false, isVoided: false, actions: [] } as unknown as FilterModel;
      saveRequestArg.primitiveProps = { transInfoAddRequestModel: null } as PrimitiveProperty;
      saveRequestArg.mainEvent = { matchId: 1 } as LogInfoEarlyKickOff;

      const newestRelatedEvents = [
        { matchId: 3, matchType: MatchType.LINK },
        { matchId: 4, matchType: MatchType.LINK }
      ] as ChildMatchModel[];

      const logInfoResult = {
        getLogInfoModels: [
          { 
            matchId: 1, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }, 
          { 
            matchId: 2, 
            validation: { 
              isInvalidTotalTickets: false,
              isHasSettledTicket: false,
              isHasInstantlySettledTicket: false
            },
            ticketRequest: null,
            logInfoDetail: null
          }
        ],
        transInfoAddRequestModel: { id: 1 }
      };

      jest.spyOn(relatedEventService, 'mapChildMatchesToEvents').mockReturnValue([
        { matchId: 3, isMainMatch: false } as LogInfoEarlyKickOff,
        { matchId: 4, isMainMatch: false } as LogInfoEarlyKickOff
      ]);
      jest.spyOn(logInfoService, 'getLogInfo').mockResolvedValue(logInfoResult as unknown as GetLogInfoViewModel);
      jest.spyOn(logInfoService, 'assignResultLogInfoToEvents');

      // Act
      await service.getLogInfoForAllEvents(saveRequestArg, newestRelatedEvents);

      // Assert
      expect(relatedEventService.mapChildMatchesToEvents).toHaveBeenCalledWith(
        newestRelatedEvents,
        saveRequestArg.mainEvent
      );
      expect(logInfoService.getLogInfo).toHaveBeenCalledWith(
        saveRequestArg.allEvents,
        saveRequestArg.isEdit,
        saveRequestArg.requestId,
        saveRequestArg.filter
      );
      expect(logInfoService.assignResultLogInfoToEvents).toHaveBeenCalledWith(
        saveRequestArg.allEvents,
        logInfoResult.getLogInfoModels
      );
      expect(saveRequestArg.primitiveProps.transInfoAddRequestModel).toBe(logInfoResult.transInfoAddRequestModel);
      expect(saveRequestArg.allEvents.length).toBe(4);
    });
  });

  describe('addNewestChildEventsToAllSelectedEvents', () => {
    it('should add new child events to all events', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, matchId: 1 } as LogInfoEarlyKickOff,
        { isMainMatch: false, matchId: 2 } as LogInfoEarlyKickOff
      ];
      saveRequestArg.mainEvent = { matchId: 1 } as LogInfoEarlyKickOff;

      const newestRelatedEvents = [
        { matchId: 3, matchType: MatchType.LINK },
        { matchId: 4, matchType: MatchType.LINK },
        { matchId: 5, matchType: MatchType.NORMAL }
      ] as ChildMatchModel[];

      jest.spyOn(relatedEventService, 'mapChildMatchesToEvents').mockReturnValue([
        { matchId: 3, isMainMatch: false } as LogInfoEarlyKickOff,
        { matchId: 4, isMainMatch: false } as LogInfoEarlyKickOff
      ]);

      // Act
      service['addNewestChildEventsToAllSelectedEvents'](saveRequestArg, newestRelatedEvents);

      // Assert
      expect(relatedEventService.mapChildMatchesToEvents).toHaveBeenCalledWith(
        [
          { matchId: 3, matchType: MatchType.LINK },
          { matchId: 4, matchType: MatchType.LINK }
        ],
        saveRequestArg.mainEvent
      );
      expect(saveRequestArg.allEvents.length).toBe(4);
      expect(saveRequestArg.allEvents[2].matchId).toBe(3);
      expect(saveRequestArg.allEvents[3].matchId).toBe(4);
    });

    it('should not add duplicate events', () => {
      // Arrange
      const saveRequestArg = new SaveRequestArg();
      saveRequestArg.allEvents = [
        { isMainMatch: true, matchId: 1 } as LogInfoEarlyKickOff,
        { isMainMatch: false, matchId: 2 } as LogInfoEarlyKickOff
      ];
      saveRequestArg.mainEvent = { matchId: 1 } as LogInfoEarlyKickOff;

      const newestRelatedEvents = [
        { matchId: 2, matchType: MatchType.LINK },
        { matchId: 3, matchType: MatchType.LINK }
      ] as ChildMatchModel[];

      jest.spyOn(relatedEventService, 'mapChildMatchesToEvents').mockReturnValue([
        { matchId: 3, isMainMatch: false } as LogInfoEarlyKickOff
      ]);

      // Act
      service['addNewestChildEventsToAllSelectedEvents'](saveRequestArg, newestRelatedEvents);

      // Assert
      expect(relatedEventService.mapChildMatchesToEvents).toHaveBeenCalledWith(
        [{ matchId: 3, matchType: MatchType.LINK }],
        saveRequestArg.mainEvent
      );
      expect(saveRequestArg.allEvents.length).toBe(3);
      expect(saveRequestArg.allEvents[2].matchId).toBe(3);
    });
  });
}); 