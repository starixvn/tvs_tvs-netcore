import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BlockUiModule } from '../../../../../utility/components/block-ui/block-ui.module';
import { LogInfoMessageComponent } from '../../../../../utility/components/log-info-detail/log-info-message/log-info-message.component';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { Item } from '../../../../../utility/models/item.model';
import { PipeModule } from '../../../../../utility/pipes/pipe.module';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { GroupBetTypeCountModel } from '../../models/get-log-info.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
  selector: 'log-info-technical-error',
  templateUrl: './log-info-technical-error.component.html',
  styleUrls: ['./log-info-technical-error.component.scss'],
  standalone: true,
  imports: [AffectedTicketComponent, LogInfoMessageComponent, BlockUiModule, PipeModule]
})

export class LogInfoTechnicalErrorComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoTechnicalError;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() issueTypeId: string;

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
    this.groupBetTypesCount = [];
    const groupBetTypes = _.groupBy(this.logInfo.betTypeCount, item => `"${item.betTypeId}+${item.betId}"`);
    for (const key in groupBetTypes) {
      const values = groupBetTypes[key];

      const childBetTypes = values
        .filter(item => item.playerName)
        .map(item => {
          return {
            name: `${item.playerName} - ${item.ticketsCount} ticket(s)`
          } as Item;
        });
      const group: GroupBetTypeCountModel = {
        name: values[0].playerName ? `${values[0].betTypeName}:` : `${values[0].betTypeName} - ${values[0].ticketsCount} ticket(s)`,
        items: childBetTypes
      };

      this.groupBetTypesCount.push(group);
    };

    this.affectedTicketsModel.groupBetTypesCount = this.groupBetTypesCount;
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
