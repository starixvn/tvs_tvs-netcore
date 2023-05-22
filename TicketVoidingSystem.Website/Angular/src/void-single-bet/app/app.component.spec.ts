import { NgModule } from '@angular/core';
import { Shallow } from 'shallow-render';
import { MatchDetailComponent } from '../../utility/components/match-detail/match-detail.component';
import { MenuBarComponent } from '../../utility/components/menu-bar/menu-bar.component';
import { MessagesResult } from '../../utility/components/messages-result/messages-result';
import { MessagesResultComponent } from '../../utility/components/messages-result/messages-result.component';
import { ModalService } from '../../utility/components/modal/modal.service';
import { Notification } from '../../utility/components/notification/notification';
import { NotificationComponent } from '../../utility/components/notification/notification.component';
import { PagingModel } from '../../utility/components/paging/paging/paging.model';
import { Message } from '../../utility/components/template-message/messages/message';
import { TemplateMessageComponent } from '../../utility/components/template-message/template-message/template-message.component';
import { TemplateValue } from '../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../utility/components/template-message/template-message/template.service';
import { ToolTipModule } from '../../utility/components/tooltip/tooltip.module';
import { TEXT } from '../../utility/constants/text';
import { MatchModel } from '../../utility/models/match.model';
import { Result, SqlResult } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { HttpService } from '../../utility/services/http.service';
import { SignalRService } from '../../utility/services/signal-r.service.native';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { Confirmation } from './confirmation/confirmation.model';
import { FilterComponent } from './filter/filter.component';
import { ModalComponent } from './modal/modal.component';
import { FilterParams, GetTicketsQuery } from './models/query.model';
import { GroupModel } from './tickets/group.model';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';
import { group } from 'console';

jest.mock('../../utility/services/signal-r.service.native');
class Helper {
  static readonly titleSelector = 'div.title';
  static readonly fakeDate = '2021-10-14 12:08:49.737';

  static getFakeMatchViewModel(): MatchModel {
      return {
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
      eventDate: new Date(Helper.fakeDate),
      dateTime: new Date(Helper.fakeDate),
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
      startTime: new Date(Helper.fakeDate),
      endTime: new Date(Helper.fakeDate),
      leagueGroupId: 0
    };
  }

  static readonly fakeTicketsModel = {
    groups:[
      {
        name: 'Credit',
        displayTotalTickets: 3,
        tickets: [
          { no: 1, betId :'108495160329', value: 108495160329, transDate: '03/30/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: '',
            odds: '<span class=\"underdog\">1.90</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">90</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Waiting</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
          },
          { no: 2, betId :'108495160330', value: 108495160330, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
          },
          { no: 3, betId :'108495160331', value: 108495160331, transDate: '03/31/2020 02:02:34.030 AM', member: 'N8BINH01065', betType: 'Single Match Parlay',
            odds: '<span class=\"underdog\">1.95</span> <span class=\"oddstype\"></span>', stake: '<div class=\"stake\">100</div>',winLoss: '-',
            currency: 'INH', status: '<div class=\"status\">Running</div>', score:'', handicap: '',
            choice: '<div class=""><span class=\"{betTeamClassName}\"></span></div>', soldId: null, mainTransId: 0, isParlay: false, isDisable: false,
            isCricket: false, isBonus: false, isMarked:false, secondAcceptFlag: ''
          },
        ]
      }
    ],
  };

  static getFakeTicketsModel(): TicketsModel {
    const data = new TicketsModel();
    data.groups = [];
    data.singleCount = 3;
    data.parlayCount = 0;
    data.fromCheckTime = new Date('2020-04-27 12:52:33.573');
    data.fromTransTime = new Date('2020-04-27 12:51:48.573');
    data.toCheckTime = new Date('2020-04-27 12:52:33.573');
    data.toTransTime = new Date('2020-04-27 12:51:55.300');
    this.fakeTicketsModel.groups.forEach(item => {
      const group = new GroupModel(item.name, JSON.parse(JSON.stringify(item.tickets)));
      data.groups.push(group);
    });
    return data;
  }

