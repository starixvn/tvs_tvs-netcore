export class CheckingPermissionModel {
    transIds: string;
    matchId: number;
    apikey: string;
    action: boolean;
    isCashOutAsUnSettledTicket: boolean;
    isCheckForTVS: boolean;

    setParam(transIds: string, matchId: number, apiKey: string, action: boolean, isCashOutAsUnSettledTicket: boolean, isCheckForTVS: boolean) {
        this.transIds = transIds;
        this.matchId = matchId;
        this.apikey = apiKey;
        this.action = action;
        this.isCashOutAsUnSettledTicket = isCashOutAsUnSettledTicket;
        this.isCheckForTVS = isCheckForTVS;
    }
}