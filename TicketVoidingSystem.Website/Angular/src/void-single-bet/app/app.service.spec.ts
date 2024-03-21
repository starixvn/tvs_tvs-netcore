import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { AppService } from './app.service';
import { GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { GroupModel } from './tickets/group.model';
import { TicketModel } from './tickets/ticket.model';
import { TicketsModel } from './tickets/tickets.model';

jest.mock('../../utility/services/http.service');
describe('AppService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let appService: AppService;
  let mockCommonService: CommonService;
  let mockBlockUiService: BlockUiService;

  beforeEach(() => {
    mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
    mockBlockUiService = new BlockUiService();
    mockCommonService = new CommonService(mockHttpService);
    mockBlockUiService.start = jest.fn();
    mockBlockUiService.stop = jest.fn();
    
    appService = new AppService(mockHttpService, mockCommonService, mockBlockUiService);
  });

  it('#getRemark should return expected data', async () => {
    // Arrange
    const expectedValue: string[] = [
      'You can void "Settled" or "Unsettled" tickets.',
      'You can void "Instantly Settled" tickets settled by Instant Settlement during live time.'
    ];
    mockHttpService.getJson.mockResolvedValue(expectedValue);

   // Action
   const actualResult = await appService.getRemark();

   // Assert
   expect(actualResult).toStrictEqual(expectedValue);
  });

  it('#getGroupBetTypes should return expected data', async() => {
    // Arrange
    const groupBettype: GroupBetType[] = [
      new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
      new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
    ];
    const expectedGroupBettypesModel = new GroupBetTypesModel(groupBettype, true);
    mockHttpService.postJson.mockResolvedValue(expectedGroupBettypesModel);
    
    // Action
   const actualResult = await appService.getGroupBetTypes(new GetBetTypesQuery());

    // Assert
    expect(actualResult).toStrictEqual(expectedGroupBettypesModel);
  });

  it('#getMatchInfo should return expected data', async() => {
    // Arrange
    const expectedMatchInfo: MatchModel = {
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
      eventDate: new Date(),
      dateTime: new Date(),
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
      startTime: new Date(),
      endTime: new Date(),
      leagueGroupId: 0
    };
    mockHttpService.postJson.mockResolvedValue(expectedMatchInfo);
    
    // Action
   const actualResult = await appService.getMatchInfo(28321695);

    // Assert
    expect(actualResult).toStrictEqual(expectedMatchInfo);
  });

  it('#getTickets should return expected data', async() => {
    // Arrange
    const expectedTicketsModel = new TicketsModel();
    expectedTicketsModel.groups = [new GroupModel('MBC Group', [{mainTransId: '12312'} as TicketModel])];
    expectedTicketsModel.totalItems = 1;
    mockHttpService.postJson.mockResolvedValue(expectedTicketsModel);
    
    // Action
   const actualResult = await appService.getTickets(new GetTicketsQuery());

    // Assert
    expect(actualResult).toStrictEqual(expectedTicketsModel);
  });

  it('#exportExcel should call #downloadFile with expected params', async() => {
    // Arrange
    const query = new GetTicketsQuery();
    const url = `api/VoidSingleBet/ExportExcel`;
    mockHttpService.downloadFile = jest.fn();

    // Action
   await appService.exportExcel(query);

    // Assert
    expect(mockHttpService.downloadFile).toHaveBeenCalledWith(query, url);
  });

  it('#voidTickets should return expected data', async() => {
    // Arrange
    const expectedValue: Array<Result<null>> = [{
      isSuccessful: true,
      errorCode: 0,
      errorMsg: ''
    }];
    mockHttpService.postJson.mockResolvedValue(expectedValue);
    
    // Action
   const actualResult = await appService.voidTickets(new VoidTicketsQuery());

    // Assert
    expect(actualResult).toStrictEqual(expectedValue);
  });
  
  it('#GetLogInfo should return expected data', async() => {
    // Arrange
    const expectedValue = new TicketsModel();
    const query = new GetTicketsQuery();
    const url = 'api/VoidSingleBet/GetLogInfo';
    mockHttpService.postJson.mockResolvedValue(expectedValue);
    
    // Action
   const actualResult = await appService.GetLogInfo(query);

    // Assert
    expect(actualResult).toStrictEqual(expectedValue);
    expect(mockHttpService.postJson).toHaveBeenCalledWith(query, url);
  });
  
  it('#getVoidResultCache should return expected data', async() => {
    // Arrange
    const expectedValue = [new Result<null>()];
    const url = 'api/SharedApi/GetVoidResultCache';
    mockHttpService.postJson.mockResolvedValue(expectedValue);
    
    // Action
   const actualResult = await appService.getVoidResultCache('');

    // Assert
    expect(actualResult).toStrictEqual(expectedValue);
    expect(mockHttpService.postJson).toHaveBeenCalledWith({guid: ''}, url);
  });
});
