import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { GetPoolHouseTicketQuery, PoolHouseTicketViewModel, PoolHouseTicketsModel } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.model';
import { PoolHouseTicketModule } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.module';
import { TicketsModel } from '../../../../../utility/components/pool-house-ticket/tickets/tickets.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { FilterWithHdpComponent } from '../filter-with-hdp/filter-with-hdp.component';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { EventWrongHdpService } from '../services/event-wrong-hdp.service';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { LogInfoWrongHdpComponent } from './log-info-wrong-hdp.component';

class Helper {
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
  static readonly fakeLogInfoDetail: LogInfoDetail =
  {
    matchId: 12345,
    liveScores: '0 - 0',
    voidFromTime: new Date(Helper.fakeFromDateTime),
    voidToTime: new Date(Helper.fakeToDateTime),
    singleCount: 1,
    mainParlayCount: 1,
    cashOutCount: 3,
    settleCount: 1,
    instantlySettleCount: 2,
    scoreNormalTicket: '',
    scoreOfMatch: '',
    cancelCashOutCount: 1
  } as LogInfoDetail;
  static readonly fakeFilterWithHdpModel: FilterWithHdpModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    homeFavorite: '2',
    awayFavorite: '',
    actualMarket: '1',
    hdpValue: '',
    liveIndicator: 0
  };
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: ''
  };

  static readonly fakeFilterModel: FilterModel = {
    sportType: 1,
    eventDate: '',
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  };
}

