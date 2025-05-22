export class LetsTalkModel {
  requestId: number;
  broadcastSessionId: string;
  statusId: number;
  createdDate: Date;
  modifiedDate: Date;
}

export class LetsTalkViewModel extends LetsTalkModel {
  statusIdSelected: number;
}

export class GetLetsTalkModel {
  requestId: number;
  broadcastSessionId: string;
}

export class UpdateLetsTalkModel {
  requestId: number;
  broadcastSessionId: string;
  statusId: number;
}