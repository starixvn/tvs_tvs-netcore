import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { Message } from '../../../utility/components/template-message/messages/message';
import { BetID } from '../../../utility/models/bet-id.model';
import { MatchModel } from '../../../utility/models/match.model';

export class FilterParams {
    matchId: number;
    match: MatchModel;
    ticketType: string;
    eventType: string;
    oddsType: string;
    oddsValue: string;
    liveHomeScore: string;
    liveAwayScore: string;
    fromTransDate?: string;
    toTransDate?: string;
    settledType: string;
    betTypes: CheckedBetType[];
    bet: string;
    timeType: number;
    voidFromTime?: string;
    voidToTime?: string;
    selectionSubParlays: string;
    isCheckTime: boolean;
}

export class GetTicketsQuery extends FilterParams {
    pageIndex: number;
    pageSize: number;
    invalidTransDate: boolean;
}

export class VoidTicketsQuery extends FilterParams {
    tickets: BetID[];
    transIdCrickets: BetID[];
    message: Message;
    userName: string;
    userPassword: string;
    reason: string;
    reasonSC: string;
    guid?: string;
}

export class CheckVoidBetPermissionQuery {
    transIds: string;
    matchId: number;
    apikey?: string;
}