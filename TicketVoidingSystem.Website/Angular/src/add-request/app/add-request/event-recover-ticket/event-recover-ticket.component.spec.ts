import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AddRequestApiService } from '../add-request-api.service';
import { AddRequestStore } from '../add-request.store';
import { FilterModel } from '../filter/filter.model';
import { RecoverTicketModel } from '../models/recover-ticket.model';
import { OthersModel } from '../others/others.model';
import { ProductFilterRecoverTicket } from './constants/product.constant';
import { EventRecoverTicketComponent } from './event-recover-ticket.component';
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
  static readonly fakeRecoverTicketModel = new RecoverTicketModel();
}

describe('EventRecoverTicketComponent', () => {
  let component: EventRecoverTicketComponent;
  let fixture: ComponentFixture<EventRecoverTicketComponent>;
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

    fixture = TestBed.createComponent(EventRecoverTicketComponent);
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
    component.recoverTicketModel = Helper.fakeRecoverTicketModel;
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue({});

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.recoverTicketModel.productIds).toBe(ProductFilterRecoverTicket.SELECTION_ITEMS[0].value);
    expect(component.primitiveProps.permission).toBeDefined();
  });

  it('should handle afterFocusOutBetIds with validation', async () => {
    // Arrange
    component.betIdsComponent = {} as BetIdsComponent;
    component.recoverTicketModel = Helper.fakeRecoverTicketModel;
    component.filter = Helper.fakeFilterModel;
    component.isCancelAfterFocusOutBetIdsEvent = false;
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();
    validationService.checkBusinessRule = jest.fn().mockResolvedValue(undefined);

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(validationService.checkBusinessRule).toHaveBeenCalledWith(
      component.betIdsComponent,
      component.recoverTicketModel,
      component.filter,
      component.requestId,
      component.primitiveProps.permission
    );
  });

  it('should not validate when isCancelAfterFocusOutBetIdsEvent is true', async () => {
    // Arrange
    component.isCancelAfterFocusOutBetIdsEvent = true;
    validationService.checkBusinessRule = jest.fn();

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(validationService.checkBusinessRule).not.toHaveBeenCalled();
  });

  it('should save request with correct arguments', async () => {
    // Arrange
    component.betIdsComponent = {
      getAllBetIds: jest.fn().mockReturnValue(['123', '456']),
      triggerFocusOutBetIds: jest.fn()
    } as unknown as BetIdsComponent;
    component.recoverTicketModel = Helper.fakeRecoverTicketModel;
    component.filter = Helper.fakeFilterModel;
    component.isEdit = true;
    component.requestId = Helper.fakeRequestId;
    component.others = Helper.fakeOthersModel;
    saveRequestService.saveRequest = jest.fn();

    // Act
    await component.saveRequest();

    // Assert
    expect(component.betIdsComponent.triggerFocusOutBetIds).toHaveBeenCalled();
    expect(saveRequestService.saveRequest).toHaveBeenCalled();
    const saveRequestArg = (saveRequestService.saveRequest as jest.Mock).mock.calls[0][0];
    expect(saveRequestArg.requestId).toBe(Helper.fakeRequestId);
    expect(saveRequestArg.isEdit).toBe(true);
    expect(saveRequestArg.filter).toBe(Helper.fakeFilterModel);
    expect(saveRequestArg.others).toBe(Helper.fakeOthersModel);
  });

  it('should create recover ticket model with correct data', () => {
    // Arrange
    component.betIdsComponent = {
      getAllBetIds: jest.fn().mockReturnValue(['123', '456'])
    } as unknown as BetIdsComponent;
    component.recoverTicketModel = Helper.fakeRecoverTicketModel;
    component.filter = Helper.fakeFilterModel;

    // Act
    const result = component['createRecoverTicketModel']();

    // Assert
    expect(result.transIds).toEqual(['123', '456']);
    expect(result.productIds).toBe(component.recoverTicketModel.productIds);
    expect(result.subIssueTypeId).toBe(Number(component.filter.subIssueTypeId));
  });
});
