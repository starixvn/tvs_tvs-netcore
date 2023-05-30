import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Shallow } from 'shallow-render';
import { PagingModule } from '../../../utility/components/paging/paging.module';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { GroupModel } from './group.model';
import { TicketModel } from './ticket.model';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';

class Helper {
    static readonly titleSelector = 'div.title-label';
    static readonly nodataSelector = '.no-data';
    static readonly bettradeMessageSelector = '.note-lasted-bettrade';
    static readonly checkedInputSelector = 'td.col-01 input[type=checkbox]';
    static readonly listCheckGroupIconSelector = 'span.icon-arrow-white-down';
    static readonly listCheckGroupSelector = 'div.list-check-groups';
    static readonly exportExcelButton = 'input[type=button]';
    static readonly fakeTicketsModel = {
      groups:[
        {
          name: 'Credit',
          displayTotalTickets: 3,
          tickets: [
            { no: 1, betId :'108495160329', value: '108495160329', transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
              odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
              currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
              choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: '0', isParlay: false, isDisable: false,
              isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
            },
            { no: 2, betId :'108495160330', value: '108495160330', transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
              odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
              currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
              choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: '0', isParlay: false, isDisable: false,
              isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
            },
            { no: 3, betId :'108495160331', value: '108495160331', transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
              odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
              currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
              choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId:'0', isParlay: false, isDisable: false,
              isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
            },
          ]
        }
      ],
      fromCheckTime: '2020-04-27 12:52:33.573',
      fromTransTime: '2020-04-27 12:51:48.573',
      toCheckTime: '2020-04-27 12:52:33.573',
      toTransTime: '2020-04-27 12:51:55.300',
      strFromTime: '12:51:48 PM',
      strToTime: '12:51:55 PM',
      totalItems: 24,
      singleCount: 3,
      parlayCount: 0,
      licenseesName: '',
      instantLicenseesName: ''
    };

    static getFakeTicketsModel(): TicketsModel {
      return JSON.parse(JSON.stringify(Helper.fakeTicketsModel));
    }

    static getFakeNoTickets(): TicketsModel {
      const data = new TicketsModel();
      data.groups = [];
      return data;
    }

    static renderTicketsModel(): TicketsModel {
      const data = new TicketsModel();
      data.groups = [];
      this.fakeTicketsModel.groups.forEach(item => {
        const group = new GroupModel(item.name, JSON.parse(JSON.stringify(item.tickets)));
        data.groups.push(group);
      });
      return data;
    }
  }

