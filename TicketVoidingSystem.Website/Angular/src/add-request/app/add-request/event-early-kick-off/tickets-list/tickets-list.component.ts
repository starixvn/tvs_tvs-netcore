import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { TableTicketsModel } from './table-tickets.model';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss']
})
export class TicketsListComponent implements OnInit {
  @Input() model: TableTicketsModel;
  @Input() paging = new PagingModel();
  @Input() isBlock: boolean;
  @Output() pagingChange = new EventEmitter<PagingModel>();

  constructor() { }

  ngOnInit() {

  }

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }
}
