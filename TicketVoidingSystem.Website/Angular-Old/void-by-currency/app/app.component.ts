import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Modal } from '../../external/components/modal/modal';
import { Notification } from '../../external/components/notification/notification';
import { Tooltip } from '../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../external/services/block-ui.service';
import { CheckingPermissionComponent } from '../../internal/components/checking-permission/checking-permission.component';
import { CheckingPermissionModel } from '../../internal/components/checking-permission/checking-permission.model';
import { CheckingPermissionService } from '../../internal/components/checking-permission/checking-permission.service';
import { Confirmation } from '../../internal/components/confirmation/confirmation';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { MatchViewModel } from '../../internal/components/match-detail/match.viewmodel';
import { MessagesResult } from '../../internal/components/messages-result/messages-result';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import { PagingEvent, PagingModel } from '../../internal/components/paging/paging.model';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { StaticService } from '../../internal/services/static.service';
import { FunctionConst } from '../../internal/shared/config';
import { TEXT } from '../../internal/shared/text';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { FilterEvent } from './filter/filter.model';
import { FilterService } from './filter/filter.service';
import { FilterArea, GetTicketQueryModel, VoidTicketQueryModel } from './models/query.model';
import { GroupViewModel } from './tickets-result/group.viewmodel';
import { TicketViewModel } from './tickets-result/ticket.viewmodel';
import { TicketsResultComponent } from './tickets-result/tickets-result.component';
import { GroupTicketsViewModel } from './tickets-result/tickets.viewmodel';

