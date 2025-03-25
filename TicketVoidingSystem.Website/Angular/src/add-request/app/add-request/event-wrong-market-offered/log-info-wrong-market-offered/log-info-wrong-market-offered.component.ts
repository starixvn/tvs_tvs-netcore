import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BlockUiModule } from 'src/utility/components/block-ui/block-ui.module';
import { LogInfoMessageComponent } from 'src/utility/components/log-info-detail/log-info-message/log-info-message.component';
import { LogInfoTicketCountComponent } from 'src/utility/components/log-info-detail/log-info-ticket-count/log-info-ticket-count.component';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { Item } from '../../../../../utility/models/item.model';
import { StaticService } from '../../../../../utility/services/static.service';
import { AffectedTicketComponent } from '../../affected-ticket/affected-ticket.component';
import { GroupBetTypeCountModel } from '../../models/get-log-info.model';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { LogInfoItem, LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';

@Component({
    selector: 'log-info-wrong-market-offered',
    templateUrl: './log-info-wrong-market-offered.component.html',
    styleUrls: ['./log-info-wrong-market-offered.component.scss'],
    standalone: true,
    imports: [AffectedTicketComponent, LogInfoTicketCountComponent, LogInfoMessageComponent, BlockUiModule]
})

export class LogInfoWrongMarketOfferedComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoWrongMarketOffered;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() issueTypeId: string;

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
    this.affectedTicketsModel = _.clone(this.affectedTicketsModel);
  }

  private updateBetTypeCountModel(logInfo: LogInfoItem) {
    this.groupBetTypesCount = [];
    const groupBetTypes = _.groupBy(logInfo.betTypeCount, item => `"${item.betTypeId}+${item.betId}"`);
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
}
