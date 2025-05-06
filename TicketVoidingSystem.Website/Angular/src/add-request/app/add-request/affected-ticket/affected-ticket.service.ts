import { inject, Injectable } from '@angular/core';
import { AddRequestApiService } from '../add-request-api.service';
import { LogInfoTicketsQuery } from '../models/live-game-early-ticket.model';
import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

@Injectable()
export class AffectedTicketService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public async getAffectedTickets(issueTypeId: number, logInfoTicketsJson: string) {
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
}
