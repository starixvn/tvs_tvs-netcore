import { inject, Injectable } from '@angular/core';
import groupBy from 'lodash/groupBy';
import { Item } from '../../../utility/models/item.model';
import { BetTypeCountModel, GroupBetTypeCountModel } from '../../models/get-log-info.model';
import { LogInfoTicketsQuery } from '../../models/live-game-early-ticket.model';
import { AddRequestApiService } from '../../services/add-request-api.service';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';
import { TicketsService } from '../pool-house-ticket/tickets/tickets.service';

@Injectable()
export class AffectedTicketService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly ticketsService = inject(TicketsService);
  async getAffectedTickets(issueTypeId: number, logInfoTicketsJson: string) {
    if (logInfoTicketsJson) {
      const query: LogInfoTicketsQuery = {
        logInfoTicketsJson: logInfoTicketsJson,
        issueTypeId: issueTypeId
      };
      const result = await this.addRequestApiService.GetLogInfoTickets(query);
      const ticketsLogInfo = this.ticketsService.initData(result);
      return ticketsLogInfo;
    }

    return new TicketsModel();
  }

  updateBetTypeCountModel(betTypeCount: BetTypeCountModel[]): GroupBetTypeCountModel[] {
    const groupBetTypesCount: GroupBetTypeCountModel[] = [];
    const groupBetTypes = groupBy(betTypeCount, item => `"${item.betTypeId}+${item.betId}"`);
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
