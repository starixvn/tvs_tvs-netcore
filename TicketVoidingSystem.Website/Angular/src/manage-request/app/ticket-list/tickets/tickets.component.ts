import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { StaticService } from '../../../../utility/services/static.service';
import { TicketsModel } from './tickets.model';
import { NgClass } from '@angular/common';
import { PagingComponent } from '../../../../utility/components/paging/paging.component';
import { SanitizeHtmlPipe } from '../../../../utility/modules/sanitize-html.pipe';

@Component({
  standalone: true,
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
  imports: [NgClass, PagingComponent, SanitizeHtmlPipe]
})
export class TicketsComponent {
  @Input() model = new TicketsModel();
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter<PagingModel>();
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Input() isBlock: boolean;
  @Input() issueTypeId: number;

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  isRecoverTicket() {
    return StaticService.isRecoverTicket(this.issueTypeId?.toString());
  }

  getTitle() {
    return this.isRecoverTicket() ? 'Recovered Tickets' : 'Voided Tickets';
  }
}
