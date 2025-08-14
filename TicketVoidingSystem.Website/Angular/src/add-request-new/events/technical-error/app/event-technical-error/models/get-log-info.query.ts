import { BetTeamAddRequestResult } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";

export class TechnicalErrorGetLogInfoQuery {
  matchId: number;
  subIssueTypeId: number;
  betTeamsResult: BetTeamAddRequestResult[];
  filterFromTransTime: string;
  filterToTransTime: string;
}