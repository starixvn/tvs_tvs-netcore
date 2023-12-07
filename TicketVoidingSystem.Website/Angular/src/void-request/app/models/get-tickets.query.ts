import { CheckedBetType } from '../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model';
import { MatchModel } from '../../../utility/models/match.model';

export class GetTicketsQuery {
  pageIndex: number;
  pageSize: number;
  match: MatchModel;
  requestId?: number;
  issueTypeId: number;
  subIssueTypeId: number;
  betTypes?: CheckedBetType[];
  transInfoJson?: string; // only use for EKO search tickets
}
