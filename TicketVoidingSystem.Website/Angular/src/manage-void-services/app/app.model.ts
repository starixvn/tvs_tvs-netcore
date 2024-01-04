export class SelectVoidBetAutomationInfoQuery {
    requestId: number;
    voidingHistoryId: number;
}

export class VoidBetAutomationModel {
    requestId: number;
    voidingHistoryId: number;
    statusId?: number;
    matchId?: number;
    isAutoVoid: boolean;
    isRunExternalService?: boolean;
    messageId?: number;
    messageIdSpecial?: number;
    reasonId?: number;
    isSentBatchMessage?: boolean;
    isSentMessageToAdminSite?: boolean;
    isInsertedVoidedTransaction?: boolean;
    isUpdatedVoidingHistory?: boolean;
    isSentEmail?: boolean;
    isSentLetsTalk?: boolean;
    isDeletedMessage?: boolean;
    isDeletedVoidedTransaction?: boolean;
}

export const SELECTION_ITEM = [
    {
        name: 'True',
        value: true
    },
    {
        name: 'Null',
        value: 'null'
    }
];

export class ServiceStatusConstant {
    static readonly New = 0;
    static readonly Running = 1;
    static readonly Done = 2;
    static readonly Failed = 3;
    static readonly VoidDone = 12;

    static readonly AfterVoidSelection = [
        { name: '1 - Running', value: ServiceStatusConstant.Running },
        { name: '2 - Done', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];

    static readonly AutoVoidRequestQueueSelection = [
        { name: '0 - New', value: ServiceStatusConstant.New },
        { name: '2 - Done', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];

    static readonly TicketVoidingQueueSelection = [
        { name: '1 - Running', value: ServiceStatusConstant.Running },
        { name: '2 - Done', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];

    static readonly VoidServiceSelection = [
        { name: '1 - Running', value: ServiceStatusConstant.Running },
        { name: '12 - Void Done', value: ServiceStatusConstant.VoidDone },
        { name: '2 - Done All', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];

    static readonly VoidingHistorySelection = [
        { name: '1 - Running', value: ServiceStatusConstant.Running },
        { name: '2 - Done', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];
    
    static readonly LetstalkSelection = [
        { name: '1 - Running', value: ServiceStatusConstant.Running },
        { name: '2 - Done', value: ServiceStatusConstant.Done },
        { name: '3 - Failed', value: ServiceStatusConstant.Failed }
    ];
}