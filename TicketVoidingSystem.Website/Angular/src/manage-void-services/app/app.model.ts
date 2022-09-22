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
    reasonId?: number;
    isSentBatchMessage?: boolean;
    isSentMessageToAdminSite?: boolean;
    isInsertedVoidedTransaction?: boolean;
    isUpdatedVoidingHistory?: boolean;
    isSentEmail?: boolean;
    isSentLetsTalk?: boolean;
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

export const VOID_BET_AUTO_STATUS_ITEM = [
    {
        name: '1 - Running',
        value: '1'
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