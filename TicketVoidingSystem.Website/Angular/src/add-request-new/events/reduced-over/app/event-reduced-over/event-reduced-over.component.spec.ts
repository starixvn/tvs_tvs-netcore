import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OddsInfo } from '../../../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { OthersModel } from '../../../../component/others/others.model';
import { ReducedOverModel } from '../../../../models/event-reduced-over.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventReducedOverComponent } from './event-reduced-over.component';
import { ReducedOverBetType } from './models/bet-type-reduced-over-json.model';
import { LogInfoReducedOver } from './models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventReducedOverService } from './services/event-reduced-over.service';
import { FilterReducedOverService } from './services/filter-reduced-over.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

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
  static readonly fakeReducedOverModel = [{
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
    logInfoDetail: null,
    liveIndicator: 0,
    filterBetIdX: '',
    filterBetIdY: '',
    filterBetTypeId: ''
  }] as unknown as ReducedOverModel[];
}

describe('EventReducedOverComponent', () => {
  let component: EventReducedOverComponent;
  let fixture: ComponentFixture<EventReducedOverComponent>;
  let validationService: ValidationService;
  let eventReducedOverService: EventReducedOverService;
  let filterService: FilterReducedOverService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventReducedOverService,
        LogInfoService,
        SaveRequestService,
        FilterReducedOverService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventReducedOverComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventReducedOverService = fixture.debugElement.injector.get(EventReducedOverService);
    filterService = fixture.debugElement.injector.get(FilterReducedOverService);
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
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeFalsy();
    expect(component.primitivePropertyEvent.isShowValidation).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.reducedOverModels = Helper.fakeReducedOverModel;
    component.primitivePropertyEvent = {
      isShowFilterArea: false,
      isShowValidation: false
    } as PrimitivePropertyEvent;
    eventReducedOverService.assignModelsToEvents = jest.fn().mockReturnValue(new LogInfoReducedOver());
    filterService.getReducedOverBetTypes = jest.fn().mockResolvedValue([] as ReducedOverBetType[]);
    filterService.getPlayers = jest.fn().mockResolvedValue([] as OddsInfo[]);
    filterService.renderGroupReducedOverBetTypes = jest.fn().mockReturnValue([]);
    filterService.initBetTypeNgSelectMixtureModel = jest.fn().mockReturnValue({});
    filterService.initDefaultPlayerSelection = jest.fn().mockReturnValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventReducedOverService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeReducedOverModel);
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeTruthy();
    expect(component.primitivePropertyEvent.isShowValidation).toBeTruthy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterReducedOverComponent = {} as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    component.logInfoEvent = new LogInfoReducedOver();
    component.filter = Helper.fakeFilterModel;
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.clickSearch();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitivePropertyEvent.isShowValidation).toBeTruthy();
  });

  it('should handle match event change', async () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeagueComponent = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.updateMatchId.emit = jest.fn();
    filterService.getReducedOverBetTypes = jest.fn().mockResolvedValue([]);
    filterService.getPlayers = jest.fn().mockResolvedValue([]);
    filterService.renderGroupReducedOverBetTypes = jest.fn().mockReturnValue([]);
    filterService.initDefaultFilter = jest.fn().mockReturnValue({});

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeTruthy();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(undefined);
  });

  it('should handle save request', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = true;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'test';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterReducedOverComponent = {} as any;
    component.logInfoEvent = new LogInfoReducedOver();
    const saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('should reset log info of event', () => {
    // Arrange
    component.logInfoEvent = new LogInfoReducedOver();
    logInfoService.resetLogInfoOfEvent = jest.fn();

    // Act
    component.resetLogInfoOfEvent();

    // Assert
    expect(component.primitivePropertyEvent.isShowValidation).toBeFalsy();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.logInfoEvent);
  });

  it('should reset filter reduced over', () => {
    // Arrange
    component.logInfoEvent = new LogInfoReducedOver();
    filterService.initDefaultFilter = jest.fn().mockReturnValue({});

    // Act
    component.resetFilterReducedOver();

    // Assert
    expect(component.logInfoEvent.filterReducedOvers.length).toBe(1);
    expect(filterService.initDefaultFilter).toHaveBeenCalled();
  });
});
