import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../utility/modules/testing.module';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { SelectionTypeModel } from './filter/filter.model';
import { AmendmentReponse, ExportExcelQuery, GetSummaryQuery, GetTicketsDetailModel, GetTicketsDetailQuery, SendFileQuery } from './models/query.model';
import { SummaryItem } from './summary/summary.model';
import { GetBetTypesQuery } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';

class Helper {
  static readonly fakeDate = '2019-11-18 12:08:49.737';
}

jest.mock('../../utility/services/http.service');
describe('AppService', () => {
  let httpService: jest.Mocked<HttpService>;
  let appService: AppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AppService, HttpService]
    });
    httpService = TestBed.inject(HttpService) as jest.Mocked<HttpService>;
    appService = TestBed.inject(AppService);
  });

  it('#getLicensees should return expected data', async () => {
    // Arrange
    const expectedData = [
      { id: 15, name: 'SENIBET'},
      { id: 29, name: 'SUNGAME'}
    ];
    httpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getLicensees();

    // Assert
    expect(actualData).toStrictEqual(expectedData);
  });

  it('#getMatchInfo should return expected data', async () => {
    // Arrange
    const expectedData = {
      matchId: 28321695,
      matchCode: '*B0001',
      eventDate: new Date(Helper.fakeDate),
      sportType: 8
    } as MatchModel;
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getMatchInfo('28321695', false);

    // Assert
    expect(actualData).toStrictEqual(expectedData);
  });

  it('#getSummary should return expected data', async () => {
    // Arrange
    const expectedData = {
      groupByLicensees: [{
        name: 'ABC',
        total: 1129,
        licenseeName: '12Bet',
        betTypes: '2',
        betTypeName: 'Handicap'
      } as SummaryItem],
      groupByBetTypes: [{
        name: 'EDF',
        total: 1129,
        licenseeName: '12Bet',
        betTypes: '2',
        betTypeName: 'Handicap'
      } as SummaryItem]
    };
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getSummary({} as GetSummaryQuery);

    // Assert
    expect(actualData).toStrictEqual(expectedData);
  });

  it('#getTicketsDetail should return expected data', async () => {
    // Arrange
    const expectedData = {
      totalItems: 1,
      tickets: [{
        betId: '107918495999',
        transDate: '11/18/2019 09:39:59 PM',
        member: 'TP17081L0000',
        choice: '<div class=""><span class=favorite>Real Madrid  (N)<span class="handicap> -0.75</span></span></div>',
        odds: '<span class="underdog">1.06</span> (<span class="oddstype">HK</span>)',
        stake: '<div class="stake">7,700</div>',
        betType: 'Handicap',
        status: '<div class="status">Running</div>'
      }]
    } as GetTicketsDetailModel;
    httpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await appService.getTicketsDetail({} as GetTicketsDetailQuery);

    // Assert
    expect(actualData).toStrictEqual(expectedData);
  });

  it('#exportExcel should call #downloadFile with expected params', async() => {
    // Arrange
    const query = {} as ExportExcelQuery;
    const url = `api/TicketListing/ExportExcel`;
    httpService.downloadFile = jest.fn();

    // Action
    await appService.exportExcel(query);

    // Assert
    expect(httpService.downloadFile).toHaveBeenCalledWith(query, url);
  });
  
  it('#getSelectionTypes should return expected data', async () => {
    // Arrange
    const expected = [{} as SelectionTypeModel];
    httpService.postJson.mockResolvedValue(expected);

    // Action
    const result = await appService.getSelectionTypes({} as GetBetTypesQuery);

    // Assert
    expect(result).toBe(expected);
    expect(httpService.postJson).toHaveBeenCalledTimes(1);
  });
  
  it('#sendCreditDataToLetstalk should return expected data', async () => {
    // Arrange
    const expected = {} as Result<null>;
    httpService.postJson.mockResolvedValue(expected);

    // Action
    const result = await appService.sendCreditDataToLetstalk({} as ExportExcelQuery);

    // Assert
    expect(result).toBe(expected);
    expect(httpService.postJson).toHaveBeenCalledTimes(1);
  });
  
  it('#sendDataToOic should return expected data', async () => {
    // Arrange
    const expected = [{} as AmendmentReponse];
    httpService.postJson.mockResolvedValue(expected);

    // Action
    const result = await appService.sendDataToOic([{} as SendFileQuery]);

    // Assert
    expect(result).toBe(expected);
    expect(httpService.postJson).toHaveBeenCalledTimes(1);
  });
});
