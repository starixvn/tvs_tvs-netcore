import { QueryList, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddChildMatchModel } from '../../../../../utility/components/add-child-match/add-child-match.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchType } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../component/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../../../component/log-info-related-event/primitive-property.model';
import { OthersModel } from '../../../../component/others/others.model';
import { TvDetectionModel } from '../../../../component/tv-detection/tv-detection.model';
import { RedCardModel } from '../../../../models/event-red-card.model';
import { ChildMatchModel } from '../../../../models/related-event.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventRedCardComponent } from './event-red-card.component';
import { FilterTimeWithAllowance } from './filter-time-with-allowance/filter-time-with-allowance.model';
import { EventRedCardService } from './services/event-red-card.service';
import { LogInfoService } from './services/log-info.service';
import { RelatedEventService } from './services/related-event.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '15',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeRedCardModel = [{
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 15,
    filterFromTransTime: '',
    filterToTransTime: '',
    isCheckedVar: false,
    logInfoDetail: new LogInfoDetail()
  }] as unknown as RedCardModel[];
}

describe('EventRedCardComponent', () => {
  let component: EventRedCardComponent;
  let fixture: ComponentFixture<EventRedCardComponent>;
  let validationService: ValidationService;
  let eventRedCardService: EventRedCardService;
  let relatedEventService: RelatedEventService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventRedCardService,
        LogInfoService,
        SaveRequestService,
        RelatedEventService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventRedCardComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventRedCardService = fixture.debugElement.injector.get(EventRedCardService);
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
    eventRedCardService.initDefaultMainEvent = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(eventRedCardService.initDefaultMainEvent).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.redCardModels = Helper.fakeRedCardModel;
    component.primitiveProps = {
      isShowRelatedEvents: false,
      isBlock: false,
      inputRelatedMatchId: 0,
      transInfoAddRequestModel: null,
      isShowLogInfoMainMatch: false,
      filterBy: 0
    } as unknown as PrimitiveProperty;
    component.filter = Helper.fakeFilterModel;
    component.mainEvent = {
      matchId: 123,
      eventDate: new Date(),
      sportType: 1,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel(),
      isMainMatch: true,
      matchCode: 'TEST123',
      leagueName: 'Test League',
      eventName: 'Test Event',
      isCheckedVar: false,
      logInfoDetail: new LogInfoDetail(),
      isShowValidation: false
    } as unknown as LogInfoRelatedEvent;
    eventRedCardService.assignModelsToEvents = jest.fn();
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
    expect(eventRedCardService.assignModelsToEvents).toHaveBeenCalledWith(
      component.allSelectedEvents,
      Helper.fakeRedCardModel,
      component.primitiveProps,
      addRequestStore
    );
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
    expect(component.filter.isChangeSubTypeManual).toBeFalsy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: {
        parentId: 456,
        matchId: 123,
        name: 'Test Match',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        eventDate: new Date(),
        sportType: 1
      }
    } as EventLeagueComponent;
    component.filterTimeAreaComponent = {
      filterTimeWithAllowanceComponent: {
        updateData: jest.fn()
      }
    } as any;
    component.tvDetectionComponent = {} as any;
    const logInfoComponent = {
      isMainMatch: true,
      logInfo: { isShowValidation: false },
      isEdit: false,
      requestId: 0,
      isDisabled: false,
      filter: Helper.fakeFilterModel,
      primitiveProps: {},
      defaultFilterTimeWithAllowance: new FilterTimeWithAllowance(),
      allEvents: [],
      mainEvent: {} as LogInfoRelatedEvent,
      addRequestStore: {} as AddRequestStore,
      inputMatchIdClass: '',
      originalRelatedEvents: [],
      filterTimeWithAllowanceComponent: {
        updateData: jest.fn()
      },
      showValidationDetail: jest.fn()
    } as unknown as LogInfoRelatedEventComponent;
    component.logInfoComponents = new QueryList<LogInfoRelatedEventComponent>();
    component.logInfoComponents.reset([logInfoComponent]);
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    relatedEventService.getChildMatches = jest.fn().mockResolvedValue([]);
    relatedEventService.getDataWhenSearch = jest.fn().mockResolvedValue(undefined);
    logInfoService.updateIsCheckedVar = jest.fn();
    component.mainEvent = {
      matchId: 123,
      matchCode: 'TEST123',
      leagueName: 'Test League',
      isMainMatch: true,
      eventName: 'Test Event',
      isCheckedVar: false,
      logInfoDetail: new LogInfoDetail(),
      isShowValidation: false,
      eventDate: new Date(),
      sportType: 1,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;
    component.filter = Helper.fakeFilterModel;
    component.allSelectedEvents = [component.mainEvent];
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(relatedEventService.getChildMatches).toHaveBeenCalled();
    expect(relatedEventService.getDataWhenSearch).toHaveBeenCalled();
    expect(logInfoService.updateIsCheckedVar).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
    expect(logInfoComponent.showValidationDetail).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });

  it('should handle search event with validation failure', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: {
        parentId: 456,
        matchId: 123,
        name: 'Test Match',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        eventDate: new Date(),
        sportType: 1
      }
    } as EventLeagueComponent;
    component.filterTimeAreaComponent = {
      filterTimeWithAllowanceComponent: {
        updateData: jest.fn()
      }
    } as any;
    component.tvDetectionComponent = {} as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(false);
    component.mainEvent = {
      matchId: 123,
      isCheckedVar: null,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('should handle search event with var check validation failure', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: {
        parentId: 456,
        matchId: 123,
        name: 'Test Match',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        eventDate: new Date(),
        sportType: 1
      }
    } as EventLeagueComponent;
    component.filterTimeAreaComponent = {
      filterTimeWithAllowanceComponent: {
        updateData: jest.fn()
      }
    } as any;
    component.tvDetectionComponent = {} as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    component.mainEvent = {
      matchId: 123,
      isCheckedVar: null,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;
    component.filter = Helper.fakeFilterModel;
    jest.spyOn(component, 'isShowVarCheck').mockReturnValue(true);

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(component.mainEvent.isHighLightVarCheck).toBeTruthy();
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
  });

  it('should handle match event change', () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeagueComponent = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.updateMatchId = {
      emit: jest.fn()
    } as any;

    // Act
    component.changeMatchEvent();

    // Assert
    expect(component.mainEvent.matchId).toBe(123);
    expect(component.primitiveProps.isShowRelatedEvents).toBeFalsy();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(matchInfo);
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
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent,
      {
        matchId: 456,
        isMainMatch: true,
        eventName: 'Test Event 2',
        leagueName: 'Test League',
        matchCode: 'TEST456',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent
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

  it('should handle var check value change', () => {
    // Arrange
    component.mainEvent = {
      isCheckedVar: null,
      isHighLightVarCheck: true,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;

    // Act
    component.changeVarCheckValue(true);

    // Assert
    expect(component.mainEvent.isCheckedVar).toBeTruthy();
    expect(component.mainEvent.isHighLightVarCheck).toBeFalsy();
  });

  it('should get log info detail', () => {
    // Arrange
    component.mainEvent = {
      logInfoDetail: new LogInfoDetail(),
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;

    // Act
    const result = component.getLogInfoDetail();

    // Assert
    expect(result).toEqual([component.mainEvent.logInfoDetail]);
  });

  it('should save related event', async () => {
    // Arrange
    const selectedRelatedEvents = [
      {
        matchId: 123,
        matchType: MatchType.CHILD,
        isChecked: true,
        matchCode: 'TEST123',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];
    component.allSelectedEvents = [
      {
        matchId: 456,
        isMainMatch: true,
        eventName: 'Test Event 2',
        leagueName: 'Test League',
        matchCode: 'TEST456',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent
    ];
    component.relatedEvents = [
      {
        matchId: 123,
        matchType: MatchType.CHILD,
        isChecked: false,
        matchCode: 'TEST123',
        leagueName: 'Test League',
        matchEvent: 'Test Event'
      } as ChildMatchModel
    ];
    component.mainEvent = {
      matchId: 456,
      isMainMatch: true,
      isCheckedVar: false,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;
    component.defaultFilterTimeWithAllowance = new FilterTimeWithAllowance();
    component.addChildMatchModel = new AddChildMatchModel();
    component.addChildMatchModel.matchType = MatchType.CHILD;
    relatedEventService.assignChildMatchToLogInfoModel = jest.fn().mockReturnValue([
      {
        matchId: 123,
        isMainMatch: false,
        eventName: 'Test Event',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent
    ]);
    eventRedCardService.updateSubIssueTypeAndAllowanceTime = jest.fn().mockResolvedValue(undefined);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    logInfoService.updateIsCheckedVar = jest.fn();

    // Act
    await component.saveRelatedEvent(selectedRelatedEvents);

    // Assert
    expect(relatedEventService.assignChildMatchToLogInfoModel).toHaveBeenCalled();
    expect(eventRedCardService.updateSubIssueTypeAndAllowanceTime).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(logInfoService.updateIsCheckedVar).toHaveBeenCalled();
    expect(component.primitiveProps.isShowRelatedEvents).toBeTruthy();
    expect(component.primitiveProps.isBlock).toBeFalsy();
  });

  it('should handle click add related event', async () => {
    // Arrange
    component.allSelectedEvents = [
      {
        matchId: 123,
        isMainMatch: true,
        eventName: 'Test Event',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent
    ];
    relatedEventService.addRelatedEventByInput = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.handleClickAddRelatedEvent();

    // Assert
    expect(relatedEventService.addRelatedEventByInput).toHaveBeenCalled();
  });

  it('should show add child match modal', () => {
    // Arrange
    const matchType = MatchType.CHILD;
    component.allSelectedEvents = [
      {
        matchId: 123,
        isMainMatch: true,
        eventName: 'Test Event',
        leagueName: 'Test League',
        matchCode: 'TEST123',
        logInfoDetail: new LogInfoDetail(),
        isShowValidation: false,
        isCheckedVar: false,
        sportType: 1,
        subIssueTypeId: 15,
        voidTimeArea: {},
        tvDetectionModel: new TvDetectionModel()
      } as unknown as LogInfoRelatedEvent
    ];

    // Act
    component.showAddChildMatchModal(matchType);

    // Assert
    expect(component.addChildMatchModel.selectedMatchIds).toEqual([123]);
    expect(component.addChildMatchModel.matchType).toBe(matchType);
    expect(component.addChildMatchModel.isOpen).toBeTruthy();
  });

  it('should handle actual time change', () => {
    // Arrange
    const actualTime = '14:30';
    component.filterTimeAreaComponent = {
      filterTimeWithAllowanceComponent: {
        fromTime: ''
      }
    } as any;
    component.mainEvent = {
      matchId: 123,
      isMainMatch: true,
      eventName: 'Test Event',
      leagueName: 'Test League',
      matchCode: 'TEST123',
      logInfoDetail: new LogInfoDetail(),
      isShowValidation: false,
      isCheckedVar: false,
      sportType: 1,
      subIssueTypeId: 15,
      voidTimeArea: {},
      tvDetectionModel: new TvDetectionModel()
    } as unknown as LogInfoRelatedEvent;

    // Act
    component.actualTimeChange(actualTime);

    // Assert
    expect(component.filterTimeAreaComponent.filterTimeWithAllowanceComponent.fromTime).toBeDefined();
    expect(component.relatedEvents).toEqual([]);
  });
});
