import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import clone from 'lodash/clone';
import moment from 'moment-timezone';
import { IssueTypeConstant } from 'src/utility/constants/issue-type.constant';
import { LogInfoTicketCountComponent } from '../../../../../utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
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
    this.updateBetTypeCountModel(logInfo);
    this.affectedTicketsModel.issueTypeId = Number(IssueTypeConstant.NOT_PARTICIPATE);
    this.affectedTicketsModel.logInfoTicketsJson = logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = clone(this.affectedTicketsModel);
  }

  private updateBetTypeCountModel(logInfo: LogInfoNotParticipate) {
    this.affectedTicketsModel.groupBetTypesCount = this.affectedTicketService.updateBetTypeCountModel(logInfo.betTypeCount);
    this.affectedTicketsModel.isShowDetailBetTypeCount = true;
  }
}
