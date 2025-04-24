import { EventEmitter, SimpleChange } from '@angular/core';
import '@angular/localize/init';
import * as _ from 'lodash';
import { ModalType } from '../../../utility/components/modal/modal.model';
import { ModalService } from '../../../utility/components/modal/modal.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { RequestSimpleInfo, RequestStatus } from '../../../utility/models/signal-r.model';
import { CommonService } from '../../../utility/services/common.service';
import { AppService } from '../app.service';
import { PermissionManage } from '../models/permission-manage.model';
import { RequestListComponent } from './request-list.component';
import { DetailRequestModel, RequestModel } from './request.model';
import { RequestDescriptionService } from './services/request-description.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';

class Helper {
  static readonly titleSelector = '.title-request-list-label';
  static readonly exportExcelButton = 'input[type=button].title-request-list-toolbox-excel';
  static readonly noDataSelector = '.no-data';
  static readonly iconVoidSelector = '.icon-void';
  static readonly matchId = 11112;
  static readonly fakeIssueTypesModel: IssueTypesModel = {
    issueTypes: [
      { issueTypeId: 1, issueTypeName: 'Danger Accepted' },
      { issueTypeId: 11, issueTypeName: 'Abnormal' }
    ],
    subIssueTypes: [
      {
        subIssueTypeId: 1,
        issueTypeId: 1,
        subIssueTypeName: 'Goal',
        subIssueTypeNameCS: null
      },
      {
        subIssueTypeId: 24,
        issueTypeId: 5,
        subIssueTypeName: 'Away Virtual Head Reversed',
        subIssueTypeNameCS: null
      },
      {
        subIssueTypeId: 11,
        issueTypeId: 11,
        subIssueTypeName: 'Abnormal',
        subIssueTypeNameCS: '非正常'
      }
    ]
  };
  static readonly fakeActions: Selection[] = [
    { name: 'Void', value: '1' },
    { name: 'Take note', value: '2' },
    { name: 'Waiting', value: '3' }
  ];
  static readonly fakeDetailRequestModelList = [
    {
      subIssueTypeId: 1,
      matchId: Helper.matchId,
      description: '',
      totalSingleProcessed: 0,
      totalParlayProcessed: 0,
      settlementStatus: '',
      totalCancelCashOutProcessed: 0,
      totalResettleProcessed: 0
    },
    {
      subIssueTypeId: 1,
      matchId: 99001684,
      description: '',
      totalSingleProcessed: 1,
      totalParlayProcessed: 1,
      settlementStatus: '',
      totalCancelCashOutProcessed: 0,
      totalResettleProcessed: 0
    },
  ] as DetailRequestModel[];
  static readonly fakeRequestModelList = [
    {
      requestId: 1112,
      issueTypeId: 11,
      actionId: 1,
      createdBy: 'sa',
      createdDate: new Date('2020-08-13 00:00:00.000'),
      mistakenBy: 'sa',
      decidedBy: 'sa',
      lastPerformedBy: 'sa',
      checkedBy: 'sa',
      isCheckedBy: true,
      eventDate: new Date('2020-08-12 00:00:00.000'),
      status: 'Completed',
      details: Helper.fakeDetailRequestModelList,
    },
    {
      requestId: 1111,
      issueTypeId: 1,
      actionId: 5,
      createdBy: 'starix',
      createdDate: new Date('2020-08-14 00:00:00.000'),
      mistakenBy: 'starix',
      decidedBy: 'starix',
      lastPerformedBy: 'starix',
      checkedBy: '',
      isCheckedBy: false,
      eventDate: new Date('2020-08-15 00:00:00.000'),
      status: 'Completed',
      details: Helper.fakeDetailRequestModelList,
    }
  ] as RequestModel[];
  static readonly fakePermissionManage: PermissionManage = {
    manageRequestHost: true,
    verifyRead: true,
    verifyHost: true,
    voidRead: true,
    isReadMarkTickets: true
  };
  static readonly fakeRequestSimpleInfo = {
    lastPerformedBy: 'starix',
    totalSingleProcessed: 12,
    totalParlayProcessed: 1,
    matchId: Helper.matchId,
    totalCancelCashOutProcessed: 0,
    totalResettleProcessed: 0
  } as RequestSimpleInfo;

  static readonly fakeRequestStatus: RequestStatus[] = [{
    requestId: 1111,
    status: 'Running',
    simpleInfo: Helper.fakeRequestSimpleInfo,
  }];
}

