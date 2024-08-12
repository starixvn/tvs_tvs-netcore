import { ElementRef, NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { AddRequestApiService } from '../../../../add-request/app/add-request/add-request-api.service';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { Result } from '../../../../utility/models/result';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
import { AddRequestStore } from '../add-request.store';
import { FilterWithHdpModel } from '../event-wrong-hdp/models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../event-wrong-hdp/models/log-info-wrong-hdp.model';
import { FilterModel } from '../filter/filter.model';
import { GroupLinkedLog, LinkedLogsViewModel } from './linked-log/linked-log.model';
import { PoolHouseTicketComponent } from './pool-house-ticket.component';
import { PoolHouseTicketViewModel, PoolHouseTicketsModel } from './pool-house-ticket.model';
import { TicketsModel } from './tickets/tickets.model';
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
  static readonly fakePoolHouseLinkedLogsData: GroupLinkedLog = {
    groupName: 'AIO',
    logsData: [],
    isAffectedGroup: false
  };
  static readonly fakeLinkedLogsViewModel: LinkedLogsViewModel = {
    isLinkGroup1X2: true,
    isLinkGroupAIO: true,
    result: new Result(),
    groupLinkedLogs: []
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
    poolHouseCheckedBetTypes: null,
    linkedLogsViewModel: Helper.fakeLinkedLogsViewModel,
    isShowValidation: false
  };
  static readonly fakePoolHouseTicketViewModel: PoolHouseTicketViewModel = {
    groupBetTypes: [],
    affectedTickets: new TicketsModel(),
    otherTickets: new TicketsModel
  };
  static readonly fakePoolHouseTicketsModel: PoolHouseTicketsModel = {
    checkedBetTypes: '1,2',
    isOpen: false,
    groupBetTypes: [],
    linkedLogsViewModel: null,
    query: null,
    affectedTickets: new TicketsModel,
    otherTickets: new TicketsModel
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
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<PoolHouseTicketComponent>;

  beforeEach(() => {
    shallow = new Shallow(PoolHouseTicketComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('PoolHouseTicketComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('ngOnChanges should call #updatePoolHouseTicketModal', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
      }
    });
    instance.model.isOpen = true;
    const changes = {
      'model': new SimpleChange(new PoolHouseTicketsModel(), new PoolHouseTicketsModel(), true)
    };
    instance['updatePoolHouseTicketModal'] = jest.fn();

    await instance.ngOnChanges(changes);

    expect(instance['updatePoolHouseTicketModal']).toHaveBeenCalledTimes(1);
  });

  it('closeClick should update model.isOpen false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        model: new PoolHouseTicketsModel(),
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
      }
    });
    instance['getCheckedBetTypes'] = jest.fn();

    instance.saveClick();

    expect(instance.model.isOpen).toBeFalsy();
  });
});
