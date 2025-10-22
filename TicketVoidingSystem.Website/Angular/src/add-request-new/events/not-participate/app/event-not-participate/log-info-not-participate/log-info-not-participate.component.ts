import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import moment from 'moment-timezone';
import { LogInfoTicketCountComponent } from '../../../../../../utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { ModalService } from '../../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../../utility/constants/issue-type.constant';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../../../../component/affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { AffectedTicketsModel } from '../../../../../models/live-game-early-ticket.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-not-participate',
  templateUrl: './log-info-not-participate.component.html',
  styleUrls: ['./log-info-not-participate.component.scss'],
  standalone: true,
  imports: [LogInfoTicketCountComponent, CommonModule, AffectedTicketComponent],
  providers: [AffectedTicketService]
})
export class LogInfoNotParticipateComponent {
  @Input() logInfo: LogInfoNotParticipate;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() filter: FilterModel;
  affectedTicketsModel = new AffectedTicketsModel();
  private readonly modalService = inject(ModalService);
  private readonly affectedTicketService = inject(AffectedTicketService);

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

  showAffectedTicketsDetails(logInfo: LogInfoNotParticipate) {
    this.affectedTicketsModel = this.affectedTicketService.getAffectedTicketsDetails(Number(IssueTypeConstant.NOT_PARTICIPATE),
    logInfo.betTypeCount, logInfo.logInfoDetail.logInfoTicketsJson);
  }
}
