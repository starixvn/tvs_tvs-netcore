import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventWrongHdpComponent } from './event-wrong-hdp.component';
import { ValidationService } from './services/validation.service';
import { EventWrongHdpService } from './services/event-wrong-hdp.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { RelatedEventService } from './services/related-event.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongHdpModel } from '../models/event-wrong-hdp.model';
import { OthersModel } from '../others/others.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { QueryList, SimpleChange } from '@angular/core';
import { LogInfoWrongHdpComponent } from './log-info-wrong-hdp/log-info-wrong-hdp.component';
import { MatchType } from '../../../../utility/constants/config';
import { LogInfoWrongHdp } from './models/log-info-wrong-hdp.model';
import { ChildMatchModel } from '../models/related-event.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { LinkedLogsViewModel } from '../pool-house-ticket/linked-log/linked-log.model';
import { FilterWithHdpModel } from './models/filter-with-hdp.model';
import { InfoSiteDBDownModel } from '../components/info-site-db-down/info-site-db-down.model';
import { PrimitiveProperty } from './models/primitive-property.model';

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
  static readonly fakeWrongHdpModel = [{
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    filterFromTransTime: '',
    filterToTransTime: '',
    homeFavorite: '',
    awayFavorite: '',
    actualMarket: '',
    hdpValue: '',
    poolHouseCheckedBetTypes: '',
    isPoolHouseAffected: false,
    logInfoDetail: new LogInfoDetail(),
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    liveIndicator: 0,
    filterBetIdX: '',
    filterBetIdY: '',
    filterBetTypeId: ''
  }] as WrongHdpModel[];
}

describe('EventWrongHdpComponent', () => {
  let component: EventWrongHdpComponent;
  let fixture: ComponentFixture<EventWrongHdpComponent>;
  let validationService: ValidationService;
  let eventWrongHdpService: EventWrongHdpService;
  let relatedEventService: RelatedEventService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongHdpService,
        LogInfoService,
        SaveRequestService,
        RelatedEventService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongHdpComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongHdpService = fixture.debugElement.injector.get(EventWrongHdpService);
    relatedEventService = fixture.debugElement.injector.get(RelatedEventService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    eventWrongHdpService.initDefaultMainEvent = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongHdpService.initDefaultMainEvent).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.wrongHdpModels = Helper.fakeWrongHdpModel;
    component.primitiveProps = {
        isShowRelatedEvents: false,
        isBlock: false,
        inputRelatedMatchId: '',
        transInfoAddRequestModel: null,
        infoSiteDBDownModel: new InfoSiteDBDownModel(),
        isShowInfoSiteDBDown: false
    } as PrimitiveProperty;
    eventWrongHdpService.assignModelsToEvents = jest.fn();
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

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventWrongHdpService.assignModelsToEvents).toHaveBeenCalledWith(component.allSelectedEvents, Helper.fakeWrongHdpModel);
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
  });

  it('should handle filter changes and reset data', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isChangeSubTypeManual = true;
    logInfoService.resetLogInfoOfEvent = jest.fn();

    // Act
    component.ngOnChanges({
      filter: {
        currentValue: Helper.fakeFilterModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
    expect(component.filter.isChangeSubTypeManual).toBeFalsy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    const logInfoComponent = {
        isMainMatch: true,
        logInfo: { isShowValidation: false }
    } as LogInfoWrongHdpComponent;
    component.logInfoComponents = new QueryList<LogInfoWrongHdpComponent>();
    component.logInfoComponents.reset([logInfoComponent]);
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    eventWrongHdpService.getLinkedLog = jest.fn().mockResolvedValue([]);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    relatedEventService.getChildMatches = jest.fn().mockResolvedValue([]);
    component.mainEvent = {
        matchId: 123,
        matchCode: 'TEST123',
        leagueName: 'Test League',
        isMainMatch: true,
        eventName: 'Test Event',
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: '',
        filterWithHdp: new FilterWithHdpModel(),
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        eventDate: new Date(),
        sportType: 1
    } as LogInfoWrongHdp;
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(eventWrongHdpService.getLinkedLog).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
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
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
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
        filterWithHdp: new FilterWithHdpModel(),
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: '',
        sportType: 1
      } as LogInfoWrongHdp,
      {
        matchId: 456,
        isMainMatch: true,
        eventName: 'Test Event 2',
        leagueName: 'Test League',
        matchCode: 'TEST456',
        filterWithHdp: new FilterWithHdpModel(),
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        isPoolHouseAffected: false,
        poolHouseCheckedBetTypes: '',
        sportType: 1
      } as LogInfoWrongHdp
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
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
    expect(component.allSelectedEvents).toEqual([]);
  });
});
