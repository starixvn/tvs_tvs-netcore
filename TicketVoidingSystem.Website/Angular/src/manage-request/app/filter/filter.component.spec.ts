import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as moment from 'moment-timezone';
import { Shallow } from 'shallow-render';
import { AutoRefreshComponent } from '../../../utility/components/auto-refresh/auto-refresh.component';
import { ManageRequestStatus } from '../../../utility/constants/config';
import { BalanceUp } from '../../../utility/models/balance-up.model';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { ToolTipModule } from '../../../utility/modules/tooltip/tooltip.module';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { FilterComponent } from './filter.component';
import { FilterModel } from './filter.model';

class Helper {
  static readonly fakeDate = '2020-11-09 12:08:49.737';
  static readonly requestIdInputSelector = '.input-request-id';
  static readonly matchIdInputSelector = '.input-match-id';
  static readonly newRequestButtontSelector = '.btn-success';
  static readonly dangerAccepted = 'Danger Accepted';
  static readonly fakeIssueTypeSelectList: Selection[] = [
    {
      name: 'Abnormal Bet',
      value: '11'
    },
    {
      name: Helper.dangerAccepted,
      value: '1'
    },
    {
      name: 'Early Kick Off',
      value: '8'
    },
    {
      name: 'rong Kick Off Time',
      value: '9'
    }
  ];
  static readonly fakeCreatedBySelectList: Selection[] = [
    {
      name: 'Zane',
      value: '11'
    },
    {
      name: 'Raymond',
      value: '112'
    }
  ];
  static readonly fakeFilterModel: FilterModel = {
    matchId: 12345,
    ngbFromDate: new NgbDate(2020, 8, 21),
    ngbToDate: new NgbDate(2020, 8, 21),
    issueTypeId: '11',
    subIssueType: '27',
    status: '0',
    isExcludeTest: true,
    createdBy: ''
  };
  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: Helper.dangerAccepted},
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet'},
    { issueTypeId: 8, issueTypeName: 'Early Kick Off'},
    { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time'}
  ];
  static readonly fakeSubIssueTypeList: SubIssueType[] = [
    {
      subIssueTypeId: 1,
      issueTypeId: 1,
      subIssueTypeName: 'Goal',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 2,
      issueTypeId: 1,
      subIssueTypeName: 'Corner',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    },
    {
      subIssueTypeId: 12,
      issueTypeId: 8,
      subIssueTypeName: 'Non Live',
      subIssueTypeNameCS: ''
    },
    {
      subIssueTypeId: 14,
      issueTypeId: 9,
      subIssueTypeName: 'Wrong Kick Off Time',
      subIssueTypeNameCS: ''
    }
  ];
  static readonly fakeIssueTypesModel: IssueTypesModel = {
    issueTypes: Helper.fakeIssueTypeList,
    subIssueTypes: Helper.fakeSubIssueTypeList
  };

  static readonly fakeBalanceUp: BalanceUp = {
    balanceUpDay: new Date('2020-01-16'),
    moveBetsDay: new Date('2020-01-26')
  };

}

