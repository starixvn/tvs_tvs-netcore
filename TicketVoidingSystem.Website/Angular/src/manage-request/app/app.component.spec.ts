import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../utility/components/modal/modal.service';
import { LABELS } from '../../utility/constants/labels';
import { BalanceUp } from '../../utility/models/balance-up.model';
import { CommonService } from '../../utility/services/common.service';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { GetRequestsQuery } from './models/get-requests.query';
import { PermissionManage } from './models/permission-manage.model';
import { RequestModel } from './request-list/request.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { ChangeDetectorRef } from '@angular/core';
import { RequestDescriptionService } from './request-list/services/request-description.service';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static readonly fakePermissionManageRequest: PermissionManage = {
    manageRequestHost: true,
    verifyRead: true,
    verifyHost: true,
    voidRead: true,
    isReadMarkTickets: true
  };

  static readonly fakeBalanceUp: BalanceUp = {
    balanceUpDay: new Date('2020-01-16'),
    moveBetsDay: new Date('2020-01-26')
  };

  static readonly fakeNowDate = new Date('2020-08-04');

  static readonly fakeRequestsModel: RequestModel[] = [
    {
      requestId: 12345,
      issueTypeId: 11,
      actionId: 5,
      createdBy: '',
      createdDate: new Date(),
      mistakenBy: '',
      decidedBy: '',
      lastPerformedBy: '',
      checkedBy: '',
      isCheckedBy: false,
      eventDate: new Date(),
      status: 'Completed',
      details: []
    },
    {
      requestId: 56789,
      issueTypeId: 11,
      actionId: 5,
      createdBy: '',
      createdDate: new Date(),
      mistakenBy: '',
      decidedBy: '',
      lastPerformedBy: '',
      checkedBy: '',
      isCheckedBy: false,
      eventDate: new Date(),
      status: 'Completed',
      details: []
    },
    {
      requestId: 52759,
      issueTypeId: 1,
      actionId: 1,
      createdBy: '',
      createdDate: new Date(),
      mistakenBy: '',
      decidedBy: '',
      lastPerformedBy: '',
      checkedBy: '',
      isCheckedBy: false,
      eventDate: new Date(),
      status: 'Completed',
      details: []
    }
  ];

  static readonly fakeFilterModel = {
    requestId: 54321,
    matchId: 12345,
    ngbFromDate: new NgbDate(2020, 8, 4),
    ngbToDate: new NgbDate(2020, 8, 6),
    issueTypeId: '11',
    subIssueType: '27',
    status: '',
    isExcludeTest: true,
    createdBy: '',
    isDisplayMissingInfo: false,
    productTypeIds: ''
  } as FilterModel;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let modalService: ModalService;
  let commonService: CommonService;
  let appService: AppService;
  let signalRService: SignalRService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule, FilterComponent
      ],
      providers: [
        ModalService, CommonService, AppService, SignalRService, RequestDescriptionService, ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    modalService = fixture.debugElement.injector.get(ModalService);
    commonService = fixture.debugElement.injector.get(CommonService);
    appService = fixture.debugElement.injector.get(AppService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    component = fixture.componentInstance;
    component.filterComponent = {} as FilterComponent;
  });

  it('#ngOnInit should return expected permission and call #initDate', async () => {
    // Arrange
    component['initDate'] = jest.fn();
    commonService.getPermissionManageRequest = jest.fn().mockImplementation(() => Helper.fakePermissionManageRequest);
    signalRService.initializeConnection = jest.fn();

    // Action
    await component.ngOnInit();

    // Assert
    expect(component.permission).toEqual(Helper.fakePermissionManageRequest);
    expect(component['initDate']).toHaveBeenCalledTimes(1);
  });

  it('#search should call #exportExcel or reload page when FromDate is before BUday', async () => {
    const mockModalServiceConfirm = jest.fn();
    modalService.confirm = mockModalServiceConfirm;
    const confirmModal = {
      title: 'Message from webpage',
      message: LABELS.EXPORT_FROMDATE_BEFORE_BALANCEDAY
    };
    component.filterComponent.subTypeSelectList = [];
    component.filter.requestId = undefined;
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.reload = jest.fn();
    component.exportExcel = jest.fn();
    component.initBalanceUp = jest.fn();
    component.isDateBeforeBUDay = jest.fn().mockImplementation(() => true);

    await component.search(false);

    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    mockModalServiceConfirm.mock.calls[0][1]();
    expect(component.exportExcel).toHaveBeenCalledTimes(1);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#search should call #getRequest and #cacheFilterData', async () => {
    // Assert
    component.getRequest = jest.fn();
    component.cacheFilterData = jest.fn();
    component.initBalanceUp = jest.fn();

    // Action
    await component.search(true);

    // Assert
    expect(component.getRequest).toHaveBeenCalledTimes(1);
    expect(component.cacheFilterData).toHaveBeenCalledTimes(1);
  });

  it('#getRequest should return expected requests when filter by matchId or requestId', async () => {
    // Assert
    appService.getRequests = jest.fn().mockImplementation(() => Helper.fakeRequestsModel);
    component.isReloading = true;
    component.filter = component.cacheFilter = Helper.fakeFilterModel;

    // Action
    await component.getRequest();

    // Assert
    expect(component.requests).toEqual(Helper.fakeRequestsModel);
    expect(component.isBlock).toBe(false);
  });

  it('#getRequest should return expected requests when filter by date', async () => {
    // Assert
    appService.getRequests = jest.fn().mockImplementation(() => Helper.fakeRequestsModel)
    component.isReloading = false;
    component.filter.issueTypeId = component.cacheFilter.issueTypeId = '1,2,3';
    component.filter.ngbFromDate = component.filter.ngbToDate = new NgbDate(2020, 8, 4);

    // Action
    await component.getRequest();

    // Assert
    expect(component.requests).toEqual(Helper.fakeRequestsModel);
    expect(component.isBlock).toBe(false);
  });

  it('#exportExcel should call exportRequest service with expected param', async () => {
    // Arrange
    const mockExportExcel = jest.fn();
    appService.exportRequest = mockExportExcel;
    const query = new GetRequestsQuery();
    component['getQuery'] = jest.fn().mockImplementation(() => query);
    component['timeoutEvent'] = jest.fn();

    // Action
    await component.exportExcel();

    // Assert
    expect(mockExportExcel).toHaveBeenCalledTimes(1);
  });

  it('#cacheFilterData should return expected cache data', async () => {
    // Arrange
    component.filter = Helper.fakeFilterModel;
    component.filterComponent.subTypeSelectList = [
      { value: '27', name: 'Abnormal' },
      { value: '28', name: 'Group Betting' }
    ];
    component.filterComponent.multipleSelectSubTypeModel = ['27,28'];
    component.filterComponent.filterByMatch = true;
    component.filterComponent.filterByValue = 'MatchId';

    // Action
    component.cacheFilterData();

    // Assert
    expect(component.cacheFilter).toEqual(Helper.fakeFilterModel);
    expect(component.cacheSubTypeSelectList).toEqual(component.filterComponent.subTypeSelectList);
    expect(component.cacheMultipleSelectSubTypeModel).toEqual(component.filterComponent.multipleSelectSubTypeModel);
    expect(component.cacheFilterByValue).toEqual(component.filterComponent.filterByValue);
    expect(component.cacheFilterByMatch).toEqual(component.filterComponent.filterByMatch);
  });

  it('#initBalanceUp should be set data buDate', async () => {
    // Arrange
    const mockBalanceUp = jest.fn().mockImplementation(() => Helper.fakeBalanceUp);
    commonService.getBalanceUp = mockBalanceUp;

    // Action
    await component.initBalanceUp();

    // Assert
    expect(component.bUDay).toEqual(Helper.fakeBalanceUp.balanceUpDay);
    expect(component.moveBetDay).toEqual(new Date(Helper.fakeBalanceUp.moveBetsDay));
  });
});
