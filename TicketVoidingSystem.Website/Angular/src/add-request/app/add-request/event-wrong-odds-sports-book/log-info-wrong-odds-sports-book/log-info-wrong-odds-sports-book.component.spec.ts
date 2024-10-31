import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Shallow } from 'shallow-render';
import { BetTypeAddRequest } from '../../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model';
import { LogInfoMessageComponent } from '../../../../../utility/components/log-info-detail/log-info-message/log-info-message.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { MultipleSelection } from '../../../../../utility/components/multiple-selection/multiple-selection';
import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { GroupModel } from '../../pool-house-ticket/tickets/group-tickets.model';
import { TicketModel } from '../../pool-house-ticket/tickets/ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { PrimitiveProperty } from '../models/primitive-property.model';
import { LogInfoWrongOddsSportsBookComponent } from './log-info-wrong-odds-sports-book.component';

class Helper {
  static readonly fromDate = '2021-12-18 12:08:49.737';
  static readonly toDate = '2021-12-21 12:08:49.737';
  static readonly fakeLogInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook = {
    matchId: 1,
    filterWrongOddsSportsBook: new FilterWrongOddsSportsBookModel(),
    logInfoDetail: new LogInfoDetail(),
    messageValidationLogInfo: [],
    betTeamsResult: [],
    checkedBetTypes: []
  } as LogInfoWrongOddsSportsBook;
}

describe('LogInfoWrongOddsSportsBookComponent', () => {
  @NgModule({
    declarations: [
      AffectedTicketComponent,
      LogInfoMessageComponent
    ],
    imports: [
      NgbModule,
      FormsModule
    ],
    providers: [
      ModalService,
      AddRequestStore,
      AddRequestApiService
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<LogInfoWrongOddsSportsBookComponent>;

  beforeEach(() => {
    shallow = new Shallow(LogInfoWrongOddsSportsBookComponent, AppModuleTest)
      .dontMock(NgbModule)
      .mock(ElementRef, {});
  });

  it('LogInfoWrongOddsSportsBookComponent init should match snapshot', async () => {
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, null);
    expect(component).toMatchSnapshot();
  });

  it('displayFullDateTimeFormat should return time', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
      }
    });
    const actual = instance.displayFullDateTimeFormat(new Date(Helper.fromDate));

    expect(actual).toBe('2021/12/18 12:08:49.737 PM');
  });

  it('countInfoContent should return info CashOut', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
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
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
      }
    });
    instance['openPopupTransIds'](0, '');

    expect(mockModalOpen).toHaveBeenCalledTimes(1);
  });

  it('isShowCountInfo should return false', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
      }
    });
    const actual = instance['isShowCountInfo'](0, 0, 0);

    expect(actual).toBeFalsy();
  });

  it('displayTransId should return 12312', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
      }
    });
    const actual = instance.displayTransId(1, '12312');

    expect(actual).toBe('12312');
  });

  it('displayTransId should return -', async () => {
    const { instance } = await shallow
    .render({
      bind: {
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook,
        primitiveProps: new PrimitiveProperty()
      }
    });
    const actual = instance.displayTransId(0, '');

    expect(actual).toBe('-');
  });

  it('clearDataValidation should update to null', async () => {
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, null);
    component.logInfo = Helper.fakeLogInfoWrongOddsSportsBook;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.logInfoTicketsJson = 'ABC';
    component.clearDataValidation();

    expect(component.logInfo.logInfoDetail).toBeNull();
    expect(component.logInfo.messageValidationLogInfo).toBeNull();
  });

  it('showAffectedTicketsDetails should call #updateAffectedTickets', async () => {
    const mockChangeBlockingUiStatus =  jest.fn();
    const { instance } = await shallow
    .mock(AddRequestStore, { changeBlockingUiStatus: mockChangeBlockingUiStatus })
    .render({
      bind: {
        isEdit: true,
        primitiveProps: new PrimitiveProperty(),
        logInfo: Helper.fakeLogInfoWrongOddsSportsBook
      }
    });
    instance.affectedTicketsModel = new AffectedTicketsModel();
    instance.updateCheckedBetTypeIds = jest.fn();
    instance.updateAffectedTickets = jest.fn();
    await instance.showAffectedTicketsDetails();

    expect(mockChangeBlockingUiStatus).toHaveBeenCalledTimes(2);
    expect(instance.updateCheckedBetTypeIds).toHaveBeenCalledTimes(1);
    expect(instance.updateAffectedTickets).toHaveBeenCalledTimes(1);
  });

  it('updateAffectedTickets should call #addRequestApiService.GetLogInfoTickets', async () => {
    const ticketJsonModel = new TicketsModel();
    ticketJsonModel.groups = [new GroupModel('', [ {mainTransId: '1'} as TicketModel ], 2)];
    const addRequestApiService = new AddRequestApiService(null);
    addRequestApiService.GetLogInfoTickets = jest.fn().mockResolvedValue(ticketJsonModel);;
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, addRequestApiService);
    component.logInfo = Helper.fakeLogInfoWrongOddsSportsBook;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.logInfoTicketsJson = 'ABC';
    component.affectedTicketsModel = new AffectedTicketsModel();

    await component.updateAffectedTickets();

    expect(addRequestApiService.GetLogInfoTickets).toHaveBeenCalledTimes(1);
    expect(component.affectedTicketsModel.tickets.groups[0].name).toBeNull();
    expect(component.affectedTicketsModel.tickets.groups[0].tickets.every(x => x.isChecked)).toBeTruthy();
  });

  it('updateAffectedTickets should update affectedTicketsModel.tickets to new model', async () => {
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, null);
    component.logInfo = Helper.fakeLogInfoWrongOddsSportsBook;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.logInfoTicketsJson = null;
    component.affectedTicketsModel = new AffectedTicketsModel();

    await component.updateAffectedTickets();

    expect(component.affectedTicketsModel.tickets).toEqual(new TicketsModel());
  });

  it('updateCheckedBetTypeIds should call update checkedBetTypes & filterBetTypes', async () => {
    const filterBetTypes = new MultipleSelection();
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, null);
    component.logInfo = Helper.fakeLogInfoWrongOddsSportsBook;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.logInfoTicketsJson = 'ABC';
    component.affectedTicketsModel = new AffectedTicketsModel();
    component['initFilterBetTypes'] = jest.fn().mockReturnValue(filterBetTypes);

    component.updateCheckedBetTypeIds();

    expect(component['initFilterBetTypes']).toHaveBeenCalledTimes(1);
    expect(component.affectedTicketsModel.filterBetTypes).toBe(filterBetTypes);
    expect(component.affectedTicketsModel.checkedBetTypes).toBe(Helper.fakeLogInfoWrongOddsSportsBook.checkedBetTypes);
  });

  it('initFilterBetTypes should return expected model', async () => {
    const betTypeAddRequest =  [new BetTypeAddRequest(1, '', true, false)];
    const component = new LogInfoWrongOddsSportsBookComponent(null, null, null);
    component.logInfo = Helper.fakeLogInfoWrongOddsSportsBook;
    component.logInfo.logInfoDetail = new LogInfoDetail();
    component.logInfo.logInfoDetail.logInfoTicketsJson = 'ABC';
    component.affectedTicketsModel = new AffectedTicketsModel();
    const actual = component['initFilterBetTypes'](betTypeAddRequest);

    expect(actual.items.length).toBe(1);
  });
});