import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { EventAbnormalBetComponent } from './event-abnormal-bet.component';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { AddRequestStore } from '../../../../services/add-request.store';
import { PopupService } from '../../../../services/popup.service';
import { SaveRequestService } from './services/save-request.service';
import { ValidationService } from './services/validation.service';
import { AbnormalBetModel } from '../../../../models/abnormal-bet.model';
import { FilterModel } from '../../../../component/filter/filter.model';
import { IssueTypes } from '../../../../component/filter/issue-types.model';
import { OthersModel } from '../../../../component/others/others.model';
import { PermissionAddRequest } from '../../../../models/permission-add-request.model';
import { AbnormalBetTicketViewModel, ValidationAbnormalBet } from './event-abnormal-bet.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { ConfirmAbnormalBetComponent } from './confirm-abnormal-bet/confirm-abnormal-bet.component';

class Helper {
  static readonly fakeRequestId = 1212;
  static readonly fakeUserId = 123;
  static readonly fakeRequestedBy = 'testUser';
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
  static readonly fakeAbnormalBetModel = new AbnormalBetModel();
  static readonly fakePermission = new PermissionAddRequest();
  static readonly fakeIssueTypes = {
    issueTypes: [{ issueTypeId: 1, issueTypeName: 'Test Issue Type' }],
    selectedSubIssueTypes: [{ subIssueTypeId: 1, subIssueTypeName: 'Test Sub Issue Type' }],
    subIssueTypes: [],
    issueId: 1,
    subIssueId: 1
  } as IssueTypes;
}

