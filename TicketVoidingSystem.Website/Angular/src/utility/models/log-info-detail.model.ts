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
    minSingleTransId: string;
    maxSingleTransId: string;
    minMainParlayTransId: string;
    maxMainParlayTransId: string;
    highlightTransId?: string;
    highlightAcceptType?: number;
    scoreNormalTicket: string;
    scoreOfMatch: string;
}