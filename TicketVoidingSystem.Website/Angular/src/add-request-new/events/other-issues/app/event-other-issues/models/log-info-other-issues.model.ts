import { BetTypeCountModel, ValidationMessage } from "src/add-request-new/models/get-log-info.model";
import { BetTeamAddRequestResult } from "src/utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { LogInfoDetail } from "src/utility/models/log-info-detail.model";
import { Selection } from "src/utility/models/selection.model";
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
  betTypeCount?: BetTypeCountModel[];
}