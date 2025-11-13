import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { ManageRequestStatus } from '../../../utility/constants/config';
import { BalanceUp } from '../../../utility/models/balance-up.model';
import { IssueType, IssueTypesModel, SubIssueType } from '../../../utility/models/issue-type.model';
import { Selection } from '../../../utility/models/selection.model';
import { TestingModule } from '../../../utility/modules/testing.module';
import { CommonService } from '../../../utility/services/common.service';
import { FilterComponent } from './filter.component';
import { FilterModel } from '../../../manage-remark/app/models/filter.model';
import { FilterService } from './filter.service';

class Helper {
  static readonly fakeDate = '2020-11-09 12:08:49.737';
  static readonly requestIdInputSelector = '.input-request-id';
  static readonly matchIdInputSelector = '.input-match-id';
  static readonly newRequestButtonSelector = '.btn-success';
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
      name: 'Wrong Kick Off Time',
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
    statusIds: '0',
    isExcludeTest: true,
    createdBy: '',
    isDisplayMissingInfo: false
  } as FilterModel;
  static readonly fakeIssueTypeList: IssueType[] = [
    { issueTypeId: 1, issueTypeName: Helper.dangerAccepted },
    { issueTypeId: 11, issueTypeName: 'Abnormal Bet' },
    { issueTypeId: 8, issueTypeName: 'Early Kick Off' },
    { issueTypeId: 9, issueTypeName: 'Wrong Kick Off Time' }
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
  static readonly year = 2025;
  static readonly month = 2;
  static readonly date = 6;
}

const store: Record<string, string> = {};

