import { ElementRef, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { LABELS } from '../../../utility/constants/labels';
import { BlockUiModule } from '../../../utility/modules/block-ui/block-ui.module';
import { PagingModule } from '../../../utility/modules/paging/paging.module';
import { PipeModule } from '../../../utility/modules/pipes/pipe.module';
import { SanitizeHtmlPipe } from '../../../utility/modules/pipes/sanitize-html.pipe';
import { ToolTipModule } from '../../../utility/modules/tooltip/tooltip.module';
import { MarkedTicketQuery } from '../models/query.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsModel } from './tickets.model';

class Helper {
  public static getFakeTicketsModel(): TicketsModel {
    const tickets: TicketModel[] = [{
      betId: '108936575088',
      value: '108936575088',
      no: 1,
      member: 'i-emvictor',
      betType: 'Handicap',
      transDate: '04/27/2020 12:51:48.573 AM',
      choice: '',
      stake: '<div class=\"stake\">1,000</div>',
      odds: '<span class=\"underdog\"><font color="#B50000">-0.89</font></span> (<span class=\"oddstype\">MY</span>)',
      currency: 'UUS',
      handicap: '-1.75',
      score: '',
      winLoss: '-',
      soldId: null,
      status: '<div class=\"status\">Running</div>',
      mainTransId: '0',
      isDisable: false,
      isCricket: false,
      isChecked: true
    },
    {
      betId: '108936575089',
      value: '108936575089',
      no: 2,
      member: 'i-emvictor',
      betType: 'Handicap',
      transDate: '04/27/2020 12:51:48.573 AM',
      choice: '',
      stake: '<div class=\"stake\">1,000</div>',
      odds: '<span class=\"underdog\"><font color="#B50000">-0.89</font></span> (<span class=\"oddstype\">MY</span>)',
      currency: 'UUS',
      handicap: '1.75',
      score: '',
      winLoss: '-',
      soldId: null,
      status: '<div class=\"status\">Running</div>',
      mainTransId: '0',
      isDisable: false,
      isCricket: false,
      isChecked: true
    }];

    const groups = new GroupModel('MBC', tickets, []);
    const model = new TicketsModel();
    model.groups = [groups];
    model.totalItemsList = ['108936575088', '108936575089'];
    model.tempUncheckedList = ['108936575089'];

    return model;
  }
}

@NgModule({
  declarations: [TicketsListComponent],
  imports: [
    BlockUiModule,
    FormsModule,
    PagingModule,
    PipeModule,
    ToolTipModule
  ],
})
class ModuleTest { }

describe('TicketsListComponent', () => {
  let shallow: Shallow<TicketsListComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsListComponent, ModuleTest)
      .mock(ElementRef, {});
  });

  it('TicketsListComponent init with empty model groups should match snapshot', async () => {
    const mockClickBody = jest.fn();
    const { fixture, instance } = await shallow.render();
    instance.isShowTickets = true;
    instance.model = new TicketsModel();
    instance.model.groups = [];

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
    instance.clickBody = mockClickBody;
    instance.ngOnInit();
    expect(mockClickBody).toBeCalledTimes(1);
    expect(mockClickBody).toBeCalledWith();
  });

  it('TicketsListComponent init with expected model groups should match snapshot', async () => {
    const mockClickBody = jest.fn();
    const { fixture, instance } = await shallow
    .dontMock(SanitizeHtmlPipe)
    .render();
    instance.isShowTickets = true;
    instance.model = Helper.getFakeTicketsModel();

    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
    instance.clickBody = mockClickBody;
    instance.ngOnInit();
    expect(mockClickBody).toBeCalledTimes(1);
    expect(mockClickBody).toBeCalledWith();
  });

  it('Should checked/unchecked correctly and ticketsChange event emit with expected tickets when click Check box select all tickets',
    async () => {
    const { fixture, instance, find } = await shallow
    .dontMock(SanitizeHtmlPipe)
    .render();
    instance.isShowTickets = true;
    instance.model = Helper.getFakeTicketsModel();
    fixture.detectChanges();

    const checkboxAll = find('span.checkbox-dropdown-list');
    checkboxAll.triggerEventHandler('click', {});
    expect(checkboxAll).toHaveFound(1);
    expect(instance.ticketsChange.emit).toHaveBeenCalledWith(0);
    expect(instance.model.groups[0].tickets[0].isChecked).toBe(false);
    expect(instance.model.groups[0].tickets[1].isChecked).toBe(false);

    checkboxAll.triggerEventHandler('click', {});
    expect(instance.ticketsChange.emit).toHaveBeenCalledWith(2);
    expect(instance.model.groups[0].tickets[0].isChecked).toBe(true);
    expect(instance.model.groups[0].tickets[1].isChecked).toBe(true);
  });

  it('Should call #exportExcel when click button export excel', async () => {
    const mockExportExcel = jest.fn();
    const { fixture, instance, find } = await shallow
    .dontMock(SanitizeHtmlPipe)
    .render();
    instance.isShowTickets = true;
    instance.model = Helper.getFakeTicketsModel();
    instance.exportExcel = mockExportExcel;
    fixture.detectChanges();
    const buttonExportExcel = find('input.title-tickets-list-toolbox-excel');
    buttonExportExcel.triggerEventHandler('click', {});

    expect(buttonExportExcel).toHaveFound(1);
    expect(mockExportExcel).toBeCalledTimes(1);
    expect(mockExportExcel).toBeCalledWith();
  });

  it('Should call #showListCheckGroup when click icon show list group', async () => {
    const mockShowListCheckGroup = jest.fn();
    const { fixture, instance, find } = await shallow
    .dontMock(SanitizeHtmlPipe)
    .render();
    instance.isShowTickets = true;
    instance.model = Helper.getFakeTicketsModel();
    instance.showListCheckGroup = mockShowListCheckGroup;
    fixture.detectChanges();
    const iconShowListGroup = find('span.icon-arrow-white-down');
    iconShowListGroup.triggerEventHandler('click', {});

    expect(iconShowListGroup).toHaveFound(1);
    expect(mockShowListCheckGroup).toBeCalledTimes(1);
    expect(mockShowListCheckGroup).toBeCalledWith();
  });

  it('#markSelectedTicketsOnPage should display tooltip when do not any transid ', async () => {
    const { instance } = await shallow.render();
    instance.model = new TicketsModel();
    instance.model.groups = [];
    instance.tooltip.display = jest.fn();
    instance.markSelectedTicketsOnPage();

    expect(instance.tooltip.display).toHaveBeenCalledWith('invalid-data', LABELS.EMPTY_TICKET);
  });

  it('#markSelectedTicketsOnPage should emit updateMarkedTickets event with expected param  ', async () => {
    const { instance } = await shallow.render();
    instance.model = Helper.getFakeTicketsModel();
    const query = new MarkedTicketQuery();
    query.transIds = '108936575088,108936575089';
    instance.markSelectedTicketsOnPage();

    expect(instance.markedTicketsQuery.transIds).toBe('108936575088,108936575089');
    expect(instance.updateMarkedTickets.emit).toHaveBeenCalledWith(query);
  });

  it('#markSelectedTicketsAllPage should display tooltip when do not any transid ', async () => {
    const { instance } = await shallow.render();
    instance.model = new TicketsModel();
    instance.model.totalItemsList = [];
    instance.tooltip.display = jest.fn();
    instance.markSelectedTicketsAllPage();

    expect(instance.tooltip.display).toHaveBeenCalledWith('invalid-data', LABELS.EMPTY_TICKET);
  });

  it('#markSelectedTicketsAllPage should emit updateMarkedTickets event with expected param  ', async () => {
    const { instance } = await shallow.render();
    instance.model = Helper.getFakeTicketsModel();
    const query = new MarkedTicketQuery();
    query.transIds = '108936575088';

    instance.markSelectedTicketsAllPage();

    expect(instance.markedTicketsQuery.transIds).toBe('108936575088');
    expect(instance.updateMarkedTickets.emit).toHaveBeenCalledWith(query);
  });
  
  it('#GroupModel should call mapTickets', async () => {
    const groupModel = new GroupModel('', [], []);
    const ticket = new TicketModel();
    ticket.value = '111';
    groupModel.uncheckedTicketList = ['111'];
    groupModel.mapTickets([ticket]);

    expect(ticket.isChecked).toBe(true);
  });
  
  it('#GroupModel should call defaultSpecialGroup', async () => {
    const ticket = new TicketModel();
    const groupModel = new GroupModel('', [], []);
    groupModel.tickets = [ticket];
    groupModel.name = 'phone betting';
    groupModel.defaultSpecialGroup();

    expect(groupModel.isCheckAll).toBe(false);
  });
  
  it('#GroupModel should call getEnableSingleTickets', async () => {
    const groupModel = new GroupModel('', [], []);
    groupModel.isCheckAll = false;
    groupModel.getEnableSingleTickets();
    
    expect(groupModel.isCheckAll).toBe(false);
  });
  
  it('#GroupModel should call getDisableBonusTickets', async () => {
    const groupModel = new GroupModel('', [], []);
    groupModel.isCheckAll = false;
    groupModel.getDisableBonusTickets();
    
    expect(groupModel.isCheckAll).toBe(false);
  });
  
  it('#GroupModel should call getEnableParlayTickets', async () => {
    const groupModel = new GroupModel('', [], []);
    groupModel.isCheckAll = false;
    groupModel.getEnableParlayTickets();
    
    expect(groupModel.isCheckAll).toBe(false);
  });
});