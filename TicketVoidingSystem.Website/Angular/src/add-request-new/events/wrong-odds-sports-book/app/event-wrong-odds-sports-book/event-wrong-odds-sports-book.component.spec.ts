import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventWrongOddsSportsBookComponent } from './event-wrong-odds-sports-book.component';
import { ValidationService } from './services/validation.service';
import { EventWrongOddsSportsBookService } from './services/event-wrong-odds-sports-book.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { FilterModel } from '../../../../component/filter/filter.model';
import { WrongOddsSportsBookModel } from '../../../../models/event-wrong-odds-sports-book.model';
import { OthersModel } from '../../../../component/others/others.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { MatchModel } from '../../../../../utility/models/match.model';
import { LogInfoWrongOddsSportsBook } from './models/log-info-wrong-odds-sports-book.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { CommonService } from '../../../../../utility/services/common.service';
import { of } from 'rxjs';

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
  static readonly fakeWrongOddsSportsBookModel = {
    matchId: 123,
    sportType: 1,
    isMainMatch: true,
    eventDate: new Date(),
    subIssueTypeId: 1,
    groupBetTypes: [],
    betTeamsResult: [],
    allBetTypesSelection: false
  } as unknown as WrongOddsSportsBookModel;
}

describe('EventWrongOddsSportsBookComponent', () => {
  let component: EventWrongOddsSportsBookComponent;
  let fixture: ComponentFixture<EventWrongOddsSportsBookComponent>;
  let validationService: ValidationService;
  let eventWrongOddsSportsBookService: EventWrongOddsSportsBookService;
  let logInfoService: LogInfoService;
  let addRequestApiService: AddRequestApiService;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongOddsSportsBookService,
        LogInfoService,
        SaveRequestService,
        AddRequestStore,
        AddRequestApiService,
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongOddsSportsBookComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongOddsSportsBookService = fixture.debugElement.injector.get(EventWrongOddsSportsBookService);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    eventWrongOddsSportsBookService.initDefaultLogInfoWrongOddsSportsBook = jest.fn().mockReturnValue({});
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventWrongOddsSportsBookService.initDefaultLogInfoWrongOddsSportsBook).toHaveBeenCalled();
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.wrongOddsSportsBookModel = Helper.fakeWrongOddsSportsBookModel;
    component.filter = Helper.fakeFilterModel;
    eventWrongOddsSportsBookService.assignModelsToEvents = jest.fn();
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(eventWrongOddsSportsBookService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeWrongOddsSportsBookModel);
    expect(component.primitiveProps.isShowValidation).toBeTruthy();
  });

  it('should handle search event with validation', async () => {
    // Arrange
    component.eventLeagueComponent = {} as EventLeagueComponent;
    component.filterWrongOddsSportsBookComponent = {} as any;
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([]),
      advancedModeComponent: {
        getAllBetTypesSelection: jest.fn().mockReturnValue(true)
      }
    } as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    component.logInfoEvent = new LogInfoWrongOddsSportsBook();
    component.filter = Helper.fakeFilterModel;
    component.permission = { canAddRequest: true } as any;

    // Act
    await component.handleSearchEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitiveProps.isShowValidation).toBeTruthy();
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
    component.logInfoEvent = new LogInfoWrongOddsSportsBook();
    component.logInfoEvent.matchId = 0; // Set initial value
    const addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.changeMatchEvent();

    // Assert
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(component.updateMatchId.emit).toHaveBeenCalledWith(0); // Should emit old value first
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });

  it('should refresh event and get group bet types', async () => {
    // Arrange
    component.eventLeagueComponent = {
      selectedMatch: { matchId: 123 } as MatchModel
    } as EventLeagueComponent;
    component.filterWrongOddsSportsBookComponent = {} as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    commonService.getGroupBetTypesTvs = jest.fn().mockReturnValue(of({ groupBetTypes: [] }));
    component.advancedMode = {
      changeBetTypes: jest.fn(),
      resetAllBetTeams: jest.fn()
    } as any;

    // Act
    await component.refreshEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(commonService.getGroupBetTypesTvs).toHaveBeenCalled();
    expect(component.advancedMode.changeBetTypes).toHaveBeenCalled();
    expect(component.advancedMode.resetAllBetTeams).toHaveBeenCalled();
  });

  it('should save request', async () => {
    // Arrange
    const saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);
    component.initSaveRequestInput = jest.fn().mockReturnValue({});

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('should reset log info', () => {
    // Act
    component.resetLogInfo();

    // Assert
    expect(component.primitiveProps.isShowErrorNoBetType).toBeFalsy();
    expect(component.primitiveProps.isShowValidation).toBeFalsy();
  });

  it('should check exist bet type event', () => {
    // Act
    component.checkExistBetTypeEvent(true);

    // Assert
    expect(component.primitiveProps.isShowErrorNoBetType).toBeFalsy();

    // Act
    component.checkExistBetTypeEvent(false);

    // Assert
    expect(component.primitiveProps.isShowErrorNoBetType).toBeTruthy();
  });
}); 