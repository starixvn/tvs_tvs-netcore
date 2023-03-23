import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonGroupTicketsModel } from '../../../utility/models/common.group-tickets.model';
import { CommonTicketModel } from '../../../utility/models/common.ticket.model';
import { CommonTicketsModel } from '../../models/common.tickets.model';
import { PagingModel } from '../paging/paging/paging.model';

@Component({
  selector: 'base-tickets-list',
  template: `
    <p>
      base-tickets-list works!
    </p>
  `,
  styles: []
})
export class BaseTicketsListComponent<T extends CommonTicketsModel<CommonGroupTicketsModel<CommonTicketModel>>>
  implements OnInit {
  @Input() model: T;
  @Input() paging = new PagingModel();
  @Input() isBlock: boolean;
  @Output() pagingChange = new EventEmitter<PagingModel>();
  @Output() exportExcelEvent = new EventEmitter<boolean>();
  @Output() ticketsChange = new EventEmitter<number>();
  isShowListCheckGroup: boolean;
  showMessageBetTrade: boolean;

  constructor(readonly element: ElementRef) { }

  ngOnInit() {
    this.clickBody();
  }

  showListCheckGroup() {
    if (this.model.groups.length > 0) {
      this.isShowListCheckGroup = true;
      this.model.updatePositionListCheckGroup(this.element);
    }
  }

  clickBody() {
    const body = document.querySelector('body');
    const className = 'list-check-groups-input';
    const listCheckGroupsElement = this.element.nativeElement.getElementsByClassName(className);
    body.addEventListener('click', e => {
      if (!this.isShowListCheckGroup || !e.target) {
        return;
      }
      if (listCheckGroupsElement[0] !== e.target && !listCheckGroupsElement[0].contains((e.target as Node))) {
        this.isShowListCheckGroup = false;
      }
    }, false);
  }

  exportExcel() {
    this.exportExcelEvent.emit();
  }

  pagingEvent() {
    this.pagingChange.emit(this.paging);
  }
}
