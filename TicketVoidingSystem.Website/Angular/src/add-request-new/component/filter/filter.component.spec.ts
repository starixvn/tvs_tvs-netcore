import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TVSRequestActionType } from '../../../utility/constants/config';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { SubIssueTypeConstant } from '../../../utility/constants/sub-issue-type.constant';
import { Selection } from '../../../utility/models/selection.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { StaticService } from '../../../utility/services/static.service';
import { AddRequestStore } from '../../services/add-request.store';
import { FilterComponent } from './filter.component';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';
import { ActionVoidService } from './services/action-void.service';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog/sub-issue-type-dialog.model';

class Helper {
  static fakeIssueTypes: IssueTypes = {
    issueTypes: [
      { issueTypeId: 8, issueTypeName: 'Early Kick Off' }
    ],
    subIssueTypes: [
      { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null },
      { subIssueTypeId: 13, issueTypeId: 8, subIssueTypeName: 'Live', subIssueTypeNameCS: null }
    ],
    issueId: 0,
    subIssueTypes: [],
    subIssueId: 0
  };

  static getFakeActions(): Selection[] {
    return [
      { name: 'Auto Void Winning', value: '1' },
      { name: 'Auto Void All (Instant)', value: '4' },
      { name: 'Manual Void', value: '5' },
      { name: 'Take note', value: '2' },
      { name: 'Waiting', value: '3' }
    ];
  }

  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '13',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  } as FilterModel;
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let addRequestStore: AddRequestStore;
  let actionVoidService: ActionVoidService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        FilterService,
        ActionVoidService,
        {
          provide: AddRequestStore,
          useValue: {
            getAbnormalFilterBySubject: { subscribe: jest.fn() },
            changeBlockingUiStatus: jest.fn(),
            changeSavingRequestStatus: jest.fn(),
            changeAllowanceTime: jest.fn(),
            changeActionWaitingToManualEditPage: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    addRequestStore = TestBed.inject(AddRequestStore);
    actionVoidService = TestBed.inject(ActionVoidService);
    component = fixture.componentInstance;
    component.model.actions = Helper.getFakeActions();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Initialization', () => {
    it('should initialize with default values when not in edit mode', async () => {
      // Arrange
      component.isEdit = false;
      component.isExternalUrl = false;
      component.model = {
        ...Helper.fakeFilterModel,
        actions: [{ value: '1', name: 'Auto Void Winning' }],
        action: '1'
      };
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = 8;
      component.originActions = [{ value: '1', name: 'Auto Void Winning' }];
      actionVoidService.getVoidActionsSelectionByIssueType = jest.fn().mockReturnValue([{ value: '1', name: 'Auto Void Winning' }]);

      // Act
      await component.ngOnInit();

      // Assert
      expect(component.model.actions).toBeDefined();
      expect(component.model.actions.length).toBeGreaterThan(0);
      expect(component.model.action).toBe('1');
    });
  });

  describe('Issue Type Handling', () => {
    it('should handle issue type change', async () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = 8;
      component.issueTypes.subIssueTypes = [{
        subIssueTypeId: 12,
        issueTypeId: 8,
        subIssueTypeName: 'Non Live',
        subIssueTypeNameCS: null
      }];
      component.issueTypes.subIssueTypes = [{
        subIssueTypeId: 12,
        issueTypeId: 8,
        subIssueTypeName: 'Non Live',
        subIssueTypeNameCS: null
      }];
      addRequestStore.changeSavingRequestStatus = jest.fn();
      jest.spyOn(StaticService, 'isWrongScore').mockReturnValue(true);

      // Act
      component.updateDataAfterClosed(12);

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(true);
    });

    it('should get sub issue type name correctly', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueId = 12;
      component.issueTypes.subIssueTypes = [{
        subIssueTypeId: 12,
        issueTypeId: 8,
        subIssueTypeName: 'Non Live',
        subIssueTypeNameCS: null
      }];

      // Act
      const result = component.getSubIssueTypeName();

      // Assert
      expect(result).toBe('Non Live');
    });

    it('should return default text when no sub issue type selected', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueId = null;

      // Act
      const result = component.getSubIssueTypeName();

      // Assert
      expect(result).toBe('Select Sub Type');
    });
  });

  describe('Sub Issue Type Validation', () => {
    it('should check if sub issue type is valid', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueId = 1;

      // Act
      const result = component.checkValidSubIssueType();

      // Assert
      expect(result).toBeTruthy();
      expect(component.isHighlightSubType).toBeFalsy();
    });

    it('should highlight sub type when invalid', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueId = null;

      // Act
      const result = component.checkValidSubIssueType();

      // Assert
      expect(result).toBeFalsy();
      expect(component.isHighlightSubType).toBeTruthy();
    });

    it('should check if action void is disabled for duplicate tickets', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.model.issueTypeId = IssueTypeConstant.DUPLICATE_TICKETS;
      component.model.action = TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString();

      // Act
      const result = component.isDisableActionVoid();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should check if action void is disabled for recover ticket', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.model.issueTypeId = IssueTypeConstant.RECOVER_TICKET;

      // Act
      const result = component.isDisableActionVoid();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should check if action void is disabled when voided', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.model.isVoided = true;

      // Act
      const result = component.isDisableActionVoid();

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('Model Updates', () => {
    it('should update model when sub issue type changes', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.issueTypes = Helper.fakeIssueTypes;
      component.modelChange.emit = jest.fn();

      // Act
      component.updateModel(true);

      // Assert
      expect(component.model.isChangeSubTypeManual).toBeTruthy();
      expect(component.modelChange.emit).toHaveBeenCalledWith(component.model);
    });

    it('should handle sub issue type dialog', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.subIssueTypeDialogModel = { isOpen: false } as SubIssueTypeDialogModel;

      // Act
      component.openDialog();

      // Assert
      expect(component.subIssueTypeDialogModel.isOpen).toBeTruthy();
      expect(component.subIssueTypeDialogModel.issueTypeId).toBe(component.model.issueTypeId);
    });
  });

  describe('Issue Type Checks', () => {
    it('should check if wrong score', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.WRONG_SCORE);
      jest.spyOn(StaticService, 'isWrongScore').mockReturnValue(true);

      // Act
      const result = component.isWrongScore();

      // Assert
      expect(result).toBeTruthy();
      expect(StaticService.isWrongScore).toHaveBeenCalledWith(component.issueTypes.issueId.toString());
    });

    it('should check if likely danger accepted', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.DANGER_ACCEPTED);
      jest.spyOn(StaticService, 'isDangerAccepted').mockReturnValue(true);
      jest.spyOn(StaticService, 'isRedCard').mockReturnValue(false);

      // Act
      const result = component.isLikelyDangerAccepted();

      // Assert
      expect(result).toBeTruthy();
      expect(StaticService.isDangerAccepted).toHaveBeenCalledWith(component.issueTypes.issueId.toString());
    });

    it('should check if archived ticket', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.ARCHIVED_TICKET);
      jest.spyOn(StaticService, 'isArchivedTicket').mockReturnValue(true);

      // Act
      const result = component.isArchivedTicket();

      // Assert
      expect(result).toBeTruthy();
      expect(StaticService.isArchivedTicket).toHaveBeenCalledWith(component.issueTypes.issueId.toString());
    });
  });

  describe('Edit and External URL Checks', () => {
    it('should check if edit or external url', () => {
      // Arrange
      component.isEdit = true;
      component.isExternalUrl = false;

      // Act
      const result = component.isEditOrExternalUrl();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should check if external url', () => {
      // Arrange
      component.isEdit = false;
      component.isExternalUrl = true;

      // Act
      const result = component.isEditOrExternalUrl();

      // Assert
      expect(result).toBeTruthy();
    });
  });

  describe('Sub Type Display Logic', () => {
    it('should show button select sub type for danger accepted', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.DANGER_ACCEPTED);

      // Act
      const result = component.isShowButtonSelectSubType();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should show button select sub type for red card', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.RED_CARD);

      // Act
      const result = component.isShowButtonSelectSubType();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should show button select sub type for wrong score', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.WRONG_SCORE);

      // Act
      const result = component.isShowButtonSelectSubType();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should not show button select sub type for other issue types', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.ABNORMAL_BET);

      // Act
      const result = component.isShowButtonSelectSubType();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('Sub Type Display Logic', () => {
    it('should show sub type when multiple sub types available', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueTypes = [
        { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null },
        { subIssueTypeId: 13, issueTypeId: 8, subIssueTypeName: 'Live', subIssueTypeNameCS: null }
      ];
      component.issueTypes.issueId = Number(IssueTypeConstant.ABNORMAL_BET);

      // Act
      const result = component.isShowSubType();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should not show sub type for wrong OU', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueTypes = [
        { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null },
        { subIssueTypeId: 13, issueTypeId: 8, subIssueTypeName: 'Live', subIssueTypeNameCS: null }
      ];
      component.issueTypes.issueId = Number(IssueTypeConstant.WRONG_OU);

      // Act
      const result = component.isShowSubType();

      // Assert
      expect(result).toBeFalsy();
    });

    it('should not show sub type when only one sub type available', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueTypes = [
        { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null }
      ];

      // Act
      const result = component.isShowSubType();

      // Assert
      expect(result).toBeFalsy();
    });
  });

  describe('Action Change Handling', () => {
    it('should handle action change from waiting to manual void', () => {
      // Arrange
      component.isEdit = true;
      component.actionIds = [TVSRequestActionType.WAITING_ID.toString()];
      component.model.action = TVSRequestActionType.MANUAL_VOID_ID.toString();
      addRequestStore.changeActionWaitingToManualEditPage = jest.fn();

      // Act
      component.changeActionWaitingToManualVoid();

      // Assert
      expect(addRequestStore.changeActionWaitingToManualEditPage).toHaveBeenCalledWith(true);
    });

    it('should not trigger action change when not in edit mode', () => {
      // Arrange
      component.isEdit = false;
      component.actionIds = [TVSRequestActionType.WAITING_ID.toString()];
      component.model.action = TVSRequestActionType.MANUAL_VOID_ID.toString();
      addRequestStore.changeActionWaitingToManualEditPage = jest.fn();

      // Act
      component.changeActionWaitingToManualVoid();

      // Assert
      expect(addRequestStore.changeActionWaitingToManualEditPage).not.toHaveBeenCalled();
    });
  });

  describe('Width Control Settings', () => {
    it('should set width controls for danger accepted issue type', () => {
      // Arrange
      component.model.issueTypeId = IssueTypeConstant.DANGER_ACCEPTED;

      // Act
      component['setWidthControlByIssueType']();

      // Assert
      expect(component.widthSubIssueTypeControl).toBe(300);
      expect(component.widthActionControl).toBe(150);
    });

    it('should set width controls for abnormal bet issue type', () => {
      // Arrange
      component.model.issueTypeId = IssueTypeConstant.ABNORMAL_BET;

      // Act
      component['setWidthControlByIssueType']();

      // Assert
      expect(component.widthSubIssueTypeControl).toBe(170);
      expect(component.widthActionControl).toBe(250);
    });

    it('should set default width controls for unknown issue type', () => {
      // Arrange
      component.model.issueTypeId = '999';

      // Act
      component['setWidthControlByIssueType']();

      // Assert
      expect(component.widthSubIssueTypeControl).toBe(0);
      expect(component.widthActionControl).toBe(0);
    });

    it('should not set width controls when issue type is not set', () => {
      // Arrange
      component.model.issueTypeId = null;
      component.widthSubIssueTypeControl = undefined;
      component.widthActionControl = undefined;

      // Act
      component['setWidthControlByIssueType']();

      // Assert
      expect(component.widthSubIssueTypeControl).toBeUndefined();
      expect(component.widthActionControl).toBeUndefined();
    });
  });

  describe('Subscription Management', () => {
    it('should subscribe to abnormal filter by changes', () => {
      // Arrange
      const mockSubscription = { subscribe: jest.fn() };
      (addRequestStore as any).getAbnormalFilterBySubject = mockSubscription;

      // Act
      component.subscribeSubScription();

      // Assert
      expect(mockSubscription.subscribe).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
      // Arrange
      const mockUnsubscribe = jest.fn();
      component.abnormalFilterBySubscription = { unsubscribe: mockUnsubscribe } as any;

      // Act
      component.ngOnDestroy();

      // Assert
      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });

  describe('Data Initialization', () => {
    it('should initialize data when issue type ID is provided', () => {
      // Arrange
      component.issueTypeId = '8';
      component.issueTypes = Helper.fakeIssueTypes;

      // Act
      component.initData();

      // Assert
      expect(component.issueTypes.issueId).toBe(8);
    });

    it('should not initialize data when issue type ID is not provided', () => {
      // Arrange
      component.issueTypeId = null;
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = undefined;

      // Act
      component.initData();

      // Assert
      // Should not throw error and should not change anything
      expect(component.issueTypes.issueId).toBeUndefined();
    });
  });

  describe('Sub Issue Type Updates', () => {
    it('should update sub issue types by issue type', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.subIssueTypes = [
        { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null },
        { subIssueTypeId: 13, issueTypeId: 8, subIssueTypeName: 'Live', subIssueTypeNameCS: null }
      ];
      component.issueTypeId = IssueTypeConstant.ABNORMAL_BET;

      // Act
      component.updateSubByIssue();

      // Assert
      expect(component.issueTypes.subIssueId).toBe(12); // First available sub issue type
    });

    it('should set sub issue ID to null for danger accepted', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.DANGER_ACCEPTED);

      // Act
      component.updateSubByIssue();

      // Assert
      expect(component.issueTypes.subIssueId).toBeNull();
    });

    it('should set technical error sub issue ID for technical error issue type', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypeId = IssueTypeConstant.TECHNICAL_ERROR;
      component.issueTypes.subIssueId = null;
      // Mock isShowButtonSelectSubType to return false so it goes to the technical error condition
      jest.spyOn(component, 'isShowButtonSelectSubType').mockReturnValue(false);

      // Act
      component.updateSubByIssue();

      // Assert
      expect(component.issueTypes.subIssueId).toBe(SubIssueTypeConstant.TECHNICAL_ERROR_TECHNICAL_ERROR);
    });
  });
});
