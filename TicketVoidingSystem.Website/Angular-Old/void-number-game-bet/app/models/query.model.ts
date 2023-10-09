import { Message } from '../../../internal/components/messages/message';
import { BetId } from '../../../internal/models/bet-id.model';

export class Filter {
    matchId: number;
    fromTransDate: string;
    toTransDate: string;
    betTypes: string;
    option: boolean;
    ballSequence: string;
}

export class GetTicketsQuery extends Filter {
    transIds: string;
    pageIndex: number;
    pageSize: number;
}

export class VoidTicketsQuery extends Filter {
    tickets: BetId[];
    userName: string;
    userPwd: string;
    reason: string;
    reasonSC: string;
    message: Message;
    isSendMessage: boolean;
    negativeBalanceUsers: string;
}