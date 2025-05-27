import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { AfterVoidComponent } from './after-void.component';
import { AppApiService } from '../app-api.service';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { ServiceStatusConstant, VoidBetAutomationModel } from '../app.model';
import { TEXT } from '../../../utility/constants/text';
import { ModalType } from '../../../utility/components/modal/modal.model';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeVoidingHistoryId = 123;
  static readonly fakeVoidBetAutomationModel = {
    requestId: 1212,
    voidingHistoryId: 123,
    statusId: 1,
    isAutoVoid: false
  } as VoidBetAutomationModel;
  static readonly fakeRequestDetailViewModel = {
    request: {
      issueTypeId: IssueTypeConstant.RECOVER_TICKET
    }
  };
}

describe('AfterVoidComponent', () => {
  let component: AfterVoidComponent;
  let fixture: ComponentFixture<AfterVoidComponent>;
  let appApiService: AppApiService;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AppApiService,
        ModalService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AfterVoidComponent);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectionItem).toEqual(ServiceStatusConstant.AfterVoidSelection);
    expect(component.isNoData).toBeTruthy();
    expect(component.isBlock).toBeFalsy();
  });

  it('should reset data correctly', () => {
    // Arrange
    component.isNoData = true;
    component.model = Helper.fakeVoidBetAutomationModel;

    // Act
    component.resetData();

    // Assert
    expect(component.isNoData).toBeFalsy();
    expect(component.model).toEqual(new VoidBetAutomationModel());
  });

  it('should validate search query correctly when both IDs are provided', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.voidingHistoryId = Helper.fakeVoidingHistoryId;

    // Act
    const result = component.isValidSearchQuery();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should validate search query correctly when requestId is missing', () => {
    // Arrange
    component.requestId = null;
    component.voidingHistoryId = Helper.fakeVoidingHistoryId;
    component.tooltip.display = jest.fn();

    // Act
    const result = component.isValidSearchQuery();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('request-id', TEXT.REQUIRED_REQUEST_ID);
  });

  it('should validate search query correctly when voidingHistoryId is missing', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.voidingHistoryId = null;
    component.tooltip.display = jest.fn();

    // Act
    const result = component.isValidSearchQuery();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('voiding-history-id', TEXT.REQUIRED_VOIDING_HISTORY_ID);
  });

  it('should search and update data successfully', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.voidingHistoryId = Helper.fakeVoidingHistoryId;
    appApiService.getVoidBetAutomationInfo = jest.fn().mockResolvedValue(Helper.fakeVoidBetAutomationModel);
    appApiService.getRequestNoAuth = jest.fn().mockResolvedValue(Helper.fakeRequestDetailViewModel);

    // Act
    await component.search();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.isNoData).toBeFalsy();
    expect(component.model).toEqual(Helper.fakeVoidBetAutomationModel);
    expect(component.isRecoverTicket).toBeTruthy();
    expect(component.orgStatusId).toBe(Helper.fakeVoidBetAutomationModel.statusId);
  });

  it('should handle search with no data', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.voidingHistoryId = Helper.fakeVoidingHistoryId;
    appApiService.getVoidBetAutomationInfo = jest.fn().mockResolvedValue(null);
    appApiService.getRequestNoAuth = jest.fn().mockResolvedValue(Helper.fakeRequestDetailViewModel);
    component.updateInfoRequest = jest.fn();

    // Act
    await component.search();

    // Assert
    expect(component.isBlock).toBeFalsy();
    expect(component.isNoData).toBeTruthy();
  });

  it('should confirm update status successfully', async () => {
    // Arrange
    component.model = Helper.fakeVoidBetAutomationModel;
    component.tmpStatusId = 2;
    component.orgStatusId = 1;
    const confirmPromise = Promise.resolve();
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => {
      onConfirm();
      return confirmPromise;
    });
    appApiService.updateVoidBetAutomationInfo = jest.fn().mockResolvedValue(true);
    modalService.open = jest.fn();

    // Act
    await component.confirmUpdateStatus();
    await confirmPromise;

    // Assert
    expect(appApiService.updateVoidBetAutomationInfo).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalledWith({
      title: 'Change Status VoidBet Automation Data result',
      message: 'Successful!',
      type: ModalType.Alert
    });
  });

  it('should handle update status failure', async () => {
    // Arrange
    component.model = Helper.fakeVoidBetAutomationModel;
    component.tmpStatusId = 2;
    component.orgStatusId = 1;
    const confirmPromise = Promise.resolve();
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => {
      onConfirm();
      return confirmPromise;
    });
    appApiService.updateVoidBetAutomationInfo = jest.fn().mockResolvedValue(false);
    modalService.open = jest.fn();

    // Act
    await component.confirmUpdateStatus();
    await confirmPromise;

    // Assert
    expect(appApiService.updateVoidBetAutomationInfo).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalledWith({
      title: 'Change Status VoidBet Automation Data result',
      message: 'Failed!',
      type: ModalType.Error
    });
  });

  it('should cancel update status', () => {
    // Arrange
    component.model = Helper.fakeVoidBetAutomationModel;
    component.tmpStatusId = 2;
    component.orgStatusId = 1;
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm, onCancel) => onCancel());

    // Act
    component.confirmUpdateStatus();

    // Assert
    expect(component.tmpStatusId).toBe(component.orgStatusId);
  });

  it('should show component when model has requestId', () => {
    // Arrange
    component.model = Helper.fakeVoidBetAutomationModel;

    // Act
    const result = component.isShow();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show component when model has no requestId', () => {
    // Arrange
    component.model = { requestId: null } as any;

    // Act
    const result = component.isShow();

    // Assert
    expect(result).toBeFalsy();
  });
});
