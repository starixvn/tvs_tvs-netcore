import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import * as _ from 'lodash';
import { Shallow } from 'shallow-render';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { MatchModel } from '../../../../../utility/models/match.model';
import { FilterModel } from '../../filter/filter.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { LogInfoService } from '../services/log-info.service';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { TicketsListComponent } from '../tickets-list/tickets-list.component';
import { LogInfoEkoComponent } from './log-info-eko.component';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeLogInfoEarlyKickOff: LogInfoEarlyKickOff = {
    matchId: 1,
    messageValidationLogInfo: [],
    eventName: '',
    isCollapse: false,
    isMainMatch: true,
    isShowValidation: false,
    kickOffTime: '',
    leagueName: '',
    matchModel: new MatchModel(),
    pagingModel: new PagingModel(),
    subIssueTypeId: 1,
    isInvalidTotalTickets: false,
    tableTicketsModel: new TableTicketsModel()
  };
}

describe('LogInfoEkoComponent', () => {
  @NgModule({
    declarations: [
      TicketsListComponent
    ],
    imports: [
      NgbModule,
      FormsModule,
      NgSelectModule
    ],
    providers: [
      ModalService,
      LogInfoService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoEkoComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoEkoComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoEkoComponent init should match snapshot', async () => {
    const component = new LogInfoEkoComponent(null, null);
    expect(component).toMatchSnapshot();
  });

  it('pagingEvent should call logInfoService.getTickets', async () => {
    const mockGetTickets = jest.fn();
    const mockInitQuery = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getTickets: mockGetTickets })
    .mock(LogInfoService, { initQuery: mockInitQuery })
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: Helper.fakeLogInfoEarlyKickOff
      }
    });
    instance.pagingEvent();

    expect(mockGetTickets).toHaveBeenCalledTimes(1);
    expect(mockInitQuery).toHaveBeenCalledTimes(1);
  });

  it('clickHeader should call logInfoService.getTickets', async () => {
    const logInfo = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    logInfo.isCollapse = true;
    const mockGetTickets = jest.fn();
    const mockInitQuery = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getTickets: mockGetTickets })
    .mock(LogInfoService, { initQuery: mockInitQuery })
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: Helper.fakeLogInfoEarlyKickOff
      }
    });
    instance.pagingEvent();

    expect(mockGetTickets).toHaveBeenCalledTimes(1);
    expect(mockInitQuery).toHaveBeenCalledTimes(1);
  });

  it('clickHeader should not call logInfoService.getTickets & logInfo.isCollapse false', async () => {
    const logInfo = _.cloneDeep(Helper.fakeLogInfoEarlyKickOff);
    logInfo.isCollapse = false;
    const mockGetTickets = jest.fn();
    const mockInitQuery = jest.fn();
    const { instance } = await shallow
    .mock(LogInfoService, { getTickets: mockGetTickets })
    .mock(LogInfoService, { initQuery: mockInitQuery })
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: Helper.fakeLogInfoEarlyKickOff
      }
    });
    instance.clickHeader();

    expect(mockGetTickets).toHaveBeenCalledTimes(0);
    expect(mockInitQuery).toHaveBeenCalledTimes(0);
  });

  it('#handleDeleteEvent should emit deleteEvent', async () => {
    const fakeLogInfoRedCard = Helper.fakeLogInfoEarlyKickOff;
    const { instance } = await shallow
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: fakeLogInfoRedCard
      }
    });
    instance.deleteEvent.emit = jest.fn();
    instance.handleDeleteEvent(1);

    expect(instance.deleteEvent.emit).toHaveBeenCalledWith(1);
  });

  it('#emitSearchEvent should emit emitSearchEvent', async () => {
    const fakeLogInfoRedCard = Helper.fakeLogInfoEarlyKickOff;
    const { instance } = await shallow
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: fakeLogInfoRedCard
      }
    });
    instance.searchTicketEvent.emit = jest.fn();
    instance.emitSearchEvent();

    expect(instance.searchTicketEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#openPopupTransIds should call #modalService.open', async () => {
    const fakeLogInfoRedCard = Helper.fakeLogInfoEarlyKickOff;
    const mockModalOpen = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { open: mockModalOpen })
    .render({
      bind: {
        filter: new FilterModel(),
        logInfo: fakeLogInfoRedCard
      }
    });
    instance.openPopupTransIds(1092, '');

    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });
});