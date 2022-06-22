import { CommonService } from './common.service';
import { IssueTypesModel, IssueInfo } from '../models/issue-type.model';
import { Selection } from '../models/selection.model';
import { MatchModel, FirstTicketTime } from '../models/match.model';
import { BalanceUp } from '../models/balance-up.model';
import { CheckingPermissionModel } from '../models/checking-permission.model';
import { SqlResult, Result } from '../models/result';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';

describe('CommonService', () => {
  let commonService: CommonService;
  const httpServiceSpy = jasmine.createSpyObj('HttpService', ['getJson', 'postJson']);

  it('Get Issue Types', () => {
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
    httpServiceSpy.getJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getIssueTypes().then((result) => {
      expect(result).toBe(expectedData);
    });
  });

  it('Get Actions', () => {
    // Arrange
    const expectedData: Selection[] = [{
      name: 'Void',
      value: '1'
    }];
    httpServiceSpy.getJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getActions().then((result) => {
      expect(result).toEqual(expectedData);
    });
  });

  it('Get Match', () => {
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
    };
    httpServiceSpy.postJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getMatch(28321695).then((result) => {
      expect(result).toBe(expectedData);
    });
  });

  it('Get request by id', () => {
    // Arrange
    const requestDetailModel = {
      actionId: 1,
      decidedBy: null,
      isTest: false,
      isVoided: false,
      issueTypeId: 11,
      mistakenBy: null,
      operators: [],
      provider: null,
      remark: 'test',
      requestedBy: "sa",
      source: null,
      sportType: 2,
      subIssueTypeId: 27,
      voidedBy: null,
    }
    const requestEventModel = {
      awayId: 18486,
      eventDate: new Date(),
      finalAwayScore: null,
      finalHomeScore: null,
      homeId: 1983,
      htAwayScore: null,
      htHomeScore: null,
      kickOffTime: new Date('2020-01-16 00:00:00.000'),
      leagueId: 78717,
      matchId: 32784859,
      parentId: 0,
      transIds: '107661343669',
      globalShowTime: new Date('2020-01-16 00:00:00.000')
    }
    const expectedData: RequestDetailViewModel = {
      request: requestDetailModel,
      events: [requestEventModel],
      messages: []
    };
   httpServiceSpy.getJson.and.returnValue(Promise.resolve(Promise.resolve(expectedData)));
   commonService = new CommonService(httpServiceSpy);
   // Action and Assert
   commonService.getRequestById(47760).then(result => {
     expect(result).toEqual(expectedData);
   });
  });

  it('Get Issue Info', () => {
    // Arrange
    const expectedData:  IssueInfo = {
      name: 'Abnormal',
      subIssueTypeId: 27,
      issueTypeId: 11,
      subIssueTypeName: 'Abnormal',
      subIssueTypeNameCS: '非正常'
    };
    httpServiceSpy.getJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getIssueInfo(27).then((result) => {
      expect(result).toEqual(expectedData);
    });
  });

  it('Get Balance Up', () => {
    // Arrange
    const expectedData: BalanceUp = {
      balanceUpDay: new Date('2019-06-21 12:00:00.000'),
      moveBetsDay: new Date('2019-06-29 12:00:00.000')
    };
    httpServiceSpy.getJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getBalanceUp().then((result) => {
      expect(result).toEqual(expectedData);
    });
  });

  it('Get FirstTime And KickOffTime', () => {
    // Arrange
    const expectedData: FirstTicketTime = {
      minTransDate: '2019-01-02 09:51:27.677',
      kickOffTime: '2019-03-20 17:34:59.000'
    };
    httpServiceSpy.getJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.getFirstTimeAndKickOffTime(28321695).then((result) => {
      expect(result).toEqual(expectedData);
    });
  });

  it('Check void bet permission', () => {
    // Arrange
    const expectedData: SqlResult = {
      ErrCode: 0,
      ErrMsg: '',
      isSuccessful: true
    };
    httpServiceSpy.postJson.and.returnValue(Promise.resolve(expectedData));
    commonService = new CommonService(httpServiceSpy);
    // Action and Assert
    commonService.checkVoidBetPermission(new CheckingPermissionModel()).then((result) => {
      expect(result).toEqual(expectedData);
    });
  });
});
