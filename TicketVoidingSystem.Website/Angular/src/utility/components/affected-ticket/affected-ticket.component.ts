import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { PagingModel } from '../../components/paging/paging/paging.model';
import { LiveGameEarlyTicketsModel, LiveGameEarlyTicketsQuery } from '../../../add-request/app/add-request/models/live-game-early-ticket.model';

@Component({
  selector: 'affected-ticket',
  templateUrl: './affected-ticket.component.html',
  styleUrls: ['./affected-ticket.component.scss']
})
export class AffectedTicketComponent implements OnChanges {
  @Input() model = new LiveGameEarlyTicketsModel();
  @Output() saveEventOutput = new EventEmitter<LiveGameEarlyTicketsModel>();
  @Output() pagingEventOuput = new EventEmitter<LiveGameEarlyTicketsQuery>();

  paging = new PagingModel();
  isBlock: boolean;
  blockBetList: boolean;

  public async ngOnChanges(changes: SimpleChanges) {
    if (changes['model'] && this.model.isOpen) {
      this.blockBetList = true;
      this.paging.total = this.model.tickets.totalSingle;
      this.blockBetList = false;
    }
  }

  public async pagingEvent(): Promise<void> {
    this.model.query.pageIndex = this.paging.page - 1;
    this.model.query.pageSize = this.paging.pageSize;
    this.pagingEventOuput.emit(this.model.query);
  }

  public closeClick(): void {
    this.model.isOpen = false;
  }
}
