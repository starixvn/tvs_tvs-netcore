import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { EventDuplicateTicketsComponent } from './event-duplicate-tickets.component';
import { ValidationService } from './services/validation.service';
import { SaveRequestService } from './services/save-request.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { DuplicateTicketsModel } from '../models/event-duplicate-tickets.model';
import { OthersModel } from '../others/others.model';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestApiService } from '../add-request-api.service';
import { AbnormalFilterBy, TVSRequestActionType } from '../../../../utility/constants/config';

class Helper {
  static readonly fakeRequestId = 1212;
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
  static readonly fakeDuplicateTicketsModel = {
    matchId: 123,
    sportType: 1,
    filterBy: AbnormalFilterBy.SINGLE,
    name: 'Test Match',
    leagueName: 'Test League',
    transIds: '123,456',
    orgTransIds: '789\n101112'
  } as DuplicateTicketsModel;
}

describe('EventDuplicateTicketsComponent', () => {
  let component: EventDuplicateTicketsComponent;
  let fixture: ComponentFixture<EventDuplicateTicketsComponent>;
  let validationService: ValidationService;
  let saveRequestService: SaveRequestService;
  let addRequestStore: AddRequestStore;
  let commonService: CommonService;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        SaveRequestService,
        AddRequestStore,
        CommonService,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDuplicateTicketsComponent);
    validationService = fixture.debugElement.injector.get(ValidationService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    commonService = fixture.debugElement.injector.get(CommonService);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    addRequestStore.changeAbnormalFilterBy = jest.fn();
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.duplicateTicketsModel.filterBy).toBe(AbnormalFilterBy.SINGLE);
    expect(addRequestStore.changeAbnormalFilterBy).toHaveBeenCalledWith(AbnormalFilterBy.SINGLE);
  });

  it('should initialize with existing values when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.duplicateTicketsModel = Helper.fakeDuplicateTicketsModel;
    const fakeMatchInfo = {
      match: {
        leagueName: 'Updated League',
        name: 'Updated Match'
      }
    };
    commonService.getMatchInfoAddRequest = jest.fn().mockResolvedValue(fakeMatchInfo);
    addRequestStore.changeAbnormalFilterBy = jest.fn();
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.duplicateTicketsModel.leagueName).toBe('Updated League');
    expect(component.duplicateTicketsModel.name).toBe('Updated Match');
    expect(addRequestStore.changeAbnormalFilterBy).toHaveBeenCalledWith(component.duplicateTicketsModel.filterBy);
  });

  it('should handle afterFocusOutBetIds when not cancelled', async () => {
    // Arrange
    component.isCancelAfterFocusOutBetIdsEvent = false;
    component.betIdsComponent = {
      getAllBetIds: jest.fn().mockReturnValue(['123', '456'])
    } as unknown as BetIdsComponent;
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
    validationService.checkValidBusinessRule = jest.fn().mockResolvedValue(true);

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(component.primitiveProps.isBlockBetIds).toBeFalsy();
  });

  it('should handle saveRequest', async () => {
    // Arrange
    component.betIdsComponent = {
      triggerFocusOutBetIds: jest.fn(),
      getAllBetIds: jest.fn().mockReturnValue(['123', '456'])
    } as unknown as BetIdsComponent;
    saveRequestService.saveRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.saveRequest();

    // Assert
    expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
    expect(component.isCancelAfterFocusOutBetIdsEvent).toBeFalsy();
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
  });

  it('should remove invalid trans IDs', () => {
    // Arrange
    component.betIdsComponent = {
      removeTransId: jest.fn()
    } as unknown as BetIdsComponent;
    component.primitiveProps.invalidTransIds = '123,456';

    // Act
    component.removeInvalidTransIds();

    // Assert
    expect(component.betIdsComponent.removeTransId).toHaveBeenCalledWith(component.primitiveProps.invalidTransIds);
    expect(component.primitiveProps.isShowButtonRemoveInvalid).toBeFalsy();
  });

  it('should trigger close event', () => {
    // Arrange
    addRequestStore.changeSavingRequestStatus = jest.fn();

    // Act
    component.triggerCloseEvent();

    // Assert
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
  });

  it('should change filter by', () => {
    // Arrange
    const newFilterBy = AbnormalFilterBy.SINGLE;
    addRequestStore.changeAbnormalFilterBy = jest.fn();

    // Act
    component.changeFilterBy(newFilterBy);

    // Assert
    expect(component.duplicateTicketsModel.filterBy).toBe(newFilterBy);
    expect(addRequestStore.changeAbnormalFilterBy).toHaveBeenCalledWith(newFilterBy);
  });

  it('should show league event when filter is SINGLE', () => {
    // Arrange
    component.duplicateTicketsModel.filterBy = AbnormalFilterBy.SINGLE;

    // Act & Assert
    expect(component.isShowLeagueEvent()).toBeTruthy();
  });

  it('should not show league event when filter is not SINGLE', () => {
    // Arrange
    component.duplicateTicketsModel = {
      ...Helper.fakeDuplicateTicketsModel,
      filterBy: AbnormalFilterBy.MIX_PARLAY
    };

    // Act & Assert
    expect(component.isShowLeagueEvent()).toBeFalsy();
  });

  it('should disable bet IDs when voided', () => {
    // Arrange
    component.filter.isVoided = true;

    // Act & Assert
    expect(component.isDisableBetIds()).toBeTruthy();
  });

  it('should disable bet IDs when action is AUTO_VOID_INSTANT_ID', () => {
    // Arrange
    component.filter.action = TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString();

    // Act & Assert
    expect(component.isDisableBetIds()).toBeTruthy();
  });

  it('should create duplicate tickets model correctly', () => {
    // Arrange
    component.duplicateTicketsModel = Helper.fakeDuplicateTicketsModel;
    component.filter = Helper.fakeFilterModel;
    component.betIdsComponent = {
      getAllBetIds: jest.fn().mockReturnValue(['123', '456'])
    } as unknown as BetIdsComponent;
    validationService.isFilterMixParlay = jest.fn().mockReturnValue(false);

    // Act
    const result = component['createDuplicateTicketsModel']();

    // Assert
    expect(result.matchId).toBe(Helper.fakeDuplicateTicketsModel.matchId);
    expect(result.transIds).toEqual(['123', '456']);
    expect(result.subIssueTypeId).toBe(Number(Helper.fakeFilterModel.subIssueTypeId));
    expect(result.filterBy).toBe(Helper.fakeDuplicateTicketsModel.filterBy);
    expect(result.orgTransIds).toBe('789,101112');
  });
});
