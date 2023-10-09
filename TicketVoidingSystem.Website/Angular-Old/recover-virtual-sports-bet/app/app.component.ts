import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import { Modal } from '../../external/components/modal/modal';
import { Tooltip } from '../../external/components/tooltip/tooltip';
import { BlockUIService } from '../../external/services/block-ui.service';
import { MessagesResult } from '../../internal/components/messages-result/messages-result';
import { ResultCode } from '../../internal/const/result-code';
import { Result } from '../../internal/models/result';
import { HttpRequestService } from '../../internal/services/http-request.service';
import { TEXT } from '../../internal/shared/text';
import { AppService } from './app.service';
import { FilterComponent } from './filter/filter.component';
import { Query } from './models/query.model';
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
  title = 'Home / Recover Virtual Sports Bet';

  @ViewChild('filter') filterComponent: FilterComponent;
  @ViewChild('tickets') ticketsComponent: TicketsComponent;

  public blockUI: boolean;
  tooltip = new Tooltip();
  modal = new Modal();
  messagesResult = new MessagesResult();

  ticketsModel = new TicketsModel();
  isShowTickets: boolean;
  isShowBtnRecover: boolean;

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
    this.isShowBtnRecover = false;
  }

  searchEvent(query: Query) {
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
      this.modal.isShow = true;
      this.modal.header = 'Recover Bet Confirm';
      this.modal.body = TEXT.CONFIRM_RECOVER_TICKET;
    }
  }

  checkValidation() {
    if (this.ticketsModel.getCheckedTickets().length === 0) {
      this.tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
      return false;
    }

    return true;
  }

  confirmEvent() {
    this.recoverTickets();
  }

  recoverTickets() {
    const query: Query = {
      ticketType: this.filterComponent.ticketType,
      type: this.filterComponent.type,
      matchId: parseInt(this.filterComponent.matchId, 10),
      tickets: this.ticketsModel.getCheckedTickets()
    };

    this.appService.recoverTicket(query).subscribe(data => {
      this.handleAfterRecover(data);
    });
  }

  handleAfterRecover(results: Array<Result>) {
    if (results[0].errorCode === ResultCode.ERROR_CODE_MOVE_BET_PROCESS) {
      this.isShowTickets = false;
      this.isShowBtnRecover = false;
    } else  if (results[0].errorCode <= 0) {
      this.isShowTickets = false;
      this.isShowBtnRecover = false;
      this.filterComponent.resetFilter();
    }

    this.showMessages(results);
  }

  showMessages(results: Array<Result>) {
    this.messagesResult.isShow = true;
    this.messagesResult.header = 'Recover Bet Result';
    this.messagesResult.results = results;
  }
}
