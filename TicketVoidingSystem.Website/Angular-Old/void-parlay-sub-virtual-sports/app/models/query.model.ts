import { Message } from '../../../internal/components/messages/message';
import { BetId } from '../../../internal/models/bet-id.model';

export class GetTicketsQuery {
    matchId: number;
    betTypes: string;
    subTransIds: string;
    pageIndex: number;
    pageSize: number;
}

export class ExportExcelQuery extends GetTicketsQuery {
    matchCode: string;
    matchEvent: string;
    eventDate: Date;
}

export class VoidTicketsQuery {
    matchId: number;
    tickets: BetId[];
    userName: string;
    password: string;
    reason: string;
    reasonSC: string;
    message: Message;
}