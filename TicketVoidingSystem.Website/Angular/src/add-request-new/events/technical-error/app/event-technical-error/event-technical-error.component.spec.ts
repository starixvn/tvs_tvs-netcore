import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { OthersModel } from '../../../../component/others/others.model';
import { TechnicalErrorModel } from '../../../../models/event-technical-error.model';
import { TransInfoAddRequestModel } from '../../../../models/trans-info-add-request.model';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventTechnicalErrorComponent } from './event-technical-error.component';
import { FilterTechnicalErrorModel } from './models/filter-technical-error.model';
import { LogInfoTechnicalError } from './models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from './models/primitive-property-event.model';
import { EventTechnicalErrorService } from './services/event-technical-error.service';
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
  static readonly fakeTechnicalErrorModel = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    filterFromTransTime: '',
    filterToTransTime: '',
    groupBetTypes: [],
    betTeamsResult: [],
    allBetTypesSelection: false,
    logInfoDetail: new LogInfoDetail()
  } as unknown as TechnicalErrorModel;
}

describe('EventTechnicalErrorComponent', () => {
  let component: EventTechnicalErrorComponent;
  let fixture: ComponentFixture<EventTechnicalErrorComponent>;
  let validationService: ValidationService;
  let eventTechnicalErrorService: EventTechnicalErrorService;
  let logInfoService: LogInfoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventTechnicalErrorService,
        LogInfoService,
        SaveRequestService,
        AddRequestStore
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventTechnicalErrorComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventTechnicalErrorService = fixture.debugElement.injector.get(EventTechnicalErrorService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    component.logInfoEvent = new LogInfoTechnicalError();
    component.logInfoEvent.filterTechnicalErrorModel = new FilterTechnicalErrorModel();

    // Act
    component.ngOnInit();

    // Assert
    expect(component.logInfoEvent.filterTechnicalErrorModel.fromDateTime).toBeDefined();
    expect(component.logInfoEvent.filterTechnicalErrorModel.toDateTime).toBeDefined();
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.technicalErrorModel = Helper.fakeTechnicalErrorModel;
    component.filter = Helper.fakeFilterModel;
    eventTechnicalErrorService.assignModelsToEvents = jest.fn().mockReturnValue(new LogInfoTechnicalError());

    // Act
    component.updateDataWhenEditRequest();

    // Assert
    expect(eventTechnicalErrorService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeTechnicalErrorModel);
    expect(component.groupBetTypesModel).toBeDefined();
    expect(component.advancedModeAddRequestModel).toBeDefined();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeague = {} as EventLeagueComponent;
    component.filterTimeComponent = {} as any;
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([]),
      advancedModeComponent: {
        getAllBetTypesSelection: jest.fn().mockReturnValue(false)
      }
    } as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    component.logInfoEvent = new LogInfoTechnicalError();
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.clickSearch();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
  });

  it('should handle match event change', () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeague = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.updateMatchId = { emit: jest.fn() } as any;
    logInfoService.resetLogInfoOfEvent = jest.fn();
    component.logInfoEvent = new LogInfoTechnicalError();
    component.logInfoEvent.matchId = 123;

    // Act
    component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(123);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
  });

  it('should reset bet type and advanced mode', () => {
    // Arrange
    component.advancedMode = {
      clearBetTeam: jest.fn()
    } as any;

    // Act
    component['resetBetTypeAndAdvancedMode']();

    // Assert
    expect(component.advancedMode.clearBetTeam).toHaveBeenCalled();
    expect(component.groupBetTypesModel).toBeDefined();
  });

  it('should initialize save request input', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = true;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'test';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.primitivePropertyEvent = { isShowValidation: true, isShowBetTypeCount: true, isShowErrorNoBetType: true, transInfoAddRequestModel: {} as TransInfoAddRequestModel, infoSiteDBDownModel: null } as PrimitivePropertyEvent;
    component.filterTimeComponent = {} as any;
    component.eventLeague = {} as EventLeagueComponent;
    component.logInfoEvent = new LogInfoTechnicalError();
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([]),
      advancedModeComponent: {
        getAllBetTypesSelection: jest.fn().mockReturnValue(false)
      }
    } as any;
    component.confirmAddRequest = {} as any;

    // Act
    const result = component['initSaveRequestInput']();

    // Assert
    expect(result.requestId).toBe(Helper.fakeRequestId);
    expect(result.requestedBy).toBe(Helper.fakeRequestedBy);
    expect(result.isEdit).toBeTruthy();
    expect(result.userId).toBe(Helper.fakeUserId);
  });

  it('should create time range model', () => {
    // Arrange
    const filterModel = new FilterTechnicalErrorModel();
    filterModel.fromDateTime = '2024-01-01';
    filterModel.toDateTime = '2024-01-02';

    // Act
    const result = component['createTimeRangeModel'](filterModel);

    // Assert
    expect(result.fromDate).toBe('2024-01-01');
    expect(result.toDate).toBe('2024-01-02');
  });
});
