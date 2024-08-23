import { TicketsModel } from '../pool-house-ticket/tickets/tickets.model';

export class LogInfoTicketsQuery {
    logInfoTicketsJson: string;
    issueTypeId: number;
}

export class AffectedTicketsModel {
    isOpen: boolean;
    tickets: TicketsModel;
    groupBetTypesCount: string[];
    isShowDetailBetTypeCount: boolean;
}