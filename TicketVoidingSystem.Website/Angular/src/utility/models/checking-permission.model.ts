import { BetID } from './bet-id.model';

export class CheckingPermissionModel {
    tickets: BetID[];
    matchId: number;
    apikey: string;
    action: boolean;
    isCashOutAsUnSettledTicket: boolean;
    isCheckForTVS: boolean;

    setParam(tickets: BetID[], matchId: number, apiKey: string, action: boolean, isCashOutAsUnSettledTicket: boolean, isCheckForTVS: boolean) {
        this.tickets = tickets;
        this.matchId = matchId;
        this.apikey = apiKey;
        this.action = action;
        this.isCashOutAsUnSettledTicket = isCashOutAsUnSettledTicket;
        this.isCheckForTVS = isCheckForTVS;
    }
}