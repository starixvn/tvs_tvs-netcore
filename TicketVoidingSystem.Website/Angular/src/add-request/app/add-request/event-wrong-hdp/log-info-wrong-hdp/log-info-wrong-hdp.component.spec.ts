import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { FilterModel } from '../../filter/filter.model';
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketComponent } from '../../pool-house-ticket/pool-house-ticket.component';
import { GetPoolHouseTicketQuery, PoolHouseTicketViewModel, PoolHouseTicketsModel } from '../../pool-house-ticket/pool-house-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { LogAnalysisService } from '../../services/log-analysis.service';
import { TicketCountOtherSportsComponent } from '../../ticket-count-other-sports/ticket-count-other-sports.component';
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
  static readonly fakeFilterWithHdpModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    homeFavorite: '2',
    awayFavorite: '',
    actualMarket: '1',
    hdpValue: '',
    liveIndicator: 0,
    filterBetType: {filterBetIdX:'1', filterBetIdY:'', filterBetTypeId:'1'}
  } as FilterWithHdpModel;
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    groupLinkedLogs: [
      {
        groupName: '1X2',
        isAffectedGroup: true,
        logsData: []
      },
      {
        groupName: 'AIO',
        isAffectedGroup: true,
        logsData: []
      },
    ],
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    result: undefined
  }
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    linkedLogsViewModel: Helper.fakeLinkedLogsViewModel,
    sportType: 0
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false,
    actions: []
  } as FilterModel;
  static readonly fakeGetPoolHouseTicketQuery: GetPoolHouseTicketQuery = {
    matchId: 75785,
    actionId: 1,
    requestId: 64324,
    issueTypeId: 1,
    subIssueTypeId: 1,
    homeFavorite: '1.75',
    awayFavorite: '',
    hdpValue: '1.5',
    wrongMarket: '1.2',
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    liveIndicator: 1,
    wrongOddsInfo: []
  };
  static readonly fakePoolHouseTicketViewModel: PoolHouseTicketViewModel = {
    groupBetTypes: [],
    affectedTickets: new TicketsModel(),
    otherTickets: new TicketsModel()
  };
}

describe('LogInfoWrongHdpComponent', () => {
  @NgModule({
    declarations: [
      FilterWithHdpComponent,
      PoolHouseTicketComponent,
      AffectedTicketComponent,
      TicketCountOtherSportsComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule
    ],
    providers: [
      ValidationService,
      LogInfoService,
      ModalService,
      AddRequestStore,
      AddRequestApiService,
      EventWrongHdpService,
      LogAnalysisService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoWrongHdpComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoWrongHdpComponent, AppModuleTest)
      .mock(ElementRef, {})
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

  it('refreshLogInfo should call #getLogInfo when filterWithHdpComponent isValid', async () => {
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

  it('refreshLogInfo should not call #getLogInfo when filterWithHdpComponent isInValid', async () => {
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

  it('recalculatePoolHouseTicket should update poolHouseCheckedBetTypes expected', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    const model = {checkedBetTypes: "123,4"} as PoolHouseTicketsModel;
    instance.refreshLogInfoByPoolHouseEvent = jest.fn();

    instance.recalculatePoolHouseTicket(model);

    expect(instance.logInfo.poolHouseCheckedBetTypes).toBe("123,4");
  });

  it('openPoolHouseDetails should call #getPoolHouseTickets', async () => {
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
    .mock(EventWrongHdpService, { getLinkedLog: jest.fn().mockReturnValue(Helper.fakeLinkedLogsViewModel) })
    .mock(AddRequestApiService, { getPoolHouseTickets: jest.fn().mockReturnValue(Helper.fakePoolHouseTicketViewModel) })
    .mock(LogAnalysisService, { writeLogClickPoolHouseDetails: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongHdp
      }
    });
    instance['initGetPoolHouseTicketQuery'] = jest.fn().mockReturnValue(Helper.fakeGetPoolHouseTicketQuery)
    instance.poolHouseTicketsModel = new PoolHouseTicketsModel();
    const poolHouseTicketsModelExpected = {
      query: Helper.fakeGetPoolHouseTicketQuery,
      linkedLogsViewModel: instance.logInfo.linkedLogsViewModel,
      groupBetTypes: Helper.fakePoolHouseTicketViewModel.groupBetTypes,
      affectedTickets: Helper.fakePoolHouseTicketViewModel.affectedTickets,
      otherTickets: Helper.fakePoolHouseTicketViewModel.otherTickets,
      checkedBetTypes: instance.logInfo.poolHouseCheckedBetTypes,
      isOpen: true} as PoolHouseTicketsModel;

    await instance.openPoolHouseDetails();

    expect(instance.poolHouseTicketsModel).toEqual(poolHouseTicketsModelExpected);
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
      wrongOddsInfo: []
    };

    let fakePoolHouseTicketsModel: PoolHouseTicketsModel = {
      isOpen: false,
      checkedBetTypes: '',
      query: fakeQuery,
      groupBetTypes: [],
      linkedLogsViewModel: new LinkedLogsViewModel,
      affectedTickets: new TicketsModel,
      otherTickets: new TicketsModel
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
  });
});
