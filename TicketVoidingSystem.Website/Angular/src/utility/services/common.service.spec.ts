import { BetType, GetBetTypesQuery, GroupBetType, GroupBetTypesModel } from '../components/advanced-mode/group-bettypes/group-bettypes.model';
import { BalanceUp } from '../models/balance-up.model';
import { CheckingPermissionModel } from '../models/checking-permission.model';
import { IssueInfo, IssueTypesModel } from '../models/issue-type.model';
import { FirstTicketTime, MatchModel } from '../models/match.model';
import { SqlResult } from '../models/result';
import { Selection } from '../models/selection.model';
import { CommonService } from './common.service';
import { HttpService } from './http.service';

describe('CommonService', () => {
  let commonService: CommonService;
  let mockHttpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    mockHttpService = new HttpService(null) as jest.Mocked<HttpService>;
});

  it('Get Issue Types',async () => {
    // Arrange
    const expectedData: IssueTypesModel = {
      issueTypes: [{
        issueTypeId: 1,
        issueTypeName: 'Danger Accepted'
      }],
      subIssueTypes: [{
        issueTypeId: 1,
        subIssueTypeId: 1,
        subIssueTypeName: 'Goal',
        subIssueTypeNameCS: 'GoalCS'
      }]
    };
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getIssueTypes();
    expect(actual).toEqual(expectedData);
  });

  it('Get Actions',async () => {
    // Arrange
    const expectedData: Selection[] = [{
      name: 'Void',
      value: '1'
    }];
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getVoidActions();
    expect(actual).toEqual(expectedData);
  });

  it('Get Match',async () => {
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
      endTime: null,
      leagueGroupId: 1,
      startTime: null
    };
    mockHttpService.postJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getMatch(28321695);
    expect(actual).toEqual(expectedData);
  });

  // it('Get request by id', () => {
  //   // Arrange
  //   const requestDetailModel = {
  //     actionId: 1,
  //     decidedBy: null,
  //     isTest: false,
  //     isVoided: false,
  //     issueTypeId: 11,
  //     mistakenBy: null,
  //     operators: [],
  //     provider: null,
  //     remark: 'test',
  //     requestedBy: "sa",
  //     source: null,
  //     sportType: 2,
  //     subIssueTypeId: 27,
  //     voidedBy: null,
  //   }
  //   const requestEventModel = {
  //     awayId: 18486,
  //     eventDate: new Date(),
  //     finalAwayScore: null,
  //     finalHomeScore: null,
  //     homeId: 1983,
  //     htAwayScore: null,
  //     htHomeScore: null,
  //     kickOffTime: new Date('2020-01-16 00:00:00.000'),
  //     leagueId: 78717,
  //     matchId: 32784859,
  //     parentId: 0,
  //     transIds: '107661343669',
  //     globalShowTime: new Date('2020-01-16 00:00:00.000')
  //   }
  //   const expectedData: RequestDetailViewModel = {
  //     request: requestDetailModel,
  //     events: [requestEventModel],
  //     messages: []
  //   };
  //  httpServiceSpy.getJson.and.returnValue(Promise.resolve(Promise.resolve(expectedData)));
  //  commonService = new CommonService(httpServiceSpy);
  //  // Action and Assert
  //  commonService.getRequestById(47760).then(result => {
  //    expect(result).toEqual(expectedData);
  //  });
  // });

  it('Get Issue Info',async () => {
    // Arrange
    const expectedData:  IssueInfo = {
      name: 'Abnormal',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getIssueInfo(27);
    expect(actual).toEqual(expectedData);
  });

  it('Get Balance Up',async () => {
    // Arrange
    const expectedData: BalanceUp = {
      balanceUpDay: new Date('2019-06-21 12:00:00.000'),
      moveBetsDay: new Date('2019-06-29 12:00:00.000')
    };
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getBalanceUp();
    expect(actual).toEqual(expectedData);
  });

  it('Get FirstTime And KickOffTime',async () => {
    // Arrange
    const expectedData: FirstTicketTime = {
      minTransDate: '2019-01-02 09:51:27.677',
      kickOffTime: '2019-03-20 17:34:59.000'
    };
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.getFirstTimeAndKickOffTime(28321695);
    expect(actual).toEqual(expectedData);
  });

  it('Check void bet permission', async () => {
    // Arrange
    const expectedData: SqlResult = {
      errCode: 0,
      errMsg: '',
      isSuccessful: true
    };
    mockHttpService.postJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    commonService = new CommonService(mockHttpService);
    // Action and Assert
    const actual = await commonService.checkVoidBetPermission(new CheckingPermissionModel());
    expect(actual).toEqual(expectedData);
  });

  it('#getGroupBetTypes should return expected data', async () => {
    // Arrange
    const groupBettype: GroupBetType[] = [
        new GroupBetType('1H', [new BetType(15, '1H 1X2', false, 0, true)], true),
        new GroupBetType('FT', [new BetType(4, 'Correct Score', false, 0, true)], true),
    ];
    const expectedGroupBettypesModel = new GroupBetTypesModel(groupBettype, true);
    mockHttpService.postJson = jest.fn().mockImplementation(() => Promise.resolve(expectedGroupBettypesModel));
    const mockCommonService = new CommonService(mockHttpService);

    // Action
    const result = await mockCommonService.getGroupBetTypes(new GetBetTypesQuery());

    // Assert
    expect(result.groupBetTypes.length).toBe(2);
    expect(result.groupBetTypes[0].groupName).toBe('1H');
  });

 it('#getMatch should return expected data', async() => {
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
    mockHttpService.postJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    const mockCommonService = new CommonService(mockHttpService);

    // Action
    const actualData = await mockCommonService.getMatch(28321695);

    // Assert
    expect(actualData).toEqual(expectedData);
  });

  it('#getIssueInfo should return expected data', async() => {
    // Arrange
    const expectedData:  IssueInfo = {
      name: 'Abnormal Bet',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    mockHttpService.getJson = jest.fn().mockImplementation(() => Promise.resolve(expectedData));
    const mockCommonService = new CommonService(mockHttpService);

    // Action
    const actualData = await mockCommonService.getIssueInfo(17);

    // Assert
    expect(actualData).toEqual(expectedData);
  });
});
