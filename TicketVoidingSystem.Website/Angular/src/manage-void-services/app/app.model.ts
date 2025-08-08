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
    isDeletedZzzBetTrans?: boolean;
    isDeletedMessage?: boolean;
    isDeletedVoidedTransaction?: boolean;
    isSentToMTS?: boolean;
}

export interface Item {
    name: string;
    value: boolean | string | number;
}

export const SELECTION_ITEM: Item[] = [
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

    static readonly NewString = '0 - New';
    static readonly RunningString = '1 - Running';
    static readonly DoneString = '2 - Done';
    static readonly FailedString = '3 - Failed';
    static readonly VoidDoneString = '12 - Void Done';

    static readonly AfterVoidSelection = [
        { name: ServiceStatusConstant.RunningString, value: ServiceStatusConstant.Running },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];

    static readonly AutoVoidRequestQueueSelection = [
        { name: ServiceStatusConstant.NewString, value: ServiceStatusConstant.New },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];

    static readonly TicketVoidingQueueSelection = [
        { name: ServiceStatusConstant.RunningString, value: ServiceStatusConstant.Running },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];

    static readonly VoidServiceSelection = [
        { name: ServiceStatusConstant.RunningString, value: ServiceStatusConstant.Running },
        { name: ServiceStatusConstant.VoidDoneString, value: ServiceStatusConstant.VoidDone },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];

    static readonly VoidingHistorySelection = [
        { name: ServiceStatusConstant.RunningString, value: ServiceStatusConstant.Running },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];

    static readonly LetsTalkSelection = [
        { name: ServiceStatusConstant.RunningString, value: ServiceStatusConstant.Running },
        { name: ServiceStatusConstant.DoneString, value: ServiceStatusConstant.Done },
        { name: ServiceStatusConstant.FailedString, value: ServiceStatusConstant.Failed }
    ];
}