describe('TicketsComponent', () => {
    @NgModule({
        imports: [
            BrowserModule,
            FormsModule,
            PagingModule,
            PipeModule,
        ],
    })
    class AppModuleTest { }

    let shallow: Shallow<TicketsComponent>;

    beforeEach(() => {
      shallow = new Shallow(TicketsComponent, AppModuleTest);
    });

    it('TicketsComponent should display html and model correctly', async () => {
      // Arrange
      const { find, fixture, instance } = await shallow.render(
        '<tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets>',
        { bind:
            { ticketsModel: Helper.getFakeTicketsModel() }
        }
      );
      fixture.detectChanges();

      // Assert
      expect(fixture).toMatchSnapshot();
      expect(find(Helper.titleSelector).nativeElement.textContent).toBe('Void Time: 12:51:48 PM - 12:51:55 PM (Single Count: 3, Parlay Count: 0)');
      expect(instance.ticketsModel.groups.length).toBe(1);
      expect(instance.ticketsModel.groups[0].tickets.length).toBe(3);
      expect(find(Helper.nodataSelector)).toHaveFound(0);
    });

    it('TicketsComponent should display no-data', async () => {
      // Arrange
      const { find, fixture } = await shallow.render(
        '<tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets>',
        { bind:
            { ticketsModel: Helper.getFakeNoTickets() }
        }
      );
      fixture.detectChanges();

      // Assert
      expect(fixture).toMatchSnapshot();
      expect(find(Helper.nodataSelector)).toHaveFoundOne();
    });

    it('Should display bettrade message', async () => {
      // Arrange
      const { find, fixture, instance } = await shallow.render(
        '<tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets>',
        { bind:
            { ticketsModel: Helper.getFakeTicketsModel() }
        }
      );
      instance.showMessageBetTrade = true;
      fixture.detectChanges();

      // Assert
      expect(fixture).toMatchSnapshot();
      expect(find(Helper.bettradeMessageSelector)).toHaveFoundOne();
    });

    it('Should display <div class="list-check-groups" /> correctly after manipulate elements', async () => {
      const { find, fixture, instance } = await shallow.render(
        '<body><tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets></body>',
        { bind:
            { ticketsModel: Helper.renderTicketsModel() }
        }
      );
      fixture.detectChanges();
      expect(find(Helper.listCheckGroupSelector)).toHaveFound(0);

      instance.ticketsModel.updatePositionListCheckGroup = jest.fn();
      const listCheckGroupIconSelector = find(Helper.listCheckGroupIconSelector);
      listCheckGroupIconSelector.triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(find(Helper.listCheckGroupSelector)).toHaveFoundOne();
      expect(instance.isShowListCheckGroup).toBe(true);
    });

    it('#exportExcelEvent should emit when click button export excel', async () => {
      // Arrange
      const { find, fixture, instance } = await shallow.render(
        '<tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets>',
        { bind:
            { ticketsModel: Helper.getFakeTicketsModel() }
        }
      );
      fixture.detectChanges();
      const exportExcelButton = find(Helper.exportExcelButton);
      exportExcelButton.triggerEventHandler('click', {});

      // Assert
      expect(instance.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
    });

    it('#pagingSearchTicket should emit with expected model', async () => {
      // Arrange
      const { find, fixture, instance } = await shallow.render(
        '<tickets [ticketsModel]="ticketsModel" [isShowTickets]="true"></tickets>',
        { bind:
            { ticketsModel: Helper.getFakeTicketsModel() }
        }
      );
      fixture.detectChanges();
      instance.ticketsModel.pagingModel = new PagingModel();
      instance.changePagingEvent();

      // Assert
      expect(instance.pagingSearchTicket.emit).toHaveBeenCalledWith(new PagingModel());
    });

    it('#changeTickets should call #showWarningBetTradeTicket', async () => {
      // Arrange
      const { instance } = await shallow.render(
        {
          bind: { ticketsModel: Helper.getFakeTicketsModel()}
        }
      );
      instance.ticketsChange.emit = jest.fn();
      instance.ticketsModel.getNumberOfCheckedTickets = jest.fn();
      instance.showWarningBetTradeTicket = jest.fn();

      instance.changeTickets();

      // Assert
      expect(instance.ticketsChange.emit).toHaveBeenCalledTimes(1);
      expect(instance.ticketsModel.getNumberOfCheckedTickets).toHaveBeenCalledTimes(1);
      expect(instance.showWarningBetTradeTicket).toHaveBeenCalledTimes(1);
    });

    it('#showWarningBetTradeTicket should not update showMessageBetTrade ', async () => {
      // Arrange
      const { instance } = await shallow.render(
        {
          bind: { ticketsModel: Helper.getFakeTicketsModel()}
        }
      );
      instance.ticketsModel.groups = [];
      instance.showMessageBetTrade = false;

      instance.showWarningBetTradeTicket();

      // Assert
      expect(instance.showMessageBetTrade).toBeFalsy();
    });

    it('#showWarningBetTradeTicket should update showMessageBetTrade to true', async () => {
      // Arrange
      const { instance } = await shallow.render(
        {
          bind: { ticketsModel: Helper.getFakeTicketsModel()}
        }
      );
      const ticketModel = new TicketModel();
      ticketModel.mainTransId = '1';
      ticketModel.member = 'bettrade';
      ticketModel.isChecked = true;
      instance.ticketsModel.groups = [new GroupModel('', [ticketModel])];
      instance.showMessageBetTrade = false;

      instance.showWarningBetTradeTicket();

      // Assert
      expect(instance.showMessageBetTrade).toBeTruthy();
    });
});