import { MatchViewModel } from '../../../internal/components/match-detail/match.viewmodel';
import { Message } from '../../../internal/components/messages/message';
import { BetId } from '../../../internal/models/bet-id.model';

export class FilterArea {
    matchId: number;
    licenseeNames: string;
    ticketType: string;
    currencyIds: string;
}

export class GetTicketQueryModel extends FilterArea {
    pageIndex: number;
    pageSize: number;
    isOutright: boolean;
}

export class VoidTicketQueryModel {
    matchId: number;
    licenseeNames: string;
    currencyIds: string;
    ticketType: string;
    tickets: BetId[];
    soldTransIds: string;
    cricketTransIds: BetId[];
    message: Message;
    userName: string;
    userPassword: string;
    reason: string;
    reasonSC: string;
    negativeBalanceUsers: string;
    match: MatchViewModel;
    voidFromTime?: string;
    voidToTime?: string;
    isOutright: boolean;
}
