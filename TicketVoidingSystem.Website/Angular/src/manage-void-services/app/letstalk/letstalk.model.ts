export class LetstalkModel {
  requestId: number;
  broadcastSessionId: string;
  statusId: number;
  createdDate: Date;
  modifiedDate: Date;
}

export class LetstalkViewModel extends LetstalkModel {
  statusIdSelected: number;
}

export class GetLetstalkModel {
  requestId: number;
  broadcastSessionId: string;
}

export class UpdateLetstalkModel {
  requestId: number;
  broadcastSessionId: string;
  statusId: number;
}