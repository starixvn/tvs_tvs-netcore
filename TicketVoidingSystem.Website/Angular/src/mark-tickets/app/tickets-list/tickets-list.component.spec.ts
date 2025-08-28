import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TEXT} from '../../../utility/constants/text';
import { BetID } from '../../../utility/models/bet-id.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsModel } from './tickets.model';
import { By } from '@angular/platform-browser';
import { TestingModule } from '../../../utility/modules/testing.module';
import { EventEmitter } from '@angular/core';
import { MarkedTicketQuery } from '../models/query.model';

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
      isChecked: true,
      siteDbGroupId: 0
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
      isChecked: true,
      siteDbGroupId: 0
    }];

    const groups = new GroupModel('MBC', tickets, []);
    const model = new TicketsModel();
    model.groups = [groups];
    model.totalItemsList = [
      { transId: '108936575088' } as BetID,
      { transId: '108936575089' } as BetID
    ];
    model.tempUncheckedList = ['108936575089'];

    return model;
  }
}

describe('TicketsListComponent', () => {
  let component: TicketsListComponent;
  let fixture: ComponentFixture<TicketsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsListComponent);
    component = fixture.componentInstance;
    
    // Mock event emitters
    component.ticketsChange = new EventEmitter<number>();
    component.updateMarkedTickets = new EventEmitter<MarkedTicketQuery>();
    
    // Mock functions
    component.clickBody = jest.fn();
    component.exportExcel = jest.fn();
    component.showListCheckGroup = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty model groups', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = new TicketsModel();
    component.model.groups = [];
    component.clickBody = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(component.clickBody).toHaveBeenCalled();
  });

  it('should initialize with expected model groups', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.clickBody = jest.fn();

    // Act
    component.ngOnInit();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(component.clickBody).toHaveBeenCalled();
  });

  it('should handle checkbox select all tickets correctly', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.ticketsChange.emit = mockEmit;
    fixture.detectChanges();

    // Act & Assert - First click (uncheck all)
    const checkboxAll = fixture.debugElement.query(By.css('span.checkbox-dropdown-list'));
    checkboxAll.triggerEventHandler('click', {});
    expect(checkboxAll).toBeTruthy();
    expect(mockEmit).toHaveBeenCalledWith(0);
    expect(component.model.groups[0].tickets[0].isChecked).toBe(false);
    expect(component.model.groups[0].tickets[1].isChecked).toBe(false);

    // Act & Assert - Second click (check all)
    checkboxAll.triggerEventHandler('click', {});
    expect(mockEmit).toHaveBeenCalledWith(2);
    expect(component.model.groups[0].tickets[0].isChecked).toBe(true);
    expect(component.model.groups[0].tickets[1].isChecked).toBe(true);
  });

  it('should call exportExcel when clicking export excel button', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.exportExcel = jest.fn();
    fixture.detectChanges();

    // Act
    const buttonExportExcel = fixture.debugElement.query(By.css('input.title-tickets-list-toolbox-excel'));
    buttonExportExcel.triggerEventHandler('click', {});

    // Assert
    expect(buttonExportExcel).toBeTruthy();
    expect(component.exportExcel).toHaveBeenCalled();
  });

  it('should call showListCheckGroup when clicking show list group icon', () => {
    // Arrange
    component.isShowTickets = true;
    component.model = Helper.getFakeTicketsModel();
    component.showListCheckGroup = jest.fn();
    fixture.detectChanges();

    // Act
    const iconShowListGroup = fixture.debugElement.query(By.css('span.icon-arrow-white-down'));
    iconShowListGroup.triggerEventHandler('click', {});

    // Assert
    expect(iconShowListGroup).toBeTruthy();
    expect(component.showListCheckGroup).toHaveBeenCalled();
  });

  it('should display tooltip when marking selected tickets on page with no transid', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.groups = [];
    component.tooltip.display = jest.fn();

    // Act
    component.markSelectedTicketsOnPage();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('invalid-data', TEXT.EMPTY_TICKET);
  });

  it('should emit updateMarkedTickets event when marking selected tickets on page', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.updateMarkedTickets.emit = mockEmit;

    // Act
    component.markSelectedTicketsOnPage();

    // Assert
    expect(mockEmit).toHaveBeenCalledWith({
      tickets: component.model.getTicketsParam(),
      checkPermissionTickets: component.model.getAllTickets()
    } as MarkedTicketQuery);
  });

  it('should display tooltip when marking selected tickets on all pages with no transid', () => {
    // Arrange
    component.model = new TicketsModel();
    component.model.totalItemsList = [];
    component.tooltip.display = jest.fn();

    // Act
    component.markSelectedTicketsAllPage();

    // Assert
    expect(component.tooltip.display).toHaveBeenCalledWith('invalid-data', TEXT.EMPTY_TICKET);
  });

  it('should emit updateMarkedTickets event when marking selected tickets on all pages', () => {
    // Arrange
    component.model = Helper.getFakeTicketsModel();
    const mockEmit = jest.fn();
    component.updateMarkedTickets.emit = mockEmit;

    // Act
    component.markSelectedTicketsAllPage();

    // Assert
    expect(mockEmit).toHaveBeenCalledWith({
      tickets: component.model.getTicketsParamWithAllPage(),
      checkPermissionTickets: component.model.getAllTickets()
    } as MarkedTicketQuery);
  });

  describe('GroupModel', () => {
    it('should map tickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel('', [], []);
      const ticket = new TicketModel();
      ticket.value = '111';
      groupModel.uncheckedTicketList = ['111'];

      // Act
      groupModel.mapTickets([ticket]);

      // Assert
      expect(ticket.isChecked).toBe(true);
    });

    it('should handle defaultSpecialGroup correctly', () => {
      // Arrange
      const ticket = new TicketModel();
      const groupModel = new GroupModel('', [], []);
      groupModel.tickets = [ticket];
      groupModel.name = 'phone betting';

      // Act
      groupModel.defaultSpecialGroup();

      // Assert
      expect(groupModel.isCheckAll).toBe(false);
    });

    it('should handle getEnableSingleTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel('', [], []);
      groupModel.isCheckAll = false;

      // Act
      groupModel.getEnableSingleTickets();

      // Assert
      expect(groupModel.isCheckAll).toBe(false);
    });

    it('should handle getDisableBonusTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel('', [], []);
      groupModel.isCheckAll = false;

      // Act
      groupModel.getDisableBonusTickets();

      // Assert
      expect(groupModel.isCheckAll).toBe(false);
    });

    it('should handle getEnableParlayTickets correctly', () => {
      // Arrange
      const groupModel = new GroupModel('', [], []);
      groupModel.isCheckAll = false;

      // Act
      groupModel.getEnableParlayTickets();

      // Assert
      expect(groupModel.isCheckAll).toBe(false);
    });
  });
});