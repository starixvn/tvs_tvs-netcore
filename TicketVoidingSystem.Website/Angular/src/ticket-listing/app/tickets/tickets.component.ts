import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PagingModel } from '../../../utility/components/paging/paging.model';
import { Product } from '../../../utility/constants/config';
import { SummaryItem } from '../summary/summary.model';
import { TicketsModel } from './ticket.model';
import { CommonModule } from '@angular/common';
import { PagingComponent } from '../../../utility/components/paging/paging.component';
import { FormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from '../../../utility/modules/sanitize-html.pipe';

@Component({
  standalone: true,
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  imports: [CommonModule, FormsModule, PagingComponent, SanitizeHtmlPipe]
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
