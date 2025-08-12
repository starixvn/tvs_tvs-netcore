import { EventEmitter, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetIdsComponent } from '../../../../utility/components/bet-ids/bet-ids.component';
import { GroupLicensee, Licensee } from '../../../../utility/components/licensees/licensees.model';
import { BalanceUp } from '../../../../utility/models/balance-up.model';
import { Currency } from '../../../../utility/models/currency.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { CommonService } from '../../../../utility/services/common.service';
import { HttpService } from '../../../../utility/services/http.service';
import { GetTicketsQuery } from '../../models/query.model';
import { FilterTicketsComponent } from './filter-tickets.component';
import { FilterSearchBy } from './filter.model';
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
    return [new GroupLicensee('China rules', [new Licensee(14, '368Cash', true)], true)];
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

describe('FilterTicketsComponent', () => {
  let component: FilterTicketsComponent;
  let fixture: ComponentFixture<FilterTicketsComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        CommonService,
        HttpService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterTicketsComponent);
    commonService = fixture.debugElement.injector.get(CommonService);
    component = fixture.componentInstance;

    // Mock EventEmitter
    component.changeSearch = new EventEmitter();
    component.searchEvent = new EventEmitter();

     // Mock document.getElementById
     const bodyElement = document.createElement('div');
     bodyElement.id = 'body';
     bodyElement.setAttribute('user-id', '8');
     document.body.appendChild(bodyElement);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    component.initData = jest.fn();
    component.initCurrency = jest.fn();
    component.renderGroupLicensees = jest.fn();
    commonService.getBalanceUpZoneManila = jest.fn().mockReturnValue(Helper.fakeBalanceUp);

    // Act
    await component.ngOnInit();

    // Assert
    expect(component.initData).toHaveBeenCalledTimes(1);
    expect(component.initCurrency).toHaveBeenCalledTimes(1);
    expect(component.renderGroupLicensees).toHaveBeenCalledTimes(1);
  });

  it('should handle status changes', async () => {
    // Arrange
    const changes = {
      'status': new SimpleChange(null, '1', true)
    };
    component.changeTab = jest.fn();

    // Act
    component.ngOnChanges(changes);

    // Assert
    expect(component.changeTab).toHaveBeenCalledTimes(1);
  });

  it('should not handle status changes when no changes', async () => {
    // Arrange
    component.changeTab = jest.fn();

    // Act
    component.ngOnChanges({});

    // Assert
    expect(component.changeTab).toHaveBeenCalledTimes(0);
  });

  it('should initialize data correctly for internal URL', async () => {
    // Arrange
    component.isExternalUrl = false;
    commonService.getBalanceUpZoneManila = jest.fn().mockReturnValue(Helper.fakeBalanceUp);
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    // Act
    await component.initData();

    // Assert
    expect(component.moveBetNgbDate.year).toBe(2020);
    expect(component.moveBetNgbDate.month).toBe(1);
    expect(component.moveBetNgbDate.day).toBe(27);
    expect(component.model.markedBy).toBe('8');
    expect(component.markedByOptions.length).toBe(2);
  });

  it('should initialize data correctly for external URL', async () => {
    // Arrange
    component.isExternalUrl = true;
    commonService.getBalanceUpZoneManila = jest.fn().mockImplementation(() => Helper.fakeBalanceUp);
    component.search = jest.fn();
    const element = document.createElement('body');
    element.setAttribute('id', 'body');
    element.setAttribute('user-id', '8');
    document.body.appendChild(element);

    // Act
    await component.initData();

    // Assert
    expect(component.search).toHaveBeenCalledTimes(1);
    expect(component.moveBetNgbDate.year).toBe(2020);
    expect(component.moveBetNgbDate.month).toBe(1);
    expect(component.moveBetNgbDate.day).toBe(27);
    expect(component.model.markedBy).toBe('8');
    expect(component.markedByOptions.length).toBe(2);
  });

  it('should initialize currency correctly', async () => {
    // Arrange
    commonService.getCurrencies = jest.fn().mockReturnValue(Helper.fakeCurrency);

    // Act
    await component.initCurrency();

    // Assert
    expect(component.currencies.items.length).toBe(6);
    expect(component.currencies.selected.length).toBe(6);
    expect(component.model.currencyIds).toBe('13,81,20,90,86,9');
  });

  it('should handle null currency data', async () => {
    // Arrange
    commonService.getCurrencies = jest.fn().mockReturnValue(null);

    // Act
    await component.initCurrency();

    // Assert
    expect(component.currencies.items).toEqual([]);
    expect(component.currencies.selected).toEqual([]);
    expect(component.model.currencyIds).toBe('');
  });

  it('should handle empty currency array', async () => {
    // Arrange
    commonService.getCurrencies = jest.fn().mockReturnValue([]);

    // Act
    await component.initCurrency();

    // Assert
    expect(component.currencies.items).toEqual([]);
    expect(component.currencies.selected).toEqual([]);
    expect(component.model.currencyIds).toBe('');
  });

  it('should handle null group licensees data', async () => {
    // Arrange
    commonService.getGroupLicensees = jest.fn().mockReturnValue(null);

    // Act
    await component.renderGroupLicensees();

    // Assert
    expect(component.groupLicenseeModel.groupLicensees).toEqual([]);
    expect(component.groupLicenseeModel.isChecked).toBe(true);
  });

  it('should handle empty group licensees array', async () => {
    // Arrange
    commonService.getGroupLicensees = jest.fn().mockReturnValue([]);

    // Act
    await component.renderGroupLicensees();

    // Assert
    expect(component.groupLicenseeModel.groupLicensees).toEqual([]);
    expect(component.groupLicenseeModel.isChecked).toBe(true);
  });

  it('should validate search by match ID', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.MATCH_ID;
    component.matchIdComponent = {
      checkValidate: jest.fn().mockReturnValue(true)
    } as unknown as MatchIdComponent;

    // Act
    const actual = component.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('should validate search by bet IDs', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.BET_IDS;
    fixture.detectChanges();
    component.betIdsComponent = {
      isHasBetId: jest.fn().mockImplementation(() => true),
      groupNumber: {
        resetAllItemsToValid: jest.fn()
      }
    } as unknown as BetIdsComponent;

    // Act
    const actual = component.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('should validate search by all marked', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.ALL_MARKED;

    // Act
    const actual = component.checkValidate();

    // Assert
    expect(actual).toBe(true);
  });

  it('should clear bet ID', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.BET_IDS;
    fixture.detectChanges();
    component.betIdsComponent = {
      clearBetId: jest.fn()
    } as unknown as BetIdsComponent;

    // Act
    component.clearBetId();

    // Assert
    expect(component.betIdsComponent.clearBetId).toHaveBeenCalledTimes(1);
  });

  it('should change tab and search by', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.ALL_MARKED;
    component.status = '0';
    component.changeSearchBy = jest.fn();
    const element = document.createElement('div');
    element.innerHTML = '<input id="inlineRadio-0" type="radio">';
    fixture.debugElement.nativeElement.appendChild(element);

    // Act
    component.changeTab();

    // Assert
    expect(component.changeSearchBy).toHaveBeenCalledWith('0');

    // Cleanup
    fixture.debugElement.nativeElement.removeChild(element);
  });

  it('should not change tab when search by is match ID', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.MATCH_ID;
    component.status = '0';
    component.changeSearchBy = jest.fn();

    // Act
    component.changeTab();

    // Assert
    expect(component.changeSearchBy).toHaveBeenCalledTimes(0);
  });

  it('should change search by and emit event', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.BET_IDS;
    component.changeSearch.emit = jest.fn();

    // Act
    component.changeSearchBy(FilterSearchBy.MATCH_ID);

    // Assert
    expect(component.searchBy.value).toBe(FilterSearchBy.MATCH_ID);
    expect(component.changeSearch.emit).toHaveBeenCalledTimes(1);
    expect(component.model.matchId).toBe('');
  });

  it('should search with match ID', async () => {
    // Arrange
    const query = {
      status: '1',
      searchBy: FilterSearchBy.MATCH_ID,
      markedBy: '8',
      licenseeNames: '12Bet',
      liveIndicator: 0,
      betTypes: [],
      durations: [],
      pageIndex: 0,
      pageSize: 3000
    } as GetTicketsQuery;
    component.model.markedBy = '8';
    component.status = '1';
    component.searchBy.value = FilterSearchBy.MATCH_ID;
    component.matchIdComponent = {
      checkValidate: jest.fn().mockReturnValue(true),
      getParams: jest.fn().mockImplementation(() => Helper.getParamsForMatchid())
    } as unknown as MatchIdComponent;
    component.checkValidate = jest.fn().mockImplementation(() => true);
    component.searchEvent.emit = jest.fn();

    // Act
    component.search();

    // Assert
    expect(component.searchEvent.emit).toHaveBeenCalledWith(query);
  });

  it('should search with bet IDs', async () => {
    // Arrange
    const query: GetTicketsQuery = {
      status: '1',
      searchBy: FilterSearchBy.BET_IDS,
      markedBy: '8',
      transIds: '123456789',
      pageIndex: 0,
      pageSize: 3000
    };
    component.getParams = jest.fn().mockImplementation(() => query);
    component.checkValidate = jest.fn().mockImplementation(() => true);
    component.searchEvent.emit = jest.fn();

    // Act
    component.search();

    // Assert
    expect(component.searchEvent.emit).toHaveBeenCalledWith(query);
  });

  it('should not search when validation fails', async () => {
    // Arrange
    component.checkValidate = jest.fn().mockImplementation(() => false);
    component.searchEvent.emit = jest.fn();

    // Act
    component.search();

    // Assert
    expect(component.searchEvent.emit).toHaveBeenCalledTimes(0);
  });

  it('should get params for bet IDs search', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.BET_IDS;
    component.betIdsComponent = {
      getAllBetIds: jest.fn()
    } as unknown as BetIdsComponent;

    // Act
    const actual = component.getParams();

    // Assert
    expect(component.searchBy.value).toBe(FilterSearchBy.BET_IDS);
    expect(component.betIdsComponent.getAllBetIds).toHaveBeenCalledTimes(1);
    expect(actual).toBeDefined();
  });

  it('should get params for all marked search', async () => {
    // Arrange
    component.searchBy.value = FilterSearchBy.ALL_MARKED;
    component.betIdsComponent = {
      getAllBetIds: jest.fn()
    } as unknown as BetIdsComponent;

    // Act
    const actual = component.getParams();

    // Assert
    expect(component.searchBy.value).toBe(FilterSearchBy.ALL_MARKED);
    expect(component.betIdsComponent.getAllBetIds).toHaveBeenCalledTimes(0);
    expect(actual).toBeDefined();
  });
});
