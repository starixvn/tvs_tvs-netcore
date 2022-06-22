export class SignalModel {
    messageContent: string;
}

export class RequestStatus {
    RequestId: number;
    Status: string;
    SimpleInfo: RequestSimpleInfo;
}

export class RequestSimpleInfo {
    LastPerformedBy: string;
    TotalVoidedSingle: number;
    TotalVoidedParlay: number;
    MatchId: number;
}

export class Result {
    ErrorCode: number;
    ErrorMsg: string;
    IsSuccessful: boolean;
    Data: string;
}