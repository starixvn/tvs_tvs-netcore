export class VoidServiceModel {
    broadcastSessionId: string;
    siteDbGroupId: number;
    requestId: number;
    voidingHistoryId: number;
    statusId: number;
    isAutoVoid: boolean;
    matchId: number;
    createdDate?: Date;
    modifiedDate?: Date;
}

export class VoidServiceViewModel extends VoidServiceModel {
    statusIdSelected: number;
}

export class GetVoidServiceModel {
    broadcastSessionId?: string;
    requestId?: number;
}

export class UpdateVoidServiceModel {
    siteDbGroupId: number;
    requestId: number;
    voidingHistoryId: number;
    statusId: number;
}