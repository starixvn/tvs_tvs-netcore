import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseTicketsListComponent } from '../../../utility/components/base-tickets-list/base-tickets-list.component';
import { BlockUiDirective } from '../../../utility/components/block-ui/block-ui.directive';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { TooltipComponent } from '../../../utility/components/tooltip/tooltip.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { TEXT } from '../../../utility/constants/text';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';
import { MarkedTicketQuery } from '../models/query.model';
import { DataPermission } from '../models/result.model';
import { GroupModel } from './group-tickets.model';
import { TicketModel } from './ticket.model';
import { TicketsListService } from './tickets-list.service';
import { TicketsModel } from './tickets.model';

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
      this.markedTicketsQuery.checkPermissionTickets = tickets;
      this.updateMarkedTickets.emit(this.markedTicketsQuery);
    }
  }

  markSelectedTicketsAllPage(): void {
    const tickets = this.ticketsListService.getTicketsParamWithAllPage(this.model);
    if (tickets.length === 0) {
      this.tooltip.display('invalid-data', TEXT.EMPTY_TICKET);
    } else {
      this.markedTicketsQuery.tickets = tickets;
      this.markedTicketsQuery.checkPermissionTickets = this.ticketsListService.getTicketsParamWithAllPage(this.model);
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
