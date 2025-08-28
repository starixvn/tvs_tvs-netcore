import { Component, inject, Input } from '@angular/core';
import moment from 'moment-timezone';
import clone from 'lodash/clone';
import { BlockUiDirective } from '../../../../../../utility/components/block-ui/block-ui.directive';
import { LogInfoMessageComponent } from '../../../../../../utility/components/log-info-detail/log-info-message/log-info-message.component';
import { DateTimeFormat } from '../../../../../../utility/constants/config';
import { SanitizeHtmlPipe } from '../../../../../../utility/modules/sanitize-html.pipe';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../../../../component/affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../../../../component/affected-ticket/affected-ticket.service';
import { GroupBetTypeCountModel } from '../../../../../models/get-log-info.model';
import { AffectedTicketsModel } from '../../../../../models/live-game-early-ticket.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-technical-error',
  templateUrl: './log-info-technical-error.component.html',
  styleUrls: ['./log-info-technical-error.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, LogInfoMessageComponent, BlockUiDirective, SanitizeHtmlPipe],
  providers: [AffectedTicketService]
})

export class LogInfoTechnicalErrorComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoTechnicalError;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() issueTypeId: string;

  private readonly affectedTicketService = inject(AffectedTicketService);

  groupBetTypesCount: GroupBetTypeCountModel[] = [];
  affectedTicketsModel = new AffectedTicketsModel();
  isBlock: boolean;

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  private updateBetTypeCountModel() {
    this.affectedTicketsModel.groupBetTypesCount = this.affectedTicketService.updateBetTypeCountModel(this.logInfo.betTypeCount);
    this.affectedTicketsModel.isShowDetailBetTypeCount = true;
  }

  public showAffectedTicketsDetails() {
    this.updateBetTypeCountModel();
    this.affectedTicketsModel.issueTypeId = Number(this.issueTypeId);
    this.affectedTicketsModel.logInfoTicketsJson = this.logInfo.logInfoDetail.logInfoTicketsJson;
    this.affectedTicketsModel.isOpen = true;
    this.affectedTicketsModel = clone(this.affectedTicketsModel);
  }
}
