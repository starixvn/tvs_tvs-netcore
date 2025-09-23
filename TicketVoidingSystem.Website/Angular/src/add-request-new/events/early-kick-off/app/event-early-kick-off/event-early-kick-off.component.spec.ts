import { QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { TemplateService } from '../../../../../utility/components/template-message/template-message/services/template.service';
import { MatchType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterModel } from '../../../../component/filter/filter.model';
import { EarlyKickOffModel } from '../../../../models/event-eko.model';
import { GetLogInfoViewModel } from '../../../../models/get-log-info.model';
import { ChildMatchModel } from '../../../../models/related-event.model';
import { OthersModel } from '../../../../component/others/others.model';
import { EventEarlyKickOffComponent } from './event-early-kick-off.component';
import { LogInfoEkoComponent } from './log-info-eko/log-info-eko.component';
import { LogInfoEarlyKickOff } from './models/log-info-eko.model';
import { EventEarlyKickOffService } from './services/event-eko.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { TableTicketsModel } from './tickets-list/table-tickets.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeEarlyKickOffModel = [{
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    kickOffTime: new Date(),
    liveIndicator: 0
  }] as unknown as EarlyKickOffModel[];
}

describe('EventEarlyKickOffComponent', () => {
  let component: EventEarlyKickOffComponent;
  let fixture: ComponentFixture<EventEarlyKickOffComponent>;
  let validationService: ValidationService;
  let eventEarlyKickOffService: EventEarlyKickOffService;
  let relatedEventService: RelatedEventService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;
  let addRequestApiService: AddRequestApiService;
  let templateService: TemplateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventEarlyKickOffService,
        LogInfoService,
        SaveRequestService,
        RelatedEventService,
        AddRequestStore,
        AddRequestApiService,
        TemplateService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventEarlyKickOffComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventEarlyKickOffService = fixture.debugElement.injector.get(EventEarlyKickOffService);
    relatedEventService = fixture.debugElement.injector.get(RelatedEventService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    templateService = fixture.debugElement.injector.get(TemplateService);
    component = fixture.componentInstance;

    // Initialize mainEvent with default values
    component.mainEvent = {
      matchId: 123,
      isMainMatch: true,
      eventName: 'Test Event',
      leagueName: 'Test League',
      matchCode: 'TEST123',
      logInfoDetail: new LogInfoDetail(),
      isShowValidation: false,
      sportType: 1,
      kickOffTime: new Date(),
      tableTicketsModel: new TableTicketsModel(),
      matchModel: {
        eventDate: new Date()
      } as MatchModel,
      isCollapse: false,
      templateValue: {},
      poolHouseCheckedBetTypes: '',
      linkedLogsViewModel: null
    } as unknown as LogInfoEarlyKickOff;
    component.allSelectedEvents = [component.mainEvent];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    component.filter = Helper.fakeFilterModel;
    eventEarlyKickOffService.initDefaultMainEvent = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventEarlyKickOffService.initDefaultMainEvent).toHaveBeenCalled();
    expect(component.primitiveProps.isShowLogInfoEvents).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.filter = Helper.fakeFilterModel;
    component.earlyKickOffModels = Helper.fakeEarlyKickOffModel;
    component.primitiveProps = {
      isShowLogInfoEvents: false,
      inputRelatedMatchId: '',
      transInfoAddRequestModel: null,
      infoSiteDBDownModel: null
    };
    eventEarlyKickOffService.assignModelsToEvents = jest.fn();
    relatedEventService.getChildMatches = jest.fn().mockResolvedValue([
      {
        matchType: MatchType.CHILD,
        isChecked: false,
        matchId: 1,
        matchCode: 'TEST1',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ]);
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});
    logInfoService.getTickets = jest.fn().mockResolvedValue(undefined);
    templateService.initializeTemplateValue = jest.fn().mockReturnValue({});
    logInfoService.assignTemplateMessageValueToEvent = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventEarlyKickOffService.assignModelsToEvents).toHaveBeenCalledWith(component.allSelectedEvents, Helper.fakeEarlyKickOffModel, Helper.fakeFilterModel);
    expect(component.primitiveProps.isShowLogInfoEvents).toBeTruthy();
  });

  it('should handle filter changes and reset data', () => {
    // Arrange
    component.filter = { ...Helper.fakeFilterModel };
    component.filter.isChangeSubTypeManual = true;
    logInfoService.resetLogInfoOfEvent = jest.fn();
    component.allSelectedEvents = [{
      matchId: 123,
      isMainMatch: true,
      eventName: 'Test Event',
      leagueName: 'Test League',
      matchCode: 'TEST123',
      logInfoDetail: new LogInfoDetail(),
      isShowValidation: false,
      sportType: 1,
      kickOffTime: new Date(),
      tableTicketsModel: new TableTicketsModel(),
      matchModel: {} as MatchModel,
      isCollapse: false,
      templateValue: {},
      poolHouseCheckedBetTypes: '',
      linkedLogsViewModel: null
    } as unknown as LogInfoEarlyKickOff];

    // Act
    component.ngOnChanges({
      issueTypeId: {
        currentValue: '1',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      } as SimpleChange
    });
    component.filter.isChangeSubTypeManual = false;

    // Assert
    expect(component.primitiveProps.isShowLogInfoEvents).toBeFalsy();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.allSelectedEvents);
    expect(component.filter.isChangeSubTypeManual).toBeFalsy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    const logInfoComponent = {
      isMainMatch: true,
      logInfo: { isShowValidation: false }
    } as LogInfoEkoComponent;
    component.logInfoComponents = new QueryList<LogInfoEkoComponent>();
    component.logInfoComponents.reset([logInfoComponent]);
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    const mockGetLogInfoResult = {
      getLogInfoModels: [],
      transInfoAddRequestModel: null
    } as GetLogInfoViewModel;
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(mockGetLogInfoResult);
    relatedEventService.getChildMatches = jest.fn().mockResolvedValue([]);
    const mockTableTicketsModel = {
      total: 0,
      totalSingle: 0,
      totalParlay: 0,
      totalCancelCashOut: 0,
      initData: function(data) {
        this.total = data.total;
        this.totalSingle = data.totalSingle;
        this.totalParlay = data.totalParlay;
        this.totalCancelCashOut = data.totalCancelCashOut;
      }
    } as TableTicketsModel;
    logInfoService.getTickets = jest.fn().mockResolvedValue(mockTableTicketsModel);
    component.filter = Helper.fakeFilterModel;
    templateService.initializeTemplateValue = jest.fn().mockReturnValue({});
    logInfoService.assignTemplateMessageValueToEvent = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitiveProps.isShowLogInfoEvents).toBeTruthy();
  });

  it('should handle match event change', () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeagueComponent = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.updateMatchId.emit = jest.fn();

    // Act
    component.changeMatchEvent();

    // Assert
    expect(component.mainEvent.matchId).toBe(123);
    expect(component.primitiveProps.isShowLogInfoEvents).toBeFalsy();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(123);
  });

  it('should handle delete event', () => {
    // Arrange
    const matchId = 123;
    component.allSelectedEvents = [
      {
        matchId: 123,
        isMainMatch: false,
        eventName: 'Test Event 1',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        sportType: 1,
        kickOffTime: new Date(),
        tableTicketsModel: new TableTicketsModel(),
        matchModel: {} as MatchModel,
        isCollapse: false,
        templateValue: {},
        poolHouseCheckedBetTypes: '',
        linkedLogsViewModel: null
      } as unknown as LogInfoEarlyKickOff,
      {
        matchId: 456,
        isMainMatch: true,
        eventName: 'Test Event 2',
        leagueName: 'Test League',
        matchCode: 'TEST456',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        sportType: 1,
        kickOffTime: new Date(),
        tableTicketsModel: new TableTicketsModel(),
        matchModel: {} as MatchModel,
        isCollapse: false,
        templateValue: {},
        poolHouseCheckedBetTypes: '',
        linkedLogsViewModel: null
      } as unknown as LogInfoEarlyKickOff
    ];

    // Act
    component.handleDeleteEvent(matchId);

    // Assert
    expect(component.allSelectedEvents.length).toBe(1);
    expect(component.allSelectedEvents[0].matchId).toBe(456);
  });

  it('should count child matches correctly', () => {
    // Arrange
    component.relatedEvents = [
      {
        matchType: MatchType.CHILD,
        isChecked: false,
        matchId: 1,
        matchCode: 'TEST1',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel,
      {
        matchType: MatchType.CHILD,
        isChecked: false,
        matchId: 2,
        matchCode: 'TEST2',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel,
      {
        matchType: MatchType.LINK,
        isChecked: false,
        matchId: 3,
        matchCode: 'TEST3',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];

    // Act
    const count = component.countChildMatches();

    // Assert
    expect(count).toBe(2);
  });

  it('should count link matches correctly', () => {
    // Arrange
    component.relatedEvents = [
      {
        matchType: MatchType.CHILD,
        isChecked: false,
        matchId: 1,
        matchCode: 'TEST1',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel,
      {
        matchType: MatchType.LINK,
        isChecked: false,
        matchId: 2,
        matchCode: 'TEST2',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel,
      {
        matchType: MatchType.LINK,
        isChecked: false,
        matchId: 3,
        matchCode: 'TEST3',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];

    // Act
    const count = component.countLinkMatches();

    // Assert
    expect(count).toBe(2);
  });

  it('should check if child matches are disabled', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.relatedEvents = [
      {
        matchType: MatchType.CHILD,
        isChecked: false,
        matchId: 1,
        matchCode: 'TEST1',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];

    // Act & Assert
    expect(component.isDisabledChildMatches()).toBeFalsy();

    component.filter.isVoided = true;
    expect(component.isDisabledChildMatches()).toBeTruthy();

    component.filter.isVoided = false;
    component.relatedEvents = [];
    expect(component.isDisabledChildMatches()).toBeTruthy();
  });

  it('should check if link matches are disabled', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.relatedEvents = [
      {
        matchType: MatchType.LINK,
        isChecked: false,
        matchId: 1,
        matchCode: 'TEST1',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];

    // Act & Assert
    expect(component.isDisabledLinkMatches()).toBeFalsy();

    component.filter.isVoided = true;
    expect(component.isDisabledLinkMatches()).toBeTruthy();

    component.filter.isVoided = false;
    component.relatedEvents = [];
    expect(component.isDisabledLinkMatches()).toBeTruthy();
  });

  it('should reset all data', () => {
    // Act
    component.resetAllData();

    // Assert
    expect(component.primitiveProps.isShowLogInfoEvents).toBeFalsy();
    expect(component.allSelectedEvents).toEqual([]);
  });
});
