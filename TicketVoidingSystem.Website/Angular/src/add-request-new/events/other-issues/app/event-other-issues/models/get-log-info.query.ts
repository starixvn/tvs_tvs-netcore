import { BetTeamAddRequestResult } from "../../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";

export class OtherIssuesGetLogInfoQuery {
  matchId: number;
  subIssueTypeId: number;
  filterFromTransTime: string;
  filterToTransTime: string;
  betTeamsResult: BetTeamAddRequestResult[];
}