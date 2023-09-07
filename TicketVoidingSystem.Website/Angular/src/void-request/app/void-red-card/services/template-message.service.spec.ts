import { DuplicateTicketsModel } from './../../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import { TemplateMessageService } from './template-message.service';
import { RedCardModel } from '../../../../add-request/app/add-request/models/event-red-card.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { RequestDetailModel, RequestDetailViewModel, RequestEventModel } from '../../../../edit-request/app/request.model';

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
    requestId: 0
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
    messages: [],
    wrongScoreModels: [],
    dangerAcceptedModels: [],
    redCardModels: [],
    wrongHdpModels: [],
    wrongOuModels: [],
    wrongOddsModels: [],
    reducedOverModels: [],
    duplicateTicketsModel: new DuplicateTicketsModel
  };
  static readonly fakeTemplateValue: TemplateValue = {
    matchId: 9000,
    sportTypeId: 8,
    homeTeamName: {
      msgEnglish: 'American League',
      msgChineseTraditional: '',
      msgChineseSimplified: '',
      msgChineseNewSimplified: ''
    }
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
    };
}

describe('TemplateMessageService', () => {
  let service: TemplateMessageService;
  let templateService: TemplateService;

  beforeEach(() => {
    templateService = new TemplateService();
    service = new TemplateMessageService(templateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getTemplateValue should return correct model for request', async () => {
    // Arrange
    const voidMatch = new VoidMatch();
    voidMatch.matchModel = new MatchModel();
    voidMatch.voidTicketsMini = new TicketsModel();
    voidMatch.logInfoDetail = new LogInfoDetail();
    voidMatch.logInfoDetail.liveScores = '1-9';
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.redCardModels = [new RedCardModel()];
    const mockGetTemplateValue = jest.fn().mockImplementation(() => Helper.fakeTemplateValue);
    templateService.getTemplateValue = mockGetTemplateValue;

    // Action
    service.getTemplateValue(voidMatch, requestDetail);

    // Assert
    expect(templateService.getTemplateValue).toHaveBeenCalledTimes(1);
  });

  it('#getLiveScoreForTemplateMessage return expected when scoreNormalTicket has value', async () => {
    // Arrange
    // Action
    const actual = service['getLiveScoreForTemplateMessage']('12 3|234', '1');

    // Assert
    expect(actual).toBe('123');
  });
});
