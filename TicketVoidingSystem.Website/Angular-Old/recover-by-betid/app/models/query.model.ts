import { BetId } from '../../../internal/models/bet-id.model';

export class GetTicketsQuery {
    transIds: string;
}

export class RecoverTicketsQuery {
    tickets: BetId[];
    negativeBalanceUsers: string;
}