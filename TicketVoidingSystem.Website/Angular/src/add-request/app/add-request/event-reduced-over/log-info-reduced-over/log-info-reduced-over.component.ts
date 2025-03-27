import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { PipeModule } from 'src/utility/pipes/pipe.module';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-reduced-over',
  templateUrl: './log-info-reduced-over.component.html',
  styleUrls: ['./log-info-reduced-over.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, NgbModule, PipeModule]
})
export class LogInfoReducedOverComponent {
  @Input() logInfo: LogInfoReducedOver;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  private readonly modalService = inject(ModalService);
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
