import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ModalService } from '../../utility/components/modal/modal.service';
import { ClipboardService } from 'ngx-clipboard';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { BlockUiService } from '../../utility/components/block-ui/block-ui.service';
import { FilterEvent } from './filter/filter.model';
import { MatchModel } from '../../utility/models/match.model';
import { SummaryItemViewModel, SummaryItem } from './summary/summary.model';
import { GetTicketsDetailModel, GetTicketsDetailQuery, AmendmentReponse, CommonQuery } from './models/query.model';
import { Product } from '../../utility/constants/config';
import { SportType } from '../../utility/constants/sport.constant';
import { CONFIG, TEXT } from '../../utility/constants/text';
import { Notification } from '../../utility/components/notification/notification';
import { MessagesResponse } from './messages-response/messages-response.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { ElementRef, EventEmitter } from '@angular/core';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { CommonService } from '../../utility/services/common.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FilterComponent } from './filter/filter.component';
import { TicketsComponent } from './tickets/tickets.component';
import { MessagesResponseComponent } from './messages-response/messages-response.component';
import { NotificationComponent } from '../../utility/components/notification/notification.component';
import { MatchDetailComponent } from '../../utility/components/match-detail/match-detail.component';
import { TooltipComponent } from '../../utility/components/tooltip/tooltip.component';
import { SummaryComponent } from './summary/summary.component';
import { NapUserInfoModel } from '../../utility/components/menu-bar/menu-bar.model';
import { BetTypesModel } from '../../utility/components/bettypes/bettypes.model';

// Mock window.alert
window.alert = jest.fn();

// Mock document.body.getAttribute
document.body.getAttribute = jest.fn().mockReturnValue('/');

class Helper {
  static readonly mockMenuItems = {
    menuItem: [{ id: 1, name: 'Menu 1', displayOrder: 1, parentId: 0, items: []},
    { id: 2, name: 'Menu 2', displayOrder: 2, parentId: 0, items: []}],
    userName: 'Test User', userId: 1
  } as unknown as NapUserInfoModel;

  static readonly mockBetTypes = {
    betTypes: [{ id: '1', name: 'Test Bet Type', liveIndicator: false, type: 1, isChecked: false }],
    isChecked: false,
    result: {
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true,
      data: null
    } as unknown as Result<null>
  } as unknown as BetTypesModel;

  static readonly mockMatchViewModel = {
    matchCode: 'TEST123',
    matchEvent: 'Test Event',
    eventDate: new Date('2024-03-20'),
    globalShowTime: new Date('2024-03-20T10:00:00'),
    startTime: new Date('2024-03-20T10:00:00'),
    endTime: new Date('2024-03-20T11:00:00'),
    matchId: 123,
    leagueName: 'Test League'
  } as unknown as MatchModel;

  static readonly mockGetTicketsDetailQuery = {
    groupBy: 0,
    licenseeName: 'Test Licensee',
    pageIndex: 0,
    pageSize: 10,
    matchId: 123,
    betTypes: '1',
    product: Product.SPORTS_BOOK,
    isReSettled: false
  } as unknown as GetTicketsDetailQuery;

  static readonly mockSummaryItemViewModel = {
    groupByLicensees: [],
    groupByBetTypes: [{
      name: 'Test Bet Type',
      total: 10,
      isChinaView: false,
      licenseeName: 'Test Licensee',
      betTypes: '1',
      items: [],
      betTypeName: 'Test Bet Type',
      isGroup: false,
      specialPlatform: null,
      isChecked: false,
      isShow: true
    }]
  } as SummaryItemViewModel;

  static readonly mockFilterEvent = {
    query: {
      matchId: 123,
      product: Product.SPORTS_BOOK,
      groupBy: 0,
      isReSettled: true,
      licenseeId: 1,
      betTypes: '1',
      selectionType: '',
      ballSequence: '',
      ticketType: 0,
      eventType: 0,
      liveHomeScore: 0,
      liveAwayScore: 0,
      fromTransDate: '',
      toTransDate: '',
      singleOrSubParlay: '',
      selectionSubParlays: ''
    },
    match: {
      sportType: SportType.SOCCER
    } as MatchModel
  } as FilterEvent;

