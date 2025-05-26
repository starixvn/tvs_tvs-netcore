export class LogInfoDetail {
    matchId: number;
    liveScores: string;
    voidFromTime: Date;
    voidToTime: Date;
    transVoidToTime: Date;
    singleCount: number;
    cashOutCount: number;
    settleCount: number;
    instantlySettleCount: number;
    mainParlayCount: number;
    cancelCashOutCount: number;
    highlightMinTime?: Date;
    highlightAcceptType?: number;
    scoreNormalTicket: string;
    scoreOfMatch: string;
    poolHouseSingleCount?: number;
    poolHouseCashOutCount?: number;
    poolHouseSettleCount?: number;
    poolHouseMainParlayCount?: number;
    poolHouseInstantlySettleCount?: number;
    minTransId: string;
    actionType: string;
    isHasWarningRangeTime?: boolean;
    logInfoTicketsJson?: string;
}