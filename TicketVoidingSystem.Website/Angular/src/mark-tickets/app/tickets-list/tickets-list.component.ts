import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseTicketsListComponent } from '../../../utility/components/base-tickets-list/base-tickets-list.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { TEXT} from '../../../utility/constants/text';
import { MarkedTicketQuery } from '../models/query.model';
import { DataPermission } from '../models/result.model';
import { TicketsModel } from './tickets.model';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { TicketsListService } from './tickets-list.service';
import { TicketModel } from './ticket.model';
import { GroupModel } from './group-tickets.model';

@Component({
  standalone: true,
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  imports: [CommonModule, FormsModule, TooltipComponent, PagingComponent, BlockUiDirective, SanitizeHtmlPipe]
})
export class TicketsListComponent extends BaseTicketsListComponent<TicketsModel> implements OnInit {
  @Input() isShowTickets: boolean;
  @Input() getStatus: string;
  @Input() isBorder: boolean;
  @Input() dataPermission = new DataPermission();
  @Output() ticketsChange = new EventEmitter<number>();
  @Output() updateMarkedTickets = new EventEmitter<MarkedTicketQuery>();
  markedTicketsQuery = new MarkedTicketQuery();
  tooltip = new Tooltip();

  private readonly ticketsListService = inject(TicketsListService);
  
  constructor(readonly element: ElementRef) {
    super();
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    this.clickBody();
  }

  markSelectedTicketsOnPage(): void {
    const tickets = this.ticketsListService.getTicketsParam(this.model.groups);
    if (tickets.length === 0) {
      this.tooltip.display('invalid-data', TEXT.EMPTY_TICKET);
    } else {
      this.markedTicketsQuery.tickets = tickets;
      this.markedTicketsQuery.checkPermissionTickets = this.ticketsListService.getAllTickets(this.model.groups);
      this.updateMarkedTickets.emit(this.markedTicketsQuery);
    }
  }

  markSelectedTicketsAllPage(): void {
    const tickets = this.ticketsListService.getTicketsParamWithAllPage(this.model);
    if (tickets.length === 0) {
      this.tooltip.display('invalid-data', TEXT.EMPTY_TICKET);
    } else {
      this.markedTicketsQuery.tickets = tickets;
      this.markedTicketsQuery.checkPermissionTickets = this.ticketsListService.getAllTickets(this.model.groups);
      this.updateMarkedTickets.emit(this.markedTicketsQuery);
    }
  }

  getTitle(): string {
    return `Mark Time: ${this.model.fromTime} - ${this.model.toTime} (Single Count: ${this.model.singleCount} ,Parlay: ${this.model.parlayCount} )`;
  }

  changeTickets(): void {
    this.ticketsChange.emit(this.model.getNumberOfCheckedTickets());
  }

  checkGroups(){
    this.ticketsListService.checkGroups(this.model);
  }

  getNumberOfTickets(){
    return this.ticketsListService.getNumberOfTickets(this.model.groups);
  }

  getUncheckedTicketList(ticket: TicketModel){
    return this.ticketsListService.getUncheckedTicketList(this.model, ticket);
  }

  getUncheckedTicketListFromGroup(group: GroupModel){
    return this.ticketsListService.getUncheckedTicketListFromGroup(this.model, group);
  }
}
