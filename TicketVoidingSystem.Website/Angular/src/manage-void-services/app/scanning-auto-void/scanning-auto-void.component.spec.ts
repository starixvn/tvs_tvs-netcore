import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { ScanningAutoVoidComponent } from './scanning-auto-void.component';
import { AppApiService } from '../app-api.service';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { AutoVoidRequestQueueModel, AutoVoidRequestQueueViewModel } from './scanning-auto-void.model';

// Mock Tooltip
jest.mock('../../../utility/components/tooltip/tooltip.model', () => ({
  Tooltip: jest.fn().mockImplementation(() => ({
    display: jest.fn()
  }))
}));

class Helper {
  static readonly fakeAutoVoidRequestQueues = [
    {
      siteDbGroupId: 1,
      queueId: 1,
      statusId: 1,
      broadcastSessionId: 'test-session-1'
    },
    {
      siteDbGroupId: 2,
      queueId: 2,
      statusId: 2,
      broadcastSessionId: 'test-session-2'
    }
  ] as AutoVoidRequestQueueModel[];

  static readonly fakeAutoVoidRequestQueuesViewModel = [
    {
      siteDbGroupId: 1,
      queueId: 1,
      statusId: 1,
      broadcastSessionId: 'test-session-1',
      siteDbName: 'SiteDb1',
      statusIdSelected: 1
    } as AutoVoidRequestQueueViewModel,
    {
      siteDbGroupId: 2,
      queueId: 2,
      statusId: 2,
      broadcastSessionId: 'test-session-2',
      siteDbName: 'SiteDb2',
      statusIdSelected: 2
    } as AutoVoidRequestQueueViewModel
  ];
}

describe('ScanningAutoVoidComponent', () => {
  let component: ScanningAutoVoidComponent;
  let fixture: ComponentFixture<ScanningAutoVoidComponent>;
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

    fixture = TestBed.createComponent(ScanningAutoVoidComponent);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.autoVoidRequestQueuesOrigin).toEqual([]);
    expect(component.autoVoidRequestQueuesViewModel).toEqual([]);
    expect(component.filterBroadcastSessionIdValue).toBeUndefined();
    expect(component.filterStatusIdValue).toBe(0);
    expect(component.filterBy).toBe(0);
    expect(component.isBlock).toBeFalsy();
  });

  it('should search auto void request queue successfully', async () => {
    // Arrange
    component.filterBroadcastSessionIdValue = 'test-session';
    component.filterBy = 0;
    appApiService.getAutoVoidRequestQueue = jest.fn().mockResolvedValue(Helper.fakeAutoVoidRequestQueues);

    // Act
    await component.searchAutoVoidRequestQueue();

    // Assert
    expect(appApiService.getAutoVoidRequestQueue).toHaveBeenCalled();
    expect(component.autoVoidRequestQueuesOrigin).toEqual(Helper.fakeAutoVoidRequestQueues);
    expect(component.autoVoidRequestQueuesViewModel.length).toBeGreaterThan(0);
    expect(component.isBlock).toBeFalsy();
  });

  it('should not search when broadcast session id is empty', async () => {
    // Arrange
    component.filterBroadcastSessionIdValue = '';
    component.filterBy = 0;
    appApiService.getAutoVoidRequestQueue = jest.fn();

    // Act
    await component.searchAutoVoidRequestQueue();

    // Assert
    expect(appApiService.getAutoVoidRequestQueue).not.toHaveBeenCalled();
  });

  it('should clear input and reset results', () => {
    // Arrange
    component.autoVoidRequestQueuesOrigin = Helper.fakeAutoVoidRequestQueues;
    component.autoVoidRequestQueuesViewModel = Helper.fakeAutoVoidRequestQueuesViewModel;
    component.filterBroadcastSessionIdValue = 'test-session';
    component.filterStatusIdValue = 1;

    // Act
    component.clearInput();

    // Assert
    expect(component.autoVoidRequestQueuesOrigin).toEqual([]);
    expect(component.autoVoidRequestQueuesViewModel).toEqual([]);
    expect(component.filterBroadcastSessionIdValue).toBeNull();
    expect(component.filterStatusIdValue).toBe(0);
  });

  it('should convert auto void request queue to view model correctly', () => {
    // Arrange
    const queues = Helper.fakeAutoVoidRequestQueues;
    const expectedViewModel = Helper.fakeAutoVoidRequestQueuesViewModel;

    // Act
    const result = component['convertToAutoVoidRequestQueueViewModel'](queues);

    // Assert
    expect(result).toEqual(expectedViewModel);
  });

  it('should validate search query correctly', () => {
    // Arrange
    component.filterBy = 0;
    component.filterBroadcastSessionIdValue = '';

    // Act
    const result = component['isValidSearchQuery']();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should initialize get query correctly for broadcast session id filter', () => {
    // Arrange
    component.filterBy = 0;
    component.filterBroadcastSessionIdValue = 'test-session';

    // Act
    const result = component['initGetQuery']();

    // Assert
    expect(result).toEqual({
      broadcastSessionId: 'test-session',
      statusId: null
    });
  });

  it('should initialize get query correctly for status filter', () => {
    // Arrange
    component.filterBy = 1;
    component.filterStatusIdValue = 2;

    // Act
    const result = component['initGetQuery']();

    // Assert
    expect(result).toEqual({
      broadcastSessionId: null,
      statusId: 2
    });
  });

  it('should initialize update query correctly', () => {
    // Arrange
    const siteDbGroupId = 1;
    const queueId = 1;
    const statusIdSelected = 2;

    // Act
    const result = component['initUpdateQuery'](siteDbGroupId, queueId, statusIdSelected);

    // Assert
    expect(result).toEqual({
      siteDbGroupId,
      queueId,
      statusId: statusIdSelected
    });
  });
});