describe('EventAbnormalBetComponent', () => {
  let component: EventAbnormalBetComponent;
  let fixture: ComponentFixture<EventAbnormalBetComponent>;
  let addRequestApiService: AddRequestApiService;
  let addRequestStore: AddRequestStore;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ AddRequestApiService, AddRequestStore, PopupService, SaveRequestService, ValidationService ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventAbnormalBetComponent);
    addRequestApiService = fixture.debugElement.injector.get(AddRequestApiService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    validationService = fixture.debugElement.injector.get(ValidationService);
    component = fixture.componentInstance;

    // Setup default component properties
    component.filter = Helper.fakeFilterModel;
    component.issueTypes = Helper.fakeIssueTypes;
    component.others = Helper.fakeOthersModel;
    component.abnormalBetModel = new AbnormalBetModel();
    component.abnormalBetModel.filterBy = 1; // Set default value
    component.betIdsComponent = {
      groupNumber: { items: [] },
      getAllBetIds: () => [],
      removeTransId: () => {},
      triggerFocusOutBetIds: () => {}
    } as unknown as BetIdsComponent;
    component.confirmAbnormalBetComponent = {} as unknown as ConfirmAbnormalBetComponent;

    // Mock document.getElementById
    const bodyElement = document.createElement('div');
    bodyElement.id = 'body';
    bodyElement.setAttribute('user-id', '123');
    document.body.appendChild(bodyElement);
  });

  afterEach(() => {
    // Clean up
    const bodyElement = document.getElementById('body');
    if (bodyElement) {
      document.body.removeChild(bodyElement);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values when not in edit mode', async () => {
    // Arrange
    component.isEdit = false;
    component.abnormalBetModel.filterBy = null; // Reset filterBy to null
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue(Helper.fakePermission);
    addRequestStore.changeAbnormalFilterBy = jest.fn();

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.abnormalBetModel.filterBy).toBe(null);
    expect(addRequestStore.changeAbnormalFilterBy).toHaveBeenCalledWith(null);
  });

  it('should not change filterBy when in edit mode', async () => {
    // Arrange
    component.isEdit = true;
    component.abnormalBetModel.filterBy = 2;
    addRequestApiService.getPermissionAddRequest = jest.fn().mockResolvedValue(Helper.fakePermission);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.abnormalBetModel.filterBy).toBe(2);
  });

  it('should show export ticket button when there are bet IDs and filter is not voided', () => {
    // Arrange
    component.betIdsComponent = {
      groupNumber: { items: [{ number: 1 }] }
    } as unknown as BetIdsComponent;
    component.filter = Helper.fakeFilterModel;

    // Act & Assert
    expect(component.isShowButtonExportTicket()).toBeTruthy();

    component.filter.isVoided = true;
    expect(component.isShowButtonExportTicket()).toBeFalsy();
  });

  it('should update model and check validation when focus out bet IDs', async () => {
    // Arrange
    component.betIdsComponent = {
      groupNumber: { items: [] },
      getAllBetIds: () => ['1', '2'],
      removeTransId: () => {},
      triggerFocusOutBetIds: () => {}
    } as unknown as BetIdsComponent;
    validationService.checkValidBusinessRule = jest.fn().mockResolvedValue({ isValid: true });
    addRequestStore.changeStartTimeFilterAnalysis = jest.fn();

    // Act
    await component.afterFocusOutBetIds();

    // Assert
    expect(addRequestStore.changeStartTimeFilterAnalysis).toHaveBeenCalled();
    expect(validationService.checkValidBusinessRule).toHaveBeenCalled();
  });

  it('should handle save request for voided request', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isVoided = true;
    component.issueTypes = Helper.fakeIssueTypes;
    component.userId = 123;
    component.betIdsComponent = {
      groupNumber: { items: [] },
      getAllBetIds: () => ['1', '2'],
      removeTransId: () => {},
      triggerFocusOutBetIds: () => {}
    } as unknown as BetIdsComponent;
    validationService.isValidationHasWarningTicket = jest.fn().mockReturnValue(false);
    validationService.isHasWarningEditTakeNoteRequest = jest.fn().mockReturnValue(false);
    validationService.isEditingByAnotherUser = jest.fn().mockReturnValue(false);

    // Act
    await component.saveRequest();

    // Assert
    expect(component.confirmAbnormalBetModel.isOpenDialog).toBeTruthy();
  });

  it('should handle save request for non-voided request', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filter.isVoided = false;
    component.issueTypes = Helper.fakeIssueTypes;
    component.userId = 123;
    component.betIdsComponent = {
      groupNumber: { items: [] },
      getAllBetIds: () => ['1', '2'],
      removeTransId: () => {},
      triggerFocusOutBetIds: () => {}
    } as unknown as BetIdsComponent;
    validationService.checkValidBusinessRule = jest.fn().mockResolvedValue({
      isValid: true,
      warningModel: new ValidationAbnormalBet()
    });
    validationService.isValidationHasWarningTicket = jest.fn().mockReturnValue(false);
    validationService.isHasWarningEditTakeNoteRequest = jest.fn().mockReturnValue(false);
    validationService.isEditingByAnotherUser = jest.fn().mockReturnValue(false);

    // Act
    await component.saveRequest();

    // Assert
    expect(validationService.checkValidBusinessRule).toHaveBeenCalled();
  });

  it('should remove invalid transaction IDs', () => {
    // Arrange
    component.primitiveProps.invalidTransIds = '1,2';
    component.exportTickets = [
      { betId: '1' } as AbnormalBetTicketViewModel,
      { betId: '2' } as AbnormalBetTicketViewModel,
      { betId: '3' } as AbnormalBetTicketViewModel
    ];
    component.betIdsComponent = {
      removeTransId: jest.fn()
    } as unknown as BetIdsComponent;

    // Act
    component.removeInvalidTransIds();

    // Assert
    expect(component.exportTickets.length).toBe(1);
    expect(component.primitiveProps.isShowButtonRemoveInvalid).toBeFalsy();
    expect(component.betIdsComponent.removeTransId).toHaveBeenCalledWith('1,2');
  });

  it('should update filterBy and clear matches when changing filter', () => {
    // Arrange
    component.abnormalBetModel.matches = [];
    addRequestStore.changeAbnormalFilterBy = jest.fn();

    // Act
    component.changeFilterBy(2);

    // Assert
    expect(component.abnormalBetModel.filterBy).toBe(2);
    expect(component.abnormalBetModel.matches).toEqual([]);
    expect(addRequestStore.changeAbnormalFilterBy).toHaveBeenCalledWith(2);
  });

  it('should export excel tickets', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.betIdsComponent = {
      groupNumber: { items: [] },
      getAllBetIds: () => ['1', '2'],
      removeTransId: () => {},
      triggerFocusOutBetIds: () => {}
    } as unknown as BetIdsComponent;
    validationService.exportExcelAbnormalBetTickets = jest.fn().mockResolvedValue(undefined);
    component.primitiveProps.isBlockUI = false;

    // Act
    await component.exportExcel();

    // Assert
    expect(validationService.exportExcelAbnormalBetTickets).toHaveBeenCalled();
    expect(component.primitiveProps.isBlockUI).toBeFalsy();
  });
});
