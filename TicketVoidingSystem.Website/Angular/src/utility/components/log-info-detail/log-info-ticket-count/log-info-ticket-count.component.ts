import { Component, Input } from '@angular/core';
import moment from 'moment-timezone';
import { BetTypeCountModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';

@Component({
  selector: 'log-info-ticket-count',
  templateUrl: './log-info-ticket-count.component.html',
  styleUrls: ['./log-info-ticket-count.component.scss']
})
export class LogInfoTicketCountComponent {
  @Input() model: LogInfoDetail;
  @Input() isShowCancelCashOut: boolean;
  @Input() isShowBetTypeCount: boolean;
  @Input() betTypesCount: BetTypeCountModel[] = []

  isShowDetaiBetTypeCount = false;
  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }
}
