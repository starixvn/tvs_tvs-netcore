import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventWrongOfferedNameComponent } from './event-wrong-offered-name.component';
import { ValidationService } from './services/validation.service';
import { EventWrongOfferedNameService } from './services/event-wrong-offered-name.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongOfferedNameModel } from '../models/event-wrong-offered-name.model';
import { OthersModel } from '../others/others.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../utility/models/match.model';
import { LogInfoWrongOfferedName } from './models/log-info-wrong-offered-name.model';
import { PermissionAddRequest } from '../models/permission-add-request.model';
import { IssueTypes } from '../filter/issue-types.model';
import { PrimitiveProperty } from './models/primitive-property.model';
import { ConfirmAddRequestModel } from '../confirm-add-request/confirm-add-request.model';
import { TransInfoAddRequestModel } from '../models/trans-info-add-request.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { CheckAddPermissionService } from '../services/check-permission.service';
import { FilterWrongOfferedNameComponent } from './filter-wrong-offered-name/filter-wrong-offered-name.component';

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
  static readonly fakeWrongOfferedNameModel = {
    matchId: 123,
    subIssueTypeId: 1,
    logInfoDetail: new LogInfoDetail(),
    licenseeNames: '',
    currencyIds: '',
    wrongName: '',
    actualName: '',
    wrongNameT: '',
    actualNameT: '',
    wrongNameS: '',
    actualNameS: ''
  } as WrongOfferedNameModel;
  static readonly fakeIssueTypes = new IssueTypes();
  static readonly fakePermission = new PermissionAddRequest();
  static readonly fakePrimitiveProperty = {
    isBlock: false,
    isShowLogInfo: false,
    transInfoAddRequest: new TransInfoAddRequestModel()
  } as PrimitiveProperty;
  static readonly fakeConfirmAddRequestModel = {
    isOpen: false,
    requestId: 0,
    userId: 0,
    requestedBy: '',
    extraWarningModel: { title: '', messages: [] },
    isHasSettledTicket: false,
    isHasWarningTicket: false,
    isHasWarningTakenNote: false,
    isEditingByAnotherUser: false,
    isShowSubIssueType: false
  } as ConfirmAddRequestModel;
}

