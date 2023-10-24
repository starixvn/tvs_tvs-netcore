export class TicketViewModel {
    no: number;
    betId: string;
    subTransId: string;
    member: string;
    transDate: string;
    odds: string;
    stake: string;
    winLoss: string;
    currencyCode: string;
    status: string;
    secondAcceptFlag: string;
    choice: string;
    isDisable: boolean;
    isChecked: boolean;
    isCricket: boolean;
    soldId: string;
    mainTransId: string;
    isMarked: boolean;
    siteDbGroupId: number;

    constructor(
        no: number,
        betId: string,
        subTransId: string,
        member: string,
        transdate: string,
        odds: string,
        stake: string,
        winloss: string,
        currencyCode: string,
        status: string,
        secondAcceptFlag: string,
        choice: string,
        isDisable: boolean,
        isCricket: boolean,
        soldId: string,
        mainTransId: string,
        isMarked: boolean,
        siteDbGroupId: number) {
        this.no = no;
        this.betId = betId;
        this.subTransId = subTransId;
        this.member = member;
        this.transDate = transdate;
        this.odds = odds;
        this.stake = stake;
        this.winLoss = winloss;
        this.currencyCode = currencyCode;
        this.status = status;
        this.secondAcceptFlag = secondAcceptFlag;
        this.choice = choice;
        this.isDisable = isDisable;
        this.isCricket = isCricket;
        this.isChecked = !isDisable;
        this.soldId = soldId;
        this.mainTransId = mainTransId;
        this.isMarked = isMarked;
        this.siteDbGroupId = siteDbGroupId;
    }
}