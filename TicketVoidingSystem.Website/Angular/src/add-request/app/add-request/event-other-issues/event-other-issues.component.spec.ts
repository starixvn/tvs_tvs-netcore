import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventOtherIssuesComponent } from './event-other-issues.component';
import { ValidationService } from './services/validation.service';
import { EventOtherIssuesService } from './services/event-other-issues.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { OtherIssuesModel } from '../models/event-other-issues.model';
import { OthersModel } from '../others/others.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { SimpleChange } from '@angular/core';
import { LogInfoOtherIssues } from './models/log-info-other-issues.model';
import { GroupBetTypesAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { AddRequestApiService } from '../add-request-api.service';
import { AdvancedModeAddRequestModel } from '../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.model';
import { Selection } from '../../../../utility/models/selection.model';

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
  static readonly fakeOtherIssuesModel = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    groupBetTypes: [],
    betTeamsResult: [],
    allBetTypesSelection: false,
    filterFromTransTime: '',
    filterToTransTime: '',
    logInfoDetail: {}
  } as unknown as OtherIssuesModel;
}

describe('EventOtherIssuesComponent', () => {
  let component: EventOtherIssuesComponent;
  let fixture: ComponentFixture<EventOtherIssuesComponent>;
  let validationService: ValidationService;
  let eventOtherIssuesService: EventOtherIssuesService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventOtherIssuesService,
        LogInfoService,
        SaveRequestService,
        AddRequestStore,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventOtherIssuesComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventOtherIssuesService = fixture.debugElement.injector.get(EventOtherIssuesService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
    component.updateMatchId.emit = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    eventOtherIssuesService.initDefaultLogInfoOtherIssues = jest.fn().mockReturnValue({});
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventOtherIssuesService.initDefaultLogInfoOtherIssues).toHaveBeenCalled();
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.otherIssuesModel = Helper.fakeOtherIssuesModel;
    component.filter = Helper.fakeFilterModel;
    eventOtherIssuesService.assignModelsToEvents = jest.fn();
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventOtherIssuesService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeOtherIssuesModel);
    expect(component.primitiveProps.isShowValidation).toBeTruthy();
  });

  it('should handle filter changes and reset data', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isChangeSubTypeManual = true;
    component.filter.subIssueTypeId = '1';
    component.eventLeagueComponent = {
      selectedMatch: {
        matchId: 123
      }
    } as EventLeagueComponent;
    component.advancedModeAddRequestModel = {
      checkedBetTypes: [],
      betTeamsResult: [],
      selectedAllBetTypes: [] as Selection[]
    } as AdvancedModeAddRequestModel;
    eventOtherIssuesService.initDefaultFilter = jest.fn().mockReturnValue({});
    addRequestStore.changeSavingRequestStatus = jest.fn();
    eventOtherIssuesService.getGroupBetTypes = jest.fn().mockResolvedValue(new GroupBetTypesAddRequestModel([], false, '', false));
    validationService.isSubTypeRestart = jest.fn().mockReturnValue(true);

    // Act
    await component.ngOnChanges({
      filter: {
        currentValue: Helper.fakeFilterModel,
        previousValue: null,
        firstChange: true
      } as SimpleChange
    });

    // Assert
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([])
    } as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    component.logInfoEvent = new LogInfoOtherIssues();
    component.filter = Helper.fakeFilterModel;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitiveProps.isShowValidation).toBeTruthy();
  });

  it('should handle match event change', async () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeagueComponent = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.filter = Helper.fakeFilterModel;
    component.filter.subIssueTypeId = '1';
    eventOtherIssuesService.getGroupBetTypes = jest.fn().mockResolvedValue(new GroupBetTypesAddRequestModel([], false, '', false));
    validationService.isSubTypeRestart = jest.fn().mockReturnValue(false);

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should reset log info of event', () => {
    // Act
    component.resetLogInfoOfEvent();

    // Assert
    expect(component.primitiveProps.isShowErrorNoBetType).toBeFalsy();
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should check if sub type is restart', () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    validationService.isSubTypeRestart = jest.fn().mockReturnValue(true);

    // Act
    const result = component.isSubTypeRestart();

    // Assert
    expect(result).toBeTruthy();
    expect(validationService.isSubTypeRestart).toHaveBeenCalledWith(component.filter.subIssueTypeId);
  });

  it('should handle checking load data advanced mode', () => {
    // Arrange
    const isLoading = true;
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    component.checkingLoadDataAdvancedMode(isLoading);

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(isLoading);
  });

  it('should handle cancel save request', () => {
    // Arrange
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.onClickCancelSaveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });
});
