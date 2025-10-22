import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { FilterModel } from '../../../../component/filter/filter.model';
import { OthersModel } from '../../../../component/others/others.model';
import { EventTicket14Model } from '../../../../models/event-ticket-14.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { EventTicket14Component } from './event-ticket14.component';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';

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
  static readonly fakeEventTicket14Model = new EventTicket14Model();
}

describe('EventTicket14Component', () => {
  let component: EventTicket14Component;
  let fixture: ComponentFixture<EventTicket14Component>;
  let validationService: ValidationService;
  let saveRequestService: SaveRequestService;
  let addRequestStore: AddRequestStore;
  let addRequestApiService: AddRequestApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ValidationService,
        SaveRequestService,
        AddRequestStore,
        AddRequestApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventTicket14Component);
    validationService = fixture.debugElement.injector.get(ValidationService);
    saveRequestService = fixture.debugElement.injector.get(SaveRequestService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    component.isEdit = false;
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(addRequestApiService.getPermissionAddRequest).toHaveBeenCalled();
    expect(component.primitiveProps.permission).toBeDefined();
  });

  it('should handle afterFocusOutBetIds when not cancelled', async () => {
    // Arrange
    component.isCancelAfterFocusOutBetIdsEvent = false;
    component.betIdsComponent = {} as BetIdsComponent;
    component.filter = Helper.fakeFilterModel;
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
    validationService.checkBusinessRule = jest.fn().mockResolvedValue({ isValid: true });

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(validationService.checkBusinessRule).toHaveBeenCalledWith(
      component.betIdsComponent,
      component.primitiveProps.permission
    );
  });

  it('should handle afterFocusOutBetIds when cancelled', async () => {
    // Arrange
    component.isCancelAfterFocusOutBetIdsEvent = true;
    component.betIdsComponent = {} as BetIdsComponent;
    component.filter = Helper.fakeFilterModel;
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
    validationService.checkBusinessRule = jest.fn();

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(validationService.checkBusinessRule).not.toHaveBeenCalled();
  });

  it('should save request when request is voided', async () => {
    // Arrange
    component.filter = { ...Helper.fakeFilterModel, isVoided: true };
    component.betIdsComponent = {
      getAllBetIds: jest.fn().mockReturnValue([])
    } as unknown as BetIdsComponent;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    saveRequestService.executeSave = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(true);
    expect(saveRequestService.executeSave).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });

  it('should save request when request is not voided and validation passes', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.betIdsComponent = {
      triggerFocusOutBetIds: jest.fn(),
      getAllBetIds: jest.fn().mockReturnValue([])
    } as unknown as BetIdsComponent;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    validationService.checkBusinessRule = jest.fn().mockResolvedValue({ isValid: true, transInfoJson: {} });
    saveRequestService.executeSave = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
    expect(validationService.checkBusinessRule).toHaveBeenCalled();
    expect(saveRequestService.executeSave).toHaveBeenCalled();
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });

  it('should not save request when validation fails', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.betIdsComponent = {
      triggerFocusOutBetIds: jest.fn(),
      getAllBetIds: jest.fn().mockReturnValue([])
    } as unknown as BetIdsComponent;
    addRequestStore.changeBlockingUiStatus = jest.fn();
    addRequestStore.changeSavingRequestStatus = jest.fn();
    validationService.checkBusinessRule = jest.fn().mockResolvedValue({ isValid: false });

    // Act
    await component.saveRequest();

    // Assert
    expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
    expect(validationService.checkBusinessRule).toHaveBeenCalled();
    expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
    expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledWith(false);
  });
});
