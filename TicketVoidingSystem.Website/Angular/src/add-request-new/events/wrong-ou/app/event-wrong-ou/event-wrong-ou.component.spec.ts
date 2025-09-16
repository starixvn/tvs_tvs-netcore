import { QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { OthersModel } from '../../../../component/others/others.model';
import { LinkedLogsViewModel } from '../../../../component/pool-house-ticket/linked-log/linked-log.model';
import { WrongOuModel } from '../../../../models/event-wrong-ou.model';
import { ChildMatchModel } from '../../../../models/related-event.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventWrongOuComponent } from './event-wrong-ou.component';
import { LogInfoWrongOuComponent } from './log-info-wrong-ou/log-info-wrong-ou.component';
import { LogInfoWrongOu } from './models/log-info-wrong-ou.model';
import { EventWrongOuService } from './services/event-wrong-ou.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

jest.mock('moment-timezone', () => {
    const actualMoment = jest.requireActual('moment-timezone');
    return {
        __esModule: true,
        default: jest.fn().mockImplementation((date) => ({
            format: jest.fn().mockReturnValue('2024-01-01')
        })),
        ...actualMoment
    };
});

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
  static readonly fakeWrongOuModel = [{
    matchId: 123,
    matchCode: 'TEST123',
    leagueName: 'Test League',
    name: 'Test Event',
    subIssueTypeId: 1,
    isMainMatch: true,
    eventDate: new Date(),
    filterFromTransTime: '',
    filterToTransTime: '',
    actualMarket: '',
    wrongMarket: '',
    logInfoDetail: new LogInfoDetail(),
    filterBetIdX: '',
    filterBetIdY: '',
    filterBetTypeId: '',
    poolHouseCheckedBetTypes: '',
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    liveIndicator: 0,
    sportType: 1
  } as WrongOuModel];
}

describe('EventWrongOuComponent', () => {
  let component: EventWrongOuComponent;
  let fixture: ComponentFixture<EventWrongOuComponent>;
  let validationService: ValidationService;
  let eventWrongOuService: EventWrongOuService;
  let relatedEventService: RelatedEventService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongOuService,
        LogInfoService,
        SaveRequestService,
        RelatedEventService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongOuComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongOuService = fixture.debugElement.injector.get(EventWrongOuService);
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
    eventWrongOuService.initDefaultMainEvent = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongOuService.initDefaultMainEvent).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.wrongOuModels = Helper.fakeWrongOuModel;
    component.filter = Helper.fakeFilterModel;
    component.mainEvent = {
        matchId: 123,
        matchCode: 'TEST123',
        leagueName: 'Test League',
        isMainMatch: true,
        eventName: 'Test Event',
        poolHouseCheckedBetTypes: '',
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        eventDate: new Date(),
        sportType: 1
    } as LogInfoWrongOu;
    component.allSelectedEvents = [component.mainEvent];
    component.primitiveProps = {
        isShowRelatedEvents: false,
        isBlock: false,
        inputRelatedMatchId: '',
        transInfoAddRequestModel: null
    };
    eventWrongOuService.assignModelsToEvents = jest.fn();
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
    expect(eventWrongOuService.assignModelsToEvents).toHaveBeenCalledWith(component.allSelectedEvents, Helper.fakeWrongOuModel);
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
    expect(relatedEventService.getChildMatches).toHaveBeenCalledWith({
        issueTypeId: 1,
        eventDate: '2024-01-01',
        matchId: 123,
        isMainMatch: true,
        sportType: 1
    });
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
    component.mainEvent = {
        matchId: 123,
        matchCode: 'TEST123',
        leagueName: 'Test League',
        isMainMatch: true,
        eventName: 'Test Event',
        poolHouseCheckedBetTypes: '',
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        eventDate: new Date(),
        sportType: 1
    } as LogInfoWrongOu;
    const logInfoComponent = {
        isMainMatch: true,
        logInfo: { isShowValidation: false }
    } as LogInfoWrongOuComponent;
    component.logInfoComponents = new QueryList<LogInfoWrongOuComponent>();
    component.logInfoComponents.reset([logInfoComponent]);
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    eventWrongOuService.getLinkedLog = jest.fn().mockResolvedValue([]);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    relatedEventService.getChildMatches = jest.fn().mockResolvedValue([]);
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(eventWrongOuService.getLinkedLog).toHaveBeenCalled();
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
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        poolHouseCheckedBetTypes: '',
        sportType: 1
      } as LogInfoWrongOu,
      {
        matchId: 456,
        isMainMatch: true,
        eventName: 'Test Event 2',
        leagueName: 'Test League',
        matchCode: 'TEST456',
        logInfoDetail: new LogInfoDetail(),
        linkedLogsViewModel: new LinkedLogsViewModel(),
        isShowValidation: false,
        poolHouseCheckedBetTypes: '',
        sportType: 1
      } as LogInfoWrongOu
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
