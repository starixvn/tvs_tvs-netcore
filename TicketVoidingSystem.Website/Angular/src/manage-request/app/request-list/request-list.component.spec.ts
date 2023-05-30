import { EventEmitter, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import '@angular/localize/init';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { Shallow } from 'shallow-render';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../utility/constants/labels';
import { IssueTypesModel } from '../../../utility/models/issue-type.model';
import { Result } from '../../../utility/models/result';
import { Selection } from '../../../utility/models/selection.model';
import { RequestSimpleInfo, RequestStatus } from '../../../utility/models/signal-r.model';
import { ModalType } from '../../../utility/modules/modal/modal';
import { ModalService } from '../../../utility/modules/modal/modal.service';
import { PagingComponent } from '../../../utility/modules/paging/paging/paging.component';
import { PipeModule } from '../../../utility/modules/pipes/pipe.module';
import { CommonService } from '../../../utility/services/common.service';
import { HttpService } from '../../../utility/services/http.service';
import { AppService } from '../app.service';
import { PermissionManage } from '../models/permission-manage.model';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { RequestListComponent } from './request-list.component';
import { DetailRequestModel, RequestModel } from './request.model';

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
  static readonly fakeDetailRequestModelList: DetailRequestModel[] = [
    {
      subIssueTypeId: 1,
      matchId: Helper.matchId,
      description: '',
      totalVoidedSingle: 0,
      totalVoidedParlay: 0,
      settlementStatus: '',
      totalCancelCashOut: 0
    },
    {
      subIssueTypeId: 1,
      matchId: 99001684,
      description: '',
      totalVoidedSingle: 1,
      totalVoidedParlay: 1,
      settlementStatus: '',
      totalCancelCashOut: 0
    },
  ];

  static readonly fakeRequestModelList: RequestModel[] = [
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
  ];
  static readonly fakePermissionManage: PermissionManage = {
    manageRequestHost: true,
    verifyRead: true,
    verifyHost: true,
    voidRead: true,
    manageRequestSettledTicketsHost: true,
    manageRequestUnsettledTicketsHost: true,
    isReadMarkTickets: true
  };
  static readonly fakeRequestSimpleInfo: RequestSimpleInfo = {
    LastPerformedBy: 'starix',
    TotalVoidedSingle: 12,
    TotalVoidedParlay: 1,
    MatchId: Helper.matchId,
    TotalCancelCashOut: 0
  };

  static readonly fakeRequestStatus: RequestStatus[] = [{
    RequestId: 1111,
    Status: 'Running',
    SimpleInfo: Helper.fakeRequestSimpleInfo,
  }];
}

