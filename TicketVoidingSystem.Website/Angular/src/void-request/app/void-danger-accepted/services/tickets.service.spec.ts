import * as _ from 'lodash';
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { PagingConstant, PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { AffectedLicensee } from '../../../../utility/models/affected-licensee.model';
import { SubIssueType } from '../../../../utility/models/issue-type.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { VoidedReason } from '../../../../utility/models/reason.model';
import { AppService } from '../../app.service';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { TicketsService } from './tickets.service';

class Helper {
  static readonly fakeRequestId = 50121;
  static readonly fakeVoidMatch: VoidMatch = {
    subIssueType: new SubIssueType(),
    displayIssueTypeName: '',
    matchModel: new MatchModel(),
    voidTicketsMini: new TicketsModel(),
    voidReason: new VoidedReason(),
    templateValue: new TemplateValue(),
    logInfoDetail: new LogInfoDetail(),
    voidTicketsFull: new TicketsModel(),
    pagingVoidTickets: new PagingModel(),
    isShowTicketFull: true,
    isLoadedTicketFull: true,
    isBlockBetList: true,
    affectedLicensee: new AffectedLicensee(),
    affectedInstantLicensee: new AffectedLicensee(),
    chinaViewLicensee: new AffectedLicensee(),
    jollyViewLicensee: new AffectedLicensee(),
    cashOutLicensee: new AffectedLicensee(),
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    isAllLiveTickets: false,
    isCheckedEarlyEvent: false,
    isMainMatch: false,
    isPoolHouseAffected: false,
    cancelCashOutLicensee: new AffectedLicensee,
    isAllNonLiveTickets: true
  };
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
    requestId: 1
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: Helper.fakeRequestId,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    messages: [],
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
}

describe('TicketsService', () => {
  let appService: AppService;
  let ticketsService: TicketsService;

  beforeEach(() => {
    appService = new AppService(null);
    ticketsService = new TicketsService(null);
  });

  it('#initTicketQuery should return expected model', async () => {
    // Action
    const result = ticketsService.initTicketQuery(null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(result.match).toBeNull();
  });
  
  it('#getVoidTicketsMini should return expected model', async () => {
    // Arrange
    const model = new TicketsModel();
    appService.getTicketsMini = jest.fn().mockImplementation(() => model);
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn();

    // Action
    const result = await mockTicketsService.getVoidTicketsMini(null);

    // Assert
    expect(result).toStrictEqual(model);
  });
  
  it('#loadVoidTicketsFullOnFirstTime should return expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn();
    mockTicketsService['getVoidTicketsFull'] = jest.fn();

    // Action
    await mockTicketsService.loadVoidTicketsFullOnFirstTime(voidMatch, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(voidMatch.isLoadedTicketFull).toBeTruthy();
    expect(voidMatch.pagingVoidTickets.pageSize).toBe(PagingConstant.SIZE_ONE);
  });
  
  it('#loadVoidTicketsFullOnPagingChange should call #initTicketQuery', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    ticketsService['getVoidTicketsFull'] = jest.fn();

    // Action
    await ticketsService.loadVoidTicketsFullOnPagingChange(voidMatch, Helper.fakeRequestDetailViewModel);
    
    // Assert
    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(ticketsService['getVoidTicketsFull']).toHaveBeenCalledTimes(1);
  });
  
  it('#exportTicketsAsExcelFile should return expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    appService.exportExcel = jest.fn();
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());

    // Action
    await mockTicketsService.exportTicketsAsExcelFile(voidMatch, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(mockTicketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(voidMatch.isBlockBetList).toBe(false);
  });
  
  it('#getVoidTicketsFull should update expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    appService.getTickets = jest.fn().mockImplementation(() => new TicketsModel());
    const mockTicketsService = new TicketsService(appService);
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    await mockTicketsService['getVoidTicketsFull'](voidMatch, null);

    // Assert
    expect(voidMatch.isShowTicketFull).toBeTruthy();
    expect(voidMatch.affectedLicensee.show).toBeTruthy();
    expect(voidMatch.isShowTicketFull).toBeTruthy();
  });
});