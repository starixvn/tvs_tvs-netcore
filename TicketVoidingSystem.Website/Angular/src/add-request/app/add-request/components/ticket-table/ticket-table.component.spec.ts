import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../../utility/modules/testing.module';
import { TicketTableComponent } from './ticket-table.component';
import { GroupTicketTableModel, TicketTableViewModel } from './ticket-table.model';
import bigDecimal from 'js-big-decimal';

describe('TicketTableComponent', () => {
  let component: TicketTableComponent;
  let fixture: ComponentFixture<TicketTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.model).toBeInstanceOf(TicketTableViewModel);
    expect(component.isBlock).toBeUndefined();
  });

  it('should show no data when groups is undefined', () => {
    component.model.groups = undefined;
    expect(component.isShowNoData()).toBeTruthy();
  });

  it('should show no data when groups is null', () => {
    component.model.groups = null;
    expect(component.isShowNoData()).toBeTruthy();
  });

  it('should show no data when groups is empty array', () => {
    component.model.groups = [];
    expect(component.isShowNoData()).toBeTruthy();
  });

  it('should show no data when all groups have displayTotalTickets = 0', () => {
    component.model.groups = [
      { displayTotalTickets: 0 },
      { displayTotalTickets: 0 }
    ] as unknown as GroupTicketTableModel[];
    expect(component.isShowNoData()).toBeTruthy();
  });

  it('should not show no data when at least one group has displayTotalTickets > 0', () => {
    component.model.groups = [
      { displayTotalTickets: 0 },
      { displayTotalTickets: 1 }
    ] as unknown as GroupTicketTableModel[];
    expect(component.isShowNoData()).toBeFalsy();
  });

  it('should emit correct winlost sum when changeWinlostCheckedTicket is called', () => {
    // Arrange
    const mockTickets = [
      { winLoss: '1,000' },
      { winLoss: '2,000' }
    ];
    component.model.getAllCheckedTickets = jest.fn().mockReturnValue(mockTickets);
    const spy = jest.spyOn(component.changeWinlost, 'emit');

    // Act
    component.changeWinLostCheckedTicket();

    // Assert
    expect(spy).toHaveBeenCalledWith(new bigDecimal(3000));
  });

  it('should handle empty checked tickets when changeWinlostCheckedTicket is called', () => {
    // Arrange
    component.model.getAllCheckedTickets = jest.fn().mockReturnValue([]);
    const spy = jest.spyOn(component.changeWinlost, 'emit');

    // Act
    component.changeWinLostCheckedTicket();

    // Assert
    expect(spy).toHaveBeenCalledWith(new bigDecimal(0));
  });

  it('should correctly convert string with comma to number', () => {
    // Using any to access private method for testing
    const componentAny = component as any;
    expect(componentAny.convertStringWithCommaToNumber('1,000')).toBe(1000);
    expect(componentAny.convertStringWithCommaToNumber('1,234,567')).toBe(1234567);
    expect(componentAny.convertStringWithCommaToNumber('0')).toBe(0);
  });
}); 