describe('RequestListComponent', () => {
  @NgModule({
    declarations: [
      TicketListComponent,
      PagingComponent
    ],
    imports: [
      FormsModule,
      PipeModule,
      NgbModule,
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<RequestListComponent>;

  beforeEach(() => {
    shallow = new Shallow(RequestListComponent, AppModuleTest)
      .dontMock(NgbModule);
  });

  it('#ngOnInit should call #getActions and #getIssueTypes', async () => {
    // Arrange
    const mockGetActions = jest.fn();
    const mockGetIssueTypes = jest.fn();
    const { instance } = await shallow
      .mock(CommonService, {
        getActions: mockGetActions,
        getIssueTypes: mockGetIssueTypes
      })
      .render();
    instance.requestStatusChangeEvent = new EventEmitter<RequestStatus[]>();
    instance.requestStatusChangeEvent.emit = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(mockGetActions).toHaveBeenCalled();
    expect(mockGetIssueTypes).toHaveBeenCalled();
  });

  it('#ngOnChanges should return expected displayedModels', async () => {
    // Arrange
    const { instance } = await shallow.render('<request-list [models]="requests"></request-list>', {
      bind: {
        requests: Helper.fakeRequestModelList
      }
    });
    const changes = {
      'models': new SimpleChange(null, Helper.fakeRequestModelList, true)
    };

    // Action
    instance.ngOnChanges(changes);

    // Assert
    expect(instance.paging.total).toBe(2);
    expect(instance.displayedModels.length).toBe(2);
  });

  it('#ngOnChanges should not call @filterDisplayRequests', async () => {
    // Arrange
    const { instance } = await shallow.render('<request-list [models]="requests"></request-list>', {
      bind: {
        requests: Helper.fakeRequestModelList
      }
    });
    instance.filterDisplayRequests = jest.fn();

    // Action
    instance.ngOnChanges({});

    // Assert
    expect(instance.filterDisplayRequests).toHaveBeenCalledTimes(0);
  });

  it('#getIssueTypeName should return empty string with param is 0', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actualData = instance.getIssueTypeName(0);

    // Assert
    expect(actualData).toBe('');
  });

  it('#getIssueTypeName should return expected IssueType', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.issueTypesModel = Helper.fakeIssueTypesModel;
    let actualData = '';
    const testCases = [
      { subIssueTypeId: 24, expectedData: '' },
      { subIssueTypeId: 11, expectedData: 'Abnormal' },
      { subIssueTypeId: 1, expectedData: 'Danger Accepted - Goal' }
    ];

    // Action and Assert
    for (const item of testCases) {
      actualData = instance.getIssueTypeName(item.subIssueTypeId);
      expect(actualData).toBe(item.expectedData);
    }
  });

  it('#getActionName should return expected action', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.actions = Helper.fakeActions;
    let actualData = '';
    const testCases = [
      { action: 1, expectedData: 'Void' },
      { action: 4, expectedData: '' }
    ];

    // Action and Assert
    testCases.forEach(item => {
      actualData = instance.getActionName(item.action);
      expect(actualData).toBe(item.expectedData);
    });
  });

  it('#checkVoided should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actualData = instance.checkVoided(Helper.fakeDetailRequestModelList);

    // Assert
    expect(actualData).toBe(true);
  });

  it('#checkCanEdit should return expected data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    const testCases = [
      { manageHostPermisson: false, eventDate: '2020-02-15', moveBetDay: '2020-03-14', expectedData: false },
      { manageHostPermisson: true, eventDate: '2020-06-15', moveBetDay: '2020-05-14', expectedData: true },
      { manageHostPermisson: false, eventDate: '2020-05-14', moveBetDay: '2020-06-15', expectedData: false },
    ];

    // Action and Assert
    testCases.forEach(item => {
      instance.permission.manageRequestHost = item.manageHostPermisson;
      instance.moveBetDay = new Date(item.moveBetDay);
      actualResult = instance.checkCanEdit(new Date(item.eventDate), 1, null);
      expect(actualResult).toBe(item.expectedData);
    });
  });

  it('#checkCanVoid should return expected data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    let actualResult = true;
    const testCases = [
      { voidReadPermisson: false, actionId: 0, eventDate: '2020-01-16', moveBetDay: '2020-01-17', expectedData: false },
      { voidReadPermisson: true, actionId: 0, eventDate: '2020-01-18', moveBetDay: '2020-01-19', expectedData: false },
      { voidReadPermisson: true, actionId: 1, eventDate: '2020-01-21', moveBetDay: '2020-01-20', expectedData: true },
      { voidReadPermisson: true, actionId: 1, eventDate: '2020-01-14', moveBetDay: '2020-01-15', expectedData: false },
    ];

    // Action and Assert
    testCases.forEach(item => {
      instance.permission.voidRead = item.voidReadPermisson;
      instance.moveBetDay = new Date(item.moveBetDay);
      actualResult = instance.checkCanVoid(item.actionId, new Date(item.eventDate), 1, null);
      expect(actualResult).toBe(item.expectedData);
    });
  });

  it('#checkCanVoid should return false when is archived ticket', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.permission.voidRead = true;
    instance.moveBetDay = new Date('2020-01-17');

    // Action and Assert
    const actualResult = instance.checkCanVoid(1, new Date('2020-01-21'), 17, new Date('2020-01-21'));
    expect(actualResult).toBe(false);
  });

  it('#pagingEvent should call #filterDisplayRequests', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.filterDisplayRequests = jest.fn();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.filterDisplayRequests).toHaveBeenCalledTimes(1);
  });

  it('#exportExcelEvent should emit when call #exportExcel', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.exportExcelEvent.emit = jest.fn();

    // Action
    instance.exportExcel();

    // Assert
    expect(instance.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#showTickets should return expected data', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const permissionTestCases = [
      { voidRead: true, verifyRead: false },
      { voidRead: false, verifyRead: true }
    ];
    const requestId = 12345;
    const matchId = 123456789;

    // Action and Assert
    permissionTestCases.forEach(item => {
      instance.permission.voidRead = item.voidRead;
      instance.permission.verifyRead = item.verifyRead;
      instance.showTickets(requestId, matchId);
      expect(instance.ticketListModal).toEqual({ open: true, minimize: false, requestId, matchId });
    });
  });

  it('#confirmCheckBy should call #confirm from modalService with expected param when isCheckedBy is true', async () => {
    const mockModalServiceConfirm = jest.fn();
    const { instance } = await shallow
      .mock(ModalService, {
        confirm: mockModalServiceConfirm
      })
      .render();
    const confirmModal = {
      title: 'Check By Confirm',
      message: `${LABELS.CONFIRM_CHECK_BY}<strong>${Helper.fakeRequestModelList[0].requestId}</strong>?`
    };
    instance.confirmCheckBy(Helper.fakeRequestModelList[0]);
    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    instance.checkBy = jest.fn();
    mockModalServiceConfirm.mock.calls[0][1]();
    expect(instance.checkBy).toHaveBeenCalledWith(Helper.fakeRequestModelList[0].requestId, true);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(Helper.fakeRequestModelList[0].isCheckedBy).toBe(false);
  });

  it('#confirmCheckBy should call #confirm from modalService with expected param when isCheckedBy is false', async () => {
    const mockModalServiceConfirm = jest.fn();
    const { instance } = await shallow
      .mock(ModalService, {
        confirm: mockModalServiceConfirm
      })
      .render();
    const confirmModal = {
      title: 'UnCheck By Confirm',
      message: `${LABELS.CONFIRM_UNCHECK_BY}<strong>${Helper.fakeRequestModelList[1].requestId}</strong>?`
    };
    instance.confirmCheckBy(Helper.fakeRequestModelList[1]);
    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    instance.checkBy = jest.fn();
    mockModalServiceConfirm.mock.calls[0][1]();
    expect(instance.checkBy).toHaveBeenCalledWith(Helper.fakeRequestModelList[1].requestId, false);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(Helper.fakeRequestModelList[1].isCheckedBy).toBe(true);
  });

  it('#checkBy should call #open from modalService with expected param when verifyHost is false', async () => {
    // Arrange
    const mockModalServiceOpen = jest.fn();
    const { instance } = await shallow
      .mock(ModalService, {
        open: mockModalServiceOpen
      })
      .render();
    instance.permission.verifyHost = false;
    const openModal = {
      title: 'Warning',
      message: 'You don\'t have permission!',
      type: ModalType.Warning
    };

    // Action
    await instance.checkBy(12345, true);

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
    const { instance } = await shallow
      .mock(AppService, {
        checkBy: jest.fn().mockImplementation(() => checkByResult)
      })
      .render();
    instance.permission.verifyHost = true;
    instance.reload.emit = jest.fn();

    // Action
    await instance.checkBy(12345, true);

    //
    expect(instance.reload.emit).toHaveBeenCalledWith(true);
  });

  it('#checkBy should call #open from modalService with expected param when data from api return error', async () => {
    // Arrange
    const checkByResult: Result<string> = {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: false
    };
    const mockModalServiceOpen = jest.fn();
    const { instance } = await shallow
      .mock(AppService, {
        checkBy: jest.fn().mockImplementation(() => checkByResult)
      })
      .mock(ModalService, {
        open: mockModalServiceOpen
      })
      .render();
    instance.permission.verifyHost = true;
    const openModal = {
      title: 'Check By Result',
      message: 'error',
      type: ModalType.Error
    };

    // Action
    await instance.checkBy(12345, true);

    // Assert
    expect(mockModalServiceOpen).toHaveBeenCalledWith(openModal);
  });

  it('#openRequestDetails should open tab for edit request', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.checkCanEdit = jest.fn().mockImplementation(() => true);
    window.open = jest.fn();

    // Action
    instance.openRequestDetails(12345, new Date(), 1, null);

    // Assert
    expect(window.open).toHaveBeenCalledWith('TicketVoidingSystem/ManageRequest/Details/12345', '_blank');
  });

  it('#openVoidRequest should open tab for void request', async () => {
    // Arrange
    const { instance } = await shallow.render();
    window.open = jest.fn();

    // Action
    instance.openVoidRequest(12345);

    // Assert
    expect(window.open).toHaveBeenCalledWith('TicketVoidingSystem/VoidRequest/Index/12345', '_blank');
  });

  it('#isOnlyHasSingleTicket should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actualResult = instance.isShowOnlyTotalTickets(11);

    // Assert
    expect(actualResult).toBe(true);
  });

  it('#isVoidAction should return true', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actualResult = instance.isVoidAction(5);

    // Assert
    expect(actualResult).toBe(true);
  });

  it('should display title and icon exportexcel when have request', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.paging.total = 10;
    fixture.detectChanges();

    // Assert
    expect(find(Helper.titleSelector).nativeElement.textContent).toBe('Manage Request');
    expect(find(Helper.exportExcelButton)).toHaveFoundOne();
  });

  it('should display "There is no data" when have not requests', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.displayedModels = [];
    fixture.detectChanges();

    // Assert
    expect(find(Helper.noDataSelector).nativeElement.textContent).toBe('There is no data');
  });

  it('when PagingComponent modelChange event emit, #pagingEvent should be called', async () => {
    // Arrange
    const { fixture, findComponent, instance } = await shallow.render();
    fixture.detectChanges();
    instance.pagingEvent = jest.fn();
    const pagingComponent = findComponent(PagingComponent);
    pagingComponent.modelChange.emit();

    // Assert
    expect(instance.pagingEvent).toHaveBeenCalledTimes(1);
  });

  it('should display iconVoid for request', async () => {
    // Arrange
    const { fixture, find, instance } = await shallow.render();
    instance.displayedModels = Helper.fakeRequestModelList;
    instance.checkCanVoid = jest.fn().mockImplementation(() => true);
    fixture.detectChanges();

    // Assert
    expect(find(Helper.iconVoidSelector)).toHaveFound(2);
  });

  it('#isOnlyHasSingleTicket should return true when issueTypeId=13', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actualResult = instance.isShowOnlyTotalTickets(13);

    // Assert
    expect(actualResult).toBeTruthy();
  });

  it('#updateRequestStatus should update data when is Danger Accepted', async () => {
    const fakeRequestModelList = _.cloneDeep(Helper.fakeRequestModelList);
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus[0].RequestId = 1000;
    fakeRequestModelList[0].requestId = 1000;
    const detailRequestModel = new DetailRequestModel();
    detailRequestModel.matchId = Helper.matchId;
    fakeRequestModelList.forEach(x => {
      x.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
      x.details = [detailRequestModel];
    });
    const { instance } = await shallow.render();
    instance['isIssueTypeHaveMultipleMatches'] = jest.fn().mockImplementation(() => true);
    instance['updateRequestStatus'](Helper.fakeRequestStatus, fakeRequestModelList);

    expect(instance['isIssueTypeHaveMultipleMatches']).toHaveBeenCalledTimes(1);
  });

  it('#updateRequestStatus should update data when is not Danger Accepted', async () => {
    const fakeRequestModelList = _.cloneDeep(Helper.fakeRequestModelList);
    const detailRequestModel = new DetailRequestModel();
    detailRequestModel.matchId = Helper.matchId;
    fakeRequestModelList.forEach(x => {
      x.issueTypeId = Number(IssueTypeConstant.RED_CARD);
      x.details = [detailRequestModel];
    });
    const { instance } = await shallow.render();
    instance['isIssueTypeHaveMultipleMatches'] = jest.fn();
    instance['updateRequestStatus'](Helper.fakeRequestStatus, fakeRequestModelList);

    expect(instance['isIssueTypeHaveMultipleMatches']).toHaveBeenCalledTimes(1);
  });

  it('#updateRequestStatus should not update data when have not SimpleInfo', async () => {
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus.forEach(x => x.SimpleInfo = null);
    const { instance } = await shallow.render();
    instance['isIssueTypeHaveMultipleMatches'] = jest.fn();
    instance['updateRequestStatus'](fakeRequestStatus, Helper.fakeRequestModelList);

    expect(instance['isIssueTypeHaveMultipleMatches']).toHaveBeenCalledTimes(0);
  });

  it('#updateRequestStatus should not update data when have not request', async () => {
    const fakeRequestStatus = _.cloneDeep(Helper.fakeRequestStatus);
    fakeRequestStatus.forEach(x => x.RequestId = 10000);
    const { instance } = await shallow.render();
    instance['isIssueTypeHaveMultipleMatches'] = jest.fn();
    instance['updateRequestStatus'](fakeRequestStatus, Helper.fakeRequestModelList);

    expect(instance['isIssueTypeHaveMultipleMatches']).toHaveBeenCalledTimes(0);
  });

  it('#isSettlementHT should false', async () => {
    const { instance } = await shallow.render();
    instance.filterDisplayRequests = jest.fn();
    const actual = instance.isSettlementHT('F');

    expect(actual).toBe(false);
  });

  it('#isSettlementHT should true', async () => {
    const { instance } = await shallow.render();
    instance.filterDisplayRequests = jest.fn();
    const actual = instance.isSettlementHT('H');

    expect(actual).toBe(true);
  });

  it('#showTickets should not update ticketListModal', async () => {
    const { instance } = await shallow.render();
    instance.ticketListModal = { open: false, minimize: false, requestId: 1, matchId: 1 };
    instance.permission = new PermissionManage();
    instance.permission.voidRead = false;
    instance.permission.verifyRead = false;
    instance.showTickets(2, 2);

    expect(instance.ticketListModal.open).toBe(false);
    expect(instance.ticketListModal.requestId).toBe(1);
    expect(instance.ticketListModal.matchId).toBe(1);
    expect(instance.ticketListModal.minimize).toBe(false);
  });

  it('#openRequestDetails should not call window.open', async () => {
    const { instance } = await shallow.render();
    window.open = jest.fn();
    instance.checkCanEdit = jest.fn().mockImplementation(() => false);
    instance.openRequestDetails(null, null, null, null);

    expect(instance.checkCanEdit).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledTimes(0);
  });

  it('#checkCanEdit should be return true when is ARCHIVED_TICKET ', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.permission = new PermissionManage();
    instance.permission.manageRequestHost = true;
    instance['isCreatedDateLessThanToday'] = jest.fn().mockImplementation(() => true);

    // Action
    const actual = instance.checkCanEdit(null, 17, null);

    // Assert
    expect(actual).toBeTruthy();
  });

  it('#isIssueTypeHaveMultipleMatches should return false', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    const actual = instance['isIssueTypeHaveMultipleMatches'](0);

    // Assert
    expect(actual).toBeFalsy();
  });

  it('#copyRequestInfo should call #copyRequestInfo', async () => {
    // Arrange
    const mockCopyRequestInfo = jest.fn();
    const { instance } = await shallow
    .mock(AppService, { copyRequestInfo: mockCopyRequestInfo })
    .mock(ClipboardService, { copyFromContent: jest.fn() })
    .render();
    window.alert = jest.fn();

    // Action
    await instance.copyRequestInfo(1212, 1212);

    // Assert
    expect(mockCopyRequestInfo).toHaveBeenCalledTimes(1);
  });
});
