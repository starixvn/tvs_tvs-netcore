import { TestBed } from '@angular/core/testing';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { WrongHdpModel } from '../../../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongOuModel } from '../../../../add-request/app/add-request/models/event-wrong-ou.model';
import { WrongScoreModel } from '../../../../add-request/app/add-request/models/event-wrong-score.model';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventType } from '../../../../utility/constants/sport.constant';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { TemplateMessageService } from './template-message.service';
import _ from 'lodash';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly fakeRequestDetailModel: RequestDetailModel = {
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
    voidedBy: null,
    userId: 0,
    requestId: 1,
    briefInfoNote: ''
  };
  static readonly fakeRequestEventModel: RequestEventModel = {
    awayId: 18486,
    subIssueTypeId: 27,
    eventDate: new Date(),
    finalAwayScore: null,
    finalHomeScore: null,
    homeId: 1983,
    htAwayScore: null,
    htHomeScore: null,
    kickOffTime: new Date('1752-12-16 01:00:00.000'),
    leagueId: 78717,
    matchId: 32784859,
    parentId: 0,
    transIds: '107661343669',
    globalShowTime: new Date('2020-12-16 02:00:00.000'),
    filterFromTransTime: new Date('2020-12-16 03:00:00.000'),
    filterToTransTime: new Date('2020-12-16 04:00:00.000'),
    filterBy: 1,
    singleCount: 1,
    minSingleTransId: 109271486445,
    maxSingleTransId: 109271486446,
    voidFromTime: new Date('2020-12-16 00:00:00.000'),
    voidToTime: new Date('2020-12-16 00:00:00.000'),
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: Helper.fakeRequestEventModel,
    playerNames: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: null,
    notParticipateModels: []
  };
  static readonly fakeTemplateValue: TemplateValue = {
    matchId: 9000,
    sportTypeId: 8,
    homeTeamName: {
      msgEnglish: 'American League',
      msgChineseTraditional: '',
      msgChineseSimplified: '',
      msgChineseNewSimplified: ''
    },
    groupPHAffected: 0
  };
  static readonly fakeLogInfoDetail: LogInfoDetail =
    {
      matchId: 12345,
      liveScores: '0 - 0',
      voidFromTime: new Date(),
      voidToTime: new Date(),
      singleCount: 1,
      mainParlayCount: 1,
      cashOutCount: 3,
      settleCount: 1,
      scoreOfMatch: '',
      scoreNormalTicket: '',
      instantlySettleCount: 2,
      cancelCashOutCount: 1
    } as LogInfoDetail;
}

describe('TemplateMessageService', () => {
  let templateMessageService: TemplateMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TemplateMessageService,
        { provide: TemplateService, useValue: { initializeTemplateValue: jest.fn().mockReturnValue(Helper.fakeTemplateValue) } }
      ]
    });
    templateMessageService = TestBed.inject(TemplateMessageService);
  });

  it('#getTemplateValue should return correct model for request', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.matchModel = new MatchModel();
    voidMatch.voidTicketsMini = {
      groupPHAffected: 4, isHasSettledTicket: true, fromTime: new Date(), toTime: new Date(),
      total: 2, isAllNonLiveTickets: true
    } as TicketsModel;
    voidMatch.logInfoDetail = new LogInfoDetail();
    voidMatch.logInfoDetail.liveScores = '1-9';
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.dangerAcceptedModels = [new RedCardModel()];
    requestDetail.wrongScoreModels = [new WrongScoreModel()];
    requestDetail.wrongHdpModels = [new WrongHdpModel()];
    requestDetail.wrongOuModels = [new WrongOuModel()];
    [
      IssueTypeConstant.DANGER_ACCEPTED,
      IssueTypeConstant.WRONG_SCORE,
      IssueTypeConstant.WRONG_HDP,
      IssueTypeConstant.WRONG_1ST_HDP,
      IssueTypeConstant.WRONG_OU,
      IssueTypeConstant.WRONG_1ST_OU,
    ].forEach(x => {
      requestDetail.request.issueTypeId = Number(x);
      // Action
      const result = templateMessageService.getTemplateValue(voidMatch, requestDetail);

      // Assert
      expect(result.groupPHAffected).toBe(4);
      expect(result.isCheckedEarlyEvent).toBeFalsy();
      expect(result.totalTickets).toBe(2);
      expect(result.checkSettled).toBeTruthy();
    });
  });

  it('#getTemplateValue should return correct model for other request abnormal bet', async () => {
    // Arrange
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.issueTypeId = Number(IssueTypeConstant.ABNORMAL_BET);
    const voidMatch = new VoidMatch();
    voidMatch.voidTicketsMini = new TicketsModel();

    // Action
    const result = templateMessageService.getTemplateValue(voidMatch, requestDetail);

    // Assert
    expect(result).toStrictEqual(Helper.fakeTemplateValue);
  });

  it('#initValueForLikelyDangerAccepted should update expected model', async () => {
    // Arrange
    const templateValue = new TemplateValue();
    const filterBy = TVSRequestFilterBy.CHECK_TIME;

    // Action
    templateMessageService['initValueForLikelyDangerAccepted'](templateValue, Helper.fakeLogInfoDetail, filterBy);

    // Assert
    expect(templateValue.isCheckTime).toBeTruthy();
    expect(templateValue.eventType).toBe(EventType.LIVE);
  });

  it('#getLiveScoreForTemplateMessage should return scoreNormalTicket', async () => {
    // Action
    const actual = templateMessageService['getLiveScoreForTemplateMessage']('1:2', '1:2');

    // Assert
    expect(actual).toBe('1:2');
  });

  it('#initValueForWrongHdp should update expected model', async () => {
    // Arrange
    const templateValue = new TemplateValue();
    const voidMatch = new VoidMatch();
    voidMatch.matchModel = new MatchModel();
    voidMatch.isAllLiveTickets = true;
    voidMatch.logInfoDetail = new LogInfoDetail();
    voidMatch.voidTicketsMini = new TicketsModel();
    const wrongHdpModel = new WrongHdpModel();
    wrongHdpModel.homeFavorite = '123';

    // Action
    templateMessageService['initValueForWrongHdp'](templateValue, voidMatch, [wrongHdpModel], "6");

    // Assert
    expect(templateValue.eventType).toBe(EventType.LIVE);
  });

  it('#initValueForWrongOu should update expected model', async () => {
    // Arrange
    const templateValue = new TemplateValue();
    const voidMatch = new VoidMatch();
    const wrongOuModel = new WrongOuModel();
    voidMatch.matchModel = new MatchModel();
    voidMatch.logInfoDetail = new LogInfoDetail();
    voidMatch.logInfoDetail.liveScores = '1|0';
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.isAllLiveTickets = true;

    // Action
    templateMessageService['initValueForWrongOu'](templateValue, voidMatch, [wrongOuModel], "6");

    // Assert
    expect(templateValue.eventType).toBe(EventType.LIVE);
  });
});
