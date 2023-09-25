import { BetId } from '../../../internal/models/bet-id.model';

export class CheckingPermissionModel {
    tickets: BetId[];
    cashOutTransIds: string;
    matchId: number;
    apikey: string;
    isCashOutAsUnSettledTicket: boolean;

    setParam(tickets: BetId[], matchId: number, cashOutTransIds: string, apiKey: string, isCashOutAsUnSettledTicket: boolean) {
        this.tickets = tickets;
        this.matchId = matchId;
        this.cashOutTransIds = cashOutTransIds;
        this.apikey = apiKey;
        this.isCashOutAsUnSettledTicket = isCashOutAsUnSettledTicket;
    }
}
