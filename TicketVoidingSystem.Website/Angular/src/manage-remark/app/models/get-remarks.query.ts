export class GetRemarksQuery {
  remarkId?: number;
  matchId?: number;
  fromDate?: string;
  toDate?: string;
  action?: string;
  createdBy?: string;
  isExcludeTest?: boolean;
}