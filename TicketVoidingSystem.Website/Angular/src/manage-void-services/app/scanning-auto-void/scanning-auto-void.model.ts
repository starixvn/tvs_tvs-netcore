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
    statusIdSelected: number;
}

export class UpdateAutoVoidRequestQueueModel {
    siteDbGroupId: number;
    queueId: number;
    statusId: number;
}

export const AUTO_VOID_REQUEST_QUEUE_STATUS_SELECTION = [
    {
        name: '0 - New',
        value: '0'
    },
    {
        name: '2 - Done',
        value: '2'
    },
    {
        name: '3 - Failed',
        value: '3'
    }
];