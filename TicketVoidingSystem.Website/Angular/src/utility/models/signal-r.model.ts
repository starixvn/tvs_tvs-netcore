export class SignalModel {
    messageContent: string;
}

export class RequestStatus {
    requestId: number;
    status: string;
    simpleInfo: RequestSimpleInfo;
}

export class RequestSimpleInfo {
    lastPerformedBy: string;
    totalSingleProcessed: number;
    totalParlayProcessed: number;
    totalCancelCashOutProcessed: number;
    totalResettleProcessed: number;
    matchId: number;
    requestDetailId: number;
}

export class Result {
    errorCode: number;
    errorMsg: string;
    isSuccessful: boolean;
    data: string;
}