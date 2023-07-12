import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketComponent } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.component';
import { GetPoolHouseTicketQuery, PoolHouseTicketViewModel, PoolHouseTicketsModel } from '../../../../../utility/components/pool-house-ticket/pool-house-ticket.model';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ModalService } from '../../../../../utility/modules/modal/modal.service';
import { ToolTipModule } from '../../../../../utility/modules/tooltip/tooltip.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
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
  };
  static readonly fakeFilterWrongOddsModel: FilterWrongOddsModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    betTeam: 'h',
    correctOdds: '1',
    favoriteValue: '1',
    filterFavoriteType: 'h',
    filterOddsType: 'value',
    filterOuType: 'h',
    fromOdds: '1',
    oddsValue: '1',
    ouValue: '1',
    liveIndicator: 0,
    toOdds: '1'
  };
  static readonly fakeLogInfoWrongOdds: LogInfoWrongOdds = {
    matchId: 12345,
    filterWrongOdds: new FilterWrongOddsModel(),
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

describe('LogInfoWrongOddsComponent', () => {
  @NgModule({
    declarations: [
      PoolHouseTicketComponent
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
      AddRequestApiService
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

  it('#ngOnInit should update isShowValidation true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: true,
        filter: new FilterModel(),
        logInfo: Helper.fakeLogInfoWrongOdds,
        primitiveProps: new PrimitiveProperty()
      }
    });

    instance.ngOnInit();

    expect(instance.primitiveProps.isShowValidation).toBeTruthy();
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

  it('clearDataValidation should update to null', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    instance.clearDataValidation();

    expect(instance.logInfo.logInfoDetail).toBeNull();
    expect(instance.logInfo.messageValidationLogInfo ).toBeNull();
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    const actual = instance.displayFullDateTimeFormat(new Date(Helper.fakeFromDateTime));

    expect(actual).toBe('2020/10/08 09:44:46.361 PM');
  });

  it('openPoolHouseDetails should call #getPoolHouseData', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOdds
      }
    });
    instance['initGetPoolHouseTicketQuery'] = jest.fn();
    instance.getPoolHouseData = jest.fn();
    await instance.openPoolHouseDetails();

    expect(instance.getPoolHouseData).toHaveBeenCalledTimes(1);
  });

  it('initGetPoolHouseTicketQuery should update pageIndex is 0 when poolHouseTicketsModel.query null', async () => {
    const fakeLogInfoWrongOdds = _.cloneDeep(Helper.fakeLogInfoWrongOdds);
    fakeLogInfoWrongOdds.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(EventWrongOddsService, { getWrongOddsModel: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongOdds
      }
    });
    instance.poolHouseTicketsModel = new PoolHouseTicketsModel();
    instance.poolHouseTicketsModel.query = null;
    const actual = instance['initGetPoolHouseTicketQuery']();

    expect(actual.pageIndex).toBe(0);
  });

  it('initGetPoolHouseTicketQuery should update pageIndex is 0 when poolHouseTicketsModel.query not null', async () => {
    const fakeLogInfoWrongOdds = _.cloneDeep(Helper.fakeLogInfoWrongOdds);
    fakeLogInfoWrongOdds.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(EventWrongOddsService, { getWrongOddsModel: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongOdds
      }
    });
    instance.poolHouseTicketsModel = new PoolHouseTicketsModel();
    instance.poolHouseTicketsModel.query = new GetPoolHouseTicketQuery();
    instance.poolHouseTicketsModel.query.pageIndex = 1;
    const actual = instance['initGetPoolHouseTicketQuery']();

    expect(actual.pageIndex).toBe(1);
  });

  it('getPoolHouseData should call #addRequestApiService.getPoolHouseTickets', async () => {
    const mockGetPoolHouseTickets = jest.fn().mockImplementation(() => Promise.resolve(new PoolHouseTicketViewModel()));
    const mockGetLinkedLog = jest.fn().mockImplementation(() => Promise.resolve(new LinkedLogsViewModel()));
    const fakeLogInfoWrongOdds = _.cloneDeep(Helper.fakeLogInfoWrongOdds);
    fakeLogInfoWrongOdds.linkedLogsViewModel = new LinkedLogsViewModel();
    const { instance } = await shallow
    .mock(EventWrongOddsService, { getLinkedLog: mockGetLinkedLog })
    .mock(AddRequestApiService, { getPoolHouseTickets: mockGetPoolHouseTickets })
    .mock(AddRequestStore, { changeBlockingUiStatus: jest.fn() })
    .render({
      bind: {
        isEdit: false,
        primitiveProps: new PrimitiveProperty(),
        filter: Helper.fakeFilterModel,
        logInfo: fakeLogInfoWrongOdds
      }
    });
    instance.poolHouseTicketsModel = new PoolHouseTicketsModel();
    await instance.getPoolHouseData(new GetPoolHouseTicketQuery());

    expect(mockGetLinkedLog).toHaveBeenCalledTimes(1);
    expect(mockGetPoolHouseTickets).toHaveBeenCalledTimes(1);
  });
});