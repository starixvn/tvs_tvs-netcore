import { Component, Input } from '@angular/core';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { PrimitivePropertyEvent } from '../models/primitive-property-event.model';
import { GroupBetTypeCountModel, BetTypeCountModel } from '../../models/get-log-info.model';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { Item } from '../../../../../utility/models/item.model';
import * as _ from 'lodash';

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

  groupBetTypesCountModel: GroupBetTypeCountModel[] = [];
  isShowDetailBetTypeCount = false;

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
    this.isShowDetailBetTypeCount = !this.isShowDetailBetTypeCount;
    if(!this.isShowDetailBetTypeCount){
      return;
    }
    if(this.groupBetTypesCountModel.length === 0){
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
        this.groupBetTypesCountModel.push(group);
      };
    }  
  }
}
