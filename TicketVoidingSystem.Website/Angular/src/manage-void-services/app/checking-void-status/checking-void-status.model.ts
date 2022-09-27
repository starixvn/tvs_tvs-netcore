export class VoidServiceModel {
    siteDbGroupId: number;
    queueId: number;
    broadcastSessionId: string;
    action: string;
    requestId: number;
    matchId: number;
    statusId: number;
    errMsg: string;
    sportType: number;
}

export class VoidServiceViewModel extends VoidServiceModel {
    siteDbName: string;
    statusIdSelected: number;
}

export class UpdateVoidServiceModel {
    siteDbGroupId: number;
    queueId: number;
    statusId: number;
}

export const VOID_SERVICE_STATUS_SELECTION = [
    {
        name: '1 - Running',
        value: '1'
    },
    {
        name: '12 - Void Done',
        value: '12'
    },
    {
        name: '2 - Done All',
        value: '2'
    },
    {
        name: '3 - Failed',
        value: '3'
    }
];