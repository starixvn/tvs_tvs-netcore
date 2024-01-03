import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { TicketsModel } from './tickets.model';

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  @Input() model = new TicketsModel();
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter<PagingModel>();
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Input() isBlock: boolean;
  @Input() isRecoverTicket: boolean;

  constructor() { }

  ngOnInit() {
  }

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  getTitle() {
    if(this.isRecoverTicket){
      return "Recovered Tickets"
    }
    return "Voided Tickets"
  }
}
