import * as _ from 'lodash';
import { RequestDetailModel, RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { PagingConstant, PagingModel } from '../../../utility/components/paging/paging/paging.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { TemplateValue } from '../../../utility/components/template-message/template-message/template.model';
import { AffectedLicensee } from '../../../utility/models/affected-licensee.model';
import { SubIssueType } from '../../../utility/models/issue-type.model';
import { MatchModel } from '../../../utility/models/match.model';
import { VoidedReason } from '../../../utility/models/reason.model';
import { Result } from '../../../utility/models/result';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/get-tickets.query';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { TicketsModel } from '../tickets-list/tickets.model';
import { TicketsService } from './tickets.service';

class Helper {
  static readonly fakeResultError: Result<null> = {
    isSuccessful: false,
    errorCode: 111111,
    errorMsg: '',
  };
  static readonly fakeVoidPageItem: VoidPageCommonItem = {
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
    affectedLicensee: new AffectedLicensee(),
    affectedInstantLicensee: new AffectedLicensee(),
    chinaViewLicensee: new AffectedLicensee(),
    cashOutLicensee: new AffectedLicensee(),
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    detailViewModel: null
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
    requestId: 1,
    lastModifiedDate: null,
    request: Helper.fakeRequestDetailModel,
    event: null,
    messages: [],
  };
}

describe('TicketsService', () => {
  let appService: AppService;
  let ticketsService: TicketsService;

  beforeEach(() => {
    appService = new AppService(null);
    ticketsService = new TicketsService(null);
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
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn();

    const result = await mockTicketsService.getVoidTicketsMini(null);

    expect(result).toStrictEqual(model);
  });

  it('#loadVoidTicketsFullOnFirstTime should update pageSize to 1', async () => {
    const voidMatch = _.clone(Helper.fakeVoidPageItem);
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn();
    mockTicketsService['getVoidTicketsFull'] = jest.fn();

    await mockTicketsService.loadVoidTicketsFullOnFirstTime(voidMatch, Helper.fakeRequestDetailViewModel);

    expect(voidMatch.isLoadedTicketFull).toBeTruthy();
    expect(voidMatch.pagingVoidTickets.pageSize).toBe(PagingConstant.SIZE_ONE);
  });

  it('#loadVoidTicketsFullOnPagingChange should call #initTicketQuery', async () => {
    const item = _.clone(Helper.fakeVoidPageItem);
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    ticketsService['getVoidTicketsFull'] = jest.fn();

    await ticketsService.loadVoidTicketsFullOnPagingChange(item, Helper.fakeRequestDetailViewModel);

    expect(ticketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(ticketsService['getVoidTicketsFull']).toHaveBeenCalledTimes(1);
  });

  it('#exportTicketsAsExcelFile should return expected model', async () => {
    const voidMatch = _.clone(Helper.fakeVoidPageItem);
    appService.exportExcel = jest.fn();
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());

    await mockTicketsService.exportTicketsAsExcelFile(voidMatch, Helper.fakeRequestDetailViewModel);

    expect(mockTicketsService.initTicketQuery).toHaveBeenCalledTimes(1);
    expect(voidMatch.isBlockBetList).toBe(false);
  });

  it('#getVoidTicketsFull should update expected model', async () => {
    const voidMatch = _.clone(Helper.fakeVoidPageItem);
    appService.getTickets = jest.fn().mockImplementation(() => new TicketsModel());
    const mockTicketsService = new TicketsService(appService);
    ticketsService.initTicketQuery = jest.fn().mockImplementation(() => new GetTicketsQuery());
    await mockTicketsService['getVoidTicketsFull'](voidMatch, null);

    expect(voidMatch.isShowTicketFull).toBeTruthy();
    expect(voidMatch.affectedLicensee.show).toBeTruthy();
    expect(voidMatch.isShowTicketFull).toBeTruthy();
  });
});