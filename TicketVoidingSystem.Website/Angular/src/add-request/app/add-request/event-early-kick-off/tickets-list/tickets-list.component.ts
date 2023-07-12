import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableTicketsModel } from './table-tickets.model';
import { PagingModel } from '../../../../../utility/modules/paging/paging/paging.model';

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
