import { TestBed } from '@angular/core/testing';
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
  let service: CommonService;
  let mockHttpService: jest.Mocked<HttpService>;

  beforeEach(() => {
    mockHttpService = {
      getJson: jest.fn(),
      postJson: jest.fn()
    } as unknown as jest.Mocked<HttpService>;

    TestBed.configureTestingModule({
      providers: [
        CommonService,
        { provide: HttpService, useValue: mockHttpService }
      ]
    });

    service = TestBed.inject(CommonService);
  });

  it('Get Issue Types', async () => {
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
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getIssueTypes();

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/SharedApi/GetIssueTypes');
  });

  it('Get Actions', async () => {
    // Arrange
    const expectedData: Selection[] = [{
      name: 'Void',
      value: '1'
    }];
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getVoidActions();

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/ManageRequest/GetVoidActions');
  });

  it('Get Match', async () => {
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
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getMatch(28321695);

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.postJson).toHaveBeenCalledWith({ matchId: 28321695, isMatch3rd: false }, 'api/MatchInfo/GetInfo');
  });

  it('Get Issue Info', async () => {
    // Arrange
    const expectedData: IssueInfo = {
      name: 'Abnormal',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getIssueInfo(27);

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/ManageRequest/GetIssueTypeName/27');
  });

  it('Get Balance Up', async () => {
    // Arrange
    const expectedData: BalanceUp = {
      balanceUpDay: new Date('2019-06-21 12:00:00.000'),
      moveBetsDay: new Date('2019-06-29 12:00:00.000')
    };
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getBalanceUp();

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/SharedApi/GetBalanceUp');
  });

  it('Get FirstTime And KickOffTime', async () => {
    // Arrange
    const expectedData: FirstTicketTime = {
      minTransDate: '2019-01-02 09:51:27.677',
      kickOffTime: '2019-03-20 17:34:59.000'
    };
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.getFirstTimeAndKickOffTime(28321695);

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/MatchInfo/GetFirstTimeAndKickOffTime/28321695');
  });

  it('Check void bet permission', async () => {
    // Arrange
    const expectedData: SqlResult = {
      errCode: 0,
      errMsg: '',
      isSuccessful: true
    };
    const permissionModel = new CheckingPermissionModel();
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actual = await service.checkVoidBetPermission(permissionModel);

    // Assert
    expect(actual).toEqual(expectedData);
    expect(mockHttpService.postJson).toHaveBeenCalledWith(permissionModel, 'api/Permission/CheckTicketsStatus');
  });

  it('#getGroupBetTypes should return expected data', async () => {
    // Arrange
    const groupBettype: GroupBetType[] = [{ groupName: '1H', betTypes: [new BetType(15, '1H 1X2', false, 0, true)], isChecked: true },
        { groupName: 'FT', betTypes: [new BetType(4, 'Correct Score', false, 0, true)], isChecked: true },
    ] as GroupBetType[];
    
    const expectedGroupBettypesModel = {groupBetTypes: groupBettype, isChecked: true, result: {errorCode: 0}} as GroupBetTypesModel;
    const query = new GetBetTypesQuery();
    mockHttpService.postJson.mockResolvedValue(expectedGroupBettypesModel);

    // Action
    const result = await service.getGroupBetTypes(query);

    // Assert
    expect(result.groupBetTypes.length).toBe(2);
    expect(result.groupBetTypes[0].groupName).toBe('1H');
    expect(mockHttpService.postJson).toHaveBeenCalledWith(query, 'api/BetTypes/GetGroupBetTypesNg');
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
    mockHttpService.postJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await service.getMatch(28321695);

    // Assert
    expect(actualData).toEqual(expectedData);
    expect(mockHttpService.postJson).toHaveBeenCalledWith({ matchId: 28321695, isMatch3rd: false }, 'api/MatchInfo/GetInfo');
  });

  it('#getIssueInfo should return expected data', async() => {
    // Arrange
    const expectedData: IssueInfo = {
      name: 'Abnormal Bet',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    mockHttpService.getJson.mockResolvedValue(expectedData);

    // Action
    const actualData = await service.getIssueInfo(17);

    // Assert
    expect(actualData).toEqual(expectedData);
    expect(mockHttpService.getJson).toHaveBeenCalledWith('api/ManageRequest/GetIssueTypeName/17');
  });
});
