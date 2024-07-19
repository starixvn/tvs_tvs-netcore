import { TicketsModel } from '../../../../manage-request/app/ticket-list/tickets/tickets.model';

export class LiveGameEarlyTicketsRequest {
    liveGameEarlyTicketsJson: string;
    pageIndex: number;
    pageSize: number;
    issueTypeId: number;
}

export class LiveGameEarlyTicketsModel {
    isOpen: boolean;
    checkedBetTypes: string;
    query: LiveGameEarlyTicketsRequest;
    tickets: TicketsModel;
  }