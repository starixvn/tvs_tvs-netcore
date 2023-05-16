export class ConfirmAutoUnmarkViewModel {
    no?: number;
    matchId: string;
    kickOffTime: Date;
    sportName: string;
    event?: string;
    htScore: string;
    ftScore: string;
    userId: number;
    markedBy: string;
    bettype: number;
    betId?: number;
    bettypeName: string;
    totalItems?: number;
    isConfirm: boolean;
    markType: number;
    childMatchId?:  string;
}

export class GetDataForConfirmAutoUnmarkViewModel {
    items: Array<ConfirmAutoUnmarkViewModel>;
    totalItems: number;
}

export class UpdateConfirmAutoUnmark {
    matchId: string;
    betType: number;
    betId?: number;
    markedBy: number;
    childMatchId?:  string;
}

export class ConfirmAutoUnmarkQuery {
    matchId: string;
    sporttype: string;
    markedBy: string;
    isExcludeTest: boolean;
    pageIndex: number;
    pageSize: number;
}
