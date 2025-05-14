import { Component, inject, Input } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { LogInfoMessageComponent } from '../../../../../utility/components/log-info-detail/log-info-message/log-info-message.component';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { Item } from '../../../../../utility/models/item.model';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { AffectedTicketService } from '../../affected-ticket/affected-ticket.service';
import { GroupBetTypeCountModel } from '../../models/get-log-info.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-technical-error',
  templateUrl: './log-info-technical-error.component.html',
  styleUrls: ['./log-info-technical-error.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, LogInfoMessageComponent, BlockUiModule, PipeModule],
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
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
  }
}
