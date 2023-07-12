
import { LeagueInfo, MatchInfo } from '../../../../utility/models/event.model';
import { HttpService } from '../../../../utility/services/http.service';
import { LeagueEventService } from './league-event.service';

jest.mock('../../../../utility/services/http.service');
describe('EventMatchService', () => {
  let mockHttpService: jest.Mocked<HttpService>;
  let leagueEventService: LeagueEventService;

  beforeEach(() => {
    mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
    leagueEventService = new LeagueEventService(mockHttpService);
  });

  it('#getLeagues should return expected data', async () => {
    // Arrange
    const expectedLeagues: LeagueInfo[] = [
      {
        leagueId: 80714,
        leagueName: '*AFC ASIAN CUP 2019 (IN UAE) - GROUP E WINNER'
      },
      {
        leagueId: 80603,
        leagueName: '*AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS'
      }
    ];
    mockHttpService.postJson.mockResolvedValue(expectedLeagues);

    // Action
    const actualData = await leagueEventService.getLeagues(1, '2019-09-19 12:00:00.000');

    // Assert
    expect(actualData).toStrictEqual(expectedLeagues);
  });

  it('#getMatchs should return expected data', async () => {
    // Arrange
    const expectedMatchs: MatchInfo[] = [
      {
        matchId: 12345,
        name: 'Test1',
        sportType: 1,
        leagueId: 12345,
        leagueName: '*AFC ASIAN CUP 2019 (IN UAE) - GROUP E WINNER'
      },
      {
        matchId: 45678,
        name: 'Test2',
        sportType: 1,
        leagueId: 12345,
        leagueName: '*AFC ASIAN CUP 2019 (IN UAE) - SPECIFIC 15 MINS'
      }
    ];

    mockHttpService.postJson.mockResolvedValue(expectedMatchs);

    // Action
    const actualData = await leagueEventService.getMatch(1, '2019-09-19 12:00:00.000', '12345', true, 1234, 1);

    // Assert
    expect(actualData).toStrictEqual(expectedMatchs);
  });
});