describe('RequestListComponent', () => {
  let component: RequestListComponent;
  let fixture: ComponentFixture<RequestListComponent>;
  let modalService: ModalService;
  let commonService: CommonService;
  let appService: AppService;
  let requestDescriptionService: RequestDescriptionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
      providers: [
        ModalService, CommonService, AppService, RequestDescriptionService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestListComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    commonService = fixture.debugElement.injector.get(CommonService);
    appService = fixture.debugElement.injector.get(AppService);
    requestDescriptionService = fixture.debugElement.injector.get(RequestDescriptionService);
    component = fixture.componentInstance;
    component.requestStatusChangeEvent = new EventEmitter<RequestStatus[]>();
  });

  it('#ngOnInit should call #getActions and #getIssueTypes', async () => {
    // Arrange
    const mockGetActions = jest.fn();
    const mockGetIssueTypes = jest.fn();
    commonService.getVoidActions = mockGetActions;
    commonService.getIssueTypes = mockGetIssueTypes;
    component.requestStatusChangeEvent.subscribe = jest.fn();

    // Action
    await component.ngOnInit();

    // Assert
    expect(mockGetActions).toHaveBeenCalled();
    expect(mockGetIssueTypes).toHaveBeenCalled();
  });

  it('#ngOnInit should call #updateRequestStatus', async () => {
    commonService.getVoidActions = jest.fn();
    commonService.getIssueTypes = jest.fn();
    component['updateRequestStatus'] = jest.fn();
    await component.ngOnInit();
    component.requestStatusChangeEvent.next([]);

    expect(component['updateRequestStatus']).toHaveBeenCalled();
  });

  it('#ngOnChanges should return expected displayedModels', async () => {
    // Arrange
    const changes = {
      'models': new SimpleChange(null, Helper.fakeRequestModelList, true)
    };
    component.models = Helper.fakeRequestModelList;

    // Action
    component.ngOnChanges(changes);

    // Assert
    expect(component.paging.total).toBe(2);
    expect(component.displayedModels.length).toBe(2);
  });

  it('#ngOnChanges should not call @filterDisplayRequests', async () => {
    // Arrange
    component.filterDisplayRequests = jest.fn();

    // Action
    component.ngOnChanges({});

    // Assert
    expect(component.filterDisplayRequests).toHaveBeenCalledTimes(0);
  });

  it('#getIssueTypeName should return empty string with param is 0', async () => {
    // Arrange
    // Action
    const actualData = component.getIssueTypeName(0);

    // Assert
    expect(actualData).toBe('');
  });

  it('#getIssueTypeName should return expected IssueType', async () => {
    // Arrange
    component.issueTypesModel = Helper.fakeIssueTypesModel;
    let actualData = '';
    const testCases = [
      { subIssueTypeId: 24, expectedData: '' },
      { subIssueTypeId: 11, expectedData: 'Abnormal' },
      { subIssueTypeId: 1, expectedData: 'Danger Accepted - Goal' }
    ];

    // Action and Assert
    for (const item of testCases) {
      actualData = component.getIssueTypeName(item.subIssueTypeId);
      expect(actualData).toBe(item.expectedData);
    }
  });

  it('#getActionName should return expected action', async () => {
    // Arrange
    component.actions = Helper.fakeActions;
    let actualData = '';
    const testCases = [
      { action: 1, expectedData: 'Void' },
      { action: 4, expectedData: '' }
    ];

    // Action and Assert
    testCases.forEach(item => {
      actualData = component.getActionName(item.action);
      expect(actualData).toBe(item.expectedData);
    });
  });

  it('#checkVoided should return true', async () => {
    // Arrange
    // Action
    const actualData = component.checkVoided(Helper.fakeDetailRequestModelList);

    // Assert
    expect(actualData).toBe(true);
  });

  it('#checkVoided should return false', async () => {
    // Arrange
    // Action
    const actualData = component.checkVoided([Helper.fakeDetailRequestModelList[0]]);

    // Assert
    expect(actualData).toBeFalsy();
  });

  it('#checkCanEdit should return expected data', async () => {
    // Arrange
    let actualResult = true;
    const testCases = [
      { manageHostPermission: false, eventDate: '2020-02-15', moveBetDay: '2020-03-14', expectedData: false },
      { manageHostPermission: true, eventDate: '2020-06-15', moveBetDay: '2020-05-14', expectedData: true },
      { manageHostPermission: false, eventDate: '2020-05-14', moveBetDay: '2020-06-15', expectedData: false },
    ];

    // Action and Assert
    testCases.forEach(item => {
      component.permission.manageRequestHost = item.manageHostPermission;
      component.moveBetDay = new Date(item.moveBetDay);
      actualResult = component.checkCanEdit(new Date(item.eventDate), 1, null);
      expect(actualResult).toBe(item.expectedData);
    });
  });

  it('#checkCanVoid should return expected data', async () => {
    // Arrange
    let actualResult = true;
    const testCases = [
      { voidReadPermission: false, actionId: 0, eventDate: '2020-01-16', moveBetDay: '2020-01-17', expectedData: false },
      { voidReadPermission: true, actionId: 0, eventDate: '2020-01-18', moveBetDay: '2020-01-19', expectedData: false },
      { voidReadPermission: true, actionId: 1, eventDate: '2020-01-21', moveBetDay: '2020-01-20', expectedData: true },
      { voidReadPermission: true, actionId: 1, eventDate: '2020-01-14', moveBetDay: '2020-01-15', expectedData: false },
    ];

    // Action and Assert
    testCases.forEach(item => {
      component.permission.voidRead = item.voidReadPermission;
      component.moveBetDay = new Date(item.moveBetDay);
      actualResult = component.checkCanVoid(item.actionId, new Date(item.eventDate), 1, null);
      expect(actualResult).toBe(item.expectedData);
    });
  });

  it('#checkCanVoid should return false when is archived ticket', async () => {
    // Arrange
    component.permission.voidRead = true;
    component.moveBetDay = new Date('2020-01-17');

    // Action and Assert
    const actualResult = component.checkCanVoid(1, new Date('2020-01-21'), 17, new Date('2020-01-21'));
    expect(actualResult).toBe(false);
  });

  it('#pagingEvent should call #filterDisplayRequests', async () => {
    // Arrange
    component.filterDisplayRequests = jest.fn();

    // Action
    component.pagingEvent();

    // Assert
    expect(component.filterDisplayRequests).toHaveBeenCalledTimes(1);
  });

  it('#exportExcelEvent should emit when call #exportExcel', async () => {
    // Arrange
    component.exportExcelEvent.emit = jest.fn();

    // Action
    component.exportExcel();

    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#confirmCheckBy should call #confirm from modalService with expected param when isCheckedBy is true', async () => {
    const mockModalServiceConfirm = jest.fn();
    modalService.confirm = mockModalServiceConfirm;
    const confirmModal = {
      title: 'Check By Confirm',
      message: `${LABELS.CONFIRM_CHECK_BY}<strong>${Helper.fakeRequestModelList[0].requestId}</strong>?`
    };
    component.confirmCheckBy(Helper.fakeRequestModelList[0]);
    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    component.checkBy = jest.fn();
    mockModalServiceConfirm.mock.calls[0][1]();
    expect(component.checkBy).toHaveBeenCalledWith(Helper.fakeRequestModelList[0].requestId, true);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(Helper.fakeRequestModelList[0].isCheckedBy).toBe(false);
  });

  it('#confirmCheckBy should call #confirm from modalService with expected param when isCheckedBy is false', async () => {
    const mockModalServiceConfirm = jest.fn();
    modalService.confirm = mockModalServiceConfirm;
    const confirmModal = {
      title: 'UnCheck By Confirm',
      message: `${LABELS.CONFIRM_UNCHECK_BY}<strong>${Helper.fakeRequestModelList[1].requestId}</strong>?`
    };
    component.confirmCheckBy(Helper.fakeRequestModelList[1]);
    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    component.checkBy = jest.fn();
    mockModalServiceConfirm.mock.calls[0][1]();
    expect(component.checkBy).toHaveBeenCalledWith(Helper.fakeRequestModelList[1].requestId, false);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(Helper.fakeRequestModelList[1].isCheckedBy).toBe(true);
  });

  it('#checkBy should call #open from modalService with expected param when verifyHost is false', async () => {
    // Arrange
    const mockModalServiceOpen = jest.fn();
    modalService.open = mockModalServiceOpen;
    component.permission.verifyHost = false;
    const openModal = {
      title: 'Warning',
      message: 'You don\'t have permission!',
      type: ModalType.Warning
    };

    // Action
    await component.checkBy(12345, true);

    // Assert
    expect(mockModalServiceOpen).toHaveBeenCalledWith(openModal);
  });

  it('#checkBy should reload request list', async () => {
    // Arrange
    const checkByResult: Result<string> = {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true
    };
    appService.checkBy = jest.fn().mockImplementation(() => checkByResult);
    component.permission.verifyHost = true;
    component.reload.emit = jest.fn();

    // Action
    await component.checkBy(12345, true);

    //
    expect(component.reload.emit).toHaveBeenCalledWith(true);
  });

  it('#checkBy should call #open from modalService with expected param when data from api return error', async () => {
    // Arrange
    const checkByResult: Result<string> = {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: false
    };
    const mockModalServiceOpen = jest.fn();

    appService.checkBy = jest.fn().mockResolvedValue(checkByResult);
    modalService.open = mockModalServiceOpen;
    component.permission.verifyHost = true;
    const openModal = {
      title: 'Check By Result',
      message: 'error',
      type: ModalType.Error
    };

    // Action
    await component.checkBy(12345, true);

    // Assert
    expect(mockModalServiceOpen).toHaveBeenCalledWith(openModal);
  });

  it('#openRequestDetails should open tab for edit request', async () => {
    // Arrange
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('root-url', '/');
    document.body.appendChild(element);
    component.checkCanEdit = jest.fn().mockImplementation(() => true);
    window.open = jest.fn();

    // Action
    component.openRequestDetails(12345, new Date(), 1, null);

    // Assert
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('#openVoidRequest should open tab for void request', async () => {
    // Arrange
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('root-url', '/');
    document.body.appendChild(element);
    window.open = jest.fn();

    // Action
    component.openVoidRequest(12345);

    // Assert
    expect(window.open).toHaveBeenCalledTimes(1);
  });

  it('#isOnlyHasSingleTicket should return true', async () => {
    // Arrange
    // Action
    const actualResult = component.isShowOnlyTotalTickets(11);

    // Assert
    expect(actualResult).toBe(true);
  });

  it('#isVoidAction should return true', async () => {
    // Arrange
    // Action
    const actualResult = component.isVoidAction(5);

    // Assert
    expect(actualResult).toBe(true);
  });

  it('should display title and icon exportExcel when have request', () => {
    // Arrange
    component.paging.total = 10;
    fixture.detectChanges();

    // Act
    const title = fixture.nativeElement.querySelector(Helper.titleSelector);
    const exportExcelButton = fixture.nativeElement.querySelector(Helper.exportExcelButton);

    // Assert
    expect(title.textContent).toBe('Manage Request');
    expect(exportExcelButton).toBeTruthy();
  });

  it('should display "There is no data" when have not requests', () => {
    // Arrange
    component.displayedModels = [];
    fixture.detectChanges();

    // Act
    const noDataElement = fixture.nativeElement.querySelector(Helper.noDataSelector);

    // Assert
    expect(noDataElement.textContent).toBe('There is no data');
  });

  it('should display iconVoid for request', () => {
    // Arrange
    component.displayedModels = Helper.fakeRequestModelList;
    component.checkCanVoid = jest.fn().mockImplementation(() => true);
    fixture.detectChanges();

    // Act
    const iconVoidElements = fixture.nativeElement.querySelectorAll(Helper.iconVoidSelector);

    // Assert
    expect(iconVoidElements.length).toBe(2);
  });

  it('#isOnlyHasSingleTicket should return true when issueTypeId=13', async () => {
    // Arrange
    // Action
    const actualResult = component.isShowOnlyTotalTickets(13);

    // Assert
    expect(actualResult).toBeTruthy();
  });

  it('#updateRequestStatus should update data when is Danger Accepted', async () => {
    const fakeRequestModelList = _.cloneDeep(Helper.fakeRequestModelList);
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus[0].requestId = 1000;
    fakeRequestModelList[0].requestId = 1000;
    const detailRequestModel = new DetailRequestModel();
    detailRequestModel.matchId = Helper.matchId;
    fakeRequestModelList.forEach(x => {
      x.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
      x.details = [detailRequestModel];
    });
    component['isDifferenceByMatchId'] = jest.fn().mockImplementation(() => true);
    component['updateRequestStatus'](Helper.fakeRequestStatus, fakeRequestModelList);

    expect(component['isDifferenceByMatchId']).toHaveBeenCalledTimes(1);
  });

  it('#updateRequestStatus should update data when is not Danger Accepted', async () => {
    const fakeRequestModelList = _.cloneDeep(Helper.fakeRequestModelList);
    const detailRequestModel = new DetailRequestModel();
    detailRequestModel.matchId = Helper.matchId;
    fakeRequestModelList.forEach(x => {
      x.issueTypeId = Number(IssueTypeConstant.RED_CARD);
      x.details = [detailRequestModel];
    });
    component['isDifferenceByMatchId'] = jest.fn();
    component['updateRequestStatus'](Helper.fakeRequestStatus, fakeRequestModelList);

    expect(component['isDifferenceByMatchId']).toHaveBeenCalledTimes(1);
  });

  it('#updateRequestStatus should not update data when have not SimpleInfo', async () => {
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus.forEach(x => x.simpleInfo = null);
    component['isDifferenceByMatchId'] = jest.fn();
    component['updateRequestStatus'](fakeRequestStatus, Helper.fakeRequestModelList);

    expect(component['isDifferenceByMatchId']).toHaveBeenCalledTimes(0);
  });

  it('#updateRequestStatus should not update data when have not request', async () => {
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus.forEach(x => x.requestId = 10000);
    component['isDifferenceByMatchId'] = jest.fn();
    component['updateRequestStatus'](fakeRequestStatus, Helper.fakeRequestModelList);

    expect(component['isDifferenceByMatchId']).toHaveBeenCalledTimes(0);
  });

  it('#isSettlementHT should false', async () => {
    component.filterDisplayRequests = jest.fn();
    const actual = component.isSettlementHT('F');

    expect(actual).toBe(false);
  });

  it('#isSettlementHT should true', async () => {
    component.filterDisplayRequests = jest.fn();
    const actual = component.isSettlementHT('H');

    expect(actual).toBe(true);
  });

  it('#openRequestDetails should not call window.open', async () => {
    window.open = jest.fn();
    component.checkCanEdit = jest.fn().mockImplementation(() => false);
    component.openRequestDetails(null, null, null, null);

    expect(component.checkCanEdit).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(0);
  });

  it('#checkCanEdit should be return true when is ARCHIVED_TICKET ', async () => {
    // Arrange
    component.permission = new PermissionManage();
    component.permission.manageRequestHost = true;
    component['isCreatedDateLessThanToday'] = jest.fn().mockImplementation(() => true);

    // Action
    const actual = component.checkCanEdit(null, 17, null);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isDifferenceByMatchId should return false', async () => {
    // Arrange
    const request = { issueTypeId: 11, filterBy: 1 } as RequestModel;

    // Action
    const actual = component['isDifferenceByMatchId'](request);

    // Assert
    expect(actual).toBeFalsy();
  });

  it('#isDifferenceByMatchId should return true', async () => {
    // Arrange
    const dataTests = [{ issueTypeId: 1, filterBy: 1 }, { issueTypeId: 11, filterBy: null }] as RequestModel[];

    // Action & Assert
    dataTests.forEach(x => {
      const actual = component['isDifferenceByMatchId'](x);
      expect(actual).toBeTruthy();
    })
  });

  it('#copyRequestDescription should call #requestDescriptionService.copyToClipboard', async () => {
    // Arrange
    const mockCopyToClipboard = jest.fn();

    requestDescriptionService.copyToClipboard = mockCopyToClipboard;
    const requestModel = new RequestModel();
    requestModel.details = [new DetailRequestModel()];
    requestModel.details[0].matchId = 1;

    // Action
    await component.copyRequestDescriptionSingleMatch(requestModel, 1, 1);

    // Assert
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('#copyRequestDescription should call #requestDescriptionService.copyToClipboard and update prop of detailRequestModel', async () => {
    // Arrange
    const mockCopyToClipboard = jest.fn();
    requestDescriptionService.copyToClipboard = mockCopyToClipboard;

    const requestModel = new RequestModel();
    requestModel.details = [new DetailRequestModel()];
    requestModel.details[0].matchId = 1;
    const detailRequestModel = new DetailRequestModel();

    // Action
    await component.copyRequestDescriptionMultiMatches(requestModel, 1, detailRequestModel);

    // Assert
    expect(detailRequestModel.processingCopyDescriptionClass).toBe('fa fa-paste copy-request-info');
    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });

  it('#isCanCopyRequestDescription should return true when isDangerAccepted', async () => {
    // Arrange
    // Action
    const actual = component.isCanCopyRequestDescription(Number(IssueTypeConstant.DANGER_ACCEPTED));

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isCanCopyRequestDescription should return false when isEarlyKickOff', async () => {
    // Arrange
    // Action
    const actual = component.isCanCopyRequestDescription(Number(IssueTypeConstant.EARLY_KICK_OFF));

    // Assert
    expect(actual).toBeFalsy();
  });
});
