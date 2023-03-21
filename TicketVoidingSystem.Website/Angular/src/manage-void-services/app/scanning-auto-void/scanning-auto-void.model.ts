export class AutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    requestIds: string;
    matchId: number;
    action: string;
    statusId: number;
    errMsg: string;
    createdDate?: Date;
    modifiedDate?: Date;
    broadcastSessionId: string;
}

export class AutoVoidRequestQueueViewModel extends AutoVoidRequestQueueModel {
    siteDbName: string;
    statusIdSelected: number;
}

export class GetAutoVoidRequestQueueModel {
    broadcastSessionId?: string;
    statusId?: number;
}

export class UpdateAutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    statusId: number;
}