import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
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
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { EventWrongOddsService } from '../services/event-wrong-odds.service';
import { LogInfoWrongOddsComponent } from './log-info-wrong-odds.component';

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
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    favoriteValue: '1',
    filterFavoriteType: 'h',
    liveIndicator: 1,
    spread: '0.2',
    maxBet: 0,
    allowanceRate: '20',
    correctOddsHomeOver: '0.8',
    correctOddsAwayUnder: '0.9',
    fromOddsNotVoidHomeOver: '0.65',
    toOddsNotVoidHomeOver: '0.85',
    fromOddsNotVoidAwayUnder: '0.5',
    toOddsNotVoidAwayUnder: '0.9',
    maxBetAndSpreadInfo: []
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: new FilterWrongOddsModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: false,
    linkedLogsViewModel: new LinkedLogsViewModel(),
    poolHouseCheckedBetTypes: '',
    isShowValidation: false,
    sportType: 0
  };
  static readonly fakeFilterModel: FilterModel = {
    issueTypeId: '1',
    subIssueTypeId: '1',
    action: '1',
    isTest: true,
    isVoided: false,
    isAbnormal: false
  } as FilterModel;
  static readonly fakeGetPoolHouseTicketQuery: GetPoolHouseTicketQuery = {
    matchId: 756352,
    actionId: 0,
    requestId: 4638,
    issueTypeId: 1,
    subIssueTypeId: 1,
    homeFavorite: '1.75',
    awayFavorite: '',
    hdpValue: '1.5',
    wrongMarket: '1.75',
    isLinkGroup1X2: false,
    isLinkGroupAIO: false,
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    liveIndicator: 0,
    wrongOddsInfo: []
  };
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
  };
  static readonly fakePoolHouseTicketViewModel: PoolHouseTicketViewModel = {
    groupBetTypes: [],
    affectedTickets: new TicketsModel(),
    otherTickets: new TicketsModel()
  };
}

describe('LogInfoWrongOddsComponent', () => {
  @NgModule({
    declarations: [
      PoolHouseTicketComponent,
      AffectedTicketComponent,
      TicketCountOtherSportsComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule
    ],
    providers: [
      ModalService,
      EventWrongOddsService,
      AddRequestStore,
      AddRequestApiService,
      LogAnalysisService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoWrongOddsComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoWrongOddsComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('#LogInfoWrongOddsComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        isEdit: false,
        logInfo: Helper.fakeLogInfoWrongOdds,
        primitiveProps: new PrimitiveProperty()
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('#recalculatePoolHouseTicket should emit searchEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        logInfo: Helper.fakeLogInfoWrongOdds,
        primitiveProps: new PrimitiveProperty()
      }
    });
    instance.searchEvent.emit = jest.fn();

    instance.recalculatePoolHouseTicket(new PoolHouseTicketsModel());

    expect(instance.searchEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('isShowCountInfo should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('displayTransId should return 12312', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
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
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });

  it('countInfoContent should return info CashOut', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    const actual = instance['countInfoContent'](1, 2, 0);

    expect(actual).toBe(' (Cash Out: <strong>1</strong>, Settled: <strong>2</strong>)');
  });

  it('openPopupTransIds should call modal Service', async () => {
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    instance['openPopupTransIds'](0, '');

    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });

  it('openPoolHouseDetails should update poolHouseTicketsModel expected', async () => {
    let fakeFunctionWriteLog = jest.fn();
    const mockGetPoolHouseTickets = jest.fn().mockReturnValue(Helper.fakePoolHouseTicketViewModel);
    const mockGetLinkedLog = jest.fn().mockImplementation(() => Promise.resolve(new LinkedLogsViewModel()));
    const fakeLogInfoWrongOdds = _.cloneDeep(Helper.fakeLogInfoWrongOdds);
    fakeLogInfoWrongOdds.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(EventWrongOddsService, { getLinkedLog: mockGetLinkedLog })
    .mock(AddRequestApiService, { getPoolHouseTickets: mockGetPoolHouseTickets })
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn()})
    .mock(LogAnalysisService, { writeLogClickPoolHouseDetails: fakeFunctionWriteLog })
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongOdds
      }
    });
    instance['initGetPoolHouseTicketQuery'] = jest.fn().mockReturnValue(Helper.fakeGetPoolHouseTicketQuery);

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
});