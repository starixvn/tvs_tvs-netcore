import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PagingModel } from '../../../../../utility/components/paging/paging.model';
import { BlockUiDirective } from '../../../../../utility/components/block-ui/block-ui.directive';
import { PagingComponent } from '../../../../../utility/components/paging/paging.component';
import { TableTicketsModel } from './table-tickets.model';
import { SanitizeHtmlPipe } from '../../../../../utility/modules/sanitize-html.pipe';

@Component({
  selector: 'tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule, BlockUiDirective, SanitizeHtmlPipe, PagingComponent]
})
export class TicketsListComponent {
  @Input() model: TableTicketsModel;
  @Input() isBlock: boolean;
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter();

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }
}
