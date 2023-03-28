import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Shallow } from 'shallow-render';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { BlockUiModule } from '../../../../utility/components/block-ui/block-ui.module';
import { BalanceUp } from '../../../../utility/models/balance-up.model';
import { CommonService } from '../../../../utility/services/common.service';
import { HttpService } from '../../../../utility/services/http.service';
import { AppService } from '../../app.service';
import { GetTicketsQuery } from '../../models/query.model';
import { FilterTicketsComponent } from './filter-tickets.component';
import { Currency, FilterSearchBy } from './filter.model';
import { GroupLicensee, Licensee } from './match-id/licensees/licensees.model';
import { MatchIdComponent } from './match-id/match-id.component';

class Helper {
  static readonly fakeBalanceUp: BalanceUp = {
    balanceUpDay: new Date('2020-01-16'),
    moveBetsDay: new Date('2020-01-26')
  };

  static readonly fakeCurrency: Currency[] = [
    {
        currencyCode: 'RMB',
        id: 13
    },
    {
        currencyCode: 'CY',
        id: 81
    },
    {
        currencyCode: 'UUS',
        id: 20
    },
    {
        currencyCode: 'AED',
        id: 90
    },
    {
        currencyCode: 'ARS',
        id: 86
    },
    {
        currencyCode: 'AUD',
        id: 9
    }
  ];

  static getGroupLicensee(): GroupLicensee[] {
    return [new GroupLicensee('China rules', [new Licensee(14, '368Cash')])];
  }

  static getParamsForMatchid(): GetTicketsQuery {
    const result = new GetTicketsQuery();
    result.licenseeNames = '12Bet';
    result.liveIndicator = 0;
    result.betTypes = [];
    result.durations = [];
    return result;
  }
}

@NgModule({
  declarations: [FilterTicketsComponent, MatchIdComponent, BetIdsComponent],
  imports: [
    FormsModule,
    NgSelectModule,
    BlockUiModule
  ],
  providers: [
    HttpService
  ]
})
class ModuleTest { }

