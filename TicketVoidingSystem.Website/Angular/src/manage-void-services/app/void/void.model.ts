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
  totalTicket: number;
  voidingTypeId: number;
  issueTypeId: number;
  negativeBalanceUsers: string;
  failedTransIds: string;
}

export class TicketVoidingQueueViewModel extends TicketVoidingQueueModel {
  siteDbName: string;
  statusIdSelected: number;
}

export const VOIDING_QUEUE_STATUS_SELECTION = [
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