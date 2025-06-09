import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { VoidComponent } from './void.component';
import { AppApiService } from '../app-api.service';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { ServiceStatusConstant } from '../app.model';
import { TicketVoidingQueueModel } from './void.model';
import { ElementRef } from '@angular/core';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';

class Helper {
  static readonly fakeVoidingHistoryId = 123;
  static readonly fakeSiteDbGroupId = 1;
  static readonly fakeQueueId = '123';
  static readonly fakeQueueIds = '123,456';
  static readonly fakeStatusId = ServiceStatusConstant.Running;
  static readonly fakeTicketVoidingQueueModel = [
    {
      siteDbGroupId: 1,
      queueId: 123,
      statusId: ServiceStatusConstant.Running
    }
  ] as TicketVoidingQueueModel[];
}

describe('VoidComponent', () => {
  let component: VoidComponent;
  let fixture: ComponentFixture<VoidComponent>;
  let appApiService: AppApiService;
  let modalService: ModalService;
  let elementRef: ElementRef;

  beforeEach(async () => {
    // Mock ElementRef
    elementRef = {
      nativeElement: {
        getElementsByClassName: () => [{
          scrollIntoView: () => {},
          getBoundingClientRect: () => ({ top: 0, left: 0 })
        }]
      }
    } as ElementRef;

    // Mock Tooltip
    jest.spyOn(Tooltip.prototype, 'display').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        AppApiService,
        ModalService,
        { provide: ElementRef, useValue: elementRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VoidComponent);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.voidingQueueStatusSelection).toBe(ServiceStatusConstant.TicketVoidingQueueSelection);
    expect(component.voidingQueuesOrigin).toEqual([]);
    expect(component.voidingQueuesViewModel).toEqual([]);
    expect(component.isBlock).toBeFalsy();
  });

  it('should search voiding queue successfully', async () => {
    // Arrange
    component.inputVoidingHistoryId = Helper.fakeVoidingHistoryId;
    appApiService.getTicketVoidingQueue = jest.fn().mockResolvedValue(Helper.fakeTicketVoidingQueueModel);

    // Act
    await component.searchVoidingQueue();

    // Assert
    expect(appApiService.getTicketVoidingQueue).toHaveBeenCalledWith(Helper.fakeVoidingHistoryId);
    expect(component.voidingQueuesOrigin).toEqual(Helper.fakeTicketVoidingQueueModel);
    expect(component.voidingQueuesViewModel.length).toBeGreaterThan(0);
    expect(component.isBlock).toBeFalsy();
  });

  it('should not search voiding queue when input is invalid', async () => {
    // Arrange
    component.inputVoidingHistoryId = null;
    appApiService.getTicketVoidingQueue = jest.fn();

    // Act
    await component.searchVoidingQueue();

    // Assert
    expect(appApiService.getTicketVoidingQueue).not.toHaveBeenCalled();
    expect(component.voidingQueuesOrigin).toEqual([]);
    expect(component.voidingQueuesViewModel).toEqual([]);
  });

  it('should confirm update failed queues to running', async () => {
    // Arrange
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => {
      onConfirm();
    });
    appApiService.updateTicketVoidingQueue = jest.fn().mockResolvedValue(true);
    modalService.open = jest.fn();

    // Act
    await component.confirmUpdateFailedQueuesToRunning(
      Helper.fakeSiteDbGroupId,
      Helper.fakeQueueIds
    );

    // Assert
    expect(modalService.confirm).toHaveBeenCalled();
    expect(appApiService.updateTicketVoidingQueue).toHaveBeenCalled();
  });

  it('should confirm update status', async () => {
    // Arrange
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => {
      onConfirm();
    });
    appApiService.updateTicketVoidingQueue = jest.fn().mockResolvedValue(true);
    modalService.open = jest.fn();

    // Act
    component.confirmUpdateStatus(
      Helper.fakeSiteDbGroupId,
      Number(Helper.fakeQueueId),
      Helper.fakeStatusId
    );

    // Assert
    expect(modalService.confirm).toHaveBeenCalled();
    expect(appApiService.updateTicketVoidingQueue).toHaveBeenCalled();
  });

  it('should clear input and reset results', () => {
    // Arrange
    component.inputVoidingHistoryId = Helper.fakeVoidingHistoryId;
    component.voidingQueuesOrigin = Helper.fakeTicketVoidingQueueModel;
    component.voidingQueuesViewModel = component['convertToTicketVoidingQueueViewModel'](Helper.fakeTicketVoidingQueueModel);

    // Act
    component.clearInput();

    // Assert
    expect(component.inputVoidingHistoryId).toBeNull();
    expect(component.voidingQueuesOrigin).toEqual([]);
    expect(component.voidingQueuesViewModel).toEqual([]);
  });

  it('should convert ticket voiding queue to view model', () => {
    // Arrange
    const queues = Helper.fakeTicketVoidingQueueModel;

    // Act
    const result = component['convertToTicketVoidingQueueViewModel'](queues);

    // Assert
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].siteDbName).toBeDefined();
    expect(result[0].statusIdSelected).toBeDefined();
  });

  it('should validate search query', () => {
    // Arrange
    component.inputVoidingHistoryId = Helper.fakeVoidingHistoryId;

    // Act
    const result = component['isValidSearchQuery']();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not validate search query with invalid input', () => {
    // Arrange
    component.inputVoidingHistoryId = null;

    // Act
    const result = component['isValidSearchQuery']();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should initialize update query', () => {
    // Arrange
    const siteDbGroupId = Helper.fakeSiteDbGroupId;
    const queueIds = Helper.fakeQueueIds;
    const statusId = Helper.fakeStatusId;

    // Act
    const result = component['initUpdateQuery'](siteDbGroupId, queueIds, statusId);

    // Assert
    expect(result.siteDbGroupId).toBe(siteDbGroupId);
    expect(result.queueIds).toBe(queueIds);
    expect(result.statusId).toBe(statusId);
  });
});
