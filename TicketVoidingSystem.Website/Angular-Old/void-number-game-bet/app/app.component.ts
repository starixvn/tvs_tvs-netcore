import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import { Modal } from '../../external/components/modal/modal';
import { Notification } from '../../external/components/notification/notification';
import { Tooltip } from '../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../external/services/block-ui.service';
import { Confirmation } from '../../internal/components/confirmation/confirmation';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { MessagesResult } from '../../internal/components/messages-result/messages-result';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import {
  PagingEvent,
  PagingModel
} from '../../internal/components/paging/paging.model';
import {
  CheckNegativeBalanceQuery,
  NegativeBalance,
  NegativeType
} from '../../internal/models/negative-balance';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { TEXT } from '../../internal/shared/text';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { GetTicketsQuery, VoidTicketsQuery } from './models/query.model';
import { GroupModel } from './tickets/group.model';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';

import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BlockUIService, HttpRequestService, AppService]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('messages') messagesComponent: MessagesComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;
  @ViewChild('tickets') ticketsComponent: TicketsComponent;

  public blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  messagesResult = new MessagesResult();
  notification = new Notification();
  getTicketsQuery: GetTicketsQuery;
  voidTicketsQuery: VoidTicketsQuery;
  negativeBalanceUsers: string;

  ticketsModel = new TicketsModel();
  confirmation: Confirmation;
  isShowTickets: boolean;
  isShowMessages: boolean;
  isShowConfirm: boolean;

  constructor(
    private element: ElementRef,
    private blockUIService: BlockUIService,
    private appService: AppService
  ) {}

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
    this.isShowTickets = false;
    this.isShowMessages = false;
    this.isShowConfirm = false;
    this.confirmationComponent.clearData();
    this.messagesComponent.clearData();
  }

  searchEvent(query: GetTicketsQuery) {
    this.isShowTickets = false;
    this.getTicketsQuery = query;
    this.getTickets();
  }

  pagingSearchTicket(pagingEvent: PagingEvent) {
    this.getTicketsQuery.pageIndex = pagingEvent.pageIndex;
    this.getTicketsQuery.pageSize = pagingEvent.pageSize;
    this.getTickets();
  }

  exportExcel() {
    if (this.ticketsModel.pagingModel.totalItems > 100000) {
      const header = 'Export Excel Result';
      const body =
        'Not allow to export large file. Please contact IT for help. Thank you!';
      this.notification.open(header, body);
    } else {
      this.appService.exportExcel(this.getTicketsQuery);
    }
  }

  getTickets() {
    this.appService.getTickets(this.getTicketsQuery).subscribe(data => {
      this.renderTickets(data);
      this.isShowTickets = true;
      this.isShowConfirm = this.ticketsModel.groups.length > 0;
      this.isShowMessages = this.ticketsModel.groups.length > 0;
      if (!this.filterComponent.filterByMatchId) {
        this.filterComponent.inputBetIds.groupNumber.updateInvalid(
          data.invalidTransIds
        );
      }
    });
  }

  renderTickets(data: TicketsModel) {
    this.ticketsModel.pagingModel = new PagingModel();
    this.ticketsModel.pagingModel.totalItems = data.totalItems;
    this.ticketsModel.pagingModel.pageIndex = this.getTicketsQuery.pageIndex;
    this.ticketsModel.pagingModel.pageSize = this.getTicketsQuery.pageSize;
    this.ticketsModel.groups = [];
    data.groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets);
      this.ticketsModel.groups.push(group);
    });
    this.ticketsModel.changeIconCheckBox();
  }

  voidBet() {
    if (this.checkValidation()) {
      this.confirmation = this.confirmationComponent.confirmation;
      this.checkNegativeBalance();
    }
  }

  checkValidation(): boolean {
    if (this.ticketsModel.getCheckedTickets().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }
    if (this.isShowMessages && !this.messagesComponent.checkValidation()) {
      return false;
    }
    if (!this.confirmationComponent.checkValidation()) {
      return false;
    }

    return true;
  }

  checkNegativeBalance() {
    const queryModel: CheckNegativeBalanceQuery = {
      type: NegativeType.VOID,
      transIds: this.ticketsModel.getCheckedTickets().map(x => x.transId).join(',')
    };

    this.appService.checkNegativeBalance(queryModel).subscribe(data => {
      this.showConfirmBeforeVoid(data);
    });
  }

  showConfirmBeforeVoid(negativeBalanceUser: NegativeBalance[]) {
    const isReload =
      this.ticketsModel.pagingModel.totalItems <= this.getTicketsQuery.pageSize;
    let confirmMessage = '';
    if (negativeBalanceUser.length > 0) {
      const userNames = negativeBalanceUser
        .map(function(elem) {
          return elem.userName;
        })
        .join(', ');
      this.negativeBalanceUsers = userNames;
      confirmMessage = isReload
        ? TEXT.CONFIRM_NEGATIVE_CUSTORMER +
          userNames +
          '<br>' +
          TEXT.CONFIRM_VOID_TICKET
        : TEXT.CONFIRM_NEGATIVE_CUSTORMER +
          userNames +
          '<br>' +
          TEXT.CONFIRM_VOID_TICKET_IN_PAGE;
    } else {
      confirmMessage = isReload
        ? TEXT.CONFIRM_VOID_TICKET
        : TEXT.CONFIRM_VOID_TICKET_IN_PAGE;
      this.negativeBalanceUsers = '';
    }

    this.modal.open('Void Bet Confirm', confirmMessage);
  }

  confirmEvent() {
    this.voidTickets();
  }

  voidTickets() {
    const queryModel: VoidTicketsQuery = _.assignIn(this.getTicketsQuery, {
      tickets: this.ticketsModel.getCheckedTickets(),
      negativeBalanceUsers: this.negativeBalanceUsers,
      isSendMessage: this.isShowMessages,
      message: this.messagesComponent.message,
      reason: this.confirmation.reason,
      reasonSC: this.confirmation.reasonSC,
      userName: this.confirmation.userName,
      userPwd: this.confirmation.userPassword
    });

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
      this.ticketsModel.pagingModel.totalItems <= this.getTicketsQuery.pageSize
    ) {
      this.hideContent();
      this.filterComponent.resetFilter();
    } else {
      if (this.ticketsModel.isAllItemsChecked()) {
        const lastPage =
          Math.ceil(
            this.ticketsModel.pagingModel.totalItems /
              this.getTicketsQuery.pageSize
          ) - 1;
        this.getTicketsQuery.pageIndex =
          this.getTicketsQuery.pageIndex === lastPage
            ? this.getTicketsQuery.pageIndex - 1
            : this.getTicketsQuery.pageIndex;
      }

      this.getTickets();
    }
  }

  showMessages(results: Result[]) {
    this.messagesResult.isShow = true;
    this.messagesResult.header = 'Void Bet Result';
    this.messagesResult.results = results;
  }
}
