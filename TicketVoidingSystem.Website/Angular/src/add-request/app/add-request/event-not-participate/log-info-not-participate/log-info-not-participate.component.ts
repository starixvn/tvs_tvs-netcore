import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import moment from 'moment-timezone';
import { LogInfoTicketCountComponent } from 'src/utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
    selector: 'log-info-not-participate',
    templateUrl: './log-info-not-participate.component.html',
    styleUrls: ['./log-info-not-participate.component.scss'],
    standalone: true,
    imports: [LogInfoTicketCountComponent, CommonModule]
})
export class LogInfoNotParticipateComponent {
  @Input() logInfo: LogInfoNotParticipate;
  @Input() primitiveProps = new PrimitivePropertyEvent();

  constructor(private readonly modalService: ModalService) { }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public openPopupTransIds(requestId: number, transIds: string): void {
    StaticService.openPopupTransIds(requestId, transIds, this.modalService);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public displayTransId(ticketCount: number, transId: string): string {
    return ticketCount === 0 ? '-' : transId;
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }
}
