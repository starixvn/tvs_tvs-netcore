import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseTicketsListComponent } from '../../../utility/components/base-tickets-list/base-tickets-list.component';
import { Tooltip } from '../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../utility/constants/labels';
import { MarkedTicketQuery } from '../models/query.model';
import { DataPermission } from '../models/result.model';
import { TicketsModel } from './tickets.model';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
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

  constructor(readonly element: ElementRef) {
    super(element);
    this.tooltip.element = this.element;
  }

  ngOnInit() {
    this.clickBody();
  }

  markSelectedTicketsOnPage(): void {
    const tickets = this.model.getTicketsParam();
    if (tickets.length === 0) {
      this.tooltip.display('invalid-data', LABELS.EMPTY_TICKET);
    } else {
      this.markedTicketsQuery.tickets = tickets;
      this.updateMarkedTickets.emit(this.markedTicketsQuery);
    }
  }

  markSelectedTicketsAllPage(): void {
    const tickets = this.model.getTicketsParamWithAllPage();
    if (tickets.length === 0) {
      this.tooltip.display('invalid-data', LABELS.EMPTY_TICKET);
    } else {
      this.markedTicketsQuery.tickets = tickets;
      this.updateMarkedTickets.emit(this.markedTicketsQuery);
    }
  }

  getTitle(): string {
    return `Mark Time: ${this.model.fromTime} - ${this.model.toTime} (Single Count: ${this.model.singleCount} ,Parlay: ${this.model.parlayCount} )`;
  }

  changeTickets(): void {
    this.ticketsChange.emit(this.model.getNumberOfCheckedTickets());
  }
}
