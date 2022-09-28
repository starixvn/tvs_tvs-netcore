export class VoidServiceModel {
    broadcastSessionId: string;
    siteDbGroupId: number;
    requestId: number;
    voidingHistoryId: number;
    statusId: number;
    isAutoVoid: boolean;
    matchId: number;
    createdDate: Date;
    modifiedDate: Date;
}

export class VoidServiceViewModel extends VoidServiceModel {
    statusIdSelected: number;
}

export class UpdateVoidServiceModel {
    siteDbGroupId: number;
    requestId: number;
    voidingHistoryId: number;
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