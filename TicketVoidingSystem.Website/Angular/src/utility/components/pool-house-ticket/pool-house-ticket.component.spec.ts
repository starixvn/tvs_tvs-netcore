import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { PipeModule } from '../../../../../utility/components/pipes/pipe.module';
import { PoolHouseTicketsModel } from '../../../../../utility/components/pool-house-ticket/pool-house-tickets.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { PoolHouseTicketValue } from '../../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../../utility/models/result';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { BetType, GroupBetType, GroupBetTypesModel } from '../group-bettypes-pool-house/group-bettypes-pool-house.model';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LinkedLogsViewModel, PoolHouseLinkedLogsData } from '../models/link-log.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { PoolHouseTicketViewModel } from '../models/pool-house-ticket.model';
import { ValidationService } from '../services/validation.service';
import { TicketsModel } from '../tickets/tickets.model';
import { PoolHouseTicketsComponent } from './pool-house-tickets.component';

class Helper {
  static readonly inputsSelector = '.form-control';
  static readonly fakeFromDateTime = '2020-10-08 09:44:46.361 PM';
  static readonly fakeToDateTime = '2020-10-09 09:44:46.361 PM';
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
  static readonly fakeFilterWithHdpModel: FilterWithHdpModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    homeFavorite: '2',
    awayFavorite: '',
    actualMarket: '1',
    hdpValue: '',
    liveIndicator: 0
  };
  static readonly fakePoolHouseLinkedLogsData: PoolHouseLinkedLogsData = {
    groupName: 'AIO',
    isShow: true,
    logsData: []
  };
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    poolHouseLinkedLogsData: [Helper.fakePoolHouseLinkedLogsData],
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    result: new Result()
  };
  static readonly fakeLogInfoWrongHdp: LogInfoWrongHdp = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWithHdp: new FilterWithHdpModel(),
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isFetchNewPHData: false,
    isPoolHouseAffected: false,
    poolHouseCheckedBetTypes: null,
    linkedLogsViewModel: Helper.fakeLinkedLogsViewModel
  };
  static readonly fakePoolHouseTicketViewModel: PoolHouseTicketViewModel = {
    groupBetTypes: [],
    isAffectedGroup1H1X2: true,
    isAffectedGroup1X2: true,
    isAffectedGroupAIO: true,
    tickets: new TicketsModel()
  };
  static readonly fakePoolHouseTicketsModel: PoolHouseTicketsModel = {
    checkedBetTypes: '1,2',
    isOpen: false
  };
}

describe('GroupBettypesPoolHouseComponent', () => {
  @NgModule({
    declarations: [
    ],
    imports: [
      NgbModule,
      FormsModule,
      BlockUiModule,
      PipeModule,
      ToolTipModule
    ],
    providers: [
      AddRequestApiService,
      AddRequestStore,
      ValidationService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<PoolHouseTicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(PoolHouseTicketsComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('PoolHouseTicketsComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('ngOnChanges should call #updatePoolHouseTicketModal', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.model.isOpen = true;
    const changes = {
      'model': new SimpleChange(new PoolHouseTicketsModel(), new PoolHouseTicketsModel(), true)
    };
    instance.paging = new PagingModel();
    instance['updatePoolHouseTicketModal'] = jest.fn();

    await instance.ngOnChanges(changes);

    expect(instance['updatePoolHouseTicketModal']).toHaveBeenCalledTimes(1);
  });

  it('getPoolHouseData should call #getPoolHouseTickets', async () => {
    const mockChangeBlockingUiStatus = jest.fn();
    const mockGetPoolHouseTickets = jest.fn().mockImplementation(() => Promise.resolve(Helper.fakePoolHouseTicketViewModel));
    const { instance } = await shallow
    .mock(AddRequestApiService, { getPoolHouseTickets: mockGetPoolHouseTickets })
    .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => true) })
    .render({
      bind: {
        model: Helper.fakePoolHouseTicketsModel,
        filter: Helper.fakeFilterModel
      }
    });
    instance.paging = new PagingModel();
    instance.mainEvent = Helper.fakeLogInfoWrongHdp;

    await instance.getPoolHouseData();

    expect(mockGetPoolHouseTickets).toHaveBeenCalledTimes(1);
  });

  it('initGetPoolHouseTicketQuery should return query with hdpValue not null', async () => {
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => false) })
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.mainEvent = Helper.fakeLogInfoWrongHdp;

    const actual = instance['initGetPoolHouseTicketQuery']();

    expect(actual.hdpValue).toBe(Helper.fakeLogInfoWrongHdp.filterWithHdp.hdpValue);
  });

  it('pagingEvent should call #getPoolHouseData', async () => {
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => false) })
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    const betType = new BetType(12, '', true);
    const groupBetTypes = new GroupBetType('', [betType], true);
    instance.groupBetTypesModel = new GroupBetTypesModel([groupBetTypes], true);
    instance.getPoolHouseData = jest.fn();

    instance.pagingEvent();

    expect(instance.getPoolHouseData).toHaveBeenCalledTimes(1);
  });

  it('changeCheckBetTypeAndTicket should call #groupBetTypesModel.checkAllBetType', async () => {
    const { instance } = await shallow
    .mock(ValidationService, { isSubTypeWrongHdpOrWrong1stHdp: jest.fn().mockImplementation(() => false) })
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.tickets = new TicketsModel();
    instance.tickets.checkAllTickets = jest.fn();
    instance.model.checkedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    instance.groupBetTypesModel = new GroupBetTypesModel([], true);
    instance.groupBetTypesModel.checkAllBetType = jest.fn();

    instance['changeCheckBetTypeAndTicket']();

    expect(instance.groupBetTypesModel.checkAllBetType).toHaveBeenCalledTimes(1);
    expect(instance.tickets.checkAllTickets).toHaveBeenCalledTimes(1);
  });

  it('changedBetTypes should call #tickets.handlecheckTicketByBetTypes', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.tickets = new TicketsModel();
    instance.tickets.handlecheckTicketByBetTypes = jest.fn();

    instance['changedBetTypes']([]);

    expect(instance.tickets.handlecheckTicketByBetTypes).toHaveBeenCalledTimes(1);
  });

  it('closeClick should update model.isOpen false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });

    instance.closeClick();

    expect(instance.model.isOpen).toBeFalsy();
  });

  it('saveClick should emit #saveEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance['geCheckedBetTypes'] = jest.fn();

    instance.saveClick();

    expect(instance.model.isOpen).toBeFalsy();
  });

  it('isHideLinkedLog should return true', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.poolHouseTicketViewModel = Helper.fakePoolHouseTicketViewModel;

    const actual = instance.isHideLinkedLog();

    expect(actual).toBeTruthy();
  });

  it('isHideLinkedLog should return true when isAffectedGroup1X2 false', async () => {
    const fakePoolHouseTicketViewModel = _.cloneDeep(Helper.fakePoolHouseTicketViewModel);
    fakePoolHouseTicketViewModel.isAffectedGroup1X2 = false;
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    instance.poolHouseTicketViewModel = fakePoolHouseTicketViewModel;

    const actual = instance.isHideLinkedLog();

    expect(actual).toBeTruthy();
  });

  it('checkCanShowGroupLinkedLog should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
        filter: Helper.fakeFilterModel
      }
    });
    ['1X2', '1H 1X2', 'AIO', ''].forEach(x => {
      const actual = instance['checkCanShowGroupLinkedLog'](x, Helper.fakePoolHouseTicketViewModel);

      expect(actual).toBeFalsy();
    });
  });
});
