import { Component, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { BetTypeCountModel, GroupBetTypeCountModel } from '../../../../add-request/app/add-request/models/get-log-info.model';
import { DateTimeFormat } from '../../../../utility/constants/config';
import { Item } from '../../../../utility/models/item.model';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';

@Component({
  selector: 'log-info-ticket-count',
  templateUrl: './log-info-ticket-count.component.html',
  styleUrls: ['./log-info-ticket-count.component.scss']
})
export class LogInfoTicketCountComponent implements OnInit {
  @Input() model: LogInfoDetail;
  @Input() isShowCancelCashOut: boolean;
  @Input() isShowBetTypeCount: boolean;
  @Input() betTypesCount: BetTypeCountModel[] = []

  groupBetTypesCountModel: GroupBetTypeCountModel[] = [];
  isShowDetaiBetTypeCount = false;

  ngOnInit(): void {
    if (this.isShowCancelCashOut) {
      this.updateBetTypeCountModel(this.betTypesCount);
    }
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public countInfoContent(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.countInfoContent(cashOutCount, settleCount, instantlySettleCount);
  }

  public isShowCountInfo(cashOutCount: number, settleCount: number, instantlySettleCount: number) {
    return StaticService.isShowCountInfo(cashOutCount, settleCount, instantlySettleCount);
  }

  private updateBetTypeCountModel(betTypeCountModel: BetTypeCountModel[]) {
    const groupBetTypes = _.groupBy(betTypeCountModel, item => `"${item.betTypeId}+${item.betId}"`);
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
      this.groupBetTypesCountModel.push(group);
    };
  }
}
