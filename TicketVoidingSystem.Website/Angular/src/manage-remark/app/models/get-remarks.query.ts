export class GetRemarksQuery {
  remarkId?: number;
  matchId?: number;
  fromDate?: string;
  toDate?: string;
  actionIds?: string;
  createdBy?: string;
  isExcludeTest?: boolean;
}