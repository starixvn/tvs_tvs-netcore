import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../utility/modules/testing.module';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';
import { PagingModel } from '../../../utility/components/paging/paging.model';

class Helper {
  static readonly fakeTicketsModel: TicketsModel = {
    id: 1,
    totalItems: 2,
    singleCount: 1,
    parlayCount: 1,
    groups: [
      {
        tickets: [
          {
            member: 'BetTrade',
            isChecked: true
          },
          {
            member: 'Normal',
            isChecked: false
          }
        ]
      }
    ],
    pagingModel: new PagingModel(),
    updatePositionListCheckGroup: jest.fn(),
    getNumberOfCheckedTickets: jest.fn().mockReturnValue(1)
  } as unknown as TicketsModel;
}

describe('TicketsComponent', () => {
  let component: TicketsComponent;
  let fixture: ComponentFixture<TicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsComponent);
    component = fixture.componentInstance;
  });

  it('#ngOnInit should call clickBody', () => {
    // Arrange
    component.clickBody = jest.fn();

    // Action
    component.ngOnInit();

    // Assert
    expect(component.clickBody).toHaveBeenCalledTimes(1);
  });

  it('#showListCheckGroup should show list check group when groups exist', () => {
    // Arrange
    component.ticketsModel = Helper.fakeTicketsModel;
    component.isShowListCheckGroup = false;

    // Action
    component.showListCheckGroup();

    // Assert
    expect(component.isShowListCheckGroup).toBe(true);
    expect(component.ticketsModel.updatePositionListCheckGroup).toHaveBeenCalledWith(component.element);
  });

  it('#showListCheckGroup should not show list check group when groups empty', () => {
    // Arrange
    component.ticketsModel = { groups: [] } as TicketsModel;
    component.isShowListCheckGroup = false;

    // Action
    component.showListCheckGroup();

    // Assert
    expect(component.isShowListCheckGroup).toBe(false);
  });

  it('#clickBody should add click event listener to body', () => {
    // Arrange
    const mockBody = document.createElement('body');
    document.body = mockBody;
    const mockEvent = new MouseEvent('click');
    const mockElement = document.createElement('div');
    mockElement.className = 'list-check-groups-input';
    component.element.nativeElement.appendChild(mockElement);
    component.isShowListCheckGroup = true;

    // Action
    component.clickBody();
    document.body.dispatchEvent(mockEvent);

    // Assert
    expect(component.isShowListCheckGroup).toBe(false);
  });

  it('#exportExcel should emit exportExcelEvent', () => {
    // Arrange
    component.exportExcelEvent.emit = jest.fn();

    // Action
    component.exportExcel();

    // Assert
    expect(component.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('#changePagingEvent should emit pagingSearchTicket with pagingModel', () => {
    // Arrange
    component.ticketsModel = Helper.fakeTicketsModel;
    component.pagingSearchTicket.emit = jest.fn();

    // Action
    component.changePagingEvent();

    // Assert
    expect(component.pagingSearchTicket.emit).toHaveBeenCalledWith(component.ticketsModel.pagingModel);
  });

  it('#changeTickets should emit ticketsChange and call showWarningBetTradeTicket', () => {
    // Arrange
    component.ticketsModel = Helper.fakeTicketsModel;
    component.ticketsChange.emit = jest.fn();
    component.showWarningBetTradeTicket = jest.fn();

    // Action
    component.changeTickets();

    // Assert
    expect(component.ticketsChange.emit).toHaveBeenCalledWith(component.ticketsModel.getNumberOfCheckedTickets());
    expect(component.showWarningBetTradeTicket).toHaveBeenCalledTimes(1);
  });

  it('#showWarningBetTradeTicket should set showMessageBetTrade to true when last ticket is BetTrade and checked', () => {
    // Arrange
    component.ticketsModel = {
      groups: [
        {
          tickets: [
            {
              member: 'Normal',
              isChecked: false
            },
            {
              member: 'BetTrade',
              isChecked: true
            }
          ]
        }
      ]
    } as unknown as TicketsModel;
    component.showMessageBetTrade = false;

    // Action
    component.showWarningBetTradeTicket();

    // Assert
    expect(component.showMessageBetTrade).toBe(true);
  });

  it('#showWarningBetTradeTicket should set showMessageBetTrade to false when last ticket is not BetTrade', () => {
    // Arrange
    component.ticketsModel = {
      groups: [
        {
          tickets: [
            {
              member: 'Normal',
              isChecked: true
            }
          ]
        }
      ]
    } as TicketsModel;
    component.showMessageBetTrade = false;

    // Action
    component.showWarningBetTradeTicket();

    // Assert
    expect(component.showMessageBetTrade).toBe(false);
  });
});
