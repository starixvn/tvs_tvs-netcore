import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { GroupModel } from './group-tickets.model';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsModel } from './tickets.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagingComponent } from '../../../utility/components/paging/paging/paging.component';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';

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
    groups: [
      {
        name: 'Credit',
        displayTotalTickets: 3,
        tickets: [
          {
            no: 1, betId: '108495160329', value: 108495160329, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
          },
          {
            no: 2, betId: '108495160330', value: 108495160330, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
          },
          {
            no: 3, betId: '108495160331', value: 108495160331, transDate: '03/31/2020 02:02:34.030 AM', member: 'AB88UUS01BetTrade', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked: false, secondAcceptFlag: '', isChecked: true, isCancelCashOutis: false
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
    singleTransIds: [108495160329, 108495160330, 108495160331],
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
  let component: TicketsListComponent;
  let fixture: ComponentFixture<TicketsListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsListComponent);
    component = fixture.componentInstance;
  });

  it('#ngOnInit should call #clickBody', async () => {
    // Arrange
    component.clickBody = jest.fn();

    // Action
    component.ngOnInit();

    // Assert
    expect(component.clickBody).toHaveBeenCalledTimes(1);
  });

  it('#changeTickets should emit ticketsChange and return expected showMessageBetTrade', async () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    component.model.getNumberOfCheckedTickets = jest.fn().mockImplementation(() => 3);
    component.ticketsChange.emit = jest.fn();

    // Action
    component.changeTickets();

    // Assert
    expect(component.ticketsChange.emit).toHaveBeenCalledTimes(1);
    expect(component.ticketsChange.emit).toHaveBeenCalledWith(3);
    expect(component.showMessageBetTrade).toBe(true);
  });

  it('should display no-data message when no tickets exist', () => {
    // Arrange
    component.model = Helper.getFakeNoTickets();
    fixture.detectChanges();

    // Assert
    expect(fixture.nativeElement.querySelector(Helper.nodataSelector)).toBeTruthy();
  });
  it('should display bet trade message when showMessageBetTrade is true', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    component.showMessageBetTrade = true;
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(fixture.nativeElement.querySelector(Helper.bettradeMessageSelector)).toBeTruthy();
  });

  it('should display checked tickets correctly after check/uncheck actions', () => {
    // Arrange
    component.model = Helper.renderTicketsModel();
    fixture.detectChanges();

    const checkedInputs = fixture.nativeElement.querySelectorAll(Helper.checkedInputSelector);

    // Act & Assert: Uncheck one item in group
    checkedInputs[1].checked = false;
    checkedInputs[1].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.model.getNumberOfCheckedTickets()).toBe(2);

    // Act & Assert: Uncheck one group
    checkedInputs[0].checked = false;
    checkedInputs[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.model.getNumberOfCheckedTickets()).toBe(0);

    // Act & Assert: Check one group
    checkedInputs[0].checked = true;
    checkedInputs[0].dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.model.getNumberOfCheckedTickets()).toBe(3);

    // Act & Assert: Click checkbox from header
    const headerCheckbox = fixture.nativeElement.querySelector(Helper.headerCheckBoxSelector);
    headerCheckbox.dispatchEvent(new Event('click'));
    expect(component.model.getNumberOfCheckedTickets()).toBe(3);

    headerCheckbox.dispatchEvent(new Event('click'));
    expect(component.model.getNumberOfCheckedTickets()).toBe(3);
  });
  
  it('should call #pagingEvent when PagingComponent emits modelChange event', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    component.pagingEvent = jest.fn();
    const pagingComponent: PagingComponent = fixture.debugElement
      .query((el) => el.componentInstance instanceof PagingComponent)
      .componentInstance;
    pagingComponent.model = { pageSize: 3000 } as PagingModel;

    // Act
    pagingComponent.modelChange.emit();

    // Assert
    expect(component.pagingEvent).toHaveBeenCalledTimes(1);
  });

  it('#ngOnChanges should set title when is DangerAccepted', async () => {
    // Arrange
    component.issueTypeId = Number(IssueTypeConstant.DANGER_ACCEPTED);
    component.model = Helper.getFakeTicketsModel();

    // Act
    component.ngOnChanges();

    // Assert
    expect(component.title).toBe('Void Time: 12:51:48 PM - 12:51:55 PM (Single Count: 3, Parlay Count: 0, Cancel CO: 0)');
  });
});
