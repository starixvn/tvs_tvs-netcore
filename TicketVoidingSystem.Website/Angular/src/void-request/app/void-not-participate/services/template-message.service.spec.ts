import { TestBed } from '@angular/core/testing';
import { TemplateMessageService } from './template-message.service';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { EventType, SportType } from '../../../../utility/constants/sport.constant';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { WrongOddsSportsBookModel } from '../../../../add-request/app/add-request/models/event-wrong-odds-sports-book.model';

class Helper {
  static readonly fakeTemplateValue: TemplateValue = new TemplateValue();
  static readonly fakeVoidNotParticipateModel = {
    matchModel: null,
    voidTicketsMini: new TicketsModel(),
    logInfoDetail: new LogInfoDetail()
  } as VoidNotParticipateModel;
  static readonly fakeRequestDetailViewModel = {
    requestId: 1,
    lastModifiedDate: null,
    request: {
      issueTypeId: 1,
      sportType: SportType.SOCCER
    },
    event: null,
    playerNames: [{
      playerNamesEnglish: 'Test Player',
      playerNamesChineseTraditional: '測試球員',
      playerNamesChineseSimplified: '测试球员'
    }],
    notParticipateModels: []
  } as RequestDetailViewModel;
}

describe('TemplateMessageService', () => {
  let templateMessageService: TemplateMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        TemplateMessageService,
        {
          provide: TemplateService,
          useValue: {
            initializeTemplateValue: jest.fn().mockReturnValue(new TemplateValue())
          }
        }
      ]
    });

    templateMessageService = TestBed.inject(TemplateMessageService);
  });

  it('should be created', () => {
    expect(templateMessageService).toBeTruthy();
  });

  it('#getTemplateValue should return template value with basic properties', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    voidPageItem.voidTicketsMini.groupPHAffected = 2;
    voidPageItem.voidTicketsMini.isHasSettledTicket = true;
    voidPageItem.voidTicketsMini.isAllLiveTickets = true;
    voidPageItem.voidTicketsMini.isAllNonLiveTickets = false;
    voidPageItem.voidTicketsMini.total = 10;
    voidPageItem.voidTicketsMini.fromTime = new Date('2024-01-01');
    voidPageItem.voidTicketsMini.toTime = new Date('2024-01-02');

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.groupPHAffected).toBe(2);
    expect(result.checkSettled).toBe(true);
    expect(result.eventType).toBe(EventType.LIVE);
    expect(result.isAllNonLiveTickets).toBe(false);
    expect(result.totalTickets).toBe(10);
    expect(result.fromTransTime).toEqual(new Date('2024-01-01'));
    expect(result.toTransTime).toEqual(new Date('2024-01-02'));
  });

  it('#getTemplateValue should set player name for not participate issue type', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.issueTypeId = 21; // Not Participate issue type

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.playerName).toBeDefined();
    expect(result.playerName.msgEnglish).toBe('Test Player');
    expect(result.playerName.msgChineseTraditional).toBe('測試球員');
    expect(result.playerName.msgChineseSimplified).toBe('测试球员');
  });

  it('#getTemplateValue should handle special bet type properties', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.issueTypeId = 25; // Wrong Odds Sports Book
    voidPageItem.voidTicketsMini.betTypes = '1';
    voidPageItem.voidTicketsMini.betTeam = 'Team A';
    voidPageItem.voidTicketsMini.hdpValues = '1.5';
    voidPageItem.voidTicketsMini.groupBetTypeId = 1;
    voidPageItem.voidTicketsMini.betTypeNameReplaceMessage = {
      contentEnglish: 'Test Message',
      contentChineseTraditional: '測試消息',
      contentChineseSimplified: '测试消息',
      contentNewChineseSimplified: '测试消息'
    } as Message;
    requestDetail.wrongOddsSportsBookModel = {
      matchId: 1,
      subIssueTypeId: 1,
      filterFromTransTime: '2024-01-01',
      filterToTransTime: '2024-01-02',
      correctOdds: '2.0'
    } as WrongOddsSportsBookModel;

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.isCheckedSpecialBetType).toBe(true);
    expect(result.betTypeNameReplaceMessage).toEqual(voidPageItem.voidTicketsMini.betTypeNameReplaceMessage);
    expect(result.betTypeId).toBe('1');
    expect(result.betTeam).toBe('Team A');
    expect(result.hdpValues).toBe('1.5');
    expect(result.groupBetTypeId).toBe(1);
  });

  it('#getTemplateValue should handle score for soccer matches', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.sportType = SportType.SOCCER;
    requestDetail.request.issueTypeId = 27; // Match Early Completed
    voidPageItem.logInfoDetail = {
      ...voidPageItem.logInfoDetail,
      scoreOfMatch: '2-1'
    };

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.score).toBe('2-1');
  });

  it('#getTemplateValue should handle baseball inning', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.sportType = SportType.BASEBALL;
    requestDetail.request.issueTypeId = 27; // Match Early Completed
    const originalTicketsMini = voidPageItem.voidTicketsMini;
    voidPageItem.voidTicketsMini = {
      ...originalTicketsMini,
      inning: '5',
      getCheckedTickets: originalTicketsMini.getCheckedTickets
    } as TicketsModel;

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.inning).toBe('5');
  });

  it('#getTemplateValue should handle smallest map ticket for other issues', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.issueTypeId = 18; // Other Issues
    const originalTicketsMini = voidPageItem.voidTicketsMini;
    voidPageItem.voidTicketsMini = {
      ...originalTicketsMini,
      smallestMapTicket: '123',
      getCheckedTickets: originalTicketsMini.getCheckedTickets
    } as TicketsModel;

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.smallestMapTicket).toBe('123');
  });

  it('#getTemplateValue should handle multiple bet types', () => {
    const voidPageItem = Helper.fakeVoidNotParticipateModel;
    const requestDetail = Helper.fakeRequestDetailViewModel;
    requestDetail.request.issueTypeId = 12; // Wrong Odds Sports Book
    voidPageItem.voidTicketsMini.betTypes = '1,2,3';

    const result = templateMessageService.getTemplateValue(voidPageItem, requestDetail);

    expect(result.betTypeId).toBeUndefined();
    expect(result.betTeam).toBeUndefined();
    expect(result.hdpValues).toBeUndefined();
    expect(result.groupBetTypeId).toBeUndefined();
  });
}); 