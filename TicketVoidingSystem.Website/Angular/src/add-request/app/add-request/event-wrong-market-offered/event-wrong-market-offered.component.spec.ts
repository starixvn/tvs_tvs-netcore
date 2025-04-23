import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventWrongMarketOfferedComponent } from './event-wrong-market-offered.component';
import { ValidationService } from './services/validation.service';
import { EventWrongMarketOfferedService } from './services/event-wrong-market-offfered.service';
import { LogInfoService } from './services/log-info.service';
import { SaveRequestService } from './services/save-request.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { WrongMarketOfferedModel } from '../models/event-wrong-market-offered.model';
import { OthersModel } from '../others/others.model';
import { EventLeagueComponent } from '../../../../utility/components/event-league/event-league.component';
import { CommonService } from '../../../../utility/services/common.service';
import { ModeType } from '../../../../utility/constants/config';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
  static readonly fakeFilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isChangeSubTypeManual: true,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeOthersModel = new OthersModel();
  static readonly fakeWrongMarketOfferedModel = [{
    id: 1,
    requestDetailId: 1,
    matchId: 123,
    subIssueTypeId: 1,
    filterFromTransTime: '2024-01-01',
    filterToTransTime: '2024-01-02',
    groupBetTypes: [{
      betTypes: [{
        id: 1,
        name: 'Test Bet Type',
        isChecked: false
      }]
    }],
    betTeamsResult: [{
      id: 1,
      name: 'Test Bet Team',
      isDisabled: false
    }],
    allBetTypesSelection: true,
    logInfoDetail: {},
    betTypeCount: 1
  }] as unknown as WrongMarketOfferedModel[];
}

describe('EventWrongMarketOfferedComponent', () => {
  let component: EventWrongMarketOfferedComponent;
  let fixture: ComponentFixture<EventWrongMarketOfferedComponent>;
  let validationService: ValidationService;
  let eventWrongMarketOfferedService: EventWrongMarketOfferedService;
  let addRequestStore: AddRequestStore;
  let logInfoService: LogInfoService;
  let commonService: CommonService;
  let saveRequestService: SaveRequestService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        EventWrongMarketOfferedService,
        LogInfoService,
        SaveRequestService,
        AddRequestStore,
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventWrongMarketOfferedComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    eventWrongMarketOfferedService = fixture.debugElement.injector.get(EventWrongMarketOfferedService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    logInfoService = fixture.debugElement.injector.get(LogInfoService);
    commonService = fixture.debugElement.injector.get(CommonService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', () => {
    // Arrange
    component.isEdit = false;
    eventWrongMarketOfferedService.initDefaultTime = jest.fn().mockReturnValue({});

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongMarketOfferedService.initDefaultTime).toHaveBeenCalledWith(1);
    expect(component.logInfoEvent.filterWrongMarketOfferedModels).toBeDefined();
  });

  it('should initialize with existing values when in edit mode', () => {
    // Arrange
    component.isEdit = true;
    component.wrongMarketOfferedModels = Helper.fakeWrongMarketOfferedModel;
    component.filter = Helper.fakeFilterModel;
    eventWrongMarketOfferedService.assignModelsToEvents = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(eventWrongMarketOfferedService.assignModelsToEvents).toHaveBeenCalledWith(Helper.fakeWrongMarketOfferedModel);
    expect(component.primitivePropertyEvent.isShowValidation).toBeTruthy();
  });

  it('should get group bet types successfully', async () => {
    // Arrange
    component.eventLeague = {
      selectedMatch: { matchId: 123 }
    } as EventLeagueComponent;
    const mockGroupBetTypes = {
      groupBetTypes: [{
        betTypes: [{
          id: 1,
          name: 'Test Bet Type'
        }]
      }]
    };
    commonService.getGroupBetTypesTvs = jest.fn().mockResolvedValue(mockGroupBetTypes);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.getGroupBetTypes();

    // Assert
    expect(commonService.getGroupBetTypesTvs).toHaveBeenCalledWith({
      mode: ModeType.SPORT_BOOK,
      matchId: 123,
      timeRanges: expect.any(Array),
      isGetCancelCashOut: true
    });
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('should handle refresh event with validation', async () => {
    // Arrange
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    component.getGroupBetTypes = jest.fn().mockResolvedValue(undefined);
    component.advancedMode = {
      changeBetTypes: jest.fn(),
      resetAllBetTeams: jest.fn()
    } as any;
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.refreshEvent();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(component.getGroupBetTypes).toHaveBeenCalled();
    expect(component.advancedMode.changeBetTypes).toHaveBeenCalled();
    expect(component.advancedMode.resetAllBetTeams).toHaveBeenCalled();
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should handle click search with validation', async () => {
    // Arrange
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([])
    } as any;
    validationService.validateCommonData = jest.fn().mockReturnValue(true);
    logInfoService.getLogInfo = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    await component.clickSearch();

    // Assert
    expect(validationService.validateCommonData).toHaveBeenCalled();
    expect(logInfoService.getLogInfo).toHaveBeenCalled();
    expect(component.primitivePropertyEvent.isShowValidation).toBeTruthy();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should handle save request', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([]),
      advancedModeComponent: {
        getAllBetTypesSelection: jest.fn().mockReturnValue(true)
      }
    } as any;
    saveRequestService.saveRequest = jest.fn().mockResolvedValue(undefined);
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(2);
  });

  it('should handle change match event', () => {
    // Arrange
    component.eventLeague = {
      selectedMatch: { matchId: 123 }
    } as EventLeagueComponent;
    component.updateMatchId.emit = jest.fn();
    logInfoService.resetLogInfoOfEvent = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.changeMatchEvent();

    // Assert
    expect(component.updateMatchId.emit).toHaveBeenCalled();
    expect(logInfoService.resetLogInfoOfEvent).toHaveBeenCalled();
    expect(component.logInfoEvent.matchId).toBe(123);
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
  });

  it('should handle check exist bet type event', () => {
    // Act
    component.checkExistBetTypeEvent(true);

    // Assert
    expect(component.primitivePropertyEvent.isShowErrorNoBetType).toBeFalsy();
  });

  it('should handle checking load data advanced mode', () => {
    // Arrange
    addRequestStore.changeBlockingUiStatus = jest.fn();

    // Act
    component.checkingLoadDataAdvancedMode(true);

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
  });

  it('should handle change filter time', () => {
    // Arrange
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.changeFilterTime();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    expect(component.primitivePropertyEvent.isShowErrorNoBetType).toBeFalsy();
    expect(component.primitivePropertyEvent.isShowValidation).toBeFalsy();
  });

  it('should handle confirm save request', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.advancedMode = {
      getCheckedBetTypes: jest.fn().mockReturnValue([]),
      advancedModeComponent: {
        getAllBetTypesSelection: jest.fn().mockReturnValue(true)
      }
    } as any;
    saveRequestService.onClickConfirmSave = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.onClickConfirmSaveRequest();

    // Assert
    expect(saveRequestService.onClickConfirmSave).toHaveBeenCalled();
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
