import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import filter from 'lodash/filter';
import moment from 'moment-timezone';
import { AutoRefreshComponent } from '../../../../utility/components/auto-refresh/auto-refresh.component';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { PagingComponent } from '../../../../utility/components/paging/paging.component';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { TooltipComponent } from '../../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../../utility/components/tooltip/tooltip.model';
import { TEXT} from '../../../../utility/constants/text';
import { SanitizeHtmlPipe } from '../../../../utility/modules/sanitize-html.pipe';
import { DataPermission } from '../../models/result.model';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { TicketDetailId } from './../../models/query.model';
import { AllMarkedTicketModel } from './all-marked-ticket.model';

enum IconCheckBox {
  none = 0,
  any = 1,
  all = 2
}

@Component({
  standalone: true,
  selector: 'all-marked-ticket-list',
  templateUrl: './all-marked-ticket-list.component.html',
  styleUrls: ['./all-marked-ticket-list.component.scss'],
  imports: [CommonModule, FormsModule, AutoRefreshComponent, BlockUiDirective,
    TooltipComponent, PagingComponent, SanitizeHtmlPipe ]
})
export class AllMarkedTicketListComponent {
  @Input() isShowAllTickets: boolean;
  @Input() isBlock: boolean;
  @Input() model = Array<AllMarkedTicketModel>();
  @Input() paging = new PagingModel();
  @Input() ticketsDetail = new TicketsModel();
  @Input() autoRefreshMode: number;
  @Input() dataPermission = new DataPermission();
  @Output() pagingChange = new EventEmitter<PagingModel>();
  @Output() getDetailTickets = new EventEmitter<TicketDetailId>();
  @Output() updateAllMarkedTickets = new EventEmitter<AllMarkedTicketModel[]>();
  @Output() refreshData = new EventEmitter();

  ticketsModel = new TicketsModel();
  iconCheckBox = IconCheckBox.all;
  isBlockTickets: boolean;
  getStatus: string;
  pagingDetail = new PagingModel();
  tempUncheckedList = new Array<string>();
  tooltip = new Tooltip();

  private readonly element = inject(ElementRef);

  constructor() {
    this.tooltip.element = this.element;
  }

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }

  getMarkedTicketDetail(ticket: AllMarkedTicketModel): void {
    const ticketDetailId: TicketDetailId = {
      matchId: ticket.matchId,
      userId: ticket.userId,
      createdDate: ticket.createdDate,
      childMatchId: ticket.childMatchId
    };
    this.getDetailTickets.emit(ticketDetailId);
  }

  checkGroups() {
    if (this.model.length > 0) {
      if (this.iconCheckBox !== IconCheckBox.none) {
        this.iconCheckBox = IconCheckBox.none;
        this.model.forEach(ticket => (ticket.isChecked = false));
      } else {
        this.iconCheckBox = IconCheckBox.all;
        this.model.forEach(ticket => (ticket.isChecked = true));
      }
    }
  }

  getTotalMarkedTickets(): number {
    let result = 0;
    this.model.forEach(ticket => (result += ticket.total));
    return result;
  }

  getUncheckedTicketList(ticket: AllMarkedTicketModel): void {
    this.changeIconCheckBox();
    const getTicket = this.tempUncheckedList.find(item => item === ticket.matchId);
    if (ticket.isChecked) {
      if (getTicket !== null) {
        this.tempUncheckedList = this.tempUncheckedList.filter(value => value !== ticket.matchId);
      }
    } else {
      if (getTicket === null || getTicket === undefined) {
        this.tempUncheckedList.push(ticket.matchId);
      }
    }
  }

  getMatchsParam(): AllMarkedTicketModel[] {
    return filter(this.model, { isChecked: true });
  }

  changeIconCheckBox() {
    let numberTickets = 0;
    let numberTicketsChecked = 0;
    this.model.forEach(item => {
      numberTickets++;
      if (item.isChecked) {
        numberTicketsChecked++;
      }
    });
    this.iconCheckBox =
      numberTickets === 0
        ? IconCheckBox.none
        : numberTickets === numberTicketsChecked
          ? IconCheckBox.all
          : numberTicketsChecked > 0
            ? IconCheckBox.any
            : IconCheckBox.none;
  }

  unmarkAllCheckedMarkedTickets(): void {
    const param = this.getMatchsParam();
    if (param.length === 0 || param === null || param === undefined) {
      this.tooltip.display('invalid-data', TEXT.EMPTY_MATCH);
    } else {
      this.updateAllMarkedTickets.emit(param);
    }
  }

  convertToGMT8(date: Date): Date {
    const timeOffset = 12;
    return moment(date).add(timeOffset, 'hours').toDate();
  }

  refreshTickets() {
    this.refreshData.emit();
    this.iconCheckBox = IconCheckBox.all;
  }

  getShowMatchId(matchId: string, childMatchId :string){
    if(childMatchId){
      return `${matchId}\n(${childMatchId})`
    }
    else{
      return `${matchId}`
    }
  }
}
