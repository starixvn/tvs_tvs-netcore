import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';

import { Modal } from '../../external/components/modal/modal';
import { Tooltip } from '../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../external/services/block-ui.service';

import { Notification } from '../../external/components/notification/notification';
import { Confirmation } from '../../internal/components/confirmation/confirmation';
import { ConfirmationComponent } from '../../internal/components/confirmation/confirmation.component';
import { MatchViewModel } from '../../internal/components/match-detail/match.viewmodel';
import { MessagesResult } from '../../internal/components/messages-result/messages-result';
import { MessagesComponent } from '../../internal/components/messages/messages.component';
import {
  PagingEvent,
  PagingModel
} from '../../internal/components/paging/paging.model';
import { Result } from '../../internal/models/result';
import { TEXT } from '../../internal/shared/text';

import { HttpRequestService } from '../../internal/services/http-request.service';
import { AppService } from './app.service';
import {
  ExportExcelQuery, GetTicketsQuery,
  VoidTicketsQuery
} from './models/query.model';

import { FilterComponent } from './filter/filter.component';
import { FilterEvent } from './filter/filter.model';

import { GroupModel } from './tickets/group.model';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';

import * as _ from 'lodash';
import { PasswordService } from '../../internal/services/password.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BlockUIService, HttpRequestService, AppService, PasswordService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Home / Void Parlay Virtual Sports Bet (Sub)';

  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('messages') messagesComponent: MessagesComponent;
  @ViewChild('confirmation') confirmationComponent: ConfirmationComponent;
  @ViewChild('tickets') ticketsComponent: TicketsComponent;

  public blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  messagesResult = new MessagesResult();
  notification = new Notification();
  matchViewModel = new MatchViewModel();
  getTicketsQuery: GetTicketsQuery;
  voidTicketsQuery: VoidTicketsQuery;

  ticketsModel = new TicketsModel();
  confirmation: Confirmation;
  isShowMatch: boolean;
  isShowTickets: boolean;
  isShowMessages: boolean;
  isShowConfirm: boolean;

  constructor(
    private element: ElementRef,
    private blockUIService: BlockUIService,
    private appService: AppService,
    private passwordService: PasswordService
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
    this.isShowMatch = false;
    this.isShowTickets = false;
    this.isShowMessages = false;
    this.isShowConfirm = false;
    this.confirmationComponent.clearData();
    this.messagesComponent.clearData();
  }

  searchEvent(filterEvent: FilterEvent) {
    this.isShowTickets = false;
    this.showMatchDetail(filterEvent.matchViewModel);
    this.getTicketsQuery = filterEvent.getTicketsQuery;
    this.getTickets();
  }

  pagingSearchTicket(pagingEvent: PagingEvent) {
    this.getTicketsQuery.pageIndex = pagingEvent.pageIndex;
    this.getTicketsQuery.pageSize = pagingEvent.pageSize;
    this.getTickets();
  }

  showMatchDetail(matchViewModel: MatchViewModel) {
    if (this.filterComponent.filterByMatchId) {
      this.matchViewModel = matchViewModel;
      this.isShowMatch = true;
    } else {
      this.isShowMatch = false;
    }
  }

  exportExcel() {
    if (this.ticketsModel.pagingModel.totalItems > 100000) {
      const header = 'Export Excel Result';
      const body =
        'Not allow to export large file. Please contact IT for help. Thank you!';
      this.notification.open(header, body);
    } else {
      const query: ExportExcelQuery = _.assignIn(
        {
          matchCode: this.matchViewModel.matchCode,
          matchEvent: this.matchViewModel.matchEvent,
          eventDate: this.matchViewModel.eventDate
        },
        this.getTicketsQuery
      );
      this.appService.exportExcel(query);
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
      this.showConfirmBeforeVoid();
    }
  }

  checkValidation(): boolean {
    if (this.ticketsModel.getMainTickets().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }
    if (!this.messagesComponent.checkValidation()) {
      return false;
    }
    if (!this.confirmationComponent.checkValidation()) {
      return false;
    }

    return true;
  }

  showConfirmBeforeVoid() {
    const isReload =
      this.ticketsModel.pagingModel.totalItems <= this.getTicketsQuery.pageSize;
    const confirmMessage = isReload
      ? TEXT.CONFIRM_VOID_TICKET
      : TEXT.CONFIRM_VOID_TICKET_IN_PAGE;
    this.modal.isShow = true;
    this.modal.header = 'Void Bet Confirm';
    this.modal.body = confirmMessage;
  }

  confirmEvent() {
    this.voidTickets();
  }

  voidTickets() {
    const matchId = parseInt(this.filterComponent.matchId, 10);
    const queryModel: VoidTicketsQuery = {
      matchId: matchId,
      tickets: matchId > 0 ? this.ticketsModel.getMainTickets() : this.ticketsModel.getSubTickets(),
      message: this.messagesComponent.message,
      reason: this.confirmation.reason,
      reasonSC: this.confirmation.reasonSC,
      userName: this.confirmation.userName,
      password: this.passwordService.hash(this.confirmation.userPassword)
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
