import { Component, Input } from '@angular/core';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import * as _ from 'lodash';
import { AffectedTicketsModel } from '../../models/live-game-early-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';

@Component({
  selector: 'log-info-wrong-market-offered',
  templateUrl: './log-info-wrong-market-offered.component.html',
  styleUrls: ['./log-info-wrong-market-offered.component.scss']
})
export class LogInfoWrongMarketOfferedComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoWrongMarketOffered;
  @Input() primitiveProps = new PrimitivePropertyEvent();

  constructor() { }

  groupBetTypesCount: string[] = [];
  isShowDetailBetTypeCount = false;
  affectedTicketsModel = new AffectedTicketsModel();

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  public updateBetTypeCountModel() {
    this.groupBetTypesCount = [];
    const groupBetTypes = _.groupBy(this.logInfo.betTypeCount, item => `"${item.betTypeId}+${item.betId}"`);
      for (const key in groupBetTypes) {
        const values = groupBetTypes[key];
        let item = values[0].playerName ? `${values[0].betTypeName}:` : `${values[0].betTypeName} - ${values[0].ticketsCount} ticket(s)`;
        this.groupBetTypesCount.push(item);
      };
      
      this.affectedTicketsModel.groupBetTypesCount = this.groupBetTypesCount;
      this.affectedTicketsModel.tickets = new TicketsModel();
      this.affectedTicketsModel.isShowDetailBetTypeCount = true;
      this.affectedTicketsModel.isOpen = true;
  }
}
