export class TicketModel {
    no: number;
    betId: string;
    member: string;
    transDate: string;
    winLoss: string;
    odds: string;
    stake: string;
    status: string;
    choice: string;
    subTransId: string;
    isChecked: boolean;
    isDisable: boolean;
    siteDbGroupId: number;

    constructor(
        no: number,
        betId: string,
        member: string,
        transDate: string,
        winLoss: string,
        odds: string,
        stake: string,
        status: string,
        choice: string,
        subTransId: string,
        isDisable: boolean,
        siteDbGroupId: number) {
        this.no = no;
        this.betId = betId;
        this.member = member;
        this.transDate = transDate;
        this.winLoss = winLoss;
        this.odds = odds;
        this.stake = stake;
        this.status = status;
        this.choice = choice;
        this.subTransId = subTransId;
        this.isDisable = isDisable;
        this.isChecked = !isDisable;
        this.siteDbGroupId = siteDbGroupId;
    }
}