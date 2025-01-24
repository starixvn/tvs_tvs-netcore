import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';
import { SanitizeHtmlPipe } from '../../../pipes/sanitize-html.pipe';

@Component({
  standalone: true,
  selector: 'log-info-ticket-count',
  templateUrl: './log-info-ticket-count.component.html',
  styleUrls: ['./log-info-ticket-count.component.scss'],
  imports: [SanitizeHtmlPipe]
})
export class LogInfoTicketCountComponent {
  @Input() model: LogInfoDetail;
  @Input() isShowCancelCashOut: boolean;
  @Input() isShowDetailsButton: boolean;
  @Output() openAffectedDetails = new EventEmitter();

  displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  showAffectedTicketsDetails() {
    this.openAffectedDetails.emit();
  }
}
