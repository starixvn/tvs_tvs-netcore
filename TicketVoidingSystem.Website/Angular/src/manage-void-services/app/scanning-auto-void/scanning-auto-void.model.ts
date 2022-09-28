export class AutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    requestId: number;
    matchId: number;
    action: string;
    statusId: number;
    errMsg: string;
    startTime: Date;
    execTime: Date;
    sportType: number;
    broadcastSessionId: string;
}

export class AutoVoidRequestQueueViewModel extends AutoVoidRequestQueueModel {
    siteDbName: string;
    statusIdSelected: number;
}

export class UpdateAutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    statusId: number;
}