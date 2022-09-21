export class AutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    broadcastSessionId: string;
    action: string;
    requestId: number;
    matchId: number;
    statusId: number;
    errMsg: string;
}
export class AutoVoidRequestQueueViewModel extends AutoVoidRequestQueueModel {
    siteDbName: string;
}