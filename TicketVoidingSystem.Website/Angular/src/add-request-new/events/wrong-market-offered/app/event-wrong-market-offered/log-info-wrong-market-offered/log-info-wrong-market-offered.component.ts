import { Component, inject, Input } from '@angular/core';
import clone from 'lodash/clone';
import moment from 'moment-timezone';
import { BlockUiDirective } from '../../../../../../utility/components/block-ui/block-ui.directive';
import { LogInfoMessageComponent } from '../../../../../../utility/components/log-info-detail/log-info-message/log-info-message.component';
import { LogInfoTicketCountComponent } from '../../../../../../utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../../../../component/affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { GroupBetTypeCountModel } from '../../../../../models/get-log-info.model';
import { AffectedTicketsModel } from '../../../../../models/live-game-early-ticket.model';
import { LogInfoItem, LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-wrong-market-offered',
  templateUrl: './log-info-wrong-market-offered.component.html',
  styleUrls: ['./log-info-wrong-market-offered.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, LogInfoTicketCountComponent, LogInfoMessageComponent, BlockUiDirective],
  providers: [AffectedTicketService]
})

export class LogInfoWrongMarketOfferedComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoWrongMarketOffered;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() issueTypeId: string;

  private readonly affectedTicketService = inject(AffectedTicketService);

  groupBetTypesCount: GroupBetTypeCountModel[] = [];
  affectedTicketsModel = new AffectedTicketsModel();
  isBlock: boolean;

  displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  showAffectedTicketsDetails(logInfo: LogInfoItem) {
    this.updateBetTypeCountModel(logInfo);
    this.affectedTicketsModel.issueTypeId = Number(this.issueTypeId);
    this.affectedTicketsModel.logInfoTicketsJson = logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = clone(this.affectedTicketsModel);
  }

  private updateBetTypeCountModel(logInfo: LogInfoItem) {
    this.affectedTicketsModel.groupBetTypesCount = this.affectedTicketService.updateBetTypeCountModel(logInfo.betTypeCount);
    this.affectedTicketsModel.isShowDetailBetTypeCount = true;
  }
}
