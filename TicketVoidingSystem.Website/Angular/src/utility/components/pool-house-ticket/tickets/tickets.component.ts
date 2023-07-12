import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagingModel } from '../../../components/paging/paging/paging.model';
import { BaseTicketsListComponent } from '../../base-tickets-list/base-tickets-list.component';
import { TicketsModel } from './tickets.model';

@Component({
  selector: 'tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent extends BaseTicketsListComponent<TicketsModel> implements OnInit {
  @Input() model = new TicketsModel();
  @Input() isBlock: boolean;
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter<PagingModel>();
  @Output() exportExcelEvent = new EventEmitter<boolean>();

  isDisableCheckbox = true;
  title = '';

  constructor(readonly element: ElementRef) {
    super(element);
  }

  public ngOnInit() {
    this.clickBody();
    this.paging.pageSize = 500;
    this.paging.page = 1;
  }

  public changeTickets() {
    this.ticketsChange.emit(this.model.getNumberOfCheckedTickets());
  }

  public pagingEvent(): void {
    this.pagingChange.emit(this.paging);
  }
}