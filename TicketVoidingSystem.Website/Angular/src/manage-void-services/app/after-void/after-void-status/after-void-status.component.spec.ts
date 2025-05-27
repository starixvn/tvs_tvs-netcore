import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { AfterVoidStatusComponent } from './after-void-status.component';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { AppApiService } from '../../app-api.service';
import { VoidBetAutomationModel } from '../../app.model';

class Helper {
  static readonly fakeVoidBetAutomationModel = {
    requestId: 123,
    voidingHistoryId: 456,
    isRunExternalService: 'true',
    messageId: 'msg123',
    messageIdSpecial: 'msg456',
    reasonId: 789,
    isSentBatchMessage: 'true',
    isSentMessageToAdminSite: 'true',
    isInsertedVoidedTransaction: 'true',
    isUpdatedVoidingHistory: 'true',
    isSentEmail: 'true',
    isDeletedZzzBetTrans: 'true',
    isDeletedMessage: 'true',
    isDeletedVoidedTransaction: 'true',
    isSentToMTS: 'true'
  } as unknown as VoidBetAutomationModel;
}

describe('AfterVoidStatusComponent', () => {
  let component: AfterVoidStatusComponent;
  let fixture: ComponentFixture<AfterVoidStatusComponent>;
  let modalService: ModalService;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ModalService,
        AppApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AfterVoidStatusComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Act
    component.ngOnInit();

    // Assert
    expect(component.tmpModel).toBeDefined();
    expect(component.selectionItem).toBeDefined();
  });

  it('should assign data correctly', () => {
    // Arrange
    component.model = Helper.fakeVoidBetAutomationModel;

    // Act
    component['assignData']();

    // Assert
    expect(component.tmpModel.isRunExternalService).toBe('true');
    expect(component.tmpModel.isSentBatchMessage).toBe('true');
    expect(component.tmpModel.isSentMessageToAdminSite).toBe('true');
  });

  it('should handle null values in assignData', () => {
    // Arrange
    component.model = new VoidBetAutomationModel();

    // Act
    component['assignData']();

    // Assert
    expect(component.tmpModel.isRunExternalService).toBe('null');
    expect(component.tmpModel.isSentBatchMessage).toBe('null');
    expect(component.tmpModel.isSentMessageToAdminSite).toBe('null');
  });

  it('should confirm update after void data', async () => {
    // Arrange
    component.tmpModel = Helper.fakeVoidBetAutomationModel;
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => onConfirm());
    appApiService.updateVoidBetAutomationInfo = jest.fn().mockResolvedValue(true);
    modalService.open = jest.fn();

    // Act
    await component.confirmUpdateAfterVoidData();

    // Assert
    expect(modalService.confirm).toHaveBeenCalled();
    expect(appApiService.updateVoidBetAutomationInfo).toHaveBeenCalled();
  });

  it('should initialize query update correctly', () => {
    // Arrange
    component.tmpModel = Helper.fakeVoidBetAutomationModel;

    // Act
    const result = component.initQueryUpdate();

    // Assert
    expect(result.requestId).toBe(Helper.fakeVoidBetAutomationModel.requestId);
    expect(result.voidingHistoryId).toBe(Helper.fakeVoidBetAutomationModel.voidingHistoryId);
    expect(result.isRunExternalService).toBeTruthy();
    expect(result.isSentBatchMessage).toBeTruthy();
  });

  it('should handle null values in initQueryUpdate', () => {
    // Arrange
    component.tmpModel = {
      ...Helper.fakeVoidBetAutomationModel,
      isRunExternalService: 'null',
      isSentBatchMessage: 'null'
    };

    // Act
    const result = component.initQueryUpdate();

    // Assert
    expect(result.isRunExternalService).toBeNull();
    expect(result.isSentBatchMessage).toBeNull();
  });
});
