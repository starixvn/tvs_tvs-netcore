import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../modules/testing.module';
import { TicketsComponent } from './tickets.component';
import { TicketsModel } from './tickets.model';
import { PagingModel } from '../paging/paging.model';
import { TicketsService } from './tickets.service';
import { GroupModel } from './group.model';

class Helper {
  static readonly fakeTicketsModel: TicketsModel = {
    id: 1,
    totalItems: 2,
    singleCount: 1,
    parlayCount: 1,
    groups: [
      new GroupModel('Test Group', [
        {
          member: 'BetTrade',
          isChecked: true,
          value: '1',
          mainTransId: '1',
          siteDbGroupId: '1',
          isDisable: false,
          status: 'active',
          isCricket: false
        } as any,
        {
          member: 'Normal',
          isChecked: false,
          value: '2',
          mainTransId: '2',
          siteDbGroupId: '2',
          isDisable: false,
          status: 'active',
          isCricket: false
        } as any
      ])
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
      ],
      providers: [TicketsService]
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
    component.ticketsService.updatePositionListCheckGroup = jest.fn();

    // Action
    component.showListCheckGroup();

    // Assert
    expect(component.isShowListCheckGroup).toBe(true);
    expect(component.ticketsService.updatePositionListCheckGroup).toHaveBeenCalledTimes(1);
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
    expect(component.showWarningBetTradeTicket).toHaveBeenCalledTimes(1);
    expect(component.ticketsChange.emit).toHaveBeenCalled();
  });

  it('#showWarningBetTradeTicket should set showMessageBetTrade to true when last ticket is BetTrade and checked', () => {
    // Arrange
    component.ticketsModel = {
      groups: [
        new GroupModel('Test Group', [
          {
            member: 'Normal',
            isChecked: false,
            value: '1',
            mainTransId: '1',
            siteDbGroupId: '1',
            isDisable: false,
            status: 'active',
            isCricket: false
          } as any,
          {
            member: 'BetTrade',
            isChecked: true,
            value: '2',
            mainTransId: '2',
            siteDbGroupId: '2',
            isDisable: false,
            status: 'active',
            isCricket: false
          } as any
        ])
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
        new GroupModel('Test Group', [
          {
            member: 'Normal',
            isChecked: true,
            value: '1',
            mainTransId: '1',
            siteDbGroupId: '1',
            isDisable: false,
            status: 'active',
            isCricket: false
          } as any
        ])
      ]
    } as TicketsModel;
    component.showMessageBetTrade = false;

    // Action
    component.showWarningBetTradeTicket();

    // Assert
    expect(component.showMessageBetTrade).toBe(false);
  });
});
