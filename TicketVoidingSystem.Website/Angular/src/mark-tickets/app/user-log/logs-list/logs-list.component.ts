import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment-timezone';
import { Content, ModalType } from '../../../../utility/components/modal/modal';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { PagingModel } from '../../../../utility/components/paging/paging/paging.model';
import { LogModel } from './logs-list.model';

@Component({
  selector: 'logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss']
})
export class LogsListComponent implements OnInit {
  @Input() isShowLogs: boolean;
  @Input() isBlock: boolean;
  @Input() model = Array<LogModel>();
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter<PagingModel>();

  constructor(private readonly modalService: ModalService) { }

  ngOnInit() {
  }

  pagingEvent(): void {
    this.pagingChange.emit(this.paging);
  }

  convertToGMT8(date: Date): Date {
    const timeOffset = 12;
    return moment(date).add(timeOffset, 'hours').toDate();
  }

  displayTransIdList(singleTickets: string[], parlayTickets: string[]): void {
    this.modalService.open(
      {
        title: 'List of BetID (Click on the list to copy)',
        type: ModalType.Alert,
        copyContent: true,
        content: this.getModalContent(singleTickets, parlayTickets)
      }
    );
  }

  countTotalTicket(singleTickets: string[], parlayTickets: string[]): number {
    return singleTickets.length + parlayTickets.length;
  }

  private getModalContent(singleTickets: string[], parlayTickets: string[]): Content[] {
    const result: Content[] = [];
    if (singleTickets.length > 0) {
      result.push({ title: 'Single ticket(s):', message: singleTickets.join(', ') });
    }
    if (parlayTickets.length > 0) {
      result.push({ title: 'Parlay ticket(s):', message: parlayTickets.join(', ') });
    }

    return result;
  }

}