  static getFakeSuccessfulSqlResult(): SqlResult {
    return {
      errCode: 0,
      errMsg: '',
      isSuccessful: true
    };
  }

  static getFakeVoidedResult(): Result<null>[] {
    return [{
      errorCode: 0,
      errorMsg: '',
      isSuccessful: true
    }];
  }
}

describe('AppComponent', () => {
  @NgModule({
    declarations: [
      FilterComponent,
      TicketsComponent,
      ModalComponent,
      ConfirmationComponent,
      MessagesResultComponent,
      MatchDetailComponent,
      NotificationComponent,
      TemplateMessageComponent,
      MenuBarComponent
    ],
    imports: [
      ToolTipModule
    ],
    providers: [AppService, TemplateService, HttpService]
  })
  class AppModuleTest { }

  let shallow: Shallow<AppComponent>;

  beforeEach(() => {
    shallow = new Shallow(AppComponent, AppModuleTest)    
    .mock(SignalRService, { initializeConnection: jest.fn()});
  });

  it('AppComponent should init match snapshot', async () => {
    // Arrange
    const { find, fixture } = await shallow.render();
    fixture.detectChanges();

    // Assert
    expect(fixture).toMatchSnapshot();
    expect(find(Helper.titleSelector).nativeElement.textContent.trim()).toBe('Home / Void Single Bet');
  });

  it('Should hide necessary content and clear data after get info match from <filter />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow.render();
    const filterComponent = findComponent(FilterComponent);
    const matchDetailComponent = findComponent(MatchDetailComponent);
    matchDetailComponent.isShowMatch = true;
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.isShowTickets = true;
    const confirmationComponent = findComponent(ConfirmationComponent);
    confirmationComponent.isShowConfirm = true;
    const templateComponent = findComponent(TemplateMessageComponent);
    templateComponent.isShowMessages = true;
    instance.confirmationComponent = new ConfirmationComponent(null);
    instance.confirmationComponent.clearData = jest.fn();
    filterComponent.changeMatchEvent.emit();
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(matchDetailComponent.isShowMatch).toBe(false);
    expect(ticketsComponent.isShowTickets).toBe(false);
    expect(confirmationComponent.isShowConfirm).toBe(false);
    expect(templateComponent.isShowMessages).toBe(false);
  });

  it('Should get match info and return no data after emit searchEvent from <filter />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow
      .mock(AppService, { getMatchInfo: jest.fn().mockImplementation(() => Helper.getFakeMatchViewModel()) })
      .render();
    const filterComponent = findComponent(FilterComponent);
    const getTicketsQuery = new GetTicketsQuery();
    getTicketsQuery.matchId = 28321695;
    getTicketsQuery.invalidTransDate = true;
    instance.matchViewModel = new MatchModel();
    instance.matchViewModel.matchId = 12345678;
    instance.ticketsModel = new TicketsModel();
    filterComponent.searchEvent.emit(getTicketsQuery);
    await fixture.whenStable();

    // Assert
    expect(instance.ticketsModel.groups.length).toBe(0);
    expect(instance.isShowTickets).toBe(true);
    expect(instance.isShowMatch).toBe(true);
    expect(instance.isShowMessages).toBe(false);
    expect(instance.isShowConfirm).toBe(false);
  });

  it('Should return expected results after emit searchEvent from <filter />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow
      .mock(AppService, { getTickets: jest.fn().mockImplementation(() => Helper.getFakeTicketsModel()) })
      .mock(TemplateService, { getTemplateValue : jest.fn().mockImplementation(() => new TemplateValue()) })
      .render();
    const filterComponent = findComponent(FilterComponent);
    const getTicketsQuery = new GetTicketsQuery();
    getTicketsQuery.matchId = 28321695;
    getTicketsQuery.invalidTransDate = false;
    instance.matchViewModel = Helper.getFakeMatchViewModel();
    instance.ticketsModel = new TicketsModel();
    filterComponent.searchEvent.emit(getTicketsQuery);
    await fixture.whenStable();
    fixture.detectChanges();

    // Assert
    expect(instance.ticketsModel.groups.length).toBe(1);
    expect(instance.ticketsModel.singleCount).toBe(3);
    expect(instance.ticketsModel.parlayCount).toBe(0);
    expect(instance.isShowMessages).toBe(true);
    expect(instance.isShowConfirm).toBe(true);
    expect(instance.templateValue.totalTickets).toBe(3);
  });

  it('Should call #getTickets with expected params after emit pagingSearchTicket from <tickets />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow.render();
    instance.getTicketsQuery = new GetTicketsQuery();
    const pagingModel = new PagingModel();
    pagingModel.page = 2;
    pagingModel.pageSize = 100;
    instance.getTickets = jest.fn();
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.pagingSearchTicket.emit(pagingModel);
    await fixture.whenStable();

    // Assert
    expect(instance.getTickets).toHaveBeenCalledTimes(1);
    expect(instance.affectedLicensee.show).toBe(false);
    expect(instance.affectedInstantLicensee.show).toBe(false);
    expect(instance.getTicketsQuery.pageIndex).toBe(1);
    expect(instance.getTicketsQuery.pageSize).toBe(100);
  });

  it('Should return notification after emit exportExcelEvent from <tickets />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow.render();
    const header = 'Export Excel Result';
    const body = 'Not allow to export large file. Please contact IT for help. Thank you!';
    instance.notification.open = jest.fn();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.ticketsModel.pagingModel.total = 100001;
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.exportExcelEvent.emit();
    await fixture.whenStable();

    // Assert
    expect(instance.notification.open).toHaveBeenCalledWith(header, body);
  });

  it('Should export excel file after emit exportExcelEvent from <tickets />', async () => {
    // Arrange
    const isExportedExcel = true;
    const { findComponent, fixture, instance } = await shallow
      .mock(AppService, { exportExcel: jest.fn().mockImplementation(() => isExportedExcel ) })
      .render();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.ticketsModel.pagingModel.total = 2;
    instance.getTicketsQuery = new GetTicketsQuery();
    const ticketsComponent = findComponent(TicketsComponent);
    ticketsComponent.exportExcelEvent.emit();
    await fixture.whenStable();

    // Assert
    expect(isExportedExcel).toBe(true);
  });

  it('Should display expected modal after emit voidEvent from <confirmation-single />', async () => {
    // Arrange
    const { findComponent, fixture, instance } = await shallow.render();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.checkValidation = jest.fn().mockImplementation(() => true);
    instance.modal.open = jest.fn();
    const confirmationComponent = findComponent(ConfirmationComponent);
    const testCases = [
      { ticketsTotal: 10, pageSize: 20, confirmMessage: TEXT.CONFIRM_VOID_TICKET },
      { ticketsTotal: 30, pageSize: 20, confirmMessage: TEXT.CONFIRM_VOID_TICKET_IN_PAGE },
    ];

    // Action and Assert
    for (const item of testCases) {
      instance.ticketsModel.pagingModel.total = item.ticketsTotal;
      instance.getTicketsQuery.pageSize = item.pageSize;
      confirmationComponent.voidEvent.emit();
      await fixture.whenStable();
      expect(instance.modal.open).toHaveBeenCalledWith('Void Bet Confirm', item.confirmMessage);
    }
  });

  it('#checkValidation should return false and display tooltip when tickets is unchecked ', async () => {
    // Arrange
    const {instance } = await shallow.render();
    const ticketsModel = Helper.getFakeTicketsModel();
    ticketsModel.groups[0].tickets[0].isChecked = false;
    ticketsModel.groups[0].tickets[1].isChecked = false;
    ticketsModel.groups[0].tickets[2].isChecked = false;
    instance.ticketsModel = ticketsModel;
    instance.tooltip.display = jest.fn();

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(false);
    expect(instance.tooltip.display).toHaveBeenCalledWith('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
  });

  it('#checkValidation should return false when messagesComponent return false ', async () => {
    // Arrange
    const {instance, findComponent } = await shallow.render();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    const messageComponent = findComponent(TemplateMessageComponent);
    messageComponent.checkValidation = jest.fn().mockImplementation(() => false);

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(false);
  });

  it('#checkValidation should return false when confirmComponent return false ', async () => {
    // Arrange
    const {instance, findComponent } = await shallow.render();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    const messageComponent = findComponent(TemplateMessageComponent);
    messageComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const confirmComponent = findComponent(ConfirmationComponent);
    confirmComponent.checkValidation = jest.fn().mockImplementation(() => false);

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(false);
  });

  it('#checkValidation should return false when #checkFilterBeforeVoid return false ', async () => {
    // Arrange
    const {instance, findComponent } = await shallow.render();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    const messageComponent = findComponent(TemplateMessageComponent);
    messageComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const confirmComponent = findComponent(ConfirmationComponent);
    confirmComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const filterComponent = findComponent(FilterComponent);
    filterComponent.getParams = jest.fn().mockImplementation(() => new FilterParams());
    const filterParamsBeforeSearch = new FilterParams();
    filterParamsBeforeSearch.matchId = 123456789;
    instance.filterParamsBeforeSearch = filterParamsBeforeSearch;
    filterComponent.checkFilterParams = jest.fn().mockImplementation(() => true);
    filterComponent.blurMatchId = jest.fn();

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(false);
  });

  it('#checkValidation should return true when all everything is valid ', async () => {
    // Arrange
    const {instance, findComponent } = await shallow.render();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    const messageComponent = findComponent(TemplateMessageComponent);
    messageComponent.checkValidation = jest.fn().mockImplementation(() => true);
    const confirmComponent = findComponent(ConfirmationComponent);
    confirmComponent.checkValidation = jest.fn().mockImplementation(() => true);
    instance.checkFilterBeforeVoid = jest.fn().mockImplementation(() => true);

    // Action
    const actualResult = instance.checkValidation();

    // Assert
    expect(actualResult).toBe(true);
  });

  it('Should void tickets when emit confirmEvent event because has permission', async () => {
    // Arrange
    const {fixture, instance, findComponent } = await shallow
      .mock(CommonService, { checkVoidBetPermission: jest.fn().mockImplementation(() => Helper.getFakeSuccessfulSqlResult() ) })
      .render();
    const modalComponent = findComponent(ModalComponent);
    instance.ticketsModel = Helper.getFakeTicketsModel();
    instance.matchViewModel = new MatchModel();
    instance.matchViewModel.matchId = 12345678;
    instance.voidTickets = jest.fn();
    modalComponent.confirmEvent.emit();

    // Action
    await fixture.whenStable();

    // Assert
    expect(instance.voidTickets).toHaveBeenCalledTimes(1);
  });

  it('#voidTickets should return expected data and no need to reload tickets because it is only one page', async () => {
    // Arrange
    const mockVoidTicket = jest.fn().mockImplementation(() => Helper.getFakeVoidedResult());
    const { instance, findComponent } = await shallow
      .mock(AppService, { voidTickets: mockVoidTicket })
      .render();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.getTicketsQuery.pageSize = 10;
    instance.filterParamsBeforeVoid = new FilterParams();
    instance.confirmation = new Confirmation();
    instance.confirmation.userPassword = '111';
    instance.ticketsModel = Helper.getFakeTicketsModel();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.ticketsModel.pagingModel.total = 3;
    instance.messagesResult.open = jest.fn();
    instance.handleAfterVoid = jest.fn();
    const filterComponent = findComponent(FilterComponent);
    filterComponent.resetFilter = jest.fn();

    // Action
    await instance.voidTickets();

    // Assert
    expect(mockVoidTicket).toHaveBeenCalledTimes(1);
  });

  it('#handleAfterVoidPaging should reload tickets after void', async () => {
    // Arrange
    const testCase = [
      {total: 5, pageSize: 2, pageIndex: 1},
      {total: 3, pageSize: 2, pageIndex: 1},
    ];
    const { instance } = await shallow.render();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.getTickets = jest.fn();
    instance.hideContent = jest.fn();
    testCase.forEach(async x => {
      instance.ticketsModel.pagingModel.total = x.total;
      instance.getTicketsQuery.pageSize = x.pageSize;
      instance.getTicketsQuery.pageIndex = x.pageIndex;

      // Action
      await instance.handleAfterVoidPaging();

      // Assert
      expect(instance.getTickets).toHaveBeenCalled();
    });
  });
  
  it('#viewLogInfoEvent should correct method', async () => {
    const { instance } = await shallow.render();
    instance['clearCacheTime'] = jest.fn();
    instance.getMatchInfoForViewLogInfo = jest.fn();

    await instance.viewLogInfoEvent(null);

    expect(instance['clearCacheTime']).toHaveBeenCalledTimes(1);
    expect(instance.getMatchInfoForViewLogInfo).toHaveBeenCalledTimes(1);
  });
  
  it('#getMatchInfoForViewLogInfo should call #getLogInfo and #getMatchInfo', async () => {
    const query = new GetTicketsQuery();
    query.matchId = 9999;
    const mockGetMatchInfo = jest.fn();
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: mockGetMatchInfo })
    .render();
    instance.matchViewModel = undefined;
    instance.getLogInfo = jest.fn();

    await instance.getMatchInfoForViewLogInfo(query);

    expect(instance.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockGetMatchInfo).toHaveBeenCalledTimes(1);
  });
  
  it('#getMatchInfoForViewLogInfo should only call #getLogInfo', async () => {
    const query = new GetTicketsQuery();
    query.matchId = 9999;
    const mockGetMatchInfo = jest.fn();
    const { instance } = await shallow
    .mock(AppService, { getMatchInfo: mockGetMatchInfo })
    .render();
    instance.matchViewModel = new MatchModel();
    instance.matchViewModel.matchId = 9999;
    instance.getLogInfo = jest.fn();

    await instance.getMatchInfoForViewLogInfo(query);

    expect(instance.getLogInfo).toHaveBeenCalledTimes(1);
    expect(mockGetMatchInfo).toHaveBeenCalledTimes(0);
  });
  
  it('#getLogInfo should call #handleNoTicket', async () => {
    const query = new GetTicketsQuery();
    query.invalidTransDate = true;
    const { instance } = await shallow.render();
    instance.handleNoTicketLogInfo = jest.fn();

    await instance.getLogInfo(query);

    expect(instance.handleNoTicketLogInfo).toHaveBeenCalledTimes(1);
  });
  
  it('#getLogInfo should call #GetLogInfo', async () => {
    const query = new GetTicketsQuery();
    query.invalidTransDate = false;
    const mockGetLogInfo = jest.fn();
    const { instance } = await shallow
    .mock(AppService, { GetLogInfo: mockGetLogInfo })
    .render();
    instance.handleNoTicket = jest.fn();
    instance.renderDataLogInfo = jest.fn();

    await instance.getLogInfo(query);

    expect(mockGetLogInfo).toHaveBeenCalledTimes(1);
  });
  
  it('#renderDataLogInfo should update correct data', async () => {
    const ticketsModel = new TicketsModel();
    const { instance } = await shallow.render();
    instance.ticketsModel = new TicketsModel();

    [true, false].forEach(async x => {      
    instance['isNullCacheTransTime'] = jest.fn().mockImplementation(() => x);
    instance['isNullCacheCheckTime'] = jest.fn().mockImplementation(() => x);

    instance.renderDataLogInfo(ticketsModel);

    expect(instance.ticketsModel.singleCount).toBe(ticketsModel.singleCount);
    expect(instance.ticketsModel.parlayCount).toBe(ticketsModel.parlayCount );
    expect(instance.ticketsModel.fromTransTime).toBe(ticketsModel.fromTransTime);
    expect(instance.ticketsModel.toTransTime).toBe(ticketsModel.toTransTime);
    expect(instance.ticketsModel.fromCheckTime).toBe(ticketsModel.fromCheckTime);
    expect(instance.ticketsModel.toCheckTime).toBe(ticketsModel.toCheckTime);
    });
  });
  
  it('#exportExcel should call #exportExcel', async () => {
    const mockExportExcel = jest.fn();
    const { instance } = await shallow
    .mock(AppService, { exportExcel: mockExportExcel })
    .render();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.ticketsModel = Helper.getFakeTicketsModel();
    instance.ticketsModel.pagingModel = null;

    await instance.exportExcel();

    expect(mockExportExcel).toHaveBeenCalledTimes(1);
  });
  
  it('#renderTickets should update correct data', async () => {
    const ticketsModel = new TicketsModel();
    ticketsModel.groups = [];
    const { instance } = await shallow.render();
    instance.ticketsModel = new TicketsModel();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.getTicketsQuery.pageIndex = 0;

    [true, false].forEach(async x => {      
      instance['isNullCacheTransTime'] = jest.fn().mockImplementation(() => x);
      instance['isNullCacheCheckTime'] = jest.fn().mockImplementation(() => x);

      instance.renderTickets(ticketsModel);

      expect(instance.ticketsModel.pagingModel.page).toBe(instance.getTicketsQuery.pageIndex + 1);
      expect(instance.ticketsModel.pagingModel.pageSize).toBe(instance.getTicketsQuery.pageSize);
    });
  });
  
  it('#voidBet should not call #showConfirmBeforeVoid', async () => {
    const { instance } = await shallow
    .render();
    instance.checkValidation = jest.fn().mockImplementation(() => false);
    instance.showConfirmBeforeVoid = jest.fn();

    instance.voidBet();

    expect(instance.showConfirmBeforeVoid).toHaveBeenCalledTimes(0);
  });
  
  it('#checkFilterBeforeVoid should return false', async () => {
    const filterParamsBeforeVoid = new FilterParams();
    filterParamsBeforeVoid.matchId = 9999;
    const { instance } = await shallow.render();
    instance.filterComponent = new FilterComponent(null, null, null, null);
    instance.filterComponent.getParams = jest.fn().mockImplementation(() => filterParamsBeforeVoid);
    instance.filterComponent.checkFilterParams = jest.fn().mockImplementation(() => false);
    instance.filterParamsBeforeSearch = new FilterParams();
    instance.notification = new Notification();
    instance.notification.open = jest.fn();

    const actual = instance.checkFilterBeforeVoid();

    expect(actual).toBe(false);
  });
  
  it('#checkFilterBeforeVoid should return true', async () => {
    const filterParamsBeforeVoid = new FilterParams();
    const { instance } = await shallow.render();
    instance.filterComponent = new FilterComponent(null, null, null, null);
    instance.filterComponent.getParams = jest.fn().mockImplementation(() => filterParamsBeforeVoid);
    instance.filterParamsBeforeSearch = filterParamsBeforeVoid;

    const actual = instance.checkFilterBeforeVoid();

    expect(actual).toBe(true);
  });
  
  it('#updateTemplateValue should update correct data', async () => {
    const { instance } = await shallow.render();
    instance.ticketsModel = new TicketsModel();

    instance.handleNoTicketLogInfo();

    expect(instance.isShowLogInfoOnly).toBe(true);
    expect(instance.isShowConfirm ).toBe(false);
  });
  
  it('#updateTemplateValue should update correct data', async () => {
    const { instance } = await shallow
    .mock(TemplateService, { getTemplateValue: jest.fn().mockImplementation(() => new TemplateValue()) })
    .render();
    instance.ticketsModel = new TicketsModel();
    instance.ticketsModel.getNumberOfCheckedTickets = jest.fn();
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.getTicketsQuery.eventType = '1';
    instance.getTicketsQuery.liveAwayScore = '1';
    instance.getTicketsQuery.liveHomeScore = '1';

    instance.updateTemplateValue(new Message());

    expect(instance.templateValue.score).toBe('1-1');
  });
  
  it('#confirmEvent should call expected', async () => {
    const mockConfirmPermission = jest.fn();
    const { instance } = await shallow
    .mock(ModalService, { confirmPermission: mockConfirmPermission })
    .render();
    instance.ticketsModel = new TicketsModel ();
    instance.ticketsModel.getAllTicket = jest.fn();
    instance.matchViewModel = new MatchModel();

    await instance.confirmEvent();

    instance.voidTickets = jest.fn();
    mockConfirmPermission.mock.calls[0][2]();
    expect(instance.voidTickets).toHaveBeenCalledTimes(1);

    instance.getTickets = jest.fn();
    instance.confirmationComponent = new ConfirmationComponent(null);
    instance.confirmationComponent.clearData = jest.fn();
    mockConfirmPermission.mock.calls[0][3]();
    expect(instance.confirmationComponent.clearData).toHaveBeenCalledTimes(1);
  });
  
  it('#voidTickets should call #getVoidResultCache', async () => {
    const mockVoidTickets = jest.fn().mockImplementation(() => Promise.resolve(null));
    const { instance } = await shallow
    .mock(AppService, { voidTickets: mockVoidTickets })
    .render();
    instance.ticketsModel = new TicketsModel();
    instance.ticketsModel.getTicketEnable = jest.fn();
    instance.ticketsModel.getTicketSold = jest.fn();
    instance.ticketsModel.getTicketCricket = jest.fn();
    instance.messagesComponent = new TemplateMessageComponent(null, null);
    instance.confirmation = new Confirmation();
    instance.confirmation.userPassword = '111';
    instance['getVoidResultCache'] = jest.fn();

    await instance.voidTickets();

    expect(mockVoidTickets).toHaveBeenCalledTimes(1);
    expect(instance['getVoidResultCache']).toHaveBeenCalledTimes(1);
  });
  
  it('#handleAfterVoid should call #showMessages', async () => {
    const { instance } = await shallow
    .render();
    instance['showMessages'] = jest.fn();
    instance['handleAfterVoidPaging'] = jest.fn();

    [0,1].forEach(async x => {
      const results = new Result<null>();
      results.errorCode = x;

      await instance.handleAfterVoid([results]);

      expect(instance['showMessages']).toHaveBeenCalled();
    });
  });
  
  it('#showMessages should update correct data', async () => {
    const { instance } = await shallow
    .render();
    instance.messagesResult = new MessagesResult();

    instance['showMessages']([]);

    expect(instance.messagesResult.header).toBe('Void Bet Result');
  });
  
  it('#handleAfterVoidPaging should call #hideContent', async () => {
    const { instance } = await shallow
    .render();
    instance.ticketsModel = new TicketsModel();
    instance.ticketsModel.pagingModel = new PagingModel();
    instance.ticketsModel.pagingModel.total = 1;
    instance.getTicketsQuery = new GetTicketsQuery();
    instance.getTicketsQuery.pageSize = 100;
    instance.hideContent = jest.fn();
    instance.filterComponent = new FilterComponent(null, null, null, null);
    instance.filterComponent.resetFilter = jest.fn();

    await instance.handleAfterVoidPaging();

    expect(instance.hideContent).toHaveBeenCalledTimes(1);
  });
  
  it('#isNullCacheTransTime should return false', async () => {
    const { instance } = await shallow
    .render();
    instance['fromTransTime'] = new Date();
    instance['toTransTime'] = new Date();

    const actual = instance['isNullCacheTransTime']();

    expect(actual).toBeFalsy();
  });
  
  it('#isNullCacheCheckTime should return false', async () => {
    const { instance } = await shallow
    .render();
    instance['fromCheckTime'] = new Date();
    instance['toCheckTime'] = new Date();

    const actual = instance['isNullCacheCheckTime']();

    expect(actual).toBeFalsy();
  });
  
  it('#updateEventType should update correct data', async () => {
    const { instance } = await shallow
    .render();
    instance.templateValue = new TemplateValue();

    instance.updateEventType('1');

    expect(instance.templateValue.eventType).toBe('1');
  });
  
  it('#updateSubIssueType should update correct data', async () => {
    const { instance } = await shallow
    .render();

    instance.updateSubIssueType(1);

    expect(instance.subIssueTypeId).toBe(1);
  });
  
  it('#updateIssueType should update correct data', async () => {
    const { instance } = await shallow
    .render();

    instance.updateIssueType(1);

    expect(instance.issueTypeId).toBe(1);
  });
});
