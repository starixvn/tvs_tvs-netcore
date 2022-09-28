export class TicketVoidingQueueModel {
  siteDbGroupId: number;
  queueId: number;
  requestId: number;
  matchId: number;
  voidingHistoryId: number;
  statusId: number;
  transIds: string;
  userId: number;
  startTime: Date;
  execTime: Date;
  duration: number;
  voidingTypeId: number;
  totalTicket: number;
  errMsg: string;
  negativeBalanceUsers: string;
  failedTransIds: string;
  issueTypeId: number;
}

export class TicketVoidingQueueViewModel extends TicketVoidingQueueModel {
  siteDbName: string;
  statusIdSelected: number;
}

export class FailedVoidingQueueViewModel {
  siteDbName: string;
  siteDbGroupId: number;
  queueIds: string;
}

export class UpdateTicketVoidingQueueModel {
  siteDbGroupId: number;
  queueIds: string;
  statusId: number;
}
