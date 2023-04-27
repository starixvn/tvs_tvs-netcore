export class LogInfoDetail {
    matchId: number;
    liveScores: string;
    voidFromTime: Date;
    voidToTime: Date;
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
    // Wrong HDP/1stHDP
    liveGameEarlySingleCount?: number;
    liveGameEarlyCashOutCount?: number;
    liveGameEarlySettleCount?: number;
    poolHouseSingleCount?: number;
    poolHouseCashOutCount?: number;
    poolHouseSettleCount?: number;
    poolHouseMainParlayCount?: number;
    poolHouseInstantlySettleCount?: number;
}