  static readonly mockCommonQuery = {
    matchId: 123,
    product: Product.SPORTS_BOOK,
    groupBy: 0,
    isReSettled: false,
    licenseeId: 1,
    betTypes: '1',
    selectionType: '',
    ballSequence: '',
    ticketType: 0,
    eventType: 0,
    liveHomeScore: 0,
    liveAwayScore: 0,
    fromTransDate: '',
    toTransDate: '',
    singleOrSubParlay: '',
    selectionSubParlays: ''
  } as CommonQuery;

  static readonly mockSummaryItem = {
    name: 'Test Item',
    total: 3,
    isChinaView: false,
    licenseeName: 'Test Licensee',
    betTypes: '29',
    items: [],
    betTypeName: 'Test Bet Type',
    isGroup: false,
    specialPlatform: null,
    isChecked: false,
    isShow: true
  } as SummaryItem;

  static readonly mockSummaryItemExceedLimit = {
    ...this.mockSummaryItem,
    total: CONFIG.TICKET_LISTING_LIMITED + 1
  } as SummaryItem;

  static readonly mockTicketsDetail = {
    totalItems: 10,
    tickets: []
  } as GetTicketsDetailModel;

  static readonly mockResult = {
    errorCode: 0,
    errorMsg: 'Success',
    isSuccessful: true,
    data: null
  } as Result<null>;

  static readonly mockAmendmentResponse = [{
    code: 0,
    message: 'Success',
    isChinaView: false,
    isCanReSend: false,
    specialPlatform: null,
    isSuccessful: true
  }] as AmendmentReponse[];

  static readonly mockNotification = {
    header: '',
    body: '',
    isShow: false,
    open: jest.fn(),
    close: jest.fn()
  } as Notification;

  static readonly mockMessagesResponse = {
    header: '',
    body: '',
    isShow: false,
    results: [],
    open: jest.fn(),
    close: jest.fn()
  } as MessagesResponse;
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let appService: AppService;
  let clipboardService: ClipboardService;
  let signalRService: SignalRService;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, MenuBarComponent, FilterComponent, TicketsComponent, MessagesResponseComponent, 
        NotificationComponent, MatchDetailComponent, TooltipComponent, SummaryComponent],
      providers: [
        { provide: HttpService, useValue: {
          get: jest.fn(), post: jest.fn(),
          getJson: jest.fn().mockReturnValue(Promise.resolve({}))
        } },
        { provide: SignalRService, useValue: { initializeConnection: jest.fn() } },
        { provide: ModalService, useValue: { open: jest.fn(), confirm: jest.fn() } },
        { provide: AppService, useValue: { 
          getSummary: jest.fn(), getTicketsDetail: jest.fn(), exportExcel: jest.fn(),
          sendCreditDataToLetstalk: jest.fn(), sendDataToOic: jest.fn(), getLicensees: jest.fn().mockResolvedValue([])
        }},
        { provide: ClipboardService, useValue: { copyFromContent: jest.fn() } },
        { provide: BlockUiService, useValue: { blockUIEvent: new EventEmitter<boolean>(), start: jest.fn(), stop: jest.fn() } },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: CommonService, useValue: {
          getNapUserInfo: jest.fn().mockResolvedValue(Helper.mockMenuItems),
          getBetTypes: jest.fn().mockResolvedValue(Helper.mockBetTypes),
          logAccessFunction: jest.fn()
        } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.matchViewModel = Helper.mockMatchViewModel;
    component.getTicketsDetailQuery = Helper.mockGetTicketsDetailQuery;
    
    // Get services from injector
    appService = fixture.debugElement.injector.get(AppService);
    clipboardService = fixture.debugElement.injector.get(ClipboardService);
    signalRService = fixture.debugElement.injector.get(SignalRService);
    commonService = fixture.debugElement.injector.get(CommonService);

    fixture.detectChanges();
  });

  it('should create', () => {
    // Arrange & Act & Assert
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should initialize SignalR connection', async () => {
    // Arrange & Act
    await component.ngOnInit();
    // Assert
    expect(signalRService.initializeConnection).toHaveBeenCalled();
  });

  it('#searchEvent should handle search event correctly', async () => {
    // Arrange
    jest.spyOn(appService, 'getSummary').mockResolvedValue(Helper.mockSummaryItemViewModel);

    // Act
    await component.searchEvent(Helper.mockFilterEvent);

    // Assert
    expect(appService.getSummary).toHaveBeenCalledWith(Helper.mockFilterEvent.query);
    expect(component.isShowMatch).toBe(true);
    expect(component.isShowSummary).toBe(true);
  });

  it('#getTicketsEvent should handle when total is within limit', async () => {
    // Arrange
    component.commonQuery = Helper.mockCommonQuery;
    jest.spyOn(appService, 'getTicketsDetail').mockResolvedValue(Helper.mockTicketsDetail);

    // Act
    await component.getTicketsEvent(Helper.mockSummaryItem);

    // Assert
    expect(appService.getTicketsDetail).toHaveBeenCalled();
    expect(component.isShowTickets).toBe(true);
  });

  it('#getTicketsEvent should show notification when total exceeds limit', async () => {
    // Arrange
    // Act
    await component.getTicketsEvent(Helper.mockSummaryItemExceedLimit);

    // Assert
    expect(appService.getTicketsDetail).not.toHaveBeenCalled();
    expect(component.notification.header).toBe('Ticket Listing Result');
    expect(component.notification.body).toBe(TEXT.TICKET_LISTING_LIMITED);
  });

  it('#exportExcelEvent should handle when total is within limit', () => {
    // Arrange
    // Act
    component.exportExcelEvent(Helper.mockSummaryItem);

    // Assert
    expect(appService.exportExcel).toHaveBeenCalled();
  });

  it('#sendCreditToLetstalk should handle when total is within limit', async () => {
    // Arrange
    jest.spyOn(appService, 'sendCreditDataToLetstalk').mockResolvedValue(Helper.mockResult);

    // Act
    await component.sendCreditToLetstalk(Helper.mockSummaryItem);

    // Assert
    expect(appService.sendCreditDataToLetstalk).toHaveBeenCalled();
    expect(component.messagesResponse.results[0].code).toBe(0);
  });

  it('#sendFile should handle correctly', async () => {
    // Arrange
    jest.spyOn(appService, 'sendDataToOic').mockResolvedValue(Helper.mockAmendmentResponse);
    component.sendFileItems = [Helper.mockSummaryItem];

    // Act
    await component.sendFile();

    // Assert
    expect(appService.sendDataToOic).toHaveBeenCalled();
    expect(component.messagesResponse.results[0].code).toBe(0);
  });

  it('#copyClipboard should copy text to clipboard', () => {
    // Arrange
    const mockText = 'Test Text';
    const clipboardServiceSpy = jest.spyOn(clipboardService, 'copyFromContent');

    // Act
    component.copyClipboard(mockText);

    // Assert
    expect(clipboardServiceSpy).toHaveBeenCalledWith(mockText);
  });

  it('should show notification when total exceeds limit', async () => {
    // Arrange
    component.notification = Helper.mockNotification;
    const notificationSpy = jest.spyOn(component.notification, 'open');

    // Act
    await component.sendCreditToLetstalk(Helper.mockSummaryItemExceedLimit);

    // Assert
    expect(notificationSpy).toHaveBeenCalledWith('Ticket Listing Result', TEXT.TICKET_LISTING_LIMITED);
  });

  it('should show messages response when API call succeeds', async () => {
    // Arrange
    jest.spyOn(appService, 'sendCreditDataToLetstalk').mockResolvedValue(Helper.mockResult);
    component.messagesResponse = Helper.mockMessagesResponse;

    // Act
    await component.sendCreditToLetstalk(Helper.mockSummaryItem);

    // Assert
    const amendmentResponse = {
      code: Helper.mockResult.errorCode,
      message: Helper.mockResult.errorMsg
    } as AmendmentReponse;

    expect(component.messagesResponse.open).toHaveBeenCalledWith('Send Data Result', [amendmentResponse]);
  });

  it('#logAccessAction should call CommonService.logAccessFunction with correct parameter', async () => {
    // Arrange
    const actionName = 'TestAction';

    // Act
    await component.logAccessAction(actionName);

    // Assert
    expect(commonService.logAccessFunction).toHaveBeenCalledWith(`TicketListing/${actionName}`);
  });
});
