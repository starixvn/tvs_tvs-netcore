import { Component, Input } from '@angular/core';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import * as _ from 'lodash';
import { AffectedTicketsModel, LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { TicketsModel } from '../../pool-house-ticket/tickets/tickets.model';
import { AddRequestApiService } from '../../add-request-api.service';

@Component({
  selector: 'log-info-wrong-market-offered',
  templateUrl: './log-info-wrong-market-offered.component.html',
  styleUrls: ['./log-info-wrong-market-offered.component.scss']
})
export class LogInfoWrongMarketOfferedComponent {
  @Input() isVoided: boolean;
  @Input() logInfo: LogInfoWrongMarketOffered;
  @Input() primitiveProps = new PrimitivePropertyEvent();
  @Input() issueTypeId: string;
 
  constructor(private readonly addRequestApiService: AddRequestApiService) { }

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
  }

  public async updateAffectedTickets(){
    if (this.logInfo.logInfoDetail.logInfoTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: this.logInfo.logInfoDetail.logInfoTicketsJson,
        issueTypeId: Number(this.issueTypeId)
      };

      this.affectedTicketsModel.tickets = await this.addRequestApiService.GetLogInfoTickets(query);
      this.affectedTicketsModel.tickets.groups[0].isExpanded = true;
      this.affectedTicketsModel.tickets.groups[0].tickets.forEach(x => x.isChecked = true);

    } else {
      this.affectedTicketsModel.tickets = new TicketsModel();
    }
  }

  public async showAffectedTicketsDetails(){
    this.updateBetTypeCountModel();
    await this.updateAffectedTickets();
    this.affectedTicketsModel.isOpen = true;
  }
}
