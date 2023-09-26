import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shallow } from 'shallow-render';
import { PagingComponent } from '../../../utility/components/paging/paging/paging.component';
import { PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Product } from '../../../utility/constants/config';
import { PipeModule } from '../../../utility/pipes/pipe.module';
import { SummaryItem } from '../summary/summary.model';
import { TicketsModel } from './ticket.model';
import { TicketsComponent } from './tickets.component';

class Helper {
  static readonly ticketsSelector = 'div.tickets';
  static readonly titleSelector = 'div.grid-title-label';
  static readonly noDataSelector = '.no-data';
  static readonly htmlRender = '<tickets [isShowTickets]="isShowTickets" [model]="ticketsModel"></tickets>';
  static getFakeTicketsModel(): TicketsModel {
    const model = new TicketsModel();
    model.title = 'Title';
    model.item = new SummaryItem('ABC', 100, false, '12Bet', '2', [], 'Handicap', 1);
    model.tickets = [
      {
        ballSequence: null,
        betId: '109631441656',
        betType: 'Handicap',
        choice: '<div class=""><span class="underdog">Harrogate Town<span class="handicap"> 1.5</span></span></div>',
        currency: 'UUS',
        isMarked: false,
        member: '12BETUUS01002',
        odds: '<span class="underdog"><font color="#B50000">-0.9</font></span> (<span class="oddstype">MY</span>)',
        secondAcceptFlag: '',
        stake: '<div class="stake">100</div>',
        status: '<div class="status">Running</div>',
        transDate: '08/26/2020 10:37:00 PM',
        winLoss: ''
      }
    ];
    return model;
  }
  static getFakeTicketsModelNoData(): TicketsModel {
    const model = new TicketsModel();
    model.title = 'NoData';
    model.tickets = [];

    return model;
  }
}

describe('TicketsComponent', () => {
  @NgModule({
    declarations: [
      PagingComponent
    ],
    imports: [
      PipeModule,
      FormsModule
    ],
    providers: []
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsComponent, AppModuleTest);
  });

  it('#ngOnInit should return expected paging.selection', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.ngOnInit();

    // Assert
    expect(instance.paging.selection.length).toBe(4);
  });

  it('#ngOnChanges should return expected paging model', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = Helper.getFakeTicketsModel();

    // Action
    instance.ngOnInit();
    instance.ngOnChanges();

    // Assert
    expect(instance.paging.total).toBe(instance.model.item.total);
    expect(instance.paging.pageSize).toBe(instance.paging.selection[0]);
  });

  it('#getWidth should return width correctly', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const testCases = [
      { product: Product.SPORTS_BOOK, width: '1275px' },
      { product: Product.NUMBER_GAME, width: '1335px' }
    ];

    // Action and Assert
    for (const item of testCases) {
      instance.product = item.product;
      expect(instance.getWidth()).toBe(item.width);
    }
  });

  it('#exportExcelEvent should emit with expected param when call #exportExcel', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.model = Helper.getFakeTicketsModel();
    instance.exportExcelEvent.emit = jest.fn();

    // Action
    instance.exportExcel();

    // Assert
    expect(instance.exportExcelEvent.emit).toHaveBeenCalledWith(instance.model.item);
  });

  it('#pagingSearchTicket should emit with expected param when call #pagingEvent', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.paging = new PagingModel();
    instance.pagingSearchTicket.emit = jest.fn();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.pagingSearchTicket.emit).toHaveBeenCalledWith(instance.paging);
  });

  it('should display content html of TicketsComponent when isShowTickets is true', async () => {
    const { fixture, find } = await shallow.render(Helper.htmlRender, {
      bind: {
        isShowTickets: true,
        ticketsModel: Helper.getFakeTicketsModel()
      }
    });
    fixture.detectChanges();

    expect(find(Helper.ticketsSelector)).toHaveFoundOne();
  });

  it('should display title when have tickets', async() => {
    const { fixture, find } =  await shallow.render(Helper.htmlRender, {
      bind: {
        isShowTickets: true,
        ticketsModel: Helper.getFakeTicketsModel()
      }
    });
    fixture.detectChanges();

    expect(find(Helper.titleSelector)).toHaveFoundOne();
    expect(find(Helper.titleSelector).nativeElement.textContent.trim()).toBe('Title');
  });

  it('should display no-data when haven\'t tickets', async() => {
    const { fixture, find } =  await shallow.render(Helper.htmlRender, {
      bind: {
        isShowTickets: true,
        ticketsModel: Helper.getFakeTicketsModelNoData()
      }
    });
    fixture.detectChanges();

    expect(find(Helper.noDataSelector)).toHaveFoundOne();
    expect(find(Helper.titleSelector)).toHaveFound(0);
  });

  it('when #modelChange of PagingComponent emit, #pagingEvent should be called', async () => {
    const { fixture, instance, findComponent } = await shallow.render(Helper.htmlRender, {
      bind: {
        isShowTickets: true,
        ticketsModel: Helper.getFakeTicketsModel()
      }
    });
    fixture.detectChanges();
    instance.pagingEvent = jest.fn();
    const pagingComponent = findComponent(PagingComponent);
    pagingComponent.modelChange.emit(new PagingModel());

    expect(instance.pagingEvent).toHaveBeenCalledTimes(1);
  });
});
