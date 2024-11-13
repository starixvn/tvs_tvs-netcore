import { BetTeamAddRequestResult } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { Selection } from "../../../../../utility/models/selection.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { FilterOtherIssuesModel } from "./filter-other-isssues.model";

export class LogInfoOtherIssues {
  matchId: number;
  filterOtherIssues = new FilterOtherIssuesModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  betTeamsResult: BetTeamAddRequestResult[];
  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
  allBetTypesSelection: Selection[];
}