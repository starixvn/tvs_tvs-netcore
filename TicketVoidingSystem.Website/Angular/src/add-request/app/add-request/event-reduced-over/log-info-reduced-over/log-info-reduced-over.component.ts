import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import clone from 'lodash/clone';
import moment from 'moment-timezone';
import { ModalService } from '../../../../../utility/components/modal/modal.service';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { SanitizeHtmlPipe } from '../../../../../utility/modules/sanitize-html.pipe';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  standalone: true,
  selector: 'log-info-reduced-over',
  templateUrl: './log-info-reduced-over.component.html',
  styleUrls: ['./log-info-reduced-over.component.scss'],
  imports: [FormsModule, CommonModule, NgbModule, SanitizeHtmlPipe]
})
export class LogInfoReducedOverComponent {
  @Input() issueTypeId: string;
  @Input() logInfo: LogInfoReducedOver;
  @Input() primitiveProps = new PrimitivePropertyEvent();

  private readonly modalService = inject(ModalService);
  private readonly affectedTicketService = inject(AffectedTicketService);

  affectedTicketsModel = new AffectedTicketsModel();

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

  showAffectedTicketsDetails(logInfo: LogInfoReducedOver) {
    this.updateBetTypeCountModel(logInfo);
    this.affectedTicketsModel.issueTypeId = Number(this.issueTypeId);
    this.affectedTicketsModel.logInfoTicketsJson = logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = clone(this.affectedTicketsModel);
  }

  private updateBetTypeCountModel(logInfo: LogInfoReducedOver) {
    this.affectedTicketsModel.groupBetTypesCount = this.affectedTicketService.updateBetTypeCountModel(logInfo.betTypeCount);
    this.affectedTicketsModel.isShowDetailBetTypeCount = true;
  }
}
