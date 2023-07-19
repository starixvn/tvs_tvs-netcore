import { EventEmitter, NgModule } from '@angular/core';
import * as _ from 'lodash';
import { ClipboardService } from 'ngx-clipboard';
import { Shallow } from 'shallow-render';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { MatchDetailComponent } from '../../utility/components/match-detail/match-detail.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { ModalType } from '../../utility/components/modal/modal.model';
import { ModalService } from '../../utility/components/modal/modal.service';
import { NotificationComponent } from '../../utility/components/notification/notification.component';
import { PagingModel } from '../../utility/components/paging/paging/paging.model';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { Product } from '../../utility/constants/config';
import { SportType } from '../../utility/constants/sport.constant';
import { TEXT } from '../../utility/constants/text';
import { MatchModel } from '../../utility/models/match.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterEvent } from './filter/filter.model';
import { MessagesResponseComponent } from './messages-response/messages-response.component';
import { MessagesResponse } from './messages-response/messages-response.model';
import { AmendmentReponse, CommonQuery, ExportExcelQuery, GetTicketsDetailModel, GetTicketsDetailQuery, SendFileQuery, SendFileResult } from './models/query.model';
import { SummaryComponent } from './summary/summary.component';
import { SummaryItem, SummaryItemViewModel } from './summary/summary.model';
import { TicketsModel } from './tickets/ticket.model';
import { TicketsComponent } from './tickets/tickets.component';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static readonly fakeDate = '2019-11-18 12:08:49.737';
  static readonly loadingSelector = '.loading';
  static readonly fakeSummaryItem = new SummaryItem('ABC', 1129, false, '12Bet', '2', [], 'Handicap');
  static readonly fakeSummaryItemForParlayBettype = new SummaryItem('ABC', 1129, false, '12Bet', '29', [], 'Handicap');
  static readonly fakeSummaryItemLarger200000 = new SummaryItem('CDE', 210000, false, '12Bet', '2', [], 'Handicap');
  static readonly fakeMatchModel: MatchModel = {
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
    eventDate: new Date('2020-08-26'),
    dateTime: new Date(),
    leagueId: 12345,
    leagueName: '',
    leagueNameNewSimplified: '',
    leagueNameSimplified: '',
    leagueNameTraditional: '',
    matchEvent: 'Real Madrid  (N) - vs - Valencia CF',
    matchEventSimplified: '皇家马德里 (中) - vs - 瓦伦西亚',
    matchEventNewSimplified: '皇家马德里 (中) - vs - 华伦西亚',
    kickOffTime: '2019-11-18 12:08:49.737',
    sportType: 8,
    sportTypeName: '',
    sportTypeNameNewSimplified: '',
    sportTypeNameSimplified: '',
    sportTypeNameTraditional: '',
    startTime: new Date(Helper.fakeDate),
    endTime: new Date(Helper.fakeDate),
    leagueGroupId: 0
  };
  static readonly fakeSummaryItemViewModel: SummaryItemViewModel = {
    groupByLicensees: [Helper.fakeSummaryItem],
    groupByBetTypes: [Helper.fakeSummaryItem]
  };
  static readonly fakeCommonQueryGroupByLicensee: CommonQuery = {
    matchId: 12345,
    betTypes: '1',
    selectionType: '',
    ballSequence: '',
    product: 0,
    ticketType: 0,
    eventType: 0,
    liveHomeScore: 1,
    liveAwayScore: 1,
    fromTransDate: '',
    toTransDate: '',
    groupBy: 0,
    singleOrSubParlay: 'Single',
    isReSettled: true,
    selectionSubParlays: ''
  };
  static readonly fakeCommonQueryGroupByBettype: CommonQuery = {
    matchId: 12345,
    betTypes: '1',
    selectionType: '',
    ballSequence: '',
    product: 0,
    ticketType: 0,
    eventType: 0,
    liveHomeScore: 1,
    liveAwayScore: 1,
    fromTransDate: '',
    toTransDate: '',
    groupBy: 1,
    singleOrSubParlay: 'Single',
    isReSettled: true,
    selectionSubParlays: ''
  };
  static readonly fakeGetTicketsDetailModel: GetTicketsDetailModel = {
    totalItems: 1,
    tickets: [
      {
        betId: '107918495999',
        transDate: '11/18/2019 09:39:59 PM',
        member: 'TP17081L0000',
        choice: '<div class=""><span class=favorite>Real Madrid  (N)<span class="handicap> -0.75</span></span></div>',
        odds: '<span class="underdog">1.06</span> (<span class="oddstype">HK</span>)',
        stake: '<div class="stake">7,700</div>',
        winLoss: '',
        currency: 'CY',
        betType: 'Handicap',
        status: '<div class="status">Running</div>',
        secondAcceptFlag: '',
        ballSequence: null,
        isMarked: false
      }
    ]
  };
  static readonly fakeSendFileResultSuccessfully: SendFileResult = {
    fileName: 'testfile',
    result: {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: ''
    }
  };
  static readonly fakeSendFileResultFailed: SendFileResult = {
    fileName: 'testfile',
    result: {
      errorCode: 1,
      errorMsg: 'error',
      isSuccessful: true,
      data: ''
    }
  };
  static readonly fakeAmendmentReponseSuccessfully: AmendmentReponse = {
    code: 0,
    message: '',
    isChinaView: false,
    isSuccessful: true,
    isCanReSend: false
  };

  static readonly fakeAmendmentReponseError: AmendmentReponse = {
    code: 1,
    message: 'error',
    isChinaView: false,
    isSuccessful: true,
    isCanReSend: false
  };

  static getFakeExportExcelQuery(betTypes: string, singleOrSubParlay: string, summaryItem: SummaryItem): ExportExcelQuery {
    return _.assignIn({}, Helper.fakeCommonQueryGroupByBettype, {
      isGroup: summaryItem.isGroup,
      betTypes: betTypes,
      singleOrSubParlay: singleOrSubParlay,
      betTypeName: summaryItem.betTypeName,
      licenseeName: summaryItem.licenseeName,
      matchCode: Helper.fakeMatchModel.matchCode,
      matchEvent: Helper.fakeMatchModel.matchEvent,
      eventDate: Helper.fakeMatchModel.eventDate,
      startTime: new Date(Helper.fakeDate),
      endTime: new Date(Helper.fakeDate),
      isChinaView: false,
      totalCreditTickets: 1129
    });
  }
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
      FilterComponent,
      MatchDetailComponent,
      SummaryComponent,
      TicketsComponent,
      NotificationComponent,
      MessagesResponseComponent,
      MenuBarComponent
    ],
    imports: [
      ToolTipModule
    ],
    providers: [HttpService, AppService]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)
    .mock(SignalRService, { initializeConnection: jest.fn()});
  });

  it('#ngAfterViewInit should call #blockUnBlockUI', async() => {
    // Arrange
    const service = new BlockUiService();
    service.blockUIEvent = new EventEmitter<boolean>();
    const component = new AppComponent (null, service, null, null, null, null);
    component['blockUnBlockUI'] = jest.fn();

    // Action
    component.ngAfterViewInit();
    service.blockUIEvent.next(true);

    // Assert
    expect(component['blockUnBlockUI']).toHaveBeenCalledTimes(1);
  });

  it('#hideContent should hide components for match, tickets', async () => {
    // Arrange
    const { instance } = await shallow.render();

    // Action
    instance.hideContent();

    // Assert
    expect(instance.isShowMatch).toBe(false);
    expect(instance.isShowSummary).toBe(false);
    expect(instance.isShowTickets).toBe(false);
  });

  it('#searchEvent should return expected data', async() => {
    // Arrange
    const { instance, findComponent } = await shallow
      .mock(AppService, {
        getSummary: jest.fn().mockImplementation(() => Helper.fakeSummaryItemViewModel)
      })
      .render();
    const getSummaryQuery = {
      matchId: 28321695,
      betTypes: '1,1303',
      selectionType: '',
      ballSequence: '1,2,3',
      product: 0,
      ticketType: 0,
      eventType: 2,
      liveHomeScore: 0,
      liveAwayScore: 0,
      fromTransDate: '2019-11-18 12:08:49.736',
      toTransDate: '2019-11-18 12:08:49.738',
      groupBy: 0,
      singleOrSubParlay: 'Single',
      isReSettled: true,
      licenseeId: 1,
      selectionSubParlays: ''
    };
    const filterEvent: FilterEvent = {
      query: getSummaryQuery,
      match: Helper.fakeMatchModel
    };
    const summaryComponent = findComponent(SummaryComponent);
    // Action
    await instance.searchEvent(filterEvent);

    // Assert
    expect(instance.commonQuery).toStrictEqual(getSummaryQuery);
    expect(instance.matchViewModel).toStrictEqual(Helper.fakeMatchModel);
    expect(summaryComponent.checkedAll).toBe(true);
    expect(summaryComponent.isShowSend).toBe(true);
    expect(instance.summaryItemsGroupByLicensee).toStrictEqual(Helper.fakeSummaryItemViewModel.groupByLicensees);
    expect(instance.summaryItems.length).toBe(1);
    expect(instance.isShowSummary).toBe(true);
    expect(instance.showSendColumn).toBe(true);
  });

  it('#searchEvent should update isShowListBetTypeAffected to true', async() => {
    // Arrange
    const { instance, findComponent } = await shallow
      .mock(AppService, {
        getSummary: jest.fn().mockImplementation(() => Helper.fakeSummaryItemViewModel)
      })
      .render();
    const getSummaryQuery = {
      matchId: 28321695,
      betTypes: '1,1303',
      selectionType: '',
      ballSequence: '1,2,3',
      product: 0,
      ticketType: 0,
      eventType: 2,
      liveHomeScore: 0,
      liveAwayScore: 0,
      fromTransDate: '2019-11-18 12:08:49.736',
      toTransDate: '2019-11-18 12:08:49.738',
      groupBy: 0,
      singleOrSubParlay: 'Single',
      isReSettled: true,
      licenseeId: 1,
      selectionSubParlays: ''
    };
    const filterEvent: FilterEvent = {
      query: getSummaryQuery,
      match: Helper.fakeMatchModel
    };
    const summaryComponent = findComponent(SummaryComponent);
    filterEvent.match.sportType = SportType.SOCCER;
    filterEvent.query.isReSettled = true;
    filterEvent.query.groupBy = 1;

    // Action
    await instance.searchEvent(filterEvent);

    // Assert
    expect(instance.commonQuery).toStrictEqual(getSummaryQuery);
    expect(instance.matchViewModel).toStrictEqual(Helper.fakeMatchModel);
    expect(summaryComponent.checkedAll).toBe(true);
    expect(summaryComponent.isShowSend).toBe(true);
    expect(instance.summaryItemsGroupByLicensee).toStrictEqual(Helper.fakeSummaryItemViewModel.groupByLicensees);
    expect(instance.summaryItems.length).toBe(1);
    expect(instance.isShowSummary).toBe(true);
    expect(instance.showSendColumn).toBe(false);
    expect(instance.isShowListBetTypeAffected).toBe(true);
  });

  it('#getTicketsEvent should display notification with data larger 200000', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.notification.open = jest.fn();

    // Action
    await instance.getTicketsEvent(Helper.fakeSummaryItemLarger200000);

    // Assert
    expect(instance.notification.open).toHaveBeenCalledWith('Ticket Listing Result', TEXT.TICKET_LISTING_LIMITED);
  });

  it('#getTicketsEvent should call #getTicketsDetail and return expected data with group by Licensee', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.commonQuery = Helper.fakeCommonQueryGroupByLicensee;
    instance.getTicketsDetail = jest.fn();

    // Action
    await instance.getTicketsEvent(Helper.fakeSummaryItem);

    // Assert
    expect(instance.getTicketsDetailQuery.betTypes).toBe('2,1305,157');
    expect(instance.getTicketsDetailQuery.singleOrSubParlay).toBe('Single');
    expect(instance.titleTicketsListing).toBe('Tickets Listing for - Match ID: 12345 - Licensee: 12Bet');
    expect(instance.currentItem).toStrictEqual(Helper.fakeSummaryItem);
    expect(instance.getTicketsDetail).toHaveBeenCalledTimes(1);
  });

  it('#getTicketsEvent should call #getTicketsDetail and return expected data with group by Bettype', async () => {
    // Arrange
    const { instance } = await shallow.render();
    instance.commonQuery = Helper.fakeCommonQueryGroupByBettype;
    instance.getTicketsDetail = jest.fn();

    // Action
    await instance.getTicketsEvent(Helper.fakeSummaryItemForParlayBettype);

    // Assert
    expect(instance.getTicketsDetailQuery.betTypes).toBe('1');
    expect(instance.getTicketsDetailQuery.singleOrSubParlay).toBe('SubParlay');
    expect(instance.titleTicketsListing).toBe('Tickets Listing for - Match ID: 12345 - Bet type: ABC');
    expect(instance.currentItem).toStrictEqual(Helper.fakeSummaryItemForParlayBettype);
    expect(instance.getTicketsDetail).toHaveBeenCalledTimes(1);
  });

  it('#pagingSearchTicket should return expected paging info and call #getTicketsDetail', async() => {
    // Arrange
    const { instance } = await shallow.render();
    const pagingModel = new PagingModel();
    pagingModel.page = 2;
    pagingModel.pageSize = 2000;
    instance.getTicketsDetailQuery = new GetTicketsDetailQuery();
    instance.getTicketsDetail = jest.fn();

    // Action
    await instance.pagingSearchTicket(pagingModel);

    // Assert
    expect(instance.getTicketsDetailQuery.pageIndex).toBe(pagingModel.page - 1);
    expect(instance.getTicketsDetailQuery.pageSize).toBe(pagingModel.pageSize);
    expect(instance.getTicketsDetail).toHaveBeenCalledTimes(1);
  });

  it('#getTicketsDetail should return expected ticketsModel', async() => {
    // Arrange
    const { instance } = await shallow
      .mock(AppService, {
        getTicketsDetail: jest.fn().mockImplementation(() => Helper.fakeGetTicketsDetailModel)
      })
      .render();
    instance.ticketsModel = new TicketsModel();
    instance.getTicketsDetailQuery = new GetTicketsDetailQuery();

    // Action
    await instance.getTicketsDetail();

    // Assert
    expect(instance.ticketsModel.tickets.length).toBe(Helper.fakeGetTicketsDetailModel.tickets.length);
    expect(instance.ticketsModel.pagingModel.total).toBe(Helper.fakeGetTicketsDetailModel.totalItems);
  });

  it('#exportExcelEvent should display notification with data larger 100000', async() => {
    // Arrange
    const { instance } = await shallow.render();
    instance.notification.open = jest.fn();

    // Action
    instance.exportExcelEvent(Helper.fakeSummaryItemLarger200000);

    // Assert
    expect(instance.notification.open).toHaveBeenCalledWith('Export Excel Result', TEXT.EXPORT_EXCEL_LIMITED);
  });

  it('#exportExcelEvent should call #exportExcel with expected param', async() => {
    // Arrange
    const mockExportExcel = jest.fn();
    const { instance } = await shallow
      .mock(AppService, {
        exportExcel: mockExportExcel
      })
      .render();
    instance.commonQuery = Helper.fakeCommonQueryGroupByBettype;
    instance.matchViewModel = Helper.fakeMatchModel;
    const expectedQuery = Helper.getFakeExportExcelQuery('2,1305,157', 'Single', Helper.fakeSummaryItem);

    // Action
    instance.exportExcelEvent(Helper.fakeSummaryItem);

    // Assert
    expect(mockExportExcel).toHaveBeenCalledTimes(1);
    expect(mockExportExcel).toHaveBeenCalledWith(expectedQuery);
  });

  it('when #searchEvent and #changeMatchEvent of FilterComponent emit, #searchEvent and #hideContent should be called', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.searchEvent = jest.fn();
    instance.hideContent = jest.fn();
    const filterComponent = findComponent(FilterComponent);
    filterComponent.searchEvent.emit(new FilterEvent());
    filterComponent.changeMatchEvent.emit();

    expect(instance.searchEvent).toHaveBeenCalledTimes(1);
    expect(instance.searchEvent).toHaveBeenCalledWith(new FilterEvent());
    expect(instance.hideContent).toHaveBeenCalledTimes(1);
  });

  it('when #getTicketsEvent, #exportExcelEvent and #sendExcelFileEvent of SummaryComponent emit and #sendExcelFileEvent should be called', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.getTicketsEvent = jest.fn();
    instance.exportExcelEvent = jest.fn();
    instance.sendExcelFileEvent = jest.fn();
    const summaryComponent = findComponent(SummaryComponent);
    summaryComponent.getTicketsEvent.emit(Helper.fakeSummaryItem);
    summaryComponent.exportExcelEvent.emit(Helper.fakeSummaryItem);
    summaryComponent.sendExcelFileEvent.emit([Helper.fakeSummaryItem]);

    expect(instance.getTicketsEvent).toHaveBeenCalledTimes(1);
    expect(instance.getTicketsEvent).toHaveBeenCalledWith(Helper.fakeSummaryItem);
    expect(instance.exportExcelEvent).toHaveBeenCalledTimes(1);
    expect(instance.exportExcelEvent).toHaveBeenCalledWith(Helper.fakeSummaryItem);
    expect(instance.sendExcelFileEvent).toHaveBeenCalledTimes(1);
    expect(instance.sendExcelFileEvent).toHaveBeenCalledWith([Helper.fakeSummaryItem]);
  });

  it('when #pagingSearchTicket and #exportExcelEvent of TicketsComponent emit, #pagingSearchTicket and #exportExcelEvent should be called', async () => {
    const { fixture, instance, findComponent } = await shallow.render();
    fixture.detectChanges();
    instance.pagingSearchTicket = jest.fn();
    instance.exportExcelEvent = jest.fn();
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.pagingSearchTicket.emit(new PagingModel());
    ticketsComponent.exportExcelEvent.emit(Helper.fakeSummaryItem);

    expect(instance.pagingSearchTicket).toHaveBeenCalledTimes(1);
    expect(instance.pagingSearchTicket).toHaveBeenCalledWith(new PagingModel());
    expect(instance.exportExcelEvent).toHaveBeenCalledTimes(1);
    expect(instance.exportExcelEvent).toHaveBeenCalledWith(Helper.fakeSummaryItem);
  });

  it('should display loading icon and block screen', async () => {
    const { instance, fixture, find } = await shallow.render();
    instance['blockUnBlockUI'](true);
    fixture.detectChanges();

    expect(find(Helper.loadingSelector)).toHaveFoundOne();
  });

  it('getSingleOrSubParlayParam should return default', async () => {
    const defaultSingleOrSubParlay = '111';
    const { instance } = await shallow.render();

    const actual = instance['getSingleOrSubParlayParam']('1', true, 2, defaultSingleOrSubParlay);

    expect(actual).toBe(defaultSingleOrSubParlay);
  });

  it('sendExcelFileEvent should called expected', async () => {
    const confirmModal = { title: 'Send Data', message: TEXT.SEND_FILE + Helper.fakeSummaryItem.licenseeName + '?', type: ModalType.Confirm };
    const mockModalServiceConfirm = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, {
      confirm: mockModalServiceConfirm
    })
    .render();
    instance.sendExcelFileEvent([Helper.fakeSummaryItem]);

    expect(mockModalServiceConfirm.mock.calls[0][0]).toStrictEqual(confirmModal);

    instance.sendFile = jest.fn();
    mockModalServiceConfirm.mock.calls[0][1]();
    expect(instance.sendFile).toHaveBeenCalledTimes(1);

    mockModalServiceConfirm.mock.calls[0][2]();
  });

  it('sendCreditToLetstalk should called expected', async () => {
    const mockSendCreditDataToLetstalk = jest.fn().mockImplementation(() => Promise.resolve(new Result()));
    const { instance } = await shallow
    .mock(AppService, {
      sendCreditDataToLetstalk: mockSendCreditDataToLetstalk
    })
    .render();
    instance.messagesResponse = new MessagesResponse();
    instance.messagesResponse.open = jest.fn();
    instance.matchViewModel = Helper.fakeMatchModel;

    await instance.sendCreditToLetstalk(Helper.fakeSummaryItem);

    expect(mockSendCreditDataToLetstalk).toHaveBeenCalledTimes(1);
    expect(instance.messagesResponse.open).toHaveBeenCalledTimes(1);
  });

  it('sendFile should called expected', async () => {
    const fakeResponse = _.cloneDeep(Helper.fakeAmendmentReponseError);
    fakeResponse.isChinaView = true;
    fakeResponse.message = null;
    const amendmentReponse = [
      Helper.fakeAmendmentReponseSuccessfully,
      Helper.fakeAmendmentReponseError,
      fakeResponse
    ];
    const fakeSummaryItem = _.cloneDeep(Helper.fakeSummaryItem);
    fakeSummaryItem.betTypes = '29';
    const mockSendDataToOic = jest.fn().mockImplementation(() => Promise.resolve(amendmentReponse));
    const { instance } = await shallow
    .mock(AppService, {
      sendDataToOic: mockSendDataToOic
    })
    .render();
    instance.matchViewModel = Helper.fakeMatchModel;
    instance.sendFileItems = [Helper.fakeSummaryItem, fakeSummaryItem];

    [Product.SPORTS_BOOK, Product.BITCOIN].forEach(async x => {
      instance.commonQuery.product = x;

      await instance.sendFile();

      expect(mockSendDataToOic).toHaveBeenCalled();
    });
  });

  it('sendCreditToLetstalk should called expected', async () => {
    const mockSendCreditDataToLetstalk = jest.fn().mockImplementation(() => Promise.resolve(new Result()));
    const { instance } = await shallow
    .mock(AppService, {
      sendCreditDataToLetstalk: mockSendCreditDataToLetstalk
    })
    .render();
    instance.messagesResponse = new MessagesResponse();
    instance.messagesResponse.open = jest.fn();
    instance.matchViewModel = Helper.fakeMatchModel;
    ['29', '112'].forEach(async x => {
      Helper.fakeSummaryItem.betTypes = x;
      await instance.sendCreditToLetstalk(Helper.fakeSummaryItem);

      expect(mockSendCreditDataToLetstalk).toHaveBeenCalled();
      expect(instance.messagesResponse.open).toHaveBeenCalled();
    });
  });

  it('resendData should update correct data when resend successfully', async () => {
    const normalQuery = new SendFileQuery();
    normalQuery.isChinaView = false;
    normalQuery.licenseeName = '';
    const chinaViewQuery = new SendFileQuery();
    chinaViewQuery.isChinaView = true;
    normalQuery.licenseeName = '';
    const fakeAmendmentReponseSuccessfully = _.cloneDeep(Helper.fakeAmendmentReponseSuccessfully);
    fakeAmendmentReponseSuccessfully.code = 0;
    const mockSendDataToOic = jest.fn().mockImplementation(() => Promise.resolve([fakeAmendmentReponseSuccessfully]));
    const { instance } = await shallow
    .mock(AppService, {
      sendDataToOic: mockSendDataToOic
    })
    .render();
    instance.sendFileQueries = [normalQuery, chinaViewQuery];
    instance.messagesResponse = new MessagesResponse();
    instance.messagesResponse.results = [Helper.fakeAmendmentReponseSuccessfully];
    instance.matchViewModel = Helper.fakeMatchModel;

    await instance.resendData(false);

    expect(mockSendDataToOic).toHaveBeenCalledTimes(1);
  });

  it('resendData should update correct data when resend has error', async () => {
    const fakeAmendmentReponseSuccessfully = _.cloneDeep(Helper.fakeAmendmentReponseSuccessfully);
    fakeAmendmentReponseSuccessfully.code = 1;
    const mockSendDataToOic = jest.fn().mockImplementation(() => Promise.resolve([fakeAmendmentReponseSuccessfully]));
    const { instance } = await shallow
    .mock(AppService, {
      sendDataToOic: mockSendDataToOic
    })
    .render();
    const query = new SendFileQuery();
    query.isChinaView = false;
    instance.sendFileQueries = [query];
    instance.messagesResponse = new MessagesResponse();
    instance.messagesResponse.results = [Helper.fakeAmendmentReponseSuccessfully];
    instance.matchViewModel = Helper.fakeMatchModel;

    await instance.resendData(false);

    expect(mockSendDataToOic).toHaveBeenCalledTimes(1);
  });

  it('copyClipboard should call #clipboardService.copyFromContent', async () => {
    const mockCopyFromContent = jest.fn();
    const { instance } = await shallow
    .mock(ClipboardService, {
      copyFromContent: mockCopyFromContent
    })
    .render();
    window.alert = jest.fn();

    instance.copyClipboard('');

    expect(mockCopyFromContent).toHaveBeenCalledTimes(1);
  });
});
