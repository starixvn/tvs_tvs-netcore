import { TicketsListComponent } from './tickets-list.component';
import { PagingModule } from '../../../../../utility/modules/paging/paging.module';
import { Shallow } from 'shallow-render';
import { NgModule } from '@angular/core';
import { BlockUiModule } from '../../../../../utility/modules/block-ui/block-ui.module';
import { PipeModule } from '../../../../../utility/modules/pipes/pipe.module';
import { TableTicketsModel } from './table-tickets.model';
import { PagingModel } from '../../../../../utility/modules/paging/paging/paging.model';

class Helper {
  static readonly titleSelector = 'div.title-tickets-list-label';
  static readonly nodataSelector = '.no-data';
  static readonly fakeTicketsModel = {
    groups: [
      {
        name: 'Credit',
        displayTotalTickets: 3,
        tickets: [
          { no: 1, betId : '108495160329', value: 108495160329, transDate: '11/09/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Handicap',
            odds: '', stake: '', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isCancelCashOutis: false, Bonus: false, isMarked: false, secondAcceptFlag: ''
          },
          { no: 2, betId : '108495160330', value: 108495160330, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Waiting</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isCancelCashOutis: false, isBonus: false, isMarked: false, secondAcceptFlag: ''
          },
          { no: 3, betId : '108495160331', value: 108495160331, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>', winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score: '', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0,
            isParlay: false, isDisable: false, isCricket: false, isCancelCashOutis: false, isBonus: false, isMarked: false, secondAcceptFlag: ''
          },
        ]
      }
    ],
    total: 3,
    totalSingle: 3,
    totalParlay: 0,
    totalCancelCashOut: 0,
    licenseesName: 'N8B',
    fromTime: '2020-03-31 14:02:34.030',
    toTime: '2020-03-31 14:02:34.040',
    singleTransIds: [108495160329, 108495160330, 108495160331],
    parlayTransIds: [],
    cancelCashOutTransIds: [],
    uncheckedTransIds: []
  };
  static getFakeTicketsModel(): TableTicketsModel {
    const ticketsModel = new TableTicketsModel();
    ticketsModel.initData(JSON.parse(JSON.stringify(Helper.fakeTicketsModel)));
    return ticketsModel;
  }
}

describe('TicketsListComponent', () => {
  @NgModule({
    imports: [
      BlockUiModule,
      PipeModule,
      PagingModule
    ]
  })
  class AppModuleTest { }

  let shallow: Shallow<TicketsListComponent>;

  beforeEach(() => {
    shallow = new Shallow(TicketsListComponent, AppModuleTest);
  });

  it('#pagingEvent should emit pagingChange with expected paging', async () => {
    // Arrange
    const { instance } = await shallow.render({
      bind: {
        model: Helper.getFakeTicketsModel()
      }
    });
    instance.paging = new PagingModel();

    // Action
    instance.pagingEvent();

    // Assert
    expect(instance.pagingChange.emit).toHaveBeenCalledWith(instance.paging);
  });

  it('TicketsListComponent should display html and model correctly', async () => {
    // Arrange
    const { find, fixture, instance } = await shallow.render({
      bind: {
        model: Helper.getFakeTicketsModel()
      }
    });
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(find(Helper.titleSelector).nativeElement.textContent).toBe('Void Time: 02:02:34 PM - 02:02:34 PM (Single Count: 3, Parlay Count: 0)');
    expect(instance.model.groups.length).toBe(1);
    expect(instance.model.groups[0].tickets.length).toBe(3);
    expect(find(Helper.nodataSelector)).toHaveFound(0);
  });
});
