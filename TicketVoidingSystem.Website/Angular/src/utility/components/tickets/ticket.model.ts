export class TicketModel {
    no: number;
    betId: string;
    value: string;
    member: string;
    transDate: string;
    betType: string;
    choice: string;
    stake: string;
    odds: string;
    winLoss: string;
    currency: string;
    handicap: string;
    score: string;
    status: string;
    secondAcceptFlag: string;
    isDisable: boolean;
    isChecked: boolean;
    isCricket: boolean;
    soldId: string;
    betdaqId: number;
    mainTransId: string;
    isMarked: boolean;
    siteDbGroupId: number;
    isHybrid: boolean;
    subTransId: string;

    constructor(item = null) {
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                this[key] = item[key];
            }
        }

        this.isChecked = !this.isDisable;
    }
}