@Component({
  selector: 'void-by-currency',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BlockUIService, FilterService, HttpRequestService, CheckingPermissionService, AppService]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('messages') messagesComponent: MessagesComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;
  @ViewChild('ticketsResult') ticketsResultComponent: TicketsResultComponent;
  @ViewChild('checkingPermission') checkingPermission: CheckingPermissionComponent;

  public blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  checkingPermissionModel = new CheckingPermissionModel();
  notification = new Notification();
  messagesResult = new MessagesResult();
  matchDetail: MatchViewModel;
  getTicketQueryModel: GetTicketQueryModel;
  voidTicketQueryModel: VoidTicketQueryModel;
  ticketsViewModel = new GroupTicketsViewModel();
  confirmation: Confirmation;
  negativeBalanceUsers = '';
  filterAreaBeforeSearch: FilterArea;
  filterAreaBeforeVoid: FilterArea;
  isShowMatch: boolean;
  isShowTickets: boolean;
  isShowMessages: boolean;
  isShowConfirm: boolean;

  constructor(
    private readonly element: ElementRef,
    private readonly blockUIService: BlockUIService,
    private readonly appService: AppService
  ) { }

  public ngOnInit() {
    this.tooltip.element = this.element;
  }

  ngAfterViewInit() {
    this.blockUIService.blockUIEvent.subscribe((event: boolean) =>
      this.blockUnBlockUI(event)
    );
  }

  private blockUnBlockUI(event: boolean) {
    this.blockUI = event;
  }

  hideContent() {
    this.isShowMatch = false;
    this.isShowTickets = false;
    this.isShowMessages = false;
    this.isShowConfirm = false;
    this.confirmationComponent.clearData();
    this.messagesComponent.clearData();
  }

  searchEvent(filterEvent: FilterEvent) {
    this.isShowTickets = false;
    this.showMatchDetail(filterEvent.matchDetail);
    this.getTicketQueryModel = filterEvent.getTicketQueryModel;
    this.filterAreaBeforeSearch = this.getFilterArea();
    this.getTickets();
  }

  getFilterArea(): FilterArea {
    return {
      currencyIds: this.filterComponent.currencies.getValueItems(),
      licenseeNames: this.filterComponent.getLicensees(),
      matchId: parseInt(this.filterComponent.matchId, 10),
      ticketType: this.filterComponent.ticketType.value
    };
  }

  pagingSearchTicket(pagingEvent: PagingEvent) {
    this.getTicketQueryModel.pageIndex = pagingEvent.pageIndex;
    this.getTicketQueryModel.pageSize = pagingEvent.pageSize;
    this.getTickets();
  }

  exportExcel() {
    if (this.ticketsViewModel.pagingModel.totalItems > 100000) {
      const header = 'Export Excel Result';
      const body =
        'Not allow to export large file. Please contact IT for help. Thank you!';
      this.notification.open(header, body);
    } else {
      this.appService.exportExcel(this.getTicketQueryModel);
    }
  }

  showMatchDetail(matchDetail: MatchViewModel) {
    this.matchDetail = matchDetail;
    this.isShowMatch = true;
  }

  getTickets() {
    this.appService.getTicket(this.getTicketQueryModel).subscribe(data => {
      this.renderTicketsViewModel(data);
      this.isShowTickets = true;
      this.isShowConfirm = !(this.ticketsViewModel.groups.length === 0);
      this.isShowMessages = !(this.ticketsViewModel.groups.length === 0);
    });
  }

  renderTicketsViewModel(data: GroupTicketsViewModel) {
    this.ticketsViewModel.pagingModel = new PagingModel();
    this.ticketsViewModel.pagingModel.totalItems = data.totalItems;
    this.ticketsViewModel.pagingModel.pageIndex = this.getTicketQueryModel.pageIndex;
    this.ticketsViewModel.pagingModel.pageSize = this.getTicketQueryModel.pageSize;
    this.ticketsViewModel.fromTransTime = data.fromTransTime;
    this.ticketsViewModel.toTransTime = data.toTransTime;
    this.ticketsViewModel.groups = [];
    data.groups.forEach(group => {
      const tickets = new Array<TicketViewModel>();
      group.tickets.forEach(ticket => {
        const item = new TicketViewModel(
          ticket.no,
          ticket.betId,
          ticket.subTransId,
          ticket.member,
          ticket.transDate,
          ticket.odds,
          ticket.stake,
          ticket.winLoss,
          ticket.currencyCode,
          ticket.status,
          ticket.secondAcceptFlag,
          ticket.choice,
          ticket.isDisable,
          ticket.isCricket,
          ticket.soldId,
          ticket.mainTransId,
          ticket.isMarked,
          ticket.siteDbGroupId);
        tickets.push(item);
      });
      this.ticketsViewModel.groups.push(
        new GroupViewModel(group.name, tickets)
      );
    });

    this.ticketsViewModel.changeIconCheckBox();
    this.ticketsResultComponent.showWarningBetTradeTicket();
  }

  voidBet() {
    if (this.checkValidation()) {
      this.confirmation = this.confirmationComponent.confirmation;
      this.showConfirmBeforeVoid();
    }
  }

  checkValidation(): boolean {
    if (this.ticketsViewModel.getTicketEnable().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }
    if (!this.messagesComponent.checkValidation()) {
      return false;
    }
    if (!this.confirmationComponent.checkValidation()) {
      return false;
    }
    if (!this.checkFilterBeforeVoid()) {
      return false;
    }

    return true;
  }

  checkFilterBeforeVoid(): boolean {
    this.filterAreaBeforeVoid = this.getFilterArea();
    if (
      JSON.stringify(this.filterAreaBeforeVoid) !==
      JSON.stringify(this.filterAreaBeforeSearch)
    ) {
      this.notification.open('WARNING', TEXT.WARNING_FILTER_OPTION_CHANGED);
      if (this.filterComponent.checkValidaitonBeforeSearch()) {
        this.filterComponent.blurMatchId();
      }
      return false;
    }

    return true;
  }

  showConfirmBeforeVoid() {
    const isReload =
      this.ticketsViewModel.pagingModel.totalItems <=
      this.getTicketQueryModel.pageSize;
    const confirmMessage = isReload
      ? TEXT.CONFIRM_VOID_TICKET
      : TEXT.CONFIRM_VOID_TICKET_IN_PAGE;
    this.modal.open('Void Bet Confirm', confirmMessage);
  }

  confirmEvent() {
    this.checkingPermissionModel.setParam(this.ticketsViewModel.getAllTicket(), null,
      null, 'void-by-currency-check-void-bet-permission', StaticService.checkHandlingCashOutAsUnSettledTicketByFunction(FunctionConst.VOID_BY_CURRENCY));
    this.checkingPermission.checkPermission();
  }

  notHavePermission() {
    this.getTickets();
    this.confirmationComponent.clearData();
    this.messagesComponent.clearData();
  }

  voidTickets() {
    const queryModel: VoidTicketQueryModel = {
      currencyIds: this.filterComponent.currencies.getValueItems(),
      licenseeNames: this.filterComponent.getLicensees(),
      matchId: parseInt(this.filterComponent.matchId, 10),
      ticketType: this.filterComponent.ticketType.value,
      tickets: this.ticketsViewModel.getTicketEnable(),
      soldTransIds: this.ticketsViewModel.getTicketSold(),
      cricketTransIds: this.ticketsViewModel.getTicketCricket(),
      message: this.messagesComponent.message,
      reason: this.confirmation.reason,
      reasonSC: this.confirmation.reasonSC,
      userName: this.confirmation.userName,
      userPassword: this.confirmation.userPassword,
      negativeBalanceUsers: this.negativeBalanceUsers,
      match: this.matchDetail,
      voidFromTime: moment(new Date(this.ticketsViewModel.fromTransTime)).format('hh:mm:ss A'),
      voidToTime: moment(new Date(this.ticketsViewModel.toTransTime)).format('hh:mm:ss A'),
      isOutright: this.filterComponent.matchDetail.isOutright
    };

    this.appService.voidTicket(queryModel).subscribe(data => {
      this.handleAfterVoid(data);
    });
  }

  handleAfterVoid(results: Result[]) {
    if (results[0].errorCode <= 0) {
      this.handleAfterVoidPaging();
    }

    this.showMessages(results);
  }

  handleAfterVoidPaging() {
    if (
      this.ticketsViewModel.pagingModel.totalItems <=
      this.getTicketQueryModel.pageSize
    ) {
      this.hideContent();
      this.filterComponent.resetFilter();
    } else {
      if (this.ticketsViewModel.isAllItemsChecked()) {
        const lastPage =
          Math.ceil(
            this.ticketsViewModel.pagingModel.totalItems /
            this.getTicketQueryModel.pageSize
          ) - 1;
        this.getTicketQueryModel.pageIndex =
          this.getTicketQueryModel.pageIndex === lastPage
            ? this.getTicketQueryModel.pageIndex - 1
            : this.getTicketQueryModel.pageIndex;
      }

      this.getTickets();
    }
  }

  showMessages(results: Result[]) {
    this.messagesResult.isShow = true;
    this.messagesResult.header = 'Void Bet Result';
    this.messagesResult.results = results;
    this.messagesResult = _.clone(this.messagesResult)
  }
}
