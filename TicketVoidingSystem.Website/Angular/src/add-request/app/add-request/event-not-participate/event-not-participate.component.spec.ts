import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { NotParticipateModel } from '../models/event-not-participate.model';
import { OthersModel } from '../others/others.model';
import { EventNotParticipateComponent } from './event-not-participate.component';
import { FilterNotParticipateComponent } from './filter-not-participate/filter-not-participate.component';
import { FilterNotParticipateModel } from './models/filter-not-participate.model';
import { LogInfoNotParticipate } from './models/log-info-not-participate.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventNotParticipateService } from './services/event-not-participate.service';
import { FilterNotParticipateService } from './services/filter-not-participate.service';
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
  static readonly fakeNotParticipateModel = [{
    matchId: 123,
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
    logInfoDetail: new LogInfoDetail(),
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    liveIndicator: 0,
    filterBetIdX: '',
    filterBetIdY: '',
    filterBetTypeId: ''
  }] as unknown as NotParticipateModel[];
}

describe('EventNotParticipateComponent', () => {
  let component: EventNotParticipateComponent;
  let fixture: ComponentFixture<EventNotParticipateComponent>;
  let validationService: ValidationService;
  let eventNotParticipateService: EventNotParticipateService;
  let filterNotParticipateService: FilterNotParticipateService;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventNotParticipateService,
        LogInfoService,
        SaveRequestService,
        FilterNotParticipateService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventNotParticipateComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventNotParticipateService = fixture.debugElement.injector.get(EventNotParticipateService);
    filterNotParticipateService = fixture.debugElement.injector.get(FilterNotParticipateService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    component.primitivePropertyEvent = {
      isShowFilterArea: false,
      isShowValidation: false,
      transInfoAddRequestModel: null
    } as PrimitivePropertyEvent;

    // Act
    component.ngOnInit();

    // Assert
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeFalsy();
    expect(component.primitivePropertyEvent.isShowValidation).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.notParticipateModels = Helper.fakeNotParticipateModel;
    component.primitivePropertyEvent = {
      isShowFilterArea: false,
      isShowValidation: false,
      transInfoAddRequestModel: null
    } as PrimitivePropertyEvent;
    eventNotParticipateService.assignModelsToEvents = jest.fn().mockReturnValue(new LogInfoNotParticipate());
    filterNotParticipateService.getNotParticipateBetTypes = jest.fn().mockResolvedValue({
      notParticipatePlayers: [],
      notParticipateBetTypes: []
    });
    filterNotParticipateService.initDefaultBetTypeSelection = jest.fn().mockReturnValue([]);

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventNotParticipateService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeNotParticipateModel);
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeTruthy();
    expect(component.primitivePropertyEvent.isShowValidation).toBeTruthy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterNotParticipateComponent = {} as FilterNotParticipateComponent;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    component.logInfoEvent = new LogInfoNotParticipate();
    component.filter = Helper.fakeFilterModel;

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
    filterNotParticipateService.getNotParticipateBetTypes = jest.fn().mockResolvedValue({
      notParticipatePlayers: [],
      notParticipateBetTypes: []
    });

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.primitivePropertyEvent.isShowFilterArea).toBeTruthy();
    expect(component.updateMatchId.emit).toHaveBeenCalled();
  });

  it('should reset log info of event', () => {
    // Arrange
    component.primitivePropertyEvent = {
      isShowValidation: true,
      isShowFilterArea: true,
      transInfoAddRequestModel: null
    } as PrimitivePropertyEvent;
    component.logInfoEvent = new LogInfoNotParticipate();
    logInfoService.resetLogInfoOfEvent = jest.fn();

    // Act
    component.resetLogInfoOfEvent();

    // Assert
    expect(component.primitivePropertyEvent.isShowValidation).toBeFalsy();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.logInfoEvent);
  });

  it('should reset filter not participate', () => {
    // Arrange
    component.logInfoEvent = new LogInfoNotParticipate();
    component.logInfoEvent.filterNotParticipates = [{} as FilterNotParticipateModel];
    filterNotParticipateService.initDefaultFilter = jest.fn().mockReturnValue({} as FilterNotParticipateModel);

    // Act
    component.resetFilterNotParticipate();

    // Assert
    expect(component.logInfoEvent.filterNotParticipates.length).toBe(1);
    expect(component.logInfoEvent.filterNotParticipates[0]).toEqual({});
  });

  it('should save request', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = true;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = '1';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.primitivePropertyEvent = {
      isShowFilterArea: true,
      isShowValidation: true,
      transInfoAddRequestModel: null
    } as PrimitivePropertyEvent;
    component.filterNotParticipateComponent = {} as FilterNotParticipateComponent;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.logInfoEvent = new LogInfoNotParticipate();

    const saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });
});
