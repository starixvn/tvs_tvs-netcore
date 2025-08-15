import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Item } from '../../../utility/models/item.model';
import { BetTypeCountModel, GroupBetTypeCountModel } from '../../models/get-log-info.model';
import { LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { AddRequestApiService } from '../../services/add-request-api.service';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

@Injectable()
export class AffectedTicketService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  async getAffectedTickets(issueTypeId: number, logInfoTicketsJson: string) {
    const ticketsLogInfo = new TicketsModel();
    if (logInfoTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: logInfoTicketsJson,
        issueTypeId: issueTypeId
      };
      const result = await this.addRequestApiService.GetLogInfoTickets(query);
      ticketsLogInfo.initData(result);
    }

    return ticketsLogInfo;
  }

  updateBetTypeCountModel(betTypeCount: BetTypeCountModel[]): GroupBetTypeCountModel[] {
    const groupBetTypesCount: GroupBetTypeCountModel[] = [];
    const groupBetTypes = _.groupBy(betTypeCount, item => `"${item.betTypeId}+${item.betId}"`);
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

      groupBetTypesCount.push(group);
    };

    return groupBetTypesCount;
  }
}
