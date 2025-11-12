import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { TicketsComponent } from './tickets.component';
import { TicketModel, TicketsModel } from './tickets.model';

class Helper {
  static readonly titleSelector = '.title-tickets-list-label';
  static readonly exportExcelButton = 'input[type=button].title-tickets-list-toolbox-excel';
  static readonly noDataSelector = '.no-data';
  static readonly fakeTicketModel: TicketModel = {
    no: 1,
    betId: '1000',
    transDate: '08/19/2020 05:14:35 AM',
    member: 'AB88UUS01',
    betType: 'Handicap',
    odds: '<span class="underdog">9.3</span> <span class="oddstype"></span>',
    stake: '<div class="stake ">10</div>',
    winLoss: '',
    currency: 'UUS',
    status: '<div class="status1">Running</div>',
    creator: 'AB88UUS011260',
    score: '1 - 0',
    handicap: '',
    choice: '',
    voidTime: '08/19/2020 05:14:35 AM',
    isCashOut: false
  } as TicketModel;

  static readonly fakeTicketsModel: TicketsModel = {
    groups: [
      {
        name: 'Deposit',
        displayTotalTickets: 4,
        isCollapse: false,
        tickets: [Helper.fakeTicketModel]
      }
    ],
    totalTicketsProcessed: 4,
    totalCancelCashOutProcessed: 0,
    licenseeNames: '',
    generalBetTypeCombinations: '',
    cancelCashOutLicenseesName: ''
  };
}

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
    component.issueTypeId = 1;
  });


  it('#pagingEvent should call emit of pagingChange with expected param', async () => {
    // Arrange
    component.pagingChange.emit = jest.fn();
    component.paging = new PagingModel();

    // Action
    component.pagingEvent();

    // Assert
    expect(component.pagingChange.emit).toHaveBeenCalledWith(new PagingModel());
  });

  it('#exportExcel should call emit of exportExcelEvent', async () => {
    // Arrange
    component.exportExcelEvent.emit = jest.fn();

    // Action
    component.exportExcel();

    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should display title and icon exportExcel when have tickets', async () => {
    // Arrange
    component.model = Helper.fakeTicketsModel;
    fixture.detectChanges();

    // Act
    const title = fixture.nativeElement.querySelector(Helper.titleSelector);
    const exportExcelButton = fixture.nativeElement.querySelector(Helper.exportExcelButton);

    // Assert
    expect(title.textContent).toBe('Voided Tickets');
    expect(exportExcelButton).toBeTruthy();
  });

  it('should display "There is no data" when have no tickets', () => {
    // Arrange
    component.model = new TicketsModel();
    component.issueTypeId = 1;
    fixture.detectChanges();

    // Act
    const noDataElement = fixture.nativeElement.querySelector(Helper.noDataSelector);

    // Assert
    expect(noDataElement.textContent).toBe('There is no data');
  });

  it('when PagingComponent modelChange event emit, #pagingEvent should be called', async () => {
    // Arrange
    const mockEventPagingChange = jest.fn();
    component.pagingChange.emit = mockEventPagingChange;

    component.pagingEvent();

    // Assert
    expect(mockEventPagingChange).toHaveBeenCalledTimes(1);
  });

  it('#getTitle should return "Recovered Tickets" when isRecoverTicket returns true', () => {
    // Arrange
    component.issueTypeId = 22;

    // Act
    const result = component.getTitle();

    // Assert
    expect(result).toBe('Recovered Tickets');
  });

  it('#getTitle should return "Voided Tickets" when isRecoverTicket returns false', () => {
    // Arrange
    component.issueTypeId = 1;

    // Act
    const result = component.getTitle();

    // Assert
    expect(result).toBe('Voided Tickets');
  });
});