const localStorageMock = {
  getItem: jest.fn((key: string) => store[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    store[key] = value;
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let commonService: CommonService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        CommonService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;
    component.tooltip.display = jest.fn();
  });

  it('#ngOnInit should call expected function', async () => {
    // Arrange
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('root-url', '/');
    document.body.appendChild(element);
    commonService.getBalanceUp = jest.fn().mockResolvedValue(Helper.fakeBalanceUp);
    component['setIssueTypeSelectList'] = jest.fn();
    component.initDefaultFilter = jest.fn();
    component.updateSubByIssue = jest.fn();
    component.clickSearch = jest.fn();
    component.model.ngbFromDate = new NgbDate(Helper.year, Helper.month, Helper.date);

    // Action
    await component.ngOnInit();

    // Assert
    expect(component['setIssueTypeSelectList']).toHaveBeenCalledTimes(1);
    expect(component.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(component.updateSubByIssue).toHaveBeenCalledTimes(1);
    expect(component.clickSearch).toHaveBeenCalledTimes(1);
    expect(component.filterByValue).toBe('MatchId');
    expect(component.bUDay).toEqual(new Date(Helper.fakeBalanceUp.balanceUpDay));
  });

  it('#controlFilter should assign expected data and call #updateSubByIssue when it search by matchId', async () => {
    // Arrange
    component.initDefaultFilter = jest.fn();
    component.updateSubByIssue = jest.fn();
    component.issueTypeSelectList = Helper.fakeIssueTypeSelectList;
    component.selectedIssueTypes = ["1"];
    component.selectedStatus = ["1"];

    // Action
    component.controlFilter('MatchId');

    // Assert
    expect(component.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(component.updateSubByIssue).toHaveBeenCalledTimes(1);
    expect(component.model.requestId).toBeNull();
    expect(component.model.statusIds).toBe("1");
    expect(component.model.issueTypeId).toBe('1');
    expect(component.model.isExcludeTest).toBe(true);
  });

  it('#checkAutoRefresh should return isShowAutoRefresh is false', async () => {
    // Arrange
    component.model.ngbFromDate = new NgbDate(Helper.year, Helper.month, Helper.date);
    component.bUDay = new Date(Helper.fakeDate);

    // Action
    component.checkAutoRefresh();

    // Assert
    expect(component.isShowAutoRefresh).toBe(true);
  });

  it('#controlFilter should assign expected data when it search by requestid', async () => {
    // Arrange
    component.initDefaultFilter = jest.fn();
    component.issueTypeSelectList = Helper.fakeIssueTypeSelectList;
    component.selectedIssueTypes = ["1"];

    // Action
    component.controlFilter('RequestId');

    // Assert
    expect(component.initDefaultFilter).toHaveBeenCalledTimes(1);
    expect(component.model.matchId).toBeNull();
    expect(component.model.issueTypeId).toBe('1');
    expect(component.model.isExcludeTest).toBe(true);
  });

  it('#initDefaultFilter should return expected FilterModel', async () => {
    // Arrange
    const date = new Date(moment.utc().tz('America/Caracas').format('YYYY-MM-DD HH:mm:ss.SSS'));
    component.issueTypeSelectList = Helper.fakeIssueTypeSelectList;
    component.createdBySelectList = Helper.fakeCreatedBySelectList;
    component.products = FilterService.initMultiSelectProduct();

    // Action
    component.initDefaultFilter();

    // Assert
    expect(component.model.ngbFromDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(component.model.ngbToDate).toStrictEqual(new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
    expect(component.model.statusIds).toBe(ManageRequestStatus.DEFAULT_STATUS.toString());
    expect(component.model.issueTypeId).toBe('11,1,8,9');
    expect(component.model.isExcludeTest).toBe(true);
  });

  it('#newRequest should open tab for add request', async () => {
    // Arrange
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('old-site-root-url', '/');
    const mockAssign = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: mockAssign },
      writable: true
    });

    // Action
    component.newRequest();

    // Assert
    expect(mockAssign).toHaveBeenCalledTimes(1);
  });

  it('#modelChange should emit with expected FilterModel when call #updateModel', async () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.modelChange.emit = jest.fn();

    // Action
    component.updateModel();

    // Assert
    expect(component.modelChange.emit).toHaveBeenCalledWith(Helper.fakeFilterModel);
  });

  it('#search should emit with expected FilterModel when call #clickSearch', async () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.search.emit = jest.fn();
    component.validate = jest.fn().mockImplementation(() => true);
    component.multipleSelectSubTypeModel = ['27'];

    // Action
    component.clickSearch();

    // Assert
    expect(component.search.emit).toHaveBeenCalledTimes(1);
  });

  it('#search should not call search.emit', async () => {
    // Arrange
    component.model = Helper.fakeFilterModel;
    component.search.emit = jest.fn();
    component.validate = jest.fn().mockImplementation(() => false);
    component.multipleSelectSubTypeModel = [];

    // Action
    component.clickSearch();

    // Assert
    expect(component.search.emit).toHaveBeenCalledTimes(0);
  });

  it('#validate should display tooltip', async () => {
    // Arrange
    let actualResult = true;
    const testCases = [
      { filterByMatch: true, requestId: null, matchId: 'aaaa', expectedResult: false },
      { filterByMatch: false, requestId: undefined, matchId: null, expectedResult: false },
      { filterByMatch: false, requestId: null, matchId: null, expectedResult: false },
      { filterByMatch: false, requestId: 'aaa', matchId: null, expectedResult: false }
    ];
    component.tooltip.display = jest.fn();

    // Action and Assert
    for (const item of testCases) {
      component.filterByMatch = item.filterByMatch;
      component.model.requestId = item.requestId;
      component.model.matchId = item.matchId;
      actualResult = component.validate();

      expect(component.tooltip.display).toHaveBeenCalled();
      expect(actualResult).toBe(item.expectedResult);
    }
  });

  it('#validate should return true when search by matchId', async () => {
    // Arrange
    component.filterByMatch = true;
    component.model = { matchId: 1, requestId: 1, issueTypeId: "1", productTypeIds: "1,2", statusIds: ManageRequestStatus.DEFAULT_STATUS.toString() } as FilterModel;

    // Action
    const actualResult = component.validate();

    // Assert
    expect(actualResult).toBe(true);
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when haven\'t any permission on IssueType', async () => {
    // Arrange
    commonService.getIssueTypes = jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel);
    commonService.getIssueTypePermissionList = jest.fn().mockResolvedValue([]);

    // Action
    await component['setIssueTypeSelectList']();

    // Assert
    expect(component.issueTypeSelectList.length).toBe(1);
    expect(component.issueTypeSelectList[0].name).toBe('N/A');
    expect(component.issueTypeSelectList[0].value).toBe('-1');
    expect(component.model.issueTypeId).toBe('-1');
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when only 1 IssueType permission', async () => {
    // Arrange
    commonService.getIssueTypes = jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel);
    commonService.getIssueTypePermissionList = jest.fn().mockResolvedValue([Helper.fakeIssueTypeList[0]]);

    // Action
    await component['setIssueTypeSelectList']();

    // Assert
    expect(component.issueTypeSelectList.length).toBe(1);
    expect(component.issueTypeSelectList[0].name).toBe('Danger Accepted');
    expect(component.issueTypeSelectList[0].value).toBe('1');
    expect(component.model.issueTypeId).toBe('1');
  });

  it('#setIssueTypeSelectList return expected issueTypeSelectList and model.issueTypeId when > 1 IssueType permission', async () => {
    // Arrange
    commonService.getIssueTypes = jest.fn().mockImplementation(() => Helper.fakeIssueTypesModel);
    commonService.getIssueTypePermissionList = jest.fn().mockImplementation(() => Helper.fakeIssueTypeList);

    // Action
    await component['setIssueTypeSelectList']();

    // Assert
    expect(component.issueTypeSelectList.length).toBe(4);
    expect(component.issueTypeSelectList[0].group).toBe('All');
    expect(component.issueTypeSelectList[0].value).toBe('1');
    expect(component.model.issueTypeId).toBe('1');
  });

  it('#updateSubByIssue should set none subtype when not permission on IssueType', async () => {
    // Arrange
    component.model.issueTypeId = '-1';

    // Action
    component.updateSubByIssue();

    // Assert
    expect(component.isNoneSubType).toBe(true);
    expect(component.multipleSelectSubTypeModel.length).toBe(1);
    expect(component.multipleSelectSubTypeModel.join(',')).toBe('-1');
  });

  it('#updateSubByIssue should get subtype when issueType is only one issueType', async () => {
    // Arrange
    component.model.issueTypeId = '1';
    component.issueTypePermissionList = Helper.fakeIssueTypeList;
    component.issueTypeModel = Helper.fakeIssueTypesModel;

    // Action
    component.updateSubByIssue();

    // Assert
    expect(component.isNoneSubType).toBe(false);
    expect(component.subTypeSelectList.length).toBe(2);
  });

  it('#updateSubByIssue should get all subtype when issueType is selected All', async () => {
    // Arrange
    component.model.issueTypeId = '1,11,8,9';
    component.issueTypePermissionList = Helper.fakeIssueTypeList;
    component.issueTypeModel = Helper.fakeIssueTypesModel;
    const lengthExpected = 5;

    // Action
    component.updateSubByIssue();

    // Assert
    expect(component.isNoneSubType).toBe(false);
    expect(component.subTypeSelectList.length).toBe(lengthExpected);
  });

  it('should display request id input when search by request', async () => {
    // Arrange
    component.filterByMatch = false;
    fixture.detectChanges();

    // Act
    const requestIdInput = fixture.nativeElement.querySelector(Helper.requestIdInputSelector);

    // Assert
    expect(requestIdInput).toBeTruthy();
  });

  it('should display match id input when search by match', async () => {
    // Arrange
    component.filterByMatch = true;
    fixture.detectChanges();

    // Act
    const matchIdInput = fixture.nativeElement.querySelector(Helper.matchIdInputSelector);

    // Assert
    expect(matchIdInput).toBeTruthy();
  });

  it('should display new request button when have manageRequestHost permission', async () => {
    // Arrange
    component.permission.manageRequestHost = true;
    fixture.detectChanges();

    // Act
    const newRequestButton = fixture.nativeElement.querySelector(Helper.newRequestButtonSelector);

    // Assert
    expect(newRequestButton).toBeTruthy();
  });

  it('#openMarkTickets should open tab for mark tickets', async () => {
    // Arrange
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('root-url', '/');
    document.body.appendChild(element);
    window.open = jest.fn();

    // Action
    component.openMarkTickets();

    // Assert
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
