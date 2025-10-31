import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../../utility/components/block-ui/block-ui.directive';
import { Content, ModalType } from '../../../../utility/components/modal/modal.model';
import { ModalService } from '../../../../utility/components/modal/modal.service';
import { PagingComponent } from '../../../../utility/components/paging/paging.component';
import { PagingModel } from '../../../../utility/components/paging/paging.model';
import { LogModel } from './logs-list.model';

@Component({
  standalone: true,
  selector: 'logs-list',
  templateUrl: './logs-list.component.html',
  styleUrls: ['./logs-list.component.scss'],
  imports: [CommonModule, PagingComponent, BlockUiDirective],
  providers: [ModalService]
})
export class LogsListComponent {
  @Input() isShowLogs: boolean;
  @Input() isBlock: boolean;
  @Input() model = Array<LogModel>();
  @Input() paging = new PagingModel();
  @Output() pagingChange = new EventEmitter<PagingModel>();

  private readonly modalService = inject(ModalService);

  pagingEvent(): void {
    this.pagingChange.emit(this.paging);
  }

  convertToGMT8(date: Date): Date {
    const timeOffset = 12;
    return moment(date).add(timeOffset, 'hours').toDate();
  }

  displayTransIdList(singleTickets: string[], parlayTickets: string[], hybridParlayTickets: string[]): void {
    this.modalService.open(
      {
        title: 'List of BetID (Click on the list to copy)',
        type: ModalType.Alert,
        copyContent: true,
        content: this.getModalContent(singleTickets, parlayTickets, hybridParlayTickets)
      }
    );
  }

  private getModalContent(singleTickets: string[], parlayTickets: string[], hybridParlayTickets: string[]): Content[] {
    const result: Content[] = [];
    if (singleTickets.length > 0) {
      result.push({ title: 'Single ticket(s):', message: singleTickets.join(', ') });
    }
    if (parlayTickets.length > 0) {
      result.push({ title: 'Parlay ticket(s):', message: parlayTickets.join(', ') });
    }
    if (hybridParlayTickets.length > 0) {
      result.push({ title: 'Bet Builder+ ticket(s):', message: hybridParlayTickets.join(', ') });
    }

    return result;
  }

}
