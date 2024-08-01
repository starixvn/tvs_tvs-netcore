import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

export class LiveGameEarlyTicketsQuery {
    liveGameEarlyTicketsJson: string;
    issueTypeId: number;
}

export class LiveGameEarlyTicketsModel {
    isOpen: boolean;
    checkedBetTypes: string;
    tickets: TicketsModel;
  }