describe('FilterComponent', () => {
  @NgModule({
      declarations: [
        AutoRefreshComponent
      ],
      imports: [
        FormsModule,
        NgbModule,
        ToolTipModule,
        NgSelectModule
      ],
      providers: [
        HttpService
      ]
    })
  class AppModuleTest { }

  let shallow: Shallow<FilterComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterComponent, AppModuleTest).dontMock(NgbModule);
  });

  it('#ngOnInit should call expected function', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, {
        getBalanceUp: jest.fn().mockImplementation(() => Helper.fakeBalanceUp)
      })
      .render();
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);
    instance['setIssueTypeSelectList'] = jest.fn();
    instance.initDefaultFilter = jest.fn();
    instance.updateSubByIssue = jest.fn();
    instance.clickSearch = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance['setIssueTypeSelectList']).toHaveBeenCalledTimes(1);
    expect(instance.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(instance.updateSubByIssue).toHaveBeenCalledTimes(1);
    expect(instance.clickSearch).toHaveBeenCalledTimes(1);
    expect(instance.filterByValue).toBe('MatchId');
    expect(instance.bUDay).toEqual(new Date(Helper.fakeBalanceUp.balanceUpDay));
  });

  it('#controlFilter should assign expected data and call #updateSubByIssue when it search by matchid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.initDefaultFilter = jest.fn();
    instance.updateSubByIssue = jest.fn();
    instance.issueTypeSelectList = Helper.fakeIssueTypeSelectList;

    // Action
    instance.controlFilter('MatchId');

    // Assert
    expect(instance.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(instance.updateSubByIssue).toHaveBeenCalledTimes(1);
    expect(instance.model.requestId).toBeNull();
    expect(instance.model.status).toBe(ManageRequestStatus.ALL_ID.toString());
    expect(instance.model.issueTypeId).toBe('11');
    expect(instance.model.isExcludeTest).toBe(true);
  });

  it('#handelAutoRefresh should return isShowAutoRefresh is true', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model.ngbFromDate = new NgbDate(2020, 9, 8);
    instance.bUDay = new Date(Helper.fakeDate);

    // Action
    instance.handelAutoRefresh();

    // Assert
    expect(instance.isShowAutoRefresh).toBe(false);
  });

  it('#controlFilter should assign expected data when it search by requestid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.initDefaultFilter = jest.fn();
    instance.issueTypeSelectList = Helper.fakeIssueTypeSelectList;

    // Action
    instance.controlFilter('RequestId');

    // Assert
    expect(instance.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(instance.model.matchId).toBeNull();
    expect(instance.model.status).toBe(ManageRequestStatus.ALL_ID.toString());
    expect(instance.model.issueTypeId).toBe('11');
    expect(instance.model.isExcludeTest).toBe(true);
  });

  it('#initDefaultFilter should return expected FilterModel', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const date = new Date(moment.utc().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss.SSS'));
    instance.issueTypeSelectList = Helper.fakeIssueTypeSelectList;
    instance.createdBySelectList = Helper.fakeCreatedBySelectList;

    // Action
    instance.initDefaultFilter();

    // Assert
    expect(instance.model.ngbFromDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(instance.model.ngbToDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(instance.model.status).toBe(ManageRequestStatus.ALL_ID.toString());
    expect(instance.model.issueTypeId).toBe('11');
    expect(instance.model.isExcludeTest).toBe(true);
  });

  it('#newRequest should open tab for add request', async () => {
    // Arrange
    const { instance } = await shallow.render();
    window.open = jest.fn();

    // Action
    instance.newRequest();

    // Assert
    expect(window.open).toHaveBeenCalledWith('TicketVoidingSystem/AddRequest/Index', '_blank');
  });

  it('#modelChange should emit with expected FilterModel when call #updateModel', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = Helper.fakeFilterModel;
    instance.modelChange.emit = jest.fn();

    // Action
    instance.updateModel();

    // Assert
    expect(instance.modelChange.emit).toHaveBeenCalledWith(Helper.fakeFilterModel);
  });

  it('#search should emit with expected FilterModel when call #clickSearch', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(CommonService, {
      getMarkedTicketsCount: jest.fn()
    })
    .render();
    instance.model = Helper.fakeFilterModel;
    instance.search.emit = jest.fn();
    instance.validate = jest.fn().mockImplementation(() => true);
    instance.multipleSelectSubTypeModel = ['27'];

    // Action
    instance.clickSearch();

    // Assert
    expect(instance.search.emit).toHaveBeenCalledTimes(1);
  });

  it('#search should not call search.emit', async () => {
    // Arrange
    const { instance } = await shallow
    .mock(CommonService, {
      getMarkedTicketsCount: jest.fn()
    })
    .render();
    instance.model = Helper.fakeFilterModel;
    instance.search.emit = jest.fn();
    instance.validate = jest.fn().mockImplementation(() => false);
    instance.multipleSelectSubTypeModel = [];

    // Action
    instance.clickSearch();

    // Assert
    expect(instance.search.emit).toHaveBeenCalledTimes(0);
  });

  it('#validate should display tooltip', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    const testCases = [
      { filterByMatch: true, requestId: null, matchId: 'aaaa', expectedResult: false },
      { filterByMatch: false, requestId: undefined,  matchId: null, expectedResult: false },
      { filterByMatch: false, requestId: null,  matchId: null, expectedResult: false },
      { filterByMatch: false, requestId: 'aaa',  matchId: null, expectedResult: false }
    ];
    instance.tooltip.display = jest.fn();

    // Action and Assert
    for (const item of testCases) {
      instance.filterByMatch = item.filterByMatch;
      instance.model.requestId = item.requestId;
      instance.model.matchId = item.matchId;
      actualResult = instance.validate();

      expect(instance.tooltip.display).toHaveBeenCalled();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('#validate should return true when search by matchid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.filterByMatch = true;

    // Action
    const actualResult = instance.validate();

    // Assert
    expect(actualResult).toBe(true);
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when haven\'t any permission on IssueType', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, {
        getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel),
        getIssueTypePermissionList: jest.fn().mockImplementation(() => [])
      })
      .render();

    // Action
    await instance['setIssueTypeSelectList']();

    // Assert
    expect(instance.issueTypeSelectList.length).toBe(1);
    expect(instance.issueTypeSelectList[0].name).toBe('N/A');
    expect(instance.issueTypeSelectList[0].value).toBe('-1');
    expect(instance.model.issueTypeId).toBe('-1');
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when only 1 IssueType permission', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, {
        getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel),
        getIssueTypePermissionList: jest.fn().mockImplementation(() => [Helper.fakeIssueTypeList[0]] )
      })
      .render();

    // Action
    await instance['setIssueTypeSelectList']();

    // Assert
    expect(instance.issueTypeSelectList.length).toBe(1);
    expect(instance.issueTypeSelectList[0].name).toBe('Danger Accepted');
    expect(instance.issueTypeSelectList[0].value).toBe('1');
    expect(instance.model.issueTypeId).toBe('1');
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when > 1 IssueType permission', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, {
        getIssueTypes: jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel),
        getIssueTypePermissionList: jest.fn().mockImplementation(() => Helper.fakeIssueTypeList )
      })
      .render();

    // Action
    await instance['setIssueTypeSelectList']();

    // Assert
    expect(instance.issueTypeSelectList.length).toBe(5);
    expect(instance.issueTypeSelectList[0].name).toBe('All');
    expect(instance.issueTypeSelectList[0].value).toBe('1,11,8,9');
    expect(instance.model.issueTypeId).toBe('1,11,8,9');
  });

  it('#updateSubByIssue should set none subtype when not permission on IssueType', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model.issueTypeId = '-1';

    // Action
    instance.updateSubByIssue();

    // Assert
    expect(instance.isNoneSubType).toBe(true);
    expect(instance.multipleSelectSubTypeModel.length).toBe(1);
    expect(instance.multipleSelectSubTypeModel.join(',')).toBe('-1');
  });

  it('#updateSubByIssue should get subtype when issueType is only one issueType', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model.issueTypeId = '1';
    instance.issueTypePermissionList = Helper.fakeIssueTypeList;
    instance.issueTypeModel = Helper.fakeIssueTypesModel;

    // Action
    instance.updateSubByIssue();

    // Assert
    expect(instance.isNoneSubType).toBe(false);
    expect(instance.subTypeSelectList.length).toBe(2);
  });

  it('#updateSubByIssue should get all subtype when issueType is selected All', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model.issueTypeId = '1,11,8,9';
    instance.issueTypePermissionList = Helper.fakeIssueTypeList;
    instance.issueTypeModel = Helper.fakeIssueTypesModel;

    // Action
    instance.updateSubByIssue();

    // Assert
    expect(instance.isNoneSubType).toBe(false);
    expect(instance.subTypeSelectList.length).toBe(5);
  });

  it('should display request id input when search by request', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.filterByMatch = false;
    fixture.detectChanges();

    // Assert
    expect(find(Helper.requestIdInputSelector)).toHaveFoundOne();
  });

  it('should display match id input when search by match', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.filterByMatch = true;
    fixture.detectChanges();

    // Assert
    expect(find(Helper.matchIdInputSelector)).toHaveFoundOne();
  });

  it('should display new request button when have manageRequestHost permission', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.permission.manageRequestHost = true;
    fixture.detectChanges();

    // Assert
    expect(find(Helper.newRequestButtontSelector)).toHaveFoundOne();
  });

  it('#openMarkTickets should open tab for mark tickets', async () => {
    // Arrange
    const { instance } = await shallow.render();
    window.open = jest.fn();

    // Action
    instance.openMarkTickets();

    // Assert
    expect(window.open).toHaveBeenCalledWith('SportBook/MarkTickets/Index/1', '_blank');
  });
});
