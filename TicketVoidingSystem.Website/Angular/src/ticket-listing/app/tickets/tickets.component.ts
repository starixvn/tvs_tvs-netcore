import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Product } from '../../../utility/constants/config';
import { SummaryItem } from '../summary/summary.model';
import { PagingModel } from './../../../utility/modules/paging/paging/paging.model';
import { TicketsModel } from './ticket.model';

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, OnChanges {
  @Input() model: TicketsModel;
  @Input() isShowTickets: boolean;
  @Input() product: number;
  @Output() pagingSearchTicket = new EventEmitter<PagingModel>();
  @Output() exportExcelEvent = new EventEmitter<SummaryItem>();
  paging = new PagingModel();

  ngOnInit() {
    this.paging.selection = [50, 100, 150, 500];
  }

  ngOnChanges() {
    if (this.model.item) {
      this.paging.total = this.model.item.total;
      this.paging.pageSize = this.paging.selection[0];
    }
  }

  getWidth() {
    return this.product === Product.NUMBER_GAME ? '1335px' : '1275px';
  }

  exportExcel() {
    this.exportExcelEvent.emit(this.model.item);
  }

  pagingEvent() {
    this.pagingSearchTicket.emit(this.paging);
  }
}
