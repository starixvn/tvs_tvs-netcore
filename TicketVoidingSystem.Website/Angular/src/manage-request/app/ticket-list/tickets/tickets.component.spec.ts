import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { PagingComponent } from '../../../../utility/components/paging/paging/paging.component';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { PipeModule } from '../../../../utility/pipes/pipe.module';
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
    winloss: '',
    currency: 'UUS',
    status: '<div class="status1">Running</div>',
    creator: 'AB88UUS011260',
    score: '1 - 0',
    handicap: '',
    choice: '',
    voidTime: '08/19/2020 05:14:35 AM',
    isCashOut: false
  };

  static readonly fakeTicketsModel: TicketsModel = {
    groups: [
      {
        name: 'Deposit',
        displayTotalTickets: 4,
        isCollapse: false,
        tickets: [Helper.fakeTicketModel]
      }
    ],
    totalVoidedTickets: 4,
    totalCancelCashOut: 0,
    licenseeNames: '',
    generalBetTypeCombinations: '',
    cancelCashOutLicenseesName: ''
  };
}

describe('TicketsComponent', () => {
  @NgModule({
      declarations: [
        PagingComponent
      ],
      imports: [
        BlockUiModule,
        PipeModule
      ],
      providers: [
      ]
    })
  class AppModuleTest { }

  let shallow: Shallow<TicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsComponent, AppModuleTest);
  });

  it('#pagingEvent should call emit of pagingChange with expected param', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.pagingChange.emit = jest.fn();
    instance.paging = new PagingModel();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.pagingChange.emit).toHaveBeenCalledWith(new PagingModel());
  });

  it('#exportExcel should call emit of exportExcelEvent', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.exportExcelEvent.emit = jest.fn();

    // Action
    instance.exportExcel();

    // Assert
    expect(instance.exportExcelEvent.emit).toHaveBeenCalledTimes(1);
  });

  it('should display title and icon exportexcel when have tickets', async () => {
    // Arrange
    const { fixture, find } = await shallow
      .render('<tickets [model]="tickets"></tickets>', {
        bind: {
          tickets: Helper.fakeTicketsModel
        }
      });
    fixture.detectChanges();

    // Assert
    expect(find(Helper.titleSelector).nativeElement.textContent).toBe('Voided Tickets');
    expect(find(Helper.exportExcelButton)).toHaveFoundOne();
  });

  it('should display "There is no data" when have not tickets', async () => {
    // Arrange
    const { fixture, find } = await shallow
      .render('<tickets [model]="tickets"></tickets>', {
        bind: {
          tickets: new TicketsModel()
        }
      });
    fixture.detectChanges();

    // Assert
    expect(find(Helper.noDataSelector).nativeElement.textContent).toBe('There is no data');
  });

  it('when PagingComponent modelChange event emit, #pagingEvent should be called', async () => {
    // Arrange
    const { fixture, findComponent, instance } = await shallow.render();
    fixture.detectChanges();
    instance.pagingEvent = jest.fn();
    const pagingComponent = findComponent(PagingComponent);
    pagingComponent.modelChange.emit();

    // Assert
    expect(instance.pagingEvent).toHaveBeenCalledTimes(1);
  });
});