describe('LogInfoWrongHdpComponent', () => {
  @NgModule({
    declarations: [
      FilterWithHdpComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
      PipeModule,
      PoolHouseTicketModule
    ],
    providers: [
      ValidationService,
      LogInfoService,
      ModalService,
      AddRequestStore,
      AddRequestApiService,
      EventWrongHdpService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoWrongHdpComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoWrongHdpComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('LogInfoWrongHdpComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('#ngOnInit should update isShowValidation True when edit is True', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        isEdit: true,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });

    instance.ngOnInit();

    expect(instance.isShowValidation).toBeTruthy();
  });

  it('refreshLogInfo should call #getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.filterWithHdpComponent = new FilterWithHdpComponent(null, null);
    instance.filterWithHdpComponent.isValid = jest.fn().mockImplementation(() => true);
    instance.clearDataValidation = jest.fn();
    instance['refreshLogInfo']();

    expect(mockGetLogInfo).toBeCalledTimes(1);
    expect(instance.clearDataValidation).toBeCalledTimes(1);
    expect(instance.filterWithHdpComponent.isValid).toBeCalledTimes(1);
  });

  it('refreshLogInfo should not call #getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.filterWithHdpComponent = new FilterWithHdpComponent(null, null);
    instance.filterWithHdpComponent.isValid = jest.fn().mockImplementation(() => false);
    instance.clearDataValidation = jest.fn();
    instance['refreshLogInfo']();

    expect(mockGetLogInfo).toBeCalledTimes(0);
    expect(instance.clearDataValidation).toBeCalledTimes(1);
    expect(instance.filterWithHdpComponent.isValid).toBeCalledTimes(1);
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance.displayFullDateTimeFormat(new Date(Helper.fakeFromDateTime));

    expect(actual).toBe('2020/10/08 09:44:46.361 PM');
  });

  it('handleDeleteEvent should emit deleteEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.deleteEvent.emit = jest.fn();
    instance.handleDeleteEvent(123);

    expect(instance.deleteEvent.emit).toBeCalledTimes(1);
  });

  it('clearDataValidation should update to null', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.clearDataValidation();

    expect(instance.logInfo.logInfoDetail).toBeNull();
    expect(instance.logInfo.messageValidationLogInfo ).toBeNull();
  });

  it('showValidationDetail should update isShowValidation true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.showValidationDetail();

    expect(instance.isShowValidation).toBeTruthy();
  });

  it('emitSearchEvent should emit searchTicketEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.searchTicketEvent.emit = jest.fn();
    instance.emitSearchEvent();

    expect(instance.searchTicketEvent.emit).toBeCalledTimes(1);
  });

  it('isShowCountInfo should return true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['isShowCashOutCount'] = jest.fn().mockImplementation(() => true);
    instance['isShowSettleCount'] = jest.fn().mockImplementation(() => true);
    const actual = instance['isShowCountInfo'](1, 2, 0);

    expect(actual).toBeTruthy();
  });

  it('isShowCountInfo should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('countInfoContent should return info CashOut', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return info Settle', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('countInfoContent should return string have not info', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['isShowCashOutCount'] = jest.fn().mockImplementation(() => false);
    instance['isShowSettleCount'] = jest.fn().mockImplementation(() => false);
    const actual = instance['countInfoContent'](0, 0, 0);

    expect(actual).toBe(' ()');
  });

  it('openPopupTransIds should call modal Service', async () => {
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['openPopupTransIds'](0, '');

    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });

  it('displayTransId should return 12312', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance.displayTransId(1, '12312');

    expect(actual).toBe('12312');
  });

  it('displayTransId should return -', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });

  it('refreshLogInfoBySearchEvent should call #refreshLogInfo', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['refreshLogInfo'] = jest.fn();

    await instance['refreshLogInfoBySearchEvent']();

    expect(instance['refreshLogInfo']).toHaveBeenCalledTimes(1);
  });

  it('refreshLogInfoByPoolHouseEvent should call #refreshLogInfo', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['refreshLogInfo'] = jest.fn();

    await instance['refreshLogInfoByPoolHouseEvent']();

    expect(instance['refreshLogInfo']).toHaveBeenCalledTimes(1);
  });

  it('getPoolHouseData should call #changeBlockingUiStatus', async () => {
    const fakeLogInfoWrongHdp = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    fakeLogInfoWrongHdp.linkedLogsViewModel = new LinkedLogsViewModel();
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
    .mock(EventWrongHdpService, { getLinkedLog: jest.fn().mockImplementation(() => Promise.resolve(new LinkedLogsViewModel())) })
    .mock(AddRequestApiService, { getPoolHouseTickets: jest.fn().mockImplementation(() => Promise.resolve(new PoolHouseTicketViewModel())) })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    [true, false].forEach(async x => {
      instance.isMainMatch = x;
      instance.poolHouseTicketsModel = new PoolHouseTicketsModel();

      await instance['getPoolHouseData'](new GetPoolHouseTicketQuery());

      expect(mockChangeBlockingUiStatus).toHaveBeenCalled();
    });
  });

  it('recalculatePoolHouseTicket should call #refreshLogInfoByPoolHouseEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance.refreshLogInfoByPoolHouseEvent = jest.fn();

    instance.recalculatePoolHouseTicket(new PoolHouseTicketsModel());

    expect(instance.refreshLogInfoByPoolHouseEvent).toHaveBeenCalledTimes(1);
  });

  it('openPoolHouseDetails should call #getPoolHouseData', async () => {
    const fakeLogInfoWrongHdp = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    fakeLogInfoWrongHdp.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongHdp
      }
    });
    instance.poolHouseTicketsModel = new PoolHouseTicketsModel();
    instance.getPoolHouseData = jest.fn();

    await instance.openPoolHouseDetails();

    expect(instance.getPoolHouseData).toHaveBeenCalledTimes(1);
  });

  it('isHavePoolHouseTicket should return true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    [
      {singleCount: 1, parlayCount: 0},
      {singleCount: 0, parlayCount: 1}
    ].forEach(x => {
      const actual = instance.isHavePoolHouseTicket(x.singleCount, x.parlayCount);

      expect(actual).toBeTruthy();
    });
  });

  it('initGetPoolHouseTicketQuery should update hdpValue', async () => {
    const fakeLogInfoWrongHdp = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    fakeLogInfoWrongHdp.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => false) })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongHdp
      }
    });
    fakeLogInfoWrongHdp.filterWithHdp.hdpValue = "hdpValue";

    const actual = instance['initGetPoolHouseTicketQuery']();

    expect(actual.hdpValue).toBe("hdpValue");
  });

  it('initGetPoolHouseTicketQuery should update homeFavorite & awayFavorite', async () => {
    const fakeLogInfoWrongHdp = _.cloneDeep(Helper.fakeLogInfoWrongHdp);
    fakeLogInfoWrongHdp.linkedLogsViewModel = new LinkedLogsViewModel();
    fakeLogInfoWrongHdp.filterWithHdp.homeFavorite = "homeFavorite";
    fakeLogInfoWrongHdp.filterWithHdp.awayFavorite = "awayFavorite";

    let fakeQuery: GetPoolHouseTicketQuery = {
      matchId: 0,
      actionId: 0,
      requestId: 0,
      issueTypeId: 0,
      subIssueTypeId: 0,
      homeFavorite: '',
      awayFavorite: '',
      hdpValue: '',
      wrongMarket: '',
      isLinkGroup1X2: false,
      isLinkGroupAIO: false,
      filterFromTransTime: '',
      filterToTransTime: '',
      liveIndicator: 0,
      pageIndex: 1,
      pageSize: 1,
      wrongOddsInfo: []
    };

    let fakePoolHouseTicketsModel: PoolHouseTicketsModel = {
      isOpen: false,
      checkedBetTypes: '',
      query: fakeQuery,
      groupBetTypes: [],
      tickets: new TicketsModel(),
      isAffectedGroup1X2: false,
      isAffectedGroup1H1X2: false,
      isAffectedGroupAIO: false,
      linkedLogsViewModel: new LinkedLogsViewModel
    };

    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongHdp
      }
    });
    instance.poolHouseTicketsModel = fakePoolHouseTicketsModel;

    const actual = instance['initGetPoolHouseTicketQuery']();

    expect(actual.homeFavorite).toBe("homeFavorite");
    expect(actual.awayFavorite).toBe("awayFavorite");
    expect(actual.pageIndex ).toBe(1);
    expect(actual.pageSize ).toBe(1);
  });
});
