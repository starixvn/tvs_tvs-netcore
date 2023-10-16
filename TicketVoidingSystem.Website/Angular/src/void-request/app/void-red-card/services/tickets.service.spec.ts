import { DuplicateTicketsModel } from './../../../../add-request/app/add-request/models/event-duplicate-tickets.model';
import * as _ from 'lodash';
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
import { RequestDetailModel, RequestDetailViewModel } from '../../../../edit-request/app/request.model';

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
    cashOutLicensee: new AffectedLicensee(),
    isShowTemplateMessage: true,
    templateMessage: new Message(),
    isAllLiveTickets: false,
    isCheckedEarlyEvent: false,
    isMainMatch: false,
    isPoolHouseAffected: false,
    jollyViewLicensee: new AffectedLicensee,
    cancelCashOutLicensee: new AffectedLicensee
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
    requestId: 0
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
    duplicateTicketsModel: new DuplicateTicketsModel
  };
}

describe('TicketsServiceService', () => {
  let service: TicketsService;
  let appService: AppService;

  beforeEach(() => {
    appService = new AppService(null)
    service = new TicketsService(appService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#initTicketQuery should return expected model', async () => {
    // Action
    const result = service['initTicketQuery'](null, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(result.kickOffDate).toBeNull();
    expect(result.match).toBeNull();
  });

  it('#loadVoidTicketsFullOnFirstTime should return expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService['initTicketQuery'] = jest.fn();
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
    service['initTicketQuery'] = jest.fn().mockImplementation(() => new GetTicketsQuery());
    service['getVoidTicketsFull'] = jest.fn();

    // Action
    await service.loadVoidTicketsFullOnPagingChange(voidMatch, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(service['initTicketQuery']).toHaveBeenCalledTimes(1);
    expect(service['getVoidTicketsFull']).toHaveBeenCalledTimes(1);
  });

  it('#exportTicketsAsExcelFile should return expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    appService.exportExcel = jest.fn();
    const mockTicketsService = new TicketsService(appService);
    mockTicketsService['initTicketQuery'] = jest.fn().mockImplementation(() => new GetTicketsQuery());

    // Action
    await mockTicketsService.exportTicketsAsExcelFile(voidMatch, Helper.fakeRequestDetailViewModel);

    // Assert
    expect(mockTicketsService['initTicketQuery']).toHaveBeenCalledTimes(1);
    expect(voidMatch.isBlockBetList).toBe(false);
  });

  it('#getVoidTicketsFull should update expected model', async () => {
    // Arrange
    const voidMatch = _.clone(Helper.fakeVoidMatch);
    appService.getTickets = jest.fn().mockImplementation(() => new TicketsModel());
    const mockTicketsService = new TicketsService(appService);
    service['initTicketQuery'] = jest.fn().mockImplementation(() => new GetTicketsQuery());

    // Action
    await mockTicketsService['getVoidTicketsFull'](voidMatch, null);

    // Assert
    expect(voidMatch.isShowTicketFull).toBeTruthy();
    expect(voidMatch.affectedLicensee.show).toBeTruthy();
    expect(voidMatch.isShowTicketFull).toBeTruthy();
  });
});
