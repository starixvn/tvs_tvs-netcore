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
    totalVoidedSingle: number;
    totalVoidedParlay: number;
    totalCancelCashOut: number;
    matchId: number;
}

export class Result {
    errorCode: number;
    errorMsg: string;
    isSuccessful: boolean;
    data: string;
}