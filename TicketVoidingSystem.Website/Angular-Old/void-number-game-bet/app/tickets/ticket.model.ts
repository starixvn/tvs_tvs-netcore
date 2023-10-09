export class TicketModel {
    no: number;
    betId: string;
    member: string;
    transDate: string;
    betType: string;
    odds: string;
    stake: string;
    winLost: string;
    currencyName: string;
    status: string;
    creator: string;
    ballSequence: number;
    choice: string;
    isChecked: boolean;
    isDisable: boolean;
    siteDbGroupId: number;

    constructor(
        no: number,
        betId: string,
        member: string,
        transDate: string,
        betType: string,
        odds: string,
        stake: string,
        winLost: string,
        currencyName: string,
        status: string,
        creator: string,
        ballSequence: number,
        choice: string,
        isDisable: boolean,
        siteDbGroupId: number) {
        this.no = no;
        this.betId = betId;
        this.member = member;
        this.transDate = transDate;
        this.betType = betType;
        this.odds = odds;
        this.stake = stake;
        this.winLost = winLost;
        this.currencyName = currencyName;
        this.status = status;
        this.creator = creator;
        this.ballSequence = ballSequence;
        this.choice = choice;
        this.isDisable = isDisable;
        this.isChecked = !isDisable;
        this.siteDbGroupId = siteDbGroupId;
    }
}