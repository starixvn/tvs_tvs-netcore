export class AutoVoidRequestQueueModel {
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