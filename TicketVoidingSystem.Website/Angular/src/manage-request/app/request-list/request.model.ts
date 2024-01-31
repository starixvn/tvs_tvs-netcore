export class RequestsModel {
  requests: RequestModel[];
  total: number;
}

export class RequestModel {
  requestId: number;
  issueTypeId: number;
  actionId: number;
  createdBy: string;
  createdDate: Date;
  mistakenBy: string;
  decidedBy: string;
  lastPerformedBy: string;
  checkedBy: string;
  isCheckedBy: boolean;
  eventDate: Date;
  status: string;
  details: DetailRequestModel[];
}

export class DetailRequestModel {
  subIssueTypeId: number;
  matchId: number;
  settlementStatus: string;
  description: string;
  totalSingleProcessed: number;
  totalParlayProcessed: number;
  totalCancelCashOutProcessed: number;
  totalResettleProcessed: number;
}
