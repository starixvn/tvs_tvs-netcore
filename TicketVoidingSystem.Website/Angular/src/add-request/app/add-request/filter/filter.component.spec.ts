import { SimpleChange } from '@angular/core';
import * as _ from 'lodash';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { SportInfo } from '../../../../utility/models/event.model';
import { IssueType } from '../../../../utility/models/issue-type.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { LogAnalysisService } from '../services/log-analysis.service';
import { FilterComponent } from './filter.component';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { ActionVoidService } from './services/action-void.service';
import { TVSRequestActionType } from '../../../../utility/constants/config';
import { SubIssueTypeDialogModel } from './sub-issue-type-dialog/sub-issue-type-dialog.model';

class Helper {
  static readonly urlNotAuthorizedPage = 'Home/NotAuthorized';
  static readonly selectSelector = 'select.form-control';
  static readonly isTestSelector = 'input[type=checkbox]';
  static readonly eventDateSelector = 'input.form-control';
  
  static getFakeIssueTypePermissionList(): IssueType[] {
    return [
      { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' },
      { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
      { issueTypeId: 11, issueTypeName: 'Abnormal Bet' }
    ];
  }

  static fakeIssueTypes: IssueTypes = {
    issueTypes: [
      { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
      { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' },
      { issueTypeId: 11, issueTypeName: 'Abnormal Bet' },
      { issueTypeId: 10, issueTypeName: 'Red Card' },
      { issueTypeId: 1, issueTypeName: 'Danger Accepted' },
      { issueTypeId: 3, issueTypeName: 'Wrong Score' }
    ],
    subIssueTypes: [
      { subIssueTypeId: 12, issueTypeId: 8, subIssueTypeName: 'Non Live', subIssueTypeNameCS: null },
      { subIssueTypeId: 13, issueTypeId: 8, subIssueTypeName: 'Live', subIssueTypeNameCS: null },
      { subIssueTypeId: 27, issueTypeId: 11, subIssueTypeName: 'Abnormal', subIssueTypeNameCS: '非正常' },
      { subIssueTypeId: 28, issueTypeId: 11, subIssueTypeName: 'Group Betting', subIssueTypeNameCS: '群组投注' },
      { subIssueTypeId: 29, issueTypeId: 11, subIssueTypeName: 'Hedging', subIssueTypeNameCS: '出货集团' },
      { subIssueTypeId: 30, issueTypeId: 11, subIssueTypeName: 'Arbitrage', subIssueTypeNameCS: '打水套利' },
      { subIssueTypeId: 31, issueTypeId: 11, subIssueTypeName: 'Fixed Game', subIssueTypeNameCS: '内定赛事' },
      { subIssueTypeId: 32, issueTypeId: 11, subIssueTypeName: 'AB Bet', subIssueTypeNameCS: '单' },
      { subIssueTypeId: 36, issueTypeId: 11, subIssueTypeName: 'Robot Betting', subIssueTypeNameCS: '机械投注' },
      { subIssueTypeId: 37, issueTypeId: 11, subIssueTypeName: 'Irrigation Bet', subIssueTypeNameCS: '灌水投注' },
      { subIssueTypeId: 38, issueTypeId: 11, subIssueTypeName: 'System Formula Bet', subIssueTypeNameCS: '系统计算投注' },
      { subIssueTypeId: 39, issueTypeId: 1, subIssueTypeName: 'System Formula Bet 1', subIssueTypeNameCS: '系统计算投注' },
      { subIssueTypeId: 40, issueTypeId: 10, subIssueTypeName: 'System Formula Bet 2', subIssueTypeNameCS: '系统计算投注' },
      { subIssueTypeId: 41, issueTypeId: 3, subIssueTypeName: 'System Formula Bet 3', subIssueTypeNameCS: '系统计算投注' },
    ],
    issueId: 0,
    selectedSubIssueTypes: [],
    subIssueId: 0
  };

  static getFakeSportsType(): SportInfo[] {
    return [
      { sportType: 1, sportName: 'Soccer' },
      { sportType: 2, sportName: 'Basketball' },
      { sportType: 3, sportName: 'Football' },
    ];
  }

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
  let filterService: FilterService;
  let commonService: CommonService;
  let addRequestStore: AddRequestStore;
  let actionVoidService: ActionVoidService;
  let logAnalysisService: LogAnalysisService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        FilterService,
        CommonService,
        AddRequestStore,
        ActionVoidService,
        LogAnalysisService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    filterService = fixture.debugElement.injector.get(FilterService);
    commonService = fixture.debugElement.injector.get(CommonService);
    addRequestStore = fixture.debugElement.injector.get(AddRequestStore);
    actionVoidService = fixture.debugElement.injector.get(ActionVoidService);
    logAnalysisService = fixture.debugElement.injector.get(LogAnalysisService);
    component = fixture.componentInstance;
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
      document.body.innerHTML = '<div id="body" user-id="1"></div>';
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = 8;
      component.originActions = [{ value: '1', name: 'Auto Void Winning' }];
      commonService.getVoidActions = jest.fn().mockResolvedValue([{ value: '1', name: 'Auto Void Winning' }]);
      commonService.getIssueTypePermissionList = jest.fn().mockResolvedValue([]);
      filterService.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypes);
      addRequestStore.changeBlockingUiStatus = jest.fn();
      logAnalysisService.writeLogAccessFunction = jest.fn().mockResolvedValue(undefined);
      actionVoidService.getVoidActionsSelectionByIssueType = jest.fn().mockReturnValue([{ value: '1', name: 'Auto Void Winning' }]);

      // Act
      await component.ngOnInit();

      // Assert
      expect(commonService.getVoidActions).toHaveBeenCalled();
      expect(commonService.getIssueTypePermissionList).toHaveBeenCalled();
      expect(addRequestStore.changeBlockingUiStatus).toHaveBeenCalledTimes(1);
      expect(actionVoidService.getVoidActionsSelectionByIssueType).toHaveBeenCalledWith(
        component.issueTypes.issueId,
        component.abnormalFilterBy,
        component.isEdit,
        component.model.action,
        component.originActions
      );
      expect(component.model.actions).toBeDefined();
      expect(component.model.actions.length).toBeGreaterThan(0);
      expect(component.model.action).toBe('1');
    });

    it('should handle filter changes and update data', async () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.isEdit = true;
      component.isExternalUrl = false;
      component.model.actions = [{ value: '1', name: 'Auto Void Winning' }];
      commonService.getVoidActions = jest.fn().mockResolvedValue([]);
      commonService.getIssueTypePermissionList = jest.fn().mockResolvedValue([{ issueTypeId: 1, issueTypeName: 'Test' }]);
      filterService.getIssueTypes = jest.fn().mockResolvedValue(Helper.fakeIssueTypes);
      addRequestStore.changeBlockingUiStatus = jest.fn();
      logAnalysisService.writeLogAccessFunction = jest.fn().mockResolvedValue(undefined);
      actionVoidService.getVoidActionsSelectionByIssueType = jest.fn().mockReturnValue([{ value: '1', name: 'Test' }]);

      // Act
      await component.ngOnChanges({
        model: {
          currentValue: Helper.fakeFilterModel,
          previousValue: null,
          firstChange: true
        } as SimpleChange
      });

      // Assert
      expect(commonService.getVoidActions).toHaveBeenCalled();
      expect(commonService.getIssueTypePermissionList).toHaveBeenCalled();
      expect(filterService.getIssueTypes).toHaveBeenCalled();
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
      component.issueTypes.selectedSubIssueTypes = [{
        subIssueTypeId: 12,
        issueTypeId: 8,
        subIssueTypeName: 'Non Live',
        subIssueTypeNameCS: null
      }];
      addRequestStore.changeSavingRequestStatus = jest.fn();
      logAnalysisService.writeLogAccessFunction = jest.fn().mockResolvedValue(undefined);

      // Act
      await component.onChangeIssueType();

      // Assert
      expect(addRequestStore.changeSavingRequestStatus).toHaveBeenCalledWith(false);
      expect(logAnalysisService.writeLogAccessFunction).toHaveBeenCalled();
    });

