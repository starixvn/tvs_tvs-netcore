import { Component, Input } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';

@Component({
  selector: 'detail-not-participate',
  templateUrl: './detail-not-participate.component.html',
  styleUrls: ['./detail-not-participate.component.scss']
})
export class DetailNotParticipateComponent {
  @Input() logInfoDetail: LogInfoDetail;

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
