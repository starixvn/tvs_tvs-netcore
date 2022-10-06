export class VoidingHistoryModel {
  voidingHistoryId: number;
  statusId: number;
  requestId: number;
  messageId: number;
  reasonId: number;
  userId: number;
  createdDate?: Date;
  modifiedDate?: Date;
  voidData: string;
  transIds: string;
  minWinLostDate?: Date;
  maxWinLostDate?: Date;
}

export class VoidingHistoryViewModel extends VoidingHistoryModel {
  statusIdSelected: number;
}

export class UpdateVoidingHistory {
  voidingHistoryId: number;
  statusId: number;
}
