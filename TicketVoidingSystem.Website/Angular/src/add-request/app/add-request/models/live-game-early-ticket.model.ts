import { TicketsModel } from '../../../../utility/components/pool-house-ticket/tickets/tickets.model';

export class LiveGameEarlyTicketsQuery {
    liveGameEarlyTicketsJson: string;
    pageIndex: number;
    pageSize: number;
    issueTypeId: number;
}

export class LiveGameEarlyTicketsModel {
    isOpen: boolean;
    checkedBetTypes: string;
    query: LiveGameEarlyTicketsQuery;
    tickets: TicketsModel;
  }