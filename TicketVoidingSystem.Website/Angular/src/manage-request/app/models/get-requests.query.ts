export class GetRequestsQuery {
  requestId?: string;
  matchId?: number;
  fromDate: string;
  toDate: string;
  issueTypeId: string;
  subIssueType?: string;
  status: string;
  isExcludeTest: boolean;
  isFromDateBeforeBUDay?: boolean;
  isToDateBeforeBUDay?: boolean;
  bUDay: string;
  createdBy: string;
  productTypeIds: string;
}
