import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../utility/components/block-ui/block-ui.module';
import { PagingComponent } from '../../../utility/components/paging/paging/paging.component';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { GroupModel } from './group-tickets.model';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsModel } from './tickets.model';

class Helper {
  static readonly titleSelector = 'div.title-tickets-list-label';
  static readonly nodataSelector = '.no-data';
  static readonly bettradeMessageSelector = '.note-lasted-bettrade';
  static readonly checkedInputSelector = 'td.col-tb-1 input[type=checkbox]';
  static readonly listCheckGroupIconSelector = 'span.icon-arrow-white-down';
  static readonly listCheckGroupSelector = 'div.list-check-groups';
  static readonly exportExcelButton = 'input[type=button]';
  static readonly headerCheckBoxSelector = '.checkbox-dropdown-list';
  static readonly fakeTicketsModel = {
    groups:[
      {
        name: 'Credit',
        displayTotalTickets: 3,
        tickets: [
          { no: 1, betId :'108495160329', value: 108495160329, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
          },
          { no: 2, betId :'108495160330', value: 108495160330, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
          },
          { no: 3, betId :'108495160331', value: 108495160331, transDate: '03/31/2020 02:02:34.030 AM', member: 'AB88UUS01BetTrade', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
          },
        ]
      }
    ],
    strFromTime: '12:51:48 PM',
    strToTime: '12:51:55 PM',
    total: 3,
    totalSingle: 3,
    totalParlay: 0,
    totalCancelCashOut: 0,
    licenseesName: '',
    instantLicenseesName: '',
    fromTime: new Date(),
    toTime: new Date(),
    singleTransIds: [108495160329,108495160330,108495160331],
    parlayTransIds: [],
    cancelCashOutTransIds: [],
    uncheckedTransIds: [],
    betTypes: ''
  };

  static getFakeTicketsModel(): TicketsModel {
    return JSON.parse(JSON.stringify(Helper.fakeTicketsModel))
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
      const group = new GroupModel(item.name, JSON.parse(JSON.stringify(item.tickets)), 24);
      data.groups.push(group);
    });
    return data;
  }
}

describe('TicketsListComponent', () => {
  @NgModule({
    declarations: [
      PagingComponent
    ],
    imports: [
      PipeModule,
      BlockUiModule,
      FormsModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketsListComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsListComponent, AppModuleTest);
  });

  it('#ngOnInit should call #clickBody', async() => {
    // Arrange
    const { instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    instance.clickBody = jest.fn();

    // Action
    instance.ngOnInit();

    // Assert
    expect(instance.clickBody).toHaveBeenCalledTimes(1);
  });

  it('#changeTickets should emit ticketsChange and return expected showMessageBetTrade', async() => {
    // Arrange
    const { instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    instance.model.getNumberOfCheckedTickets = jest.fn().mockImplementation(() => 3);
    instance.ticketsChange.emit = jest.fn();

    // Action
    instance.changeTickets();

    // Assert
    expect(instance.ticketsChange.emit).toHaveBeenCalledTimes(1);
    expect(instance.ticketsChange.emit).toHaveBeenCalledWith(3);
    expect(instance.showMessageBetTrade).toBe(true);
  });

  it('TicketsListComponent should display html and model correctly', async () => {
    // Arrange
    const { instance, fixture, find } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(find(Helper.titleSelector).nativeElement.textContent).toBe('Void Time: 12:51:48 PM - 12:51:55 PM (Single Count: 3, Parlay Count: 0)');
    expect(instance.model).toStrictEqual(Helper.getFakeTicketsModel());
    expect(find(Helper.nodataSelector)).toHaveFound(0);
  });

  it('TicketsComponent should display no-data', async () => {
    // Arrange
    const { find, fixture } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
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
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
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

  it('Should display checked tickets correctly after check/uncheck on betlist', async () => {
    const { find, fixture, instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.renderTicketsModel() }
      }
    );
    fixture.detectChanges();
    const checkedInputListSelector = find(Helper.checkedInputSelector);

    // uncheck one item in group on betlist
    checkedInputListSelector[1].nativeElement.checked = false;
    checkedInputListSelector[1].triggerEventHandler('change', { target: checkedInputListSelector[1].nativeElement });
    expect(instance.model.getNumberOfCheckedTickets()).toBe(2);

    // uncheck one group on betlist
    checkedInputListSelector[0].nativeElement.checked = false;
    checkedInputListSelector[0].triggerEventHandler('change', { target: checkedInputListSelector[0].nativeElement });
    expect(instance.model.getNumberOfCheckedTickets()).toBe(0);

    // check one group
    checkedInputListSelector[0].nativeElement.checked = true;
    checkedInputListSelector[0].triggerEventHandler('change', { target: checkedInputListSelector[0].nativeElement });
    expect(instance.model.getNumberOfCheckedTickets()).toBe(3);

    // click checkbox from header
    const headerCheckBoxSelector = find(Helper.headerCheckBoxSelector);
    headerCheckBoxSelector.triggerEventHandler('click', {});
    expect(instance.model.getNumberOfCheckedTickets()).toBe(3);

    headerCheckBoxSelector.triggerEventHandler('click', {});
    expect(instance.model.getNumberOfCheckedTickets()).toBe(3);
  });

  it('#exportExcelEvent should emit when click button export excel', async () => {
    // Arrange
    const { find, fixture, instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    instance.exportExcelEvent.emit = jest.fn();
    fixture.detectChanges();
    const exportExcelButton = find(Helper.exportExcelButton);
    exportExcelButton.triggerEventHandler('click', {});

    // Assert
    expect(instance.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('when PagingComponent modelChange event emit, #pagingEvent should be called', async () => {
    // Arrange
    const { findComponent, instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    instance.pagingEvent = jest.fn();
    const pagingComponent = findComponent(PagingComponent);
    pagingComponent.modelChange.emit();

    // Assert
    expect(instance.pagingEvent).toHaveBeenCalledTimes(1);
  });

  it('#initTitle should set title when is DangerAccepted', async () => {
    // Arrange
    const { instance } = await shallow.render(
      '<tickets-list [(model)]="ticketsModel"></tickets-list>',
      { bind:
          { ticketsModel: Helper.getFakeTicketsModel() }
      }
    );
    instance.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    instance.initTitle();

    // Assert
    expect(instance.title).toBe('Void Time: 12:51:48 PM - 12:51:55 PM (Single Count: 3, Parlay Count: 0, Cancel CO: 0)');
  });
});
