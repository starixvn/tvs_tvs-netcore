import { NgModule } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AutoRefreshComponent } from '../../utility/components/auto-refresh/auto-refresh.component';
import { BlockUiModule } from '../../utility/components/block-ui/block-ui.module';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { ModalService } from '../../utility/components/modal/modal.service';
import { LABELS } from '../../utility/constants/labels';
import { BalanceUp } from '../../utility/models/balance-up.model';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterModel } from './filter/filter.model';
import { GetRequestsQuery } from './models/get-requests.query';
import { PermissionManage } from './models/permission-manage.model';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestModel } from './request-list/request.model';

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

  static readonly fakeFilterModel: FilterModel = {
    requestId: 54321,
    matchId: 12345,
    ngbFromDate: new NgbDate(2020, 8, 4),
    ngbToDate: new NgbDate(2020, 8, 6),
    issueTypeId: '11',
    subIssueType: '27',
    status: '',
    isExcludeTest: true,
    createdBy: ''
  };
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
      MenuBarComponent,
      FilterComponent,
      RequestListComponent,
      AutoRefreshComponent
    ],
    imports: [
      BlockUiModule
    ],
    providers: [
      HttpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
      .mock(SignalRService, { initializeConnection: jest.fn() });
  });

  it('#ngOnInit should return expected permission and call #initDate', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(CommonService, { getPermissionManageRequest: jest.fn().mockImplementation(() => Helper.fakePermissionManageRequest) })
      .render();
    instance['initDate'] = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.permission).toEqual(Helper.fakePermissionManageRequest);
    expect(instance['initDate']).toHaveBeenCalledTimes(1);
  });

  it('#search should call #exportExcel or reload page when FromDate is before BUday', async () => {
    const mockModalServiceConfirm = jest.fn();
    const { instance } = await shallow
      .mock(ModalService, {
        confirm: mockModalServiceConfirm
      })
      .render();
    const confirmModal = {
      title: 'Message from webpage',
      message: LABELS.EXPORT_FROMDATE_BEFORE_BALANCEDAY
    };
    instance.filter.requestId = undefined;
    const url = 'http://localhost:60196/';
    Object.defineProperty(window, 'location', {
      value: new URL(url)
    });
    window.location.reload = jest.fn();
    instance.exportExcel = jest.fn();
    instance.initBalanceUp = jest.fn();
    instance.isDateBeforeBUDay = jest.fn().mockImplementation(() => true);
    await instance.search(false);
    expect(mockModalServiceConfirm).toHaveBeenCalledTimes(1);
    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);
    expect(mockModalServiceConfirm.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(mockModalServiceConfirm.mock.calls[0][2]).toBeInstanceOf(Function);

    mockModalServiceConfirm.mock.calls[0][1]();
    expect(instance.exportExcel).toHaveBeenCalledTimes(1);

    mockModalServiceConfirm.mock.calls[0][2]();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('#search should call #getRequest and #cacheFilterData', async () => {
    // Assert
    const { instance } = await shallow.render();
    instance.getRequest = jest.fn();
    instance.cacheFilterData = jest.fn();
    instance.initBalanceUp = jest.fn();

    // Action
    await instance.search(true);

    // Assert
    expect(instance.getRequest).toHaveBeenCalledTimes(1);
    expect(instance.cacheFilterData).toHaveBeenCalledTimes(1);
  });

  it('#getRequest should return expected requests when filter by matchId or requestId', async () => {
    // Assert
    const { instance } = await shallow
      .mock(AppService, {
        getRequests: jest.fn().mockImplementation(() => Helper.fakeRequestsModel)
      })
      .render();
    instance.isReloading = true;
    instance.filter = instance.cacheFilter = Helper.fakeFilterModel;

    // Action
    await instance.getRequest();

    // Assert
    expect(instance.requests).toEqual(Helper.fakeRequestsModel);
    expect(instance.isBlock).toBe(false);
  });

  it('#getRequest should return expected requests when filter by date', async () => {
    // Assert
    const { instance } = await shallow
      .mock(AppService, {
        getRequests: jest.fn().mockImplementation(() => Helper.fakeRequestsModel)
      })
      .render();
    instance.isReloading = false;
    instance.filter.issueTypeId = instance.cacheFilter.issueTypeId = '1,2,3';
    instance.filter.ngbFromDate = instance.filter.ngbToDate = new NgbDate(2020, 8, 4);

    // Action
    await instance.getRequest();

    // Assert
    expect(instance.requests).toEqual(Helper.fakeRequestsModel);
    expect(instance.isBlock).toBe(false);
  });

  it('#exportExcel should call exportRequest service with expected param', async () => {
    // Arrange
    const mockExportExcel = jest.fn();
    const { instance } = await shallow
      .mock(AppService, { exportRequest: mockExportExcel })
      .render();
    const query = new GetRequestsQuery();
    instance['getQuery'] = jest.fn().mockImplementation(() => query);

    // Action
    await instance.exportExcel();

    // Assert
    expect(mockExportExcel).toHaveBeenCalledWith(query);
    expect(mockExportExcel).toHaveBeenCalledTimes(1);
  });

  it('#cacheFilterData should return expected cache data', async () => {
    // Arrange
    const { instance, findComponent } = await shallow.render();
    instance.filter = Helper.fakeFilterModel;
    const filterComponent = findComponent(FilterComponent);
    filterComponent.subTypeSelectList = [
      { value: '27', name: 'Abnormal' },
      { value: '28', name: 'Group Betting' }
    ];
    filterComponent.multipleSelectSubTypeModel = ['27,28'];
    filterComponent.filterByMatch = true;
    filterComponent.filterByValue = 'MatchId';

    // Action
    instance.cacheFilterData();

    // Assert
    expect(instance.cacheFilter).toEqual(Helper.fakeFilterModel);
    expect(instance.cacheSubTypeSelectList).toEqual(filterComponent.subTypeSelectList);
    expect(instance.cacheMultipleSelectSubTypeModel).toEqual(filterComponent.multipleSelectSubTypeModel);
    expect(instance.cacheFilterByValue).toEqual(filterComponent.filterByValue);
    expect(instance.cacheFilterByMatch).toEqual(filterComponent.filterByMatch);
  });

  it('AppComponent should init match snapshot', async () => {
    // Arrange
    const { fixture, findComponent } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(findComponent(FilterComponent)).toHaveFoundOne();
    expect(findComponent(RequestListComponent)).toHaveFoundOne();
  });

  it('when FilterComponent search event emit, #search should be called with param is false', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.search = jest.fn();
    const filterComponent = findComponent(FilterComponent);
    filterComponent.search.emit();

    expect(instance.search).toHaveBeenCalledTimes(1);
    expect(instance.search).toHaveBeenCalledWith(false);
  });

  it('when RequestListComponent exportExcelEvent event emit, #exportExcel should be called', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.exportExcel = jest.fn();
    const requestListComponent = findComponent(RequestListComponent);
    requestListComponent.exportExcelEvent.emit();

    expect(instance.exportExcel).toHaveBeenCalledTimes(1);
  });

  it('when RequestListComponent reload event emit, #search should be called with param is true', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.search = jest.fn();
    const requestListComponent = findComponent(RequestListComponent);
    requestListComponent.reload.emit();

    expect(instance.search).toHaveBeenCalledTimes(1);
    expect(instance.search).toHaveBeenCalledWith(true);
  });

  it('#initBalanceUp should be set data buDate', async () => {
    // Arrange
    const mockBalanceUp = jest.fn().mockImplementation(() => Helper.fakeBalanceUp);
    const { instance } = await shallow
      .mock(CommonService, { getBalanceUp: mockBalanceUp })
      .render();

    // Action
    await instance.initBalanceUp();

    // Assert
    expect(instance.bUDay).toEqual(Helper.fakeBalanceUp.balanceUpDay);
    expect(instance.moveBetDay).toEqual(new Date(Helper.fakeBalanceUp.moveBetsDay));
  });
});
