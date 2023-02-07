import { BetTypeVirtualSport, GroupBetTypeVirtualSport } from '../../utility/components/bettypes-virtualsports/bettypes-virtualsports.model';
import { BetTypeModel, BetTypesModel } from '../../utility/components/bettypes/bettypes.model';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../../utility/modules/advanced-mode/group-bettypes/group-bettypes.model';
import { BlockUiService } from '../../utility/modules/block-ui/block-ui.service';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { SelectionTypeModel } from './filter/filter.model';
import { AmendmentReponse, ExportExcelQuery, GetSummaryQuery, GetTicketsDetailModel, GetTicketsDetailQuery, SendFileQuery } from './models/query.model';
import { SummaryItem } from './summary/summary.model';

class Helper {
  static readonly fakeDate = '2019-11-18 12:08:49.737';
}

jest.mock('../../utility/services/http.service');
describe('AppService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let appService: AppService;
  const blockUIService = new BlockUiService();

  beforeEach(() => {
    mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
    appService = new AppService(mockHttpService, blockUIService);
  });

  it('#getLicensees should return expected data', async () => {
    // Arrange
    const expectedData = [
      { id: 15, name: 'SENIBET'},
      { id: 29, name: 'SUNGAME'}
    ];
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getLicensees();

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#getBetTypesVirtualSports should return expected data', async () => {
    // Arrange
    const expectedData = [
      new GroupBetTypeVirtualSport([0,1],[new BetTypeVirtualSport(1, 'Handicap')])
    ];
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getBetTypesVirtualSports();

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#getGroupBetTypes should return expected data', async () => {
    // Arrange
    const groupBettype: GroupBetType[] = [
      new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
    ];
    const expectedGroupBettypesModel = new GroupBetTypesModel(groupBettype, true);
    mockHttpService.postJson.mockResolvedValue(expectedGroupBettypesModel);

    // Action
   const actualData = await appService.getGroupBetTypes(new GetBetTypesQuery());

   // Assert
   expect(actualData).toStrictEqual(expectedGroupBettypesModel);
  });

  it('#getBetTypes should return expected data', async () => {
    // Arrange
    const expectedData = new BetTypesModel([new BetTypeModel('2702', '1H 1X2', false, 5, true)], true);
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getBetTypes(new GetBetTypesQuery());

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#getMatchInfo should return expected data', async () => {
    // Arrange
    const expectedData: MatchModel = {
      matchId: 28321695,
      homeId: 10935,
      homeName: 'American League',
      homeNameNewSimplified: '美国聯盟',
      homeNameSimplified: '美国聯盟',
      homeNameTraditional: '美國聯盟',
      awayId: 16277,
      awayName: 'National League',
      awayNameNewSimplified: '国家联盟',
      awayNameSimplified: '国家联盟',
      awayNameTraditional: '國家聯盟',
      matchCode: '*B0001',
      eventDate: new Date(Helper.fakeDate),
      dateTime: new Date(Helper.fakeDate),
      leagueId: 12345,
      leagueName: '',
      leagueNameNewSimplified: '',
      leagueNameSimplified: '',
      leagueNameTraditional: '',
      matchEvent: '',
      matchEventSimplified: '',
      matchEventNewSimplified: '',
      kickOffTime: '',
      sportType: 8,
      sportTypeName: '',
      sportTypeNameNewSimplified: '',
      sportTypeNameSimplified: '',
      sportTypeNameTraditional: '',      
      startTime: new Date(Helper.fakeDate),
      endTime: new Date(Helper.fakeDate),
      leagueGroupId: 0
    };
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getMatchInfo('28321695', false);

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#getSummary should return expected data', async () => {
    // Arrange
    const expectedData = {
      groupByLicensees: [new SummaryItem('ABC', 1129, false, '12Bet', '2', [], 'Handicap')],
      groupByBetTypes: [new SummaryItem('EDF', 1129, false, '12Bet', '2', [], 'Handicap')]
    };
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getSummary(new GetSummaryQuery());

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#getTicketsDetail should return expected data', async () => {
    // Arrange
    const expectedData: GetTicketsDetailModel = {
      totalItems: 1,
      tickets: [
        {
          betId: '107918495999',
          transDate: '11/18/2019 09:39:59 PM',
          member: 'TP17081L0000',
          choice: '<div class=""><span class=favorite>Real Madrid  (N)<span class="handicap> -0.75</span></span></div>',
          odds: '<span class="underdog">1.06</span> (<span class="oddstype">HK</span>)',
          stake: '<div class="stake">7,700</div>',
          winLoss: '',
          currency: 'CY',
          betType: 'Handicap',
          status: '<div class="status">Running</div>',
          secondAcceptFlag: '',
          ballSequence: null,
          isMarked: false
        }
      ]
    };
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
   const actualData = await appService.getTicketsDetail(new GetTicketsDetailQuery());

   // Assert
   expect(actualData).toStrictEqual(expectedData);
  });

  it('#exportExcel should call #downloadFile with expected params', async() => {
    // Arrange
    const query = new ExportExcelQuery();
    const url = `Misc/TicketListing/ExportExcel`;
    mockHttpService.downloadFile = jest.fn();

    // Action
   await appService.exportExcel(query);

    // Assert
    expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
  });
  
  it('#getSelectionTypes should return expected data', async () => {
    const expected = [new SelectionTypeModel()];
    mockHttpService.postJson.mockResolvedValue(expected);
    const result = await appService.getSelectionTypes(new GetBetTypesQuery());

    expect(result).toBe(expected);
    expect(mockHttpService.postJson).toHaveBeenCalledTimes(1);
  });
  
  it('#sendCreditDataToLetstalk should return expected data', async () => {
    const expected = new Result<null>();
    mockHttpService.postJson.mockResolvedValue(expected);
    const result = await appService.sendCreditDataToLetstalk(new ExportExcelQuery());

    expect(result).toBe(expected);
    expect(mockHttpService.postJson).toHaveBeenCalledTimes(1);
  });
  
  it('#sendDataToOic should return expected data', async () => {
    const expected = [new AmendmentReponse()];
    mockHttpService.postJson.mockResolvedValue(expected);
    const result = await appService.sendDataToOic([new SendFileQuery()]);

    expect(result).toBe(expected);
    expect(mockHttpService.postJson).toHaveBeenCalledTimes(1);
  });
});
