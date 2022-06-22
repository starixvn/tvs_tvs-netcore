export class CommonTicketModel {
    no: number;
    betId: string;
    value: number;
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
    isDisable: boolean;
    isChecked: boolean;
    isCricket: boolean;
    soldId: number;
    mainTransId: number;

    constructor(item = null) {
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                this[key] = item[key];
            }
        }

        this.isChecked = !this.isDisable;
    }
}
