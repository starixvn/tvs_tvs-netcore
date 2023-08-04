import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import moment from 'moment-timezone';
import { Shallow } from 'shallow-render';
import { AutoRefreshComponent } from '../../../../utility/components/auto-refresh/auto-refresh.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { PagingModule } from '../../../../utility/components/paging/paging.module';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { ToolTipModule } from '../../../../utility/components/tooltip/tooltip.module';
import { LABELS } from '../../../../utility/constants/labels';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
import { TicketDetailId } from '../../models/query.model';
import { AllMarkedTicketListComponent } from './all-marked-ticket-list.component';
import { AllMarkedTicketModel } from './all-marked-ticket.model';

enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}
class Helper {
  static readonly noDataSelector = '.no-data';
  static readonly htmlRender = '<all-marked-ticket-list [isShowAllTickets]="isShowAllTickets" [model]="ticketsModel"></all-marked-ticket-list>';

  static readonly fakeAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-08-14 03:42:02.737'),
    event: 'Eastern Conference- vs -Western Conference',
    ftScore: '-',
    htScore: '-',
    isChecked: true,
    kickOffTime: new Date('2020-03-11 18:59:59.000'),
    matchId: '31757960',
    no: 1,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static readonly fakeOTherAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-10-14 22:19:51.960'),
    event: 'Barnet- vs -Harrogate Town',
    ftScore: '-',
    htScore: '-',
    isChecked: true,
    kickOffTime: new Date('2020-10-11 22:00:00.000'),
    matchId: '702001046',
    no: 2,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static readonly fakeUncheckedAllMarkedTicketModel: AllMarkedTicketModel = {
    createdDate: new Date('2020-07-02 02:54:42.890'),
    event: 'Republicans- vs -Democrats',
    ftScore: '-',
    htScore: '-',
    isChecked: false,
    kickOffTime: new Date('2020-11-03 08:59:59.000'),
    matchId: '34038292',
    no: 3,
    total: 1,
    userId: 8,
    username: 'sa'
  };

  static getFakePagingModel(): PagingModel {
    const model = new PagingModel();
    model.page = 2;
    return model;
  }
}

@NgModule({
  declarations: [AllMarkedTicketListComponent, AutoRefreshComponent],
  imports: [
    FormsModule,
    PagingModule,
    BlockUiModule,
    PipeModule,
    ToolTipModule
  ],
})
class ModuleTest { }

describe('AllMarkedTicketListComponent', () => {
  let shallow: Shallow<AllMarkedTicketListComponent>;

  beforeEach(() => {
    shallow = new Shallow(AllMarkedTicketListComponent, ModuleTest);
  });

  it('pagingChange event should emit with expected paging when call #pagingEvent', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.paging = Helper.getFakePagingModel();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.pagingChange.emit).toHaveBeenCalledWith(Helper.getFakePagingModel());
  });

  it('getDetailTickets event should emit with expected TicketDetailId model when call #getMarkedTicketDetail', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const ticketDetailId: TicketDetailId = {
      matchId: '31757960',
      userId: 8,
      createdDate: new Date('2020-08-14 03:42:02.737')
    };

    // Action
    instance.getMarkedTicketDetail(Helper.fakeAllMarkedTicketModel);

    // Assert
    expect(instance.getDetailTickets.emit).toHaveBeenCalledWith(ticketDetailId);
  });

  it('#checkGroups should return iconCheckBox is none and all ticket is unchecked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.iconCheckBox = IconCheckBox.all;
    instance.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Action
    instance.checkGroups();

    // Assert
    expect(instance.iconCheckBox).toBe(IconCheckBox.none);
    expect(instance.model[0].isChecked).toBe(false);
    expect(instance.model[1].isChecked).toBe(false);
  });

  it('#checkGroups should return iconCheckBox is all and all ticket is checked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.iconCheckBox = IconCheckBox.none;
    instance.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Action
    instance.checkGroups();

    // Assert
    expect(instance.iconCheckBox).toBe(IconCheckBox.all);
    expect(instance.model[0].isChecked).toBe(true);
    expect(instance.model[1].isChecked).toBe(true);
  });

  it('#getTotalMarkedTickets should return expected total', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];

    // Action
    const actual = instance.getTotalMarkedTickets();

    // Assert
    expect(actual).toBe(2);
  });

  it('#getUncheckedTicketList should return tempUncheckedList(2 items) correctly when ticket param is unchecked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.tempUncheckedList = ['31757960'];

    // Action
    instance.getUncheckedTicketList(Helper.fakeUncheckedAllMarkedTicketModel);

    // Assert
    expect(instance.tempUncheckedList.length).toBe(2);
  });

  it('#getUncheckedTicketList should return tempUncheckedList(1 items) correctly when ticket param is checked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.tempUncheckedList = ['31757960'];

    // Action
    instance.getUncheckedTicketList(Helper.fakeOTherAllMarkedTicketModel);

    // Assert
    expect(instance.tempUncheckedList.length).toBe(1);
  });

  it('#changeIconCheckBox should return iconCheckBox is none (0)', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [];

    // Action
    instance.changeIconCheckBox();

    // Assert
    expect(instance.iconCheckBox).toBe(IconCheckBox.none);
  });

  it('#changeIconCheckBox should return iconCheckBox is all (2)', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeAllMarkedTicketModel];

    // Action
    instance.changeIconCheckBox();

    // Assert
    expect(instance.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('#changeIconCheckBox should return iconCheckBox is any (1)', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeUncheckedAllMarkedTicketModel];

    // Action
    instance.changeIconCheckBox();

    // Assert
    expect(instance.iconCheckBox).toBe(IconCheckBox.any);
  });

  it('#unmarkAllCheckedMarkedTickets should display tooltip when all is unchecked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeUncheckedAllMarkedTicketModel];
    instance.tooltip.display = jest.fn();

    // Action
    instance.unmarkAllCheckedMarkedTickets();

    // Assert
    expect(instance.tooltip.display).toHaveBeenCalledWith('invalid-data', LABELS.EMPTY_MATCH);
  });

  it('updateAllMarkedTickets event should emit with expected param after call #unmarkAllCheckedMarkedTickets', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeAllMarkedTicketModel];

    // Action
    instance.unmarkAllCheckedMarkedTickets();

    // Assert
    expect(instance.updateAllMarkedTickets.emit).toHaveBeenCalledWith([Helper.fakeAllMarkedTicketModel]);
  });

  it('#convertToGMT8 should return expected date (GMT8)', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const date = new Date('2020-03-11 18:59:59.000');

    // Action
    const actual = instance.convertToGMT8(date);

    // Assert
    expect(moment(actual).format('YYYY-MM-DD HH:mm:ss')).toBe('2020-03-12 06:59:59');
  });

  it('refreshData event should emit and set iconCheckBox is all after call #refreshTickets', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.refreshTickets();

    // Assert
    expect(instance.refreshData.emit).toHaveBeenCalledTimes(1);
    expect(instance.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('#getMatchsParam should return AllMarkedTicketModel is selected', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = [Helper.fakeAllMarkedTicketModel, Helper.fakeOTherAllMarkedTicketModel];
    // Action
    const actual = instance.getMatchsParam();

    // Assert
    expect(actual.length).toBe(2);
    expect(instance.iconCheckBox).toBe(IconCheckBox.all);
  });

  it('#getShowMatchId display MatchId when ChildMatchId is Null', async() => {
    // Arrange
    const { instance } = await shallow.render();
    let matchId = '111';
    let childMatchId = null;

    // Action
    const actual = instance.getShowMatchId(matchId, childMatchId);

    // Assert
    expect(actual).toBe(`111`);
  });

  it('#getShowMatchId display MatchId and ChildMatchId when ChildMatchId not Null', async() => {
    // Arrange
    const { instance } = await shallow.render();
    let matchId = '111';
    let childMatchId = '222';

    // Action
    const actual = instance.getShowMatchId(matchId, childMatchId);

    // Assert
    expect(actual).toBe(`111\n(222)`);
  });

});
