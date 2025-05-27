import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { VoidingHistoryComponent } from './voiding-history.component';
import { AppApiService } from '../app-api.service';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { VoidingHistoryModel, VoidingHistoryViewModel } from './voiding-history.model';
import { ServiceStatusConstant } from '../app.model';
import { TEXT } from '../../../utility/constants/text';

class Helper {
  static readonly fakeVoidingHistoryModel = [
    {
      voidingHistoryId: 1,
      siteDbGroupId: 1,
      statusId: 1,
      requestId: 123,
      createdDate: new Date(),
    }
  ] as VoidingHistoryModel[];

  static readonly fakeVoidingHistoryViewModel = [
    {
      voidingHistoryId: 1,
      siteDbGroupId: 1,
      statusId: 1,
      statusIdSelected: 1,
      siteDbName: 'SiteDb1',
      requestId: 123,
      createdDate: new Date()
    } as unknown as VoidingHistoryViewModel
  ];
}

describe('VoidingHistoryComponent', () => {
  let component: VoidingHistoryComponent;
  let fixture: ComponentFixture<VoidingHistoryComponent>;
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

    fixture = TestBed.createComponent(VoidingHistoryComponent);
    appApiService = fixture.debugElement.injector.get(AppApiService);
    modalService = fixture.debugElement.injector.get(ModalService);
    component = fixture.componentInstance;

    // Mock tooltip display
    component.tooltip = {
      display: jest.fn(),
      hide: jest.fn()
    } as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.voidingHistoryOrigin).toEqual([]);
    expect(component.voidingHistoryViewModel).toEqual([]);
    expect(component.voidingHistorySelection).toEqual(ServiceStatusConstant.VoidingHistorySelection);
    expect(component.isBlock).toBeFalsy();
    expect(component.inputRequestId).toBeUndefined();
  });

  it('should search voiding history successfully with valid input', async () => {
    // Arrange
    component.inputRequestId = 123;
    appApiService.getVoidingHistory = jest.fn().mockResolvedValue(Helper.fakeVoidingHistoryModel);

    // Act
    await component.searchVoidingHistory();

    // Assert
    expect(appApiService.getVoidingHistory).toHaveBeenCalledWith(123);
    expect(component.voidingHistoryOrigin).toEqual(Helper.fakeVoidingHistoryModel);
    expect(component.voidingHistoryViewModel.length).toBeGreaterThan(0);
    expect(component.isBlock).toBeFalsy();
  });

  it('should not search voiding history with invalid input', async () => {
    // Arrange
    component.inputRequestId = -1;
    appApiService.getVoidingHistory = jest.fn();

    // Act
    await component.searchVoidingHistory();

    // Assert
    expect(appApiService.getVoidingHistory).not.toHaveBeenCalled();
    expect(component.voidingHistoryOrigin).toEqual([]);
    expect(component.voidingHistoryViewModel).toEqual([]);
    expect(component.tooltip.display).toHaveBeenCalledWith('request-id', TEXT.REQUIRED_FIELD);
  });

  it('should confirm update status and show success modal', async () => {
    // Arrange
    const voidingHistoryId = 1;
    const statusIdSelected = 2;
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => onConfirm());
    appApiService.updateVoidingHistory = jest.fn().mockResolvedValue(true);
    modalService.open = jest.fn();

    // Act
    component.confirmUpdateStatus(voidingHistoryId, statusIdSelected);

    // Assert
    expect(modalService.confirm).toHaveBeenCalled();
    expect(appApiService.updateVoidingHistory).toHaveBeenCalledWith({
      voidingHistoryId: voidingHistoryId,
      statusId: statusIdSelected
    });
  });

  it('should confirm update status and show error modal', async () => {
    // Arrange
    const voidingHistoryId = 1;
    const statusIdSelected = 2;
    modalService.confirm = jest.fn().mockImplementation((config, onConfirm) => onConfirm());
    appApiService.updateVoidingHistory = jest.fn().mockResolvedValue(false);
    modalService.open = jest.fn();

    // Act
    component.confirmUpdateStatus(voidingHistoryId, statusIdSelected);

    // Assert
    expect(modalService.confirm).toHaveBeenCalled();
    expect(appApiService.updateVoidingHistory).toHaveBeenCalled();
  });

  it('should clear input and reset results', () => {
    // Arrange
    component.inputRequestId = 123;
    component.voidingHistoryOrigin = Helper.fakeVoidingHistoryModel;
    component.voidingHistoryViewModel = Helper.fakeVoidingHistoryViewModel;

    // Act
    component.clearInput();

    // Assert
    expect(component.inputRequestId).toBeNull();
    expect(component.voidingHistoryOrigin).toEqual([]);
    expect(component.voidingHistoryViewModel).toEqual([]);
  });

  it('should convert voiding history model to view model correctly', () => {
    // Arrange
    const input = Helper.fakeVoidingHistoryModel;
    const expected = Helper.fakeVoidingHistoryViewModel;

    // Act
    const result = component['convertToVoidingHistoryViewModel'](input);

    // Assert
    expect(result).toEqual(expected);
  });

  it('should validate search query correctly', () => {
    // Arrange
    component.inputRequestId = 123;
    component.tooltip.display = jest.fn();

    // Act
    const result = component['isValidSearchQuery']();

    // Assert
    expect(result).toBeTruthy();
    expect(component.tooltip.display).not.toHaveBeenCalled();
  });

  it('should show tooltip for invalid search query', () => {
    // Arrange
    component.inputRequestId = -1;
    component.tooltip.display = jest.fn();

    // Act
    const result = component['isValidSearchQuery']();

    // Assert
    expect(result).toBeFalsy();
    expect(component.tooltip.display).toHaveBeenCalledWith('request-id', TEXT.REQUIRED_FIELD);
  });
});
