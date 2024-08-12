import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { LinkedLogsViewModel } from '../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model';
import { ToolTipModule } from '../../../../../utility/components/tooltip/tooltip.module';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { FilterWrongOuComponent } from '../filter-wrong-ou/filter-wrong-ou.component';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { EventWrongOuService } from '../services/event-wrong-ou.service';
import { LogInfoService } from '../services/log-info.service';
import { ValidationService } from '../services/validation.service';
import { LogInfoWrongOuComponent } from './log-info-wrong-ou.component';
import { PoolHouseTicketsModel, GetPoolHouseTicketQuery, PoolHouseTicketViewModel } from '../../pool-house-ticket/pool-house-ticket.model';

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
  static readonly fakeFilterWrongOuModel: FilterWrongOuModel = {
    filterFromTransTime: Helper.fakeFromDateTime,
    filterToTransTime: Helper.fakeToDateTime,
    actualMarket: '1',
    wrongMarket: '1',
    liveIndicator: 1
  };
  static readonly fakeLogInfoWrongOu: LogInfoWrongOu = {
    matchId: 12345,
    leagueName: '',
    isMainMatch: true,
    eventName: '',
    filterWrongOu: Helper.fakeFilterWrongOuModel,
    logInfoDetail: Helper.fakeLogInfoDetail,
    messageValidationLogInfo: [],
    isPoolHouseAffected: true,
    linkedLogsViewModel: null,
    poolHouseCheckedBetTypes: '',
    isShowValidation: false
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

describe('LogInfoWrongOuComponent', () => {
  @NgModule({
    declarations: [
      DateFullTimeNewComponent,
      FilterWrongOuComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      ToolTipModule,
      BlockUiModule,
      PipeModule    ],
    providers: [
      ValidationService,
      LogInfoService,
      ModalService,
      AddRequestStore,
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoWrongOuComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoWrongOuComponent, AppModuleTest)
      .mock(ElementRef, {})
      .dontMock(NgbModule);
  });

  it('LogInfoWrongOuComponent init should match snapshot', async () => {
    const { fixture } = await shallow
    .render({
      bind: {
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu,
        isEdit: false
      }
    });

    expect(fixture).toMatchSnapshot();
  });

  it('refreshLogInfo should call #getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    instance.filterWrongOuComponent = new FilterWrongOuComponent(null, null);
    instance.filterWrongOuComponent.isValid = jest.fn().mockImplementation(() => true);
    instance.clearDataValidation = jest.fn();
    instance.refreshLogInfo();

    expect(mockGetLogInfo).toBeCalledTimes(1);
    expect(instance.clearDataValidation).toBeCalledTimes(1);
    expect(instance.filterWrongOuComponent.isValid).toBeCalledTimes(1);
  });

  it('refreshLogInfo should not call #getLogInfo', async () => {
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getLogInfo: mockGetLogInfo })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    instance.filterWrongOuComponent = new FilterWrongOuComponent(null, null);
    instance.filterWrongOuComponent.isValid = jest.fn().mockImplementation(() => false);
    instance.clearDataValidation = jest.fn();
    instance.refreshLogInfo();

    expect(mockGetLogInfo).toBeCalledTimes(0);
    expect(instance.clearDataValidation).toBeCalledTimes(1);
    expect(instance.filterWrongOuComponent.isValid).toBeCalledTimes(1);
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });

  it('getPoolHouseData should call #changeBlockingUiStatus', async () => {
    const fakeLogInfoWrongHdp = _.cloneDeep(Helper.fakeLogInfoWrongOu);
    fakeLogInfoWrongHdp.linkedLogsViewModel = new LinkedLogsViewModel();
    const mockChangeBlockingUiStatus = jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
    .mock(EventWrongOuService, { getLinkedLog: jest.fn().mockImplementation(() => Promise.resolve(new LinkedLogsViewModel())) })
    .mock(AddRequestApiService, { getPoolHouseTickets: jest.fn().mockImplementation(() => Promise.resolve(new PoolHouseTicketViewModel())) })
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    [true, false].forEach(async x => {
      instance.isMainMatch = x;
      instance.poolHouseTicketsModel = new PoolHouseTicketsModel();

      await instance['getPoolHouseData'](new GetPoolHouseTicketQuery());

      expect(mockChangeBlockingUiStatus).toHaveBeenCalled();
    });
  });

  it('refreshLogInfoBySearchEvent should call #refreshLogInfo', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
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
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    instance['refreshLogInfo'] = jest.fn();

    await instance['refreshLogInfoByPoolHouseEvent']();

    expect(instance['refreshLogInfo']).toHaveBeenCalledTimes(1);
  });

  it('recalculatePoolHouseTicket should call #refreshLogInfoByPoolHouseEvent', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        isEdit: false,
        filter: Helper.fakeFilterModel,
        logInfo: Helper.fakeLogInfoWrongOu
      }
    });
    instance.refreshLogInfoByPoolHouseEvent = jest.fn();
    instance.recalculatePoolHouseTicket(new PoolHouseTicketsModel());

    expect(instance.refreshLogInfoByPoolHouseEvent).toHaveBeenCalledTimes(1);
  });
});
