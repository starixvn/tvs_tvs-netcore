import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import { Modal } from '../../external/components/modal/modal';
import { Tooltip } from '../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../external/services/block-ui.service';
import { MessagesResult } from '../../internal/components/messages-result/messages-result';
import { ResultCode } from '../../internal/const/result-code';
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
import { GetTicketsQuery, RecoverTicketsQuery } from './models/query.model';
import { GroupModel } from './tickets/group.model';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketsModel } from './tickets/tickets.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BlockUIService, HttpRequestService, AppService]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Home / Recover By BetId';

  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('tickets') ticketsComponent: TicketsComponent;

  public blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  messagesResult = new MessagesResult();
  negativeBalanceUsers = '';
  ticketsModel = new TicketsModel();
  isShowTickets: boolean;
  isShowBtnRecover: boolean;

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

  searchEvent(query: GetTicketsQuery) {
    this.appService.getTickets(query).subscribe(data => {
      this.renderTickets(data.groups);
      this.showWarningTransIds(data);
      this.isShowTickets = true;
      this.isShowBtnRecover = data.groups.length > 0;
    });
  }

  renderTickets(groups: Array<GroupModel>) {
    this.ticketsModel.groups = [];
    groups.forEach(item => {
      const group = new GroupModel(item.name, item.tickets);
      this.ticketsModel.groups.push(group);
    });
    this.ticketsModel.changeIconCheckBox();
  }

  showWarningTransIds(data: TicketsModel) {
    this.filterComponent.inputBetIds.groupNumber.updateInvalid(
      data.invalidTransIds
    );
    this.filterComponent.inputBetIds.groupNumber.updateMoved(
      data.movedTransIds
    );
  }

  recoverBet() {
    if (this.checkValidation()) {
      this.checkNegativeBalance();
    }
  }

  checkValidation() {
    if (this.ticketsModel.getCheckedTickets().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }

    return true;
  }
  checkNegativeBalance() {
    var tickets = this.ticketsModel.getCheckedTickets();
    const queryModel: CheckNegativeBalanceQuery = {
      type: NegativeType.RECOVER,
      transIds: tickets.map(x => x.transId).join(',')
    };

    this.appService.checkNegativeBalance(queryModel).subscribe(data => {
      this.showConfirmBeforeRecover(data);
    });
  }

  showConfirmBeforeRecover(negativeBalanceUser: NegativeBalance[]) {
    let confirmMessage = '';
    if (negativeBalanceUser.length > 0) {
      const userNames = negativeBalanceUser
        .map(function (elem) {
          return elem.userName;
        })
        .join(', ');
      this.negativeBalanceUsers = userNames;
      confirmMessage =
        TEXT.CONFIRM_NEGATIVE_CUSTORMER +
        userNames +
        '<br>' +
        TEXT.CONFIRM_RECOVER_TICKET;
    } else {
      confirmMessage = TEXT.CONFIRM_RECOVER_TICKET;
      this.negativeBalanceUsers = '';
    }

    this.modal.isShow = true;
    this.modal.header = 'Recover Bet Confirm';
    this.modal.body = confirmMessage;
  }

  confirmEvent() {
    this.recoverTickets();
  }

  recoverTickets() {
    const query: RecoverTicketsQuery = {
      tickets: this.ticketsModel.getCheckedTickets(),
      negativeBalanceUsers: this.negativeBalanceUsers
    };

    this.appService.recoverTicket(query).subscribe(data => {
      this.handleAfterRecover(data);
    });
  }

  handleAfterRecover(results: Array<Result>) {
    if (results[0].errorCode === ResultCode.ERROR_CODE_MOVE_BET_PROCESS) {
      this.isShowTickets = false;
      this.isShowBtnRecover = false;
    } else if (results[0].errorCode <= 0) {
      this.isShowTickets = false;
      this.isShowBtnRecover = false;
      this.filterComponent.resetFilter();
    }

    this.showMessages(results);
  }

  showMessages(results: Array<Result>) {
    this.messagesResult = {
      ...this.messagesResult,
      isShow: true,
      header: 'Recover Bet Result',
      results: results
    } as MessagesResult;
  }
}
