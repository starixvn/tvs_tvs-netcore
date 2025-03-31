import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventWrongOddsComponent } from './event-wrong-odds.component';
import { ValidationService } from './services/validation.service';
import { EventWrongOddsService } from './services/event-wrong-odds.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { CalculateOddsService } from './services/calculate-odds.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongOddsModel } from '../models/event-wrong-odds.model';
import { OthersModel } from '../others/others.model';
import { LogInfoWrongOdds } from './models/log-info-wrong-odds.model';
import { FilterWrongOddsModel, MaxBetAndSpreadInfo } from './models/filter-wrong-odds.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { PoolHouseTicketValue } from '../pool-house-ticket/pool-house-ticket.constant';
import { FilterWrongOddsComponent } from './filter-wrong-odds/filter-wrong-odds.component';
import { SimpleChange } from '@angular/core';

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
  static readonly fakeWrongOddsModel = [{
    matchId: 123,
    sportType: 1
  }] as WrongOddsModel [];
  static readonly fakeMaxBetAndSpreadInfo =  [{
    maxBet: 1000,
    spread: '0.5'
  }] as MaxBetAndSpreadInfo[];
}

describe('EventWrongOddsComponent', () => {
  let component: EventWrongOddsComponent;
  let fixture: ComponentFixture<EventWrongOddsComponent>;
  let validationService: ValidationService;
  let eventWrongOddsService: EventWrongOddsService;
  let logInfoService: LogInfoService;
  let saveRequestService: SaveRequestService;
  let calculateOddsService: CalculateOddsService;
  let addRequestApiService: AddRequestApiService;
  let addRequestStore: AddRequestStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongOddsService,
        LogInfoService,
        SaveRequestService,
        CalculateOddsService,
        AddRequestApiService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongOddsComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongOddsService = fixture.debugElement.injector.get(EventWrongOddsService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    calculateOddsService = fixture.debugElement.injector.get(CalculateOddsService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    eventWrongOddsService.initDefaultLogInfoWrongOdds = jest.fn().mockReturnValue(new LogInfoWrongOdds());

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongOddsService.initDefaultLogInfoWrongOdds).toHaveBeenCalled();
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.wrongOddsModels = Helper.fakeWrongOddsModel;
    eventWrongOddsService.assignModelsToEvents = jest.fn().mockReturnValue(new LogInfoWrongOdds());

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongOddsService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeWrongOddsModel[0]);
  });

  it('should handle filter changes and update maxBetAndSpreadInfo', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.eventLeagueComponent = {
      selectedMatch: { matchId: 123 } as MatchModel
    } as EventLeagueComponent;
    component.filterWrongOddsComponent = {
      filterWrongOddsModel: {} as FilterWrongOddsModel
    } as FilterWrongOddsComponent;
    addRequestApiService.getMaxBetAndSpreadOfEvent = jest.fn().mockResolvedValue(Helper.fakeMaxBetAndSpreadInfo);
    calculateOddsService.resetOddsInfo = jest.fn();

    // Act
    await component.ngOnChanges({
      filter: {
        currentValue: Helper.fakeFilterModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(addRequestApiService.getMaxBetAndSpreadOfEvent).toHaveBeenCalled();
    expect(calculateOddsService.resetOddsInfo).toHaveBeenCalled();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOddsComponent = {
      filterWrongOddsModel: {} as FilterWrongOddsModel
    } as FilterWrongOddsComponent;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    calculateOddsService.calculateOddsRange = jest.fn();
    eventWrongOddsService.getLinkedLog = jest.fn().mockResolvedValue([]);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(calculateOddsService.calculateOddsRange).toHaveBeenCalled();
    expect(eventWrongOddsService.getLinkedLog).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.logInfoEvent.isShowValidation).toBeTruthy();
  });

  it('should handle save request', async () => {
    // Arrange
    addRequestStore.changeBlockingUiStatus = jest.fn();
    calculateOddsService.calculateOddsRange = jest.fn();
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.saveRequest();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalled();
    expect(calculateOddsService.calculateOddsRange).toHaveBeenCalled();
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
    expect(component.logInfoEvent.isShowValidation).toBeFalsy();
  });

  it('should handle match event change', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: {
        matchId: 123,
        sportType: 1
      } as MatchModel
    } as EventLeagueComponent;
    calculateOddsService.updateOddsInfo = jest.fn();
    logInfoService.resetLogInfoOfEvent = jest.fn();
    component.updateMatchId = {
      emit: jest.fn()
    } as any;

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.logInfoEvent.sportType).toBe(1);
    expect(calculateOddsService.updateOddsInfo).toHaveBeenCalled();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(123);
  });

  it('should reset log info of event', () => {
    // Arrange
    logInfoService.resetLogInfoOfEvent = jest.fn();

    // Act
    component.resetLogInfoOfEvent();

    // Assert
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.logInfoEvent);
  });

  it('should reset pool house checked bet types', () => {
    // Act
    component.resetPoolHouseCheckedBetTypes();

    // Assert
    expect(component.logInfoEvent.poolHouseCheckedBetTypes).toBe(PoolHouseTicketValue.SELECT_ALL_BETTYPE);
  });

  it('should initialize save request input with correct values', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = true;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'test-action';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOddsComponent = {
      filterWrongOddsModel: {} as FilterWrongOddsModel
    } as FilterWrongOddsComponent;
    component.logInfoEvent = new LogInfoWrongOdds();

    // Act
    const result = component['initSaveRequestInput']();

    // Assert
    expect(result.requestId).toBe(Helper.fakeRequestId);
    expect(result.requestedBy).toBe(Helper.fakeRequestedBy);
    expect(result.isEdit).toBeTruthy();
    expect(result.userId).toBe(Helper.fakeUserId);
    expect(result.actionIdOfFirstTimeAccess).toBe('test-action');
    expect(result.others).toBe(Helper.fakeOthersModel);
    expect(result.filter).toBe(Helper.fakeFilterModel);
    expect(result.eventLeagueComponent).toBeDefined();
    expect(result.filterWrongOddsComponent).toBeDefined();
    expect(result.logInfoEvent).toBeDefined();
    expect(result.addRequestStore).toBeDefined();
  });
});
