import { CheckedBetType } from "../../../utility/components/advanced-mode/advanced-mode/advanced-mode.model";
import { MatchModel } from "../../../utility/models/match.model";

export class GetTicketsQuery {
  pageIndex: number;
  pageSize: number;
  match: MatchModel;
  kickOffDate: string;
  requestId?: number;
  issueTypeId: number;
  subIssueTypeId: number;
  betTypes?: CheckedBetType[];
  actionId?: number;
  transInfoJson?: string; // only use for EKO search tickets
}