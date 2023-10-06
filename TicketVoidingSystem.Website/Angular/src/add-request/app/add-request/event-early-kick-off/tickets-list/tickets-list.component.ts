import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { TableTicketsModel } from './table-tickets.model';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent {
  @Input() model: TableTicketsModel;
  @Input() paging = new PagingModel();
  @Input() isBlock: boolean;
  @Output() pagingChange = new EventEmitter<PagingModel>();

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }
}