describe('EventWrongOfferedNameComponent', () => {
  let component: EventWrongOfferedNameComponent;
  let fixture: ComponentFixture<EventWrongOfferedNameComponent>;
  let validationService: ValidationService;
  let eventWrongOfferedNameService: EventWrongOfferedNameService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;
  let saveRequestService: SaveRequestService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongOfferedNameService,
        LogInfoService,
        SaveRequestService,
        AddRequestStore,
        CheckAddPermissionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongOfferedNameComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongOfferedNameService = fixture.debugElement.injector.get(EventWrongOfferedNameService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    eventWrongOfferedNameService.getPermissionAddRequest = jest.fn().mockResolvedValue(Helper.fakePermission);
    eventWrongOfferedNameService.initLogInfoEvent = jest.fn().mockReturnValue(new LogInfoWrongOfferedName());

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventWrongOfferedNameService.getPermissionAddRequest).toHaveBeenCalled();
    expect(eventWrongOfferedNameService.initLogInfoEvent).toHaveBeenCalled();
    expect(component.permission).toEqual(Helper.fakePermission);
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.wrongOfferedNameModel = Helper.fakeWrongOfferedNameModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = Helper.fakePrimitiveProperty;
    eventWrongOfferedNameService.getPermissionAddRequest = jest.fn().mockResolvedValue(Helper.fakePermission);
    eventWrongOfferedNameService.assignModelsToEvents = jest.fn().mockResolvedValue(new LogInfoWrongOfferedName());

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventWrongOfferedNameService.getPermissionAddRequest).toHaveBeenCalled();
    expect(eventWrongOfferedNameService.assignModelsToEvents).toHaveBeenCalledWith(component.filter, Helper.fakeWrongOfferedNameModel);
    expect(component.primitiveProps.isShowLogInfo).toBeTruthy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    component.filter = Helper.fakeFilterModel;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.logInfoEvent.isHasInstantlySettledTicket = false;
    component.logInfoEvent.isHasSettledTicket = false;
    component.permission = Helper.fakePermission;
    
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    validationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(validationService.isAccountHasAddRequestPermission).toHaveBeenCalled();
    expect(component.primitiveProps.isShowLogInfo).toBeTruthy();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should not proceed with search event if validation fails', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    validationService.validateCommonData = jest.fn().mockReturnValue(false);
    logInfoService.getLogInfo = jest.fn();
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).not.toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).not.toHaveBeenCalled();
  });

  it('should not proceed with search event if user lacks permission', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    component.filter = Helper.fakeFilterModel;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.logInfoEvent.isHasInstantlySettledTicket = false;
    component.logInfoEvent.isHasSettledTicket = false;
    component.permission = Helper.fakePermission;
    
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    validationService.isAccountHasAddRequestPermission = jest.fn().mockReturnValue(false);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(validationService.isAccountHasAddRequestPermission).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
    expect(component.primitiveProps.isShowLogInfo).toBeFalsy();
  });

  it('should handle match event change', async () => {
    // Arrange
    const matchInfo = { matchId: 123 } as MatchModel;
    component.eventLeagueComponent = {
      selectedMatch: matchInfo
    } as EventLeagueComponent;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.logInfoEvent.matchId = 123; // Khởi tạo matchId trước khi gọi changeMatchEvent
    component.updateMatchId.emit = jest.fn();
    component.filter = Helper.fakeFilterModel;
    logInfoService.resetLogInfoOfEvent = jest.fn();
    eventWrongOfferedNameService.updateSelectedMatchToInput = jest.fn();

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.primitiveProps.isShowLogInfo).toBeFalsy();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(123);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.logInfoEvent);
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.logInfoEvent.matchModel).toEqual(matchInfo);
    expect(eventWrongOfferedNameService.updateSelectedMatchToInput).toHaveBeenCalledWith(
      matchInfo, 
      component.logInfoEvent.filterWrongOfferedName, 
      component.filter.subIssueTypeId
    );
  });

  it('should not update match info if no match is selected', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: null
    } as EventLeagueComponent;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.logInfoEvent.matchId = 0; // Khởi tạo matchId trước khi gọi changeMatchEvent
    component.updateMatchId.emit = jest.fn();
    logInfoService.resetLogInfoOfEvent = jest.fn();
    eventWrongOfferedNameService.updateSelectedMatchToInput = jest.fn();

    // Act
    await component.changeMatchEvent();

    // Assert
    expect(component.primitiveProps.isShowLogInfo).toBeFalsy();
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(0);
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalledWith(component.logInfoEvent);
    expect(eventWrongOfferedNameService.updateSelectedMatchToInput).not.toHaveBeenCalled();
  });

  it('should save request', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = false;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'action1';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = Helper.fakePrimitiveProperty;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.confirmAddRequest = Helper.fakeConfirmAddRequestModel;
    component.permission = Helper.fakePermission;
    
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('should confirm save request', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = false;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'action1';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = Helper.fakePrimitiveProperty;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.confirmAddRequest = Helper.fakeConfirmAddRequestModel;
    component.permission = Helper.fakePermission;
    
    saveRequestService.onClickConfirmSave = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.onClickConfirmSaveRequest();

    // Assert
    expect(saveRequestService.onClickConfirmSave).toHaveBeenCalled();
  });

  it('should cancel save request', () => {
    // Arrange
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.onClickCancelSaveRequest();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should reset log info', () => {
    // Arrange
    component.primitiveProps = Helper.fakePrimitiveProperty;
    component.primitiveProps.isShowLogInfo = true;

    // Act
    component.resetLogInfo();

    // Assert
    expect(component.primitiveProps.isShowLogInfo).toBeFalsy();
  });

  it('should initialize save request input correctly', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.requestedBy = Helper.fakeRequestedBy;
    component.isEdit = false;
    component.userId = Helper.fakeUserId;
    component.actionIdOfFirstTimeAccess = 'action1';
    component.others = Helper.fakeOthersModel;
    component.filter = Helper.fakeFilterModel;
    component.primitiveProps = Helper.fakePrimitiveProperty;
    component.filterWrongOfferedNameComponent = {} as FilterWrongOfferedNameComponent;
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.logInfoEvent = new LogInfoWrongOfferedName();
    component.confirmAddRequest = Helper.fakeConfirmAddRequestModel;
    component.permission = Helper.fakePermission;

    // Act
    const result = component.initSaveRequestInput();

    // Assert
    expect(result.requestId).toBe(Helper.fakeRequestId);
    expect(result.requestedBy).toBe(Helper.fakeRequestedBy);
    expect(result.isEdit).toBeFalsy();
    expect(result.userId).toBe(Helper.fakeUserId);
    expect(result.actionIdOfFirstTimeAccess).toBe('action1');
    expect(result.others).toBe(Helper.fakeOthersModel);
    expect(result.filter).toBe(Helper.fakeFilterModel);
    expect(result.primitiveProps).toBe(component.primitiveProps);
    expect(result.filterWrongOfferedNameComponent).toBe(component.filterWrongOfferedNameComponent);
    expect(result.eventLeagueComponent).toBe(component.eventLeagueComponent);
    expect(result.logInfoEvent).toBe(component.logInfoEvent);
    expect(result.confirmAddRequest).toBe(component.confirmAddRequest);
    expect(result.permission).toBe(component.permission);
  });
});