describe('FilterTicketsComponent', () => {
  let shallow: Shallow<FilterTicketsComponent>;

  beforeEach(() => {
    shallow = new Shallow(FilterTicketsComponent, ModuleTest);
  });

  it('#ngOnInit should call expected function', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.initData = jest.fn();
    instance.initCurrency = jest.fn();
    instance.renderGroupLicensees = jest.fn();

    // Action
    await instance.ngOnInit();

    // Assert
    expect(instance.initData).toHaveBeenCalledTimes(1);
    expect(instance.initCurrency).toHaveBeenCalledTimes(1);
    expect(instance.renderGroupLicensees).toHaveBeenCalledTimes(1);
  });

  it('Should call #changeTab when change status', async () => {
    const { instance } = await shallow.render();
    const changes = {
      'status': new SimpleChange(null, '1', true)
    };
    instance.changeTab = jest.fn();
    instance.ngOnChanges(changes);

    expect(instance.changeTab).toHaveBeenCalledTimes(1);
  });
  
  it('#ngOnChanges should not call #changeTab when change status', async () => {
    const { instance } = await shallow.render();
    instance.changeTab = jest.fn();
    instance.ngOnChanges({});

    expect(instance.changeTab).toHaveBeenCalledTimes(0);
  });

  it('#initData should init expected data and call #search', async () => {
    const { instance } = await shallow
      .mock(CommonService, {
        getBalanceUpZoneManila: jest.fn().mockImplementation(() => Helper.fakeBalanceUp)
      })
      .render();
    instance.isExternalUrl = false;
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    await instance.initData();

    expect(instance.moveBetNgbDate.year).toBe(2020);
    expect(instance.moveBetNgbDate.month).toBe(1);
    expect(instance.moveBetNgbDate.day).toBe(27);
    expect(instance.model.markedBy).toBe('8');
    expect(instance.markedByOptions.length).toBe(2);
  });
  
  it('#initData should call #search', async () => {
    const { instance } = await shallow
      .mock(CommonService, {
        getBalanceUpZoneManila: jest.fn().mockImplementation(() => Helper.fakeBalanceUp)
      })
      .render();
    instance.isExternalUrl = true;
    instance.search = jest.fn();
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    await instance.initData();

    expect(instance.search).toHaveBeenCalledTimes(1);
    expect(instance.moveBetNgbDate.year).toBe(2020);
    expect(instance.moveBetNgbDate.month).toBe(1);
    expect(instance.moveBetNgbDate.day).toBe(27);
    expect(instance.model.markedBy).toBe('8');
    expect(instance.markedByOptions.length).toBe(2);
  });

  it('#initCurrency should return expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(AppService, {
        getCurrencies: jest.fn().mockImplementation(() => Helper.fakeCurrency)
      })
      .render();

    // Act
    await instance.initCurrency();

    // Assert
    expect(instance.currencies.items.length).toBe(6);
    expect(instance.currencies.selected.length).toBe(6);
    expect(instance.model.currencyIds).toBe('13,81,20,90,86,9');
  });

  it('#renderGroupLicensees should return expected data', async () => {
    // Arrange
    const { instance } = await shallow
      .mock(AppService, {
        getLicensees: jest.fn().mockImplementation(() => Helper.getGroupLicensee())
      })
      .render();

    // Act
    await instance.renderGroupLicensees();

    // Assert
    expect(instance.groupLicensees.length).toBe(1);
    expect(instance.groupLicensees[0].licensees.length).toBe(1);
  });

  it('#checkValidate should return true when search by matchid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.MATCH_ID;
    instance.matchIdComponent.checkValidate = jest.fn().mockImplementation(() => true);

    // Act
    const actual = instance.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('#checkValidate should return true when search by betid', async () => {
    // Arrange
    const { fixture, instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.BETIDS;
    fixture.detectChanges();
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.isHasBetId = jest.fn().mockImplementation(() => true);

    // Act
    const actual = instance.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('#checkValidate should return true when search by all marked', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.ALL_MARKED;

    // Act
    const actual = instance.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('#clearBetId should call #clearBetId from betIdsComponent', async () => {
    // Arrange
    const { fixture, instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.BETIDS;
    fixture.detectChanges();
    instance.betIdsComponent.clearBetId = jest.fn();

    // Act
    instance.clearBetId();

    // Assert
    expect(instance.betIdsComponent.clearBetId).toHaveBeenCalledTimes(1);
  });

  it('#changeTab should call #changeSearchBy with searchby is matchid', async () => {
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.ALL_MARKED;
    instance.status = '0';
    instance.changeSearchBy = jest.fn();

    instance.changeTab();

    expect(instance.changeSearchBy).toHaveBeenCalledWith('0');
  });
  
  it('#changeTab should not call #changeSearchBy', async () => {
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.MATCH_ID;
    instance.status = '0';
    instance.changeSearchBy = jest.fn();

    instance.changeTab();

    expect(instance.changeSearchBy).toHaveBeenCalledTimes(0);
  });

  it('#changeSearchBy should set value of searchby correctly and emit changeSearch event', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.BETIDS;

    // Act
    instance.changeSearchBy(FilterSearchBy.MATCH_ID);

    // Assert
    expect(instance.searchBy.value).toBe(FilterSearchBy.MATCH_ID);
    expect(instance.changeSearch.emit).toHaveBeenCalledTimes(1);
    expect(instance.model.matchId).toBe('');
  });

  it('#search should emit searchEvent event with expected param when search with matchid', async () => {
    // Arrange
    const { instance } = await shallow.render();
    const query: GetTicketsQuery = {
      status: '1',
      searchBy: FilterSearchBy.MATCH_ID,
      markedBy: '8',
      licenseeNames: '12Bet',
      liveIndicator: 0,
      betTypes: [],
      durations: [],
      pageIndex: 0,
      pageSize: 3000
    };
    instance.model.markedBy = '8';
    instance.status = '1';
    instance.searchBy.value = FilterSearchBy.MATCH_ID;
    instance.matchIdComponent.getParams = jest.fn().mockImplementation(() => Helper.getParamsForMatchid());
    instance.checkValidate = jest.fn().mockImplementation(() => true);

    // Act
    instance.search();

    // Assert
    expect(instance.searchEvent.emit).toHaveBeenCalledWith(query);
  });

  it('#search should emit searchEvent event with expected param when search with betid', async () => {
    const { instance } = await shallow.render();
    const query: GetTicketsQuery = {
      status: '1',
      searchBy: FilterSearchBy.BETIDS,
      markedBy: '8',
      transIds: '123456789',
      pageIndex: 0,
      pageSize: 3000
    };
    instance.getParams = jest.fn().mockImplementation(() => query);
    instance.checkValidate = jest.fn().mockImplementation(() => true);
    instance.search();

    expect(instance.searchEvent.emit).toHaveBeenCalledWith(query);
  });
  
  it('#search should not emit searchEvent event', async () => {
    const { instance } = await shallow.render();
    instance.checkValidate = jest.fn().mockImplementation(() => false);
    instance.searchEvent.emit = jest.fn();
    instance.search();

    expect(instance.searchEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('value of isBlock should return true when blockComponent event from MatchIdComponent emit with param is true', async () => {
    // Arrange
    const { instance, findComponent } = await shallow.render();
    const matchIdComponent = findComponent(MatchIdComponent);

    // Act
    matchIdComponent.blockComponent.emit(true);

    // Assert
    expect(instance.isBlock).toBe(true);
  });

  it('#changeMatchInfo should return emit when changeMatch event from MatchIdComponent emit ', async () => {
    // Arrange
    const { instance, findComponent } = await shallow.render();
    const matchIdComponent = findComponent(MatchIdComponent);

    // Act
    matchIdComponent.changeMatch.emit();

    // Assert
    expect(instance.changeMatchInfo.emit).toHaveBeenCalledTimes(1);
  });
  
  it('#getParams should update correct data when filter by BETIDS', async () => {
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.BETIDS;
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    const actual = instance.getParams();

    expect(instance.searchBy.value).toBe(FilterSearchBy.BETIDS);
    expect(instance.betIdsComponent.getAllBetIds).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });
  
  it('#getParams should update correct data when filter by ALL_MARKED', async () => {
    const { instance } = await shallow.render();
    instance.searchBy.value = FilterSearchBy.ALL_MARKED;
    instance.betIdsComponent = new BetIdsComponent(null);
    instance.betIdsComponent.getAllBetIds = jest.fn();
    const actual = instance.getParams();

    expect(instance.searchBy.value).toBe(FilterSearchBy.ALL_MARKED);
    expect(instance.betIdsComponent.getAllBetIds).toHaveBeenCalledTimes(0);
    expect(actual).toBeDefined();
  });
});