    it('should get default issue type ID', () => {
      // Arrange
      component.isExternalUrl = false;
      component.model = Helper.fakeFilterModel;
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = 1;
      window.localStorage.getItem = jest.fn().mockReturnValue('1');
      document.getElementById = jest.fn().mockReturnValue({ getAttribute: () => '123' });
      component['haveIssueTypeFromPermission'] = jest.fn().mockReturnValue(true);

      // Act
      const result = component.getIssueTypeIdDefault();

      // Assert
      expect(result).toBe(1);
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

    it('should check if action void is disabled', () => {
      // Arrange
      component.model = Helper.fakeFilterModel;
      component.model.issueTypeId = IssueTypeConstant.DUPLICATE_TICKETS;
      component.model.action = TVSRequestActionType.AUTO_VOID_INSTANT_ID.toString();

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

      // Act
      const result = component.isWrongScore();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should check if likely danger accepted', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.DANGER_ACCEPTED);

      // Act
      const result = component.isLikelyDangerAccepted();

      // Assert
      expect(result).toBeTruthy();
    });

    it('should check if archived ticket', () => {
      // Arrange
      component.issueTypes = Helper.fakeIssueTypes;
      component.issueTypes.issueId = Number(IssueTypeConstant.ARCHIVED_TICKET);

      // Act
      const result = component.isArchivedTicket();

      // Assert
      expect(result).toBeTruthy();
    });
  });
});
