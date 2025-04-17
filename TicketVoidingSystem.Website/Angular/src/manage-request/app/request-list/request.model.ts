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
  processingCopyDescriptionClass?: string;
  filterBy?: number;
  isStored: boolean;
}

export class DetailRequestModel {
  processingCopyDescriptionClass?: string;
  subIssueTypeId: number;
  matchId: number;
  requestDetailId: number;
  settlementStatus: string;
  description: string;
  totalSingleProcessed: number;
  totalParlayProcessed: number;
  totalCancelCashOutProcessed: number;
  totalResettleProcessed: number;
}
