import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { DateTimeModule } from '../../../../utility/components/date-time/date-time.module';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { SportType } from '../../../../utility/constants/sport.constant';
import { SportInfo } from '../../../../utility/models/event.model';
import { IssueType, SubIssueType } from '../../../../utility/models/issue-type.model';
import { Selection } from '../../../../utility/models/selection.model';
import { CommonService } from '../../../../utility/services/common.service';
import { AddRequestStore } from '../add-request.store';
import { FilterComponent } from './filter.component';
import { FilterModel } from './filter.model';
import { FilterService } from './filter.service';
import { IssueTypes } from './issue-types.model';
import { SubIssueTypeDialogComponent } from './sub-issue-type-dialog/sub-issue-type-dialog.component';
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
    sportType: 1,
    eventDate: '2020-11-09 12:08:49.737',
    issueTypeId: '13',
    subIssueTypeId: '27',
    action: '5',
    isTest: false,
    isVoided: false,
    subIssueTypes: [],
    isAbnormal: false
  };
}

describe('FilterComponent', () => {
  @NgModule({
    declarations: [
      SubIssueTypeDialogComponent
    ],
    imports: [
      DateTimeModule,
      FormsModule,
      NgSelectModule,
      NgbModule,

    ],
    providers: [
      AddRequestStore,
      FilterService,
      CommonService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest)
      .dontMock(DateTimeModule)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('FilterComponent should init match snapshot', async () => {
    // Arrange
    const { fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
  });

  it('FilterComponent should init default value for all filter', async () => {
    // Arrange
    const { find, findComponent, fixture } = await shallow
      .mock(CommonService,
        {
          getIssueTypePermissionList: jest.fn().mockImplementation(() => Helper.getFakeIssueTypePermissionList()),
          getVoidActions: jest.fn().mockImplementation(() => Helper.getFakeActions())
        }
      )
      .mock(FilterService,
        {
          getSportsType: jest.fn().mockImplementation(() => Helper.getFakeSportsType()),
          getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypes)
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });

    fixture.detectChanges();
    const selectComponent = findComponent(NgSelectComponent);
    const issueTypeSelector = selectComponent[0];

    // Assert
    expect(issueTypeSelector.items.length).toBe(6);
    expect(find(Helper.isTestSelector).nativeElement.checked).toBe(false);
  });

  it('#backToNotAuthorizedPage should go to Home/NotAuthorized', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.assign = jest.fn();

    // Act
    instance.backToNotAuthorizedPage();

    // Assert
    expect(window.location.assign).toHaveBeenCalledWith(Helper.urlNotAuthorizedPage);
  });

  it('Should call expected function and return expected data when change model', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const model = new FilterModel();
    const changes = {
      'model': new SimpleChange(null, model, true)
    };
    instance.isEdit = true;
    instance.initData = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.model.subIssueTypeId = '12';
    instance.issueTypes = new IssueTypes(Helper.fakeIssueTypes);
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();
    instance.haveIssueTypeFromPermission = jest.fn().mockImplementation(() => false);
    instance.backToNotAuthorizedPage = jest.fn();

    // Act
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance.issueTypes.issueId).toBe(8);
    expect(instance.issueTypes.selectedSubIssueTypes.length).toBe(2);
    expect(instance.issueTypes.issueTypes.length).toBe(6);
  });

  it('#ngOnChanges Should call expected function and return expected data when isLikelyDangerAccepted true', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const model = new FilterModel();
    const changes = {
      'model': new SimpleChange(null, model, true)
    };
    instance.isEdit = true;
    instance.initData = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.model.subIssueTypeId = '12';
    instance.issueTypes = new IssueTypes(Helper.fakeIssueTypes);
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();
    instance.haveIssueTypeFromPermission = jest.fn().mockImplementation(() => true);
    instance.isLikelyDangerAccepted = jest.fn().mockImplementation(() => true);
    instance['getAllowanceTimeBySubIssueType'] = jest.fn();
    instance['setWidthControlByIssueType'] = jest.fn();

    // Act
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance['getAllowanceTimeBySubIssueType']).toHaveBeenCalledTimes(1);
    expect(instance['setWidthControlByIssueType']).toHaveBeenCalledTimes(1);
    expect(instance.issueTypes.issueId).toBe(8);
    expect(instance.issueTypes.selectedSubIssueTypes.length).toBe(2);
    expect(instance.issueTypes.issueTypes.length).toBe(6);
  });

  it('#ngOnChanges Should call expected function and return expected data when isLikelyDangerAccepted false', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const model = new FilterModel();
    const changes = {
      'model': new SimpleChange(null, model, true)
    };
    const fakeIssueTypes = _.cloneDeep(Helper.fakeIssueTypes)
    fakeIssueTypes.issueId = null;
    instance.isEdit = true;
    instance.initData = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.model.subIssueTypeId = '12';
    instance.issueTypes = new IssueTypes(fakeIssueTypes);
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();
    instance.issueTypes.issueId = null;
    instance.isLikelyDangerAccepted = jest.fn().mockImplementation(() => false);
    instance['getAllowanceTimeBySubIssueType'] = jest.fn();
    instance['setWidthControlByIssueType'] = jest.fn();

    // Act
    await instance.ngOnChanges(changes);

    // Assert
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance['getAllowanceTimeBySubIssueType']).toHaveBeenCalledTimes(0);
    expect(instance['setWidthControlByIssueType']).toHaveBeenCalledTimes(1);
    expect(instance.issueTypes.issueId).toBe(8);
    expect(instance.issueTypes.selectedSubIssueTypes.length).toBe(2);
    expect(instance.issueTypes.issueTypes.length).toBe(6);
  });

  it('#changeActionWaitingToManualVoid should call #changeActionWaitingToManualEditPage when edit request', async () => {
    // Arrange
    const mockChangeActionWaitingToManualEditPage = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeActionWaitingToManualEditPage: mockChangeActionWaitingToManualEditPage
      })
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isEdit = true;
    instance.actionIds = ['3'];
    instance.model.action = '5';

    // Act
    instance.changeActionWaitingToManualVoid();

    // Assert
    expect(mockChangeActionWaitingToManualEditPage).toHaveBeenCalledTimes(1);
    expect(mockChangeActionWaitingToManualEditPage).toHaveBeenCalledWith(true);
  });

  it('#changeActionWaitingToManualVoid should not call #changeActionWaitingToManualEditPage when add request', async () => {
    // Arrange
    const mockChangeActionWaitingToManualEditPage = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeActionWaitingToManualEditPage: mockChangeActionWaitingToManualEditPage
      })
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isEdit = false;
    instance.actionIds = ['3'];
    instance.model.action = '5';

    // Act
    instance.changeActionWaitingToManualVoid();

    // Assert
    expect(mockChangeActionWaitingToManualEditPage).toHaveBeenCalledTimes(0);
  });

  it('#isAbnormalAccount should be return true when edit request', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.isEdit = true;
    instance.model.issueTypeId = '13';

    // Act
    instance.isAbnormalAccount();

    // Assert
    expect(instance.isAbnormalAccount).toBeTruthy();
  });

  it('#haveIssueTypeFromPermission should be return true when has issue type id', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    // Act
    instance.haveIssueTypeFromPermission('8');

    // Assert
    expect(instance.haveIssueTypeFromPermission).toBeTruthy();
  });

  it('#ngOnInit should be call expected function', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.initData = jest.fn();
    instance.initDate = jest.fn();
    instance.updateModel = jest.fn();
    instance.subscribeSubScription = jest.fn();
    instance.isEditOrExternalUrl = jest.fn().mockImplementation(() => false);
    instance.isEdit = false;

    // Act
    await instance.ngOnInit();

    // Assert
    expect(instance.initDate).toHaveBeenCalledTimes(1);
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance.isEditOrExternalUrl).toHaveBeenCalledTimes(1);
    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });

  it('#ngOnInit should be call expected function when isEditOrExternalUrl true', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.initData = jest.fn();
    instance.initDate = jest.fn();
    instance.updateModel = jest.fn();
    instance.subscribeSubScription = jest.fn();
    instance.isEditOrExternalUrl = jest.fn().mockImplementation(() => true);
    instance.isEdit = false;

    // Act
    await instance.ngOnInit();

    // Assert
    expect(instance.initDate).toHaveBeenCalledTimes(1);
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance.isEditOrExternalUrl).toHaveBeenCalledTimes(1);
    expect(instance.updateModel).toHaveBeenCalledTimes(0);
  });

  it('#initData should be call #updateModel when add request', async () => {
    // Arrange
    document.body.innerHTML = '<section id="body" user-name="star" user-id="360418"></section>';
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance['initialize'] = false;
    instance.isEdit = false;
    instance.getIssueTypes = jest.fn();
    instance.initSelections = jest.fn();
    instance.updateSubByIssue = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.updateModel = jest.fn();

    instance.haveIssueTypeFromPermission = jest.fn().mockImplementation(() => true);
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn().mockImplementation(() => '1');

    // Act
    await instance.initData();

    // Assert
    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });

  it('#initData should not call #updateModel when add edit request ', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance['initialize'] = false;
    instance.isEdit = true;
    instance.getIssueTypes = jest.fn();
    instance.initSelections = jest.fn();
    instance.updateSubByIssue = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.updateModel = jest.fn();

    // Act
    await instance.initData();

    // Assert
    expect(instance.updateModel).toHaveBeenCalledTimes(0);
  });

  it('#initData should not call #updateModel when initialize false ', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance['initialize'] = true;
    instance.updateModel = jest.fn();

    // Act
    await instance.initData();

    // Assert
    expect(instance.updateModel).toHaveBeenCalledTimes(0);
  });

  it('#initSelections should be call #updateModel when add request', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(FilterService,
        {
          getSportsType: jest.fn().mockImplementation(() => Helper.getFakeSportsType()),
        }
      )
      .mock(CommonService,
        {
          getVoidActions: jest.fn().mockImplementation(() => Helper.getFakeActions()),
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isEdit = true;
    instance.actionIds = [];

    // Act
    await instance.initSelections();

    // Assert
    expect(instance.model.sportType).toEqual(Helper.fakeFilterModel.sportType);
    expect(instance.actionIds[0]).toEqual(Helper.fakeFilterModel.action);
  });

  it('#initSelections should be call #updateModel when edit request', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(FilterService, { getSportsType: jest.fn().mockImplementation(() => Helper.getFakeSportsType()) })
      .mock(CommonService, { getVoidActions: jest.fn().mockImplementation(() => Helper.getFakeActions()) })
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isEdit = false;
    instance.actionIds = [];

    // Act
    await instance.initSelections();

    // Assert
    expect(instance.model.sportType).toEqual(SportType.SOCCER);
  });

  it('#getAllowanceTimeBySubIssueType should be call #updateModel when edit request', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(FilterService, { getSportsType: jest.fn().mockImplementation(() => Helper.getFakeSportsType()) })
      .mock(CommonService, { getVoidActions: jest.fn().mockImplementation(() => Helper.getFakeActions()) })
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isEdit = false;
    instance.actionIds = [];

    // Act
    await instance['getAllowanceTimeBySubIssueType']();

    // Assert
    expect(instance.model.sportType).toEqual(SportType.SOCCER);
  });

  it('#getIssueTypes should be back to not authorized page', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(CommonService,
        {
          getIssueTypePermissionList: jest.fn().mockImplementation(() => []),
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.assign = jest.fn();

    // Act
    await instance.getIssueTypes();

    // Assert
    expect(window.location.assign).toHaveBeenCalledWith(Helper.urlNotAuthorizedPage);
  });

  it('#getIssueTypes should be set value issueId when add request and has not abnormalBet permission', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(CommonService,
        {
          getIssueTypePermissionList: jest.fn().mockImplementation(() => Helper.getFakeIssueTypePermissionList()),
        }
      )
      .mock(FilterService,
        {
          getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypes),
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.filterIssueTypePermission = jest.fn();
    instance.isEdit = false;
    instance.haveAbnormalBetFromPermission = jest.fn().mockImplementation(() => false);
    instance.updateSubByIssue = jest.fn();
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    // Act
    await instance.getIssueTypes();

    // Assert
    expect(instance.filterIssueTypePermission).toHaveBeenCalledTimes(1);
  });

  it('#getIssueTypes should be set value issueId when add request and has abnormalBet permission', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(CommonService,
        {
          getIssueTypePermissionList: jest.fn().mockImplementation(() => Helper.getFakeIssueTypePermissionList()),
        }
      )
      .mock(FilterService,
        {
          getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypes),
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.filterIssueTypePermission = jest.fn();
    instance.isEdit = false;
    instance.haveAbnormalBetFromPermission = jest.fn().mockImplementation(() => true);
    instance.updateSubByIssue = jest.fn();
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    // Act
    await instance.getIssueTypes();

    // Assert
    expect(instance.filterIssueTypePermission).toHaveBeenCalledTimes(1);
  });

  it('#getIssueTypes should be set value issueId when edit request', async () => {
    // Arrange
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
      .mock(AddRequestStore, {
        changeBlockingUiStatus: mockChangeBlockingUiStatus
      })
      .mock(CommonService,
        {
          getIssueTypePermissionList: jest.fn().mockImplementation(() => Helper.getFakeIssueTypePermissionList()),
        }
      )
      .mock(FilterService,
        {
          getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypes),
        }
      )
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.filterIssueTypePermission = jest.fn();
    instance.isEdit = true;
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    // Act
    await instance.getIssueTypes();

    // Assert
    expect(instance.filterIssueTypePermission).toHaveBeenCalledTimes(1);
  });


  it('#haveIssueTypeFromPermission should be return true when issue type = null', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });

    // Act
    const actual = await instance.haveIssueTypeFromPermission(null);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#updateIssueBySub should be not change value of issueId', async () => {
    // Arrange
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes = Helper.fakeIssueTypes;

    // Act
    instance['updateIssueBySub']();

    // Assert
    expect(instance.issueTypes.issueId).toBe(Helper.fakeIssueTypes.issueId);
  });

  it('#ngOnDestroy should not call unsubscribe when abnormalFilterBySubscription null', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.abnormalFilterBySubscription = null;

    instance.ngOnDestroy();

    expect(instance.abnormalFilterBySubscription).toBeNull();
  });

  it('#getSubIssueTypeName should return name when has subIssueId', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const subIssueType = new SubIssueType();
    subIssueType.subIssueTypeId = 11;
    subIssueType.subIssueTypeName = 'ABC';

    instance.issueTypes.subIssueId = subIssueType.subIssueTypeId;
    instance.issueTypes.selectedSubIssueTypes = [subIssueType];

    const actual = instance.getSubIssueTypeName();

    expect(actual).toBe('ABC');
  });

  it('#getSubIssueTypeName should return default text when has not subtype', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    const subIssueType = new SubIssueType();
    subIssueType.subIssueTypeId = 11;
    subIssueType.subIssueTypeName = 'ABC';
    instance.issueTypes.subIssueId = 12;
    instance.issueTypes.selectedSubIssueTypes = [subIssueType];

    const actual = instance.getSubIssueTypeName();

    expect(actual).toBe('Select Sub Type');
  });

  it('#getSubIssueTypeName should return default text when has not subIssueId', async () => {
    const fakeIssueTypes = _.cloneDeep(Helper.fakeIssueTypes);
    fakeIssueTypes.subIssueId = null;
    const { instance } = await shallow
      .render({
        bind: {
          model: Helper.fakeFilterModel,
          issueTypes: fakeIssueTypes
        }
      });

    const actual = instance.getSubIssueTypeName();

    expect(actual).toBe('Select Sub Type');
  });

  it('#initDate should init date with date time that is not model.eventDate', async () => {
    const fakeFilterModel = _.cloneDeep(Helper.fakeFilterModel);
    fakeFilterModel.eventDate = '2020-11-09 12:08:49.737';
    const date = new Date(Helper.fakeFilterModel.eventDate);
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });

    instance.initDate();

    expect(instance.date.year).toBeGreaterThan(date.getFullYear());
  });

  it('#updateDataAfterClosed should call #updateModel', async () => {
    const { instance } = await shallow
      .mock(AddRequestStore, { changeAllowanceTime: jest.fn() })
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.updateModel = jest.fn();

    instance.updateDataAfterClosed(1);

    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });

  it('#openDialog should update subIssueTypeDialogModel', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.subIssueTypeDialogModel = new SubIssueTypeDialogModel();

    instance.openDialog();

    expect(instance.subIssueTypeDialogModel.isOpen).toBeTruthy();
    expect(instance.subIssueTypeDialogModel.issueTypeId).toBe(instance.model.issueTypeId);
  });

  it('#onChangeIssueType should call expected method', async () => {
    const { instance } = await shallow
      .mock(AddRequestStore, { changeSavingRequestStatus: jest.fn() })
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.updateSubByIssue = jest.fn();
    instance['updateCurrentAction'] = jest.fn();
    instance.updateModel = jest.fn();
    instance['setWidthControlByIssueType'] = jest.fn();

    instance.onChangeIssueType();

    expect(instance['updateCurrentAction']).toHaveBeenCalled();
    expect(instance.updateModel).toHaveBeenCalled();
    expect(instance['setWidthControlByIssueType']).toHaveBeenCalled();
  });

  it('#onChangeSubIssueType should call #updateModel', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.updateModel = jest.fn();

    instance.onChangeSubIssueType();

    expect(instance.updateModel).toHaveBeenCalledTimes(1);
  });

  it('#setWidthControlByIssueType should update correctly', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });

    [1, 8, 9, 13, 10, 4, 5, 6, 7, 11, 15, 3, 17, 19].forEach(issueId => {
      instance.model.issueTypeId = issueId.toString();

      instance['setWidthControlByIssueType']();

      expect(instance.widthActionControl).toBeGreaterThan(0);
    });
  });

  it('#updateCurrentAction should update actions when is abnormal mix parlay', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isLikelyAbnormalBet = jest.fn().mockImplementation(() => true);
    instance.isAbnormalBet = jest.fn().mockImplementation(() => true);
    instance.abnormalFilterBy = AbnormalFilterBy.MIX_PARLAY;
    instance.originActions = Helper.getFakeActions();

    instance['updateCurrentAction']();

    expect(instance.actions.length).toBeGreaterThan(0);
  });

  it('#updateCurrentAction should update actions when is AB real member', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isLikelyAbnormalBet = jest.fn().mockImplementation(() => true);
    instance.abnormalFilterBy = null;
    instance.originActions = Helper.getFakeActions();

    instance['updateCurrentAction']();

    expect(instance.actions.length).toBeGreaterThan(0);
  });

  it('#updateCurrentAction should update actions when is Archived ticket', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isLikelyAbnormalBet = jest.fn().mockImplementation(() => false);
    instance.isArchivedTicket = jest.fn().mockImplementation(() => true);
    instance.originActions = Helper.getFakeActions();

    instance['updateCurrentAction']();

    expect(instance.actions.length).toBeGreaterThan(0);
  });

  it('#updateCurrentAction should update actions when is Abnormal Account', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isLikelyAbnormalBet = jest.fn().mockImplementation(() => false);
    instance.isArchivedTicket = jest.fn().mockImplementation(() => false);
    instance.isAbnormalAccount = jest.fn().mockImplementation(() => true);
    instance.originActions = Helper.getFakeActions();

    instance['updateCurrentAction']();

    expect(instance.actions.length).toBeGreaterThan(0);
  });

  it('#updateCurrentAction should update actions when is others', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.isLikelyAbnormalBet = jest.fn().mockImplementation(() => false);
    instance.isArchivedTicket = jest.fn().mockImplementation(() => false);
    instance.isAbnormalAccount = jest.fn().mockImplementation(() => true);
    instance.originActions = Helper.getFakeActions();

    instance['updateCurrentAction']();

    expect(instance.actions.length).toBeGreaterThan(0);
  });

  it('#filterIssueTypePermission should filter issueTypes', async () => {
    const issues = _.cloneDeep(Helper.fakeIssueTypes);
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    instance.filterIssueTypePermission(issues);

    expect(issues.issueTypes.length).toBeGreaterThan(0);
  });

  it('#updateModel should emit modelChange', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.modelChange.emit = jest.fn();
    instance.date = new NgbDate(2021, 12, 21);

    [1, 3, 11].forEach(x => {
      instance.issueTypes.issueId = x;

      instance.updateModel();

      expect(instance.modelChange.emit).toHaveBeenCalled();
    });
  });

  it('#updateModel should emit modelChange when have not issueId, subIssueId', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.modelChange.emit = jest.fn();
    instance.date = new NgbDate(2021, 12, 21);
    instance.issueTypes.issueId = null;
    instance.issueTypes.subIssueId = null;

    instance.updateModel();

    expect(instance.modelChange.emit).toHaveBeenCalled();
  });

  it('#isShowSubType should return true', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes.issueId = 1;
    instance.issueTypes.selectedSubIssueTypes = Helper.fakeIssueTypes.subIssueTypes;

    const actual = instance.isShowSubType();

    expect(actual).toBeTruthy();
  });

  it('#isShowButtonSelectSubType should return false', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    [null, 11].forEach(x => {
      instance.issueTypes.issueId = x;

      const actual = instance.isShowButtonSelectSubType();

      expect(actual).toBeFalsy();
    });
  });

  it('#updateSubByIssue should update selectedSubIssueTypes correctly', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    [1, 11, 10, 8].forEach(x => {
      instance.issueTypes.issueId = x;

      instance.updateSubByIssue();

      expect(instance.issueTypes.selectedSubIssueTypes.length).toBeGreaterThan(0);
    });
  });

  it('#isDangerAccepted should return false', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes.issueId = null;

    const actual = instance.isDangerAccepted();

    expect(actual).toBeFalsy();
  });

  it('#isRedCard should return false', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes.issueId = null;

    const actual = instance.isRedCard();

    expect(actual).toBeFalsy();
  });

  it('#haveAbnormalBetFromPermission should return true', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypesPermission = Helper.getFakeIssueTypePermissionList();

    const actual = instance.haveAbnormalBetFromPermission();

    expect(actual).toBeTruthy();
  });

  it('#checkValidSubIssueType should return true', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes.subIssueId = 1;

    const actual = instance.checkValidSubIssueType();

    expect(actual).toBeTruthy();
  });

  it('#checkValidSubIssueType should return false', async () => {
    const { instance } = await shallow
      .render({
        bind: {
          isEdit: false,
          model: Helper.fakeFilterModel,
          issueTypes: Helper.fakeIssueTypes
        }
      });
    instance.issueTypes.subIssueId = null;

    const actual = instance.checkValidSubIssueType();

    expect(actual).toBeFalsy();
  });
});
