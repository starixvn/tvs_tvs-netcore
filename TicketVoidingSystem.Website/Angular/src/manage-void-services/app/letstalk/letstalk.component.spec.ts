import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { LetsTalkComponent } from './letstalk.component';
import { AppApiService } from '../app-api.service';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { LetsTalkModel, LetsTalkViewModel } from './letstalk.model';
import { ServiceStatusConstant } from '../app.model';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { TEXT } from '../../../utility/constants/text';

class Helper {
  static readonly fakeRequestId = 12345;
  static readonly fakeBroadcastSessionId = 'test-session-123';
  static readonly fakeLetsTalkModels: LetsTalkModel[] = [
    {
      requestId: 12345,
      broadcastSessionId: 'test-session-123',
      statusId: 1
    } as LetsTalkModel
  ];
  static readonly fakeLetsTalkViewModels: LetsTalkViewModel[] = [
    {
      requestId: 12345,
      broadcastSessionId: 'test-session-123',
      statusId: 1,
      statusIdSelected: 1
    } as LetsTalkViewModel
  ];
}

describe('LetsTalkComponent', () => {
  let component: LetsTalkComponent;
  let fixture: ComponentFixture<LetsTalkComponent>;
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

    fixture = TestBed.createComponent(LetsTalkComponent);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
    
    // Mock tooltip element
    const mockElement = {
      getElementsByClassName: () => [{
        scrollIntoView: () => {},
        getBoundingClientRect: () => ({ top: 0, left: 0 })
      }]
    };
    component.tooltip.element = mockElement as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    // Initialize component with default values
    component.requestId = null;
    component.broadcastSessionId = null;
    component.letsTalkModels = [];
    component.letsTalkViewModels = [];
    
    expect(component.isBlock).toBeFalsy();
    expect(component.requestId).toBeNull();
    expect(component.broadcastSessionId).toBeNull();
    expect(component.letsTalkModels).toEqual([]);
    expect(component.letsTalkViewModels).toEqual([]);
    expect(component.letsTalkSelection).toEqual(ServiceStatusConstant.LetsTalkSelection);
  });

  it('should clear input and reset results', () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.broadcastSessionId = Helper.fakeBroadcastSessionId;
    component.letsTalkModels = Helper.fakeLetsTalkModels;
    component.letsTalkViewModels = Helper.fakeLetsTalkViewModels;

    // Act
    component.clearInput();

    // Assert
    expect(component.requestId).toBeNull();
    expect(component.broadcastSessionId).toBeNull();
    expect(component.letsTalkModels).toEqual([]);
    expect(component.letsTalkViewModels).toEqual([]);
  });

  it('should not search when requestId is invalid', async () => {
    // Arrange
    component.requestId = null;
    appApiService.getLetsTalk = jest.fn();
    component.tooltip.display = jest.fn();

    // Act
    await component.search();

    // Assert
    expect(appApiService.getLetsTalk).not.toHaveBeenCalled();
    expect(component.tooltip.display).toHaveBeenCalledWith('request-id', TEXT.REQUIRED_REQUEST_ID);
  });

  it('should search successfully with valid requestId', async () => {
    // Arrange
    component.requestId = Helper.fakeRequestId;
    component.broadcastSessionId = null;
    appApiService.getLetsTalk = jest.fn().mockResolvedValue(Helper.fakeLetsTalkModels);

    // Act
    await component.search();

    // Assert
    expect(appApiService.getLetsTalk).toHaveBeenCalledWith({
      requestId: Helper.fakeRequestId,
      broadcastSessionId: null
    });
    expect(component.letsTalkModels).toEqual(Helper.fakeLetsTalkModels);
    expect(component.letsTalkViewModels).toEqual(Helper.fakeLetsTalkViewModels);
    expect(component.isBlock).toBeFalsy();
  });

  it('should not update status when confirmation is cancelled', async () => {
    // Arrange
    const requestId = Helper.fakeRequestId;
    const broadcastSessionId = Helper.fakeBroadcastSessionId;
    const statusIdSelected = 1;
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm, onCancel) => onCancel());
    appApiService.updateLetstalk = jest.fn();

    // Act
    component.confirmUpdateStatus(requestId, broadcastSessionId, statusIdSelected);

    // Assert
    expect(appApiService.updateLetstalk).not.toHaveBeenCalled();
  });
});
