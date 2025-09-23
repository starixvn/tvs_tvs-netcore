import { BetTeamAddRequestResult } from "../../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";

export class WrongMarketOfferedGetLogInfoQuery {
  id: number;
  matchId: number;
  subIssueTypeId: number;
  betTeamsResult: BetTeamAddRequestResult[];
  filterFromTransTime: string;
  filterToTransTime: string;
}