import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';

@Component({
  selector: 'ticket-count-other-sports',
  templateUrl: './ticket-count-other-sports.component.html',
  styleUrls: ['./ticket-count-other-sports.component.scss']
})
export class TicketCountOtherSportsComponent {
  @Input() isVoided: boolean;
  @Input() logInfoDetail: LogInfoDetail;
  @Output() openTicketDetails = new EventEmitter<number>();

  constructor() { }

  public clickOpenTicketDetails(){
    this.openTicketDetails.emit();
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }
}
