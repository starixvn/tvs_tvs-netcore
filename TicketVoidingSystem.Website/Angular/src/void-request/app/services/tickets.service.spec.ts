import clone from 'lodash/clone';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Result } from '../../../utility/models/result';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/get-tickets.query';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { TicketsModel } from '../tickets-list/tickets.model';
import { TicketsService } from './tickets.service';
import { TestBed } from '@angular/core/testing';
import { GroupService } from '../../../utility/components/tickets/group.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
  static readonly fakeVoidPageItem: VoidPageCommonItem = {
    id: 1,
    subIssueType: new SubIssueType(),
    displayIssueTypeName: '',
    matchModel: new MatchModel(),
    voidTicketsMini: new TicketsModel(),
    voidReason: new VoidedReason(),
    templateValue: new TemplateValue(),
    voidTicketsFull: new TicketsModel(),
    pagingVoidTickets: new PagingModel(),
    isShowTicketFull: true,
    isLoadedTicketFull: true,
    isBlockBetList: true,
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    detailViewModel: null,
    licenseeAffectedList: []
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
    requestId: 1,
    briefInfoNote: ''
  };
  static readonly fakeRequestDetailViewModel: RequestDetailViewModel = {
    requestId: 1,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    playerNames: [],
  };
}

describe('TicketsService', () => {
  let appService: jest.Mocked<AppService>;
  let ticketsService: TicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TicketsService,
        { provide: AppService, useValue: { getTicketsMini: jest.fn(), exportExcel: jest.fn(), getTickets: jest.fn() } },
        { provide: GroupService, useValue: {} }
      ]
    });
    appService = TestBed.inject(AppService) as jest.Mocked<AppService>;
    ticketsService = TestBed.inject(TicketsService);
  });

  it('#initTicketQuery should return model with match undefined', async () => {
    const result = ticketsService.initTicketQuery(Helper.fakeRequestDetailViewModel);

    expect(result.match).toBeUndefined()
  });

  it('#initTicketQuery should return model with match not null', async () => {
    const match = new MatchModel();
    const result = ticketsService.initTicketQuery(Helper.fakeRequestDetailViewModel, match);

    expect(result.match).toStrictEqual(match);
  });

  it('#getVoidTicketsMini should return TicketsModel', async () => {
    const model = new TicketsModel();
    appService.getTicketsMini = jest.fn().mockImplementation(() => model);
    ticketsService.initTicketQuery = jest.fn();

    const result = await ticketsService.getVoidTicketsMini(null);

    expect(result).toStrictEqual(model);
  });

  it('#loadVoidTicketsFullOnFirstTime should update pageSize to 1', async () => {
    const voidMatch = clone(Helper.fakeVoidPageItem);
    ticketsService.initTicketQuery = jest.fn();
    ticketsService['getVoidTicketsFull'] = jest.fn();

    await ticketsService.loadVoidTicketsFullOnFirstTime(voidMatch, Helper.fakeRequestDetailViewModel);

    expect(voidMatch.isLoadedTicketFull).toBeTruthy();
    expect(voidMatch.pagingVoidTickets.pageSize).toBe(PagingConstant.SIZE_ONE);
  });

  it('#loadVoidTicketsFullOnPagingChange should call #initTicketQuery', async () => {
    const item = clone(Helper.fakeVoidPageItem);
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    ticketsService['getVoidTicketsFull'] = jest.fn();

    await ticketsService.loadVoidTicketsFullOnPagingChange(item, Helper.fakeRequestDetailViewModel);

    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(ticketsService['getVoidTicketsFull']).toHaveBeenCalledTimes(1);
  });

  it('#exportTicketsAsExcelFile should return expected model', async () => {
    const voidMatch = clone(Helper.fakeVoidPageItem);
    appService.exportExcel = jest.fn();
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());

    await ticketsService.exportTicketsAsExcelFile(voidMatch, Helper.fakeRequestDetailViewModel);

    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(voidMatch.isBlockBetList).toBe(false);
  });

  it('#getVoidTicketsFull should update expected model', async () => {
    const voidMatch = clone(Helper.fakeVoidPageItem);
    appService.getTickets = jest.fn().mockImplementation(() => new TicketsModel());
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    await ticketsService['getVoidTicketsFull'](voidMatch, null);
    expect(voidMatch.isShowTicketFull).toBeTruthy();
  });
});