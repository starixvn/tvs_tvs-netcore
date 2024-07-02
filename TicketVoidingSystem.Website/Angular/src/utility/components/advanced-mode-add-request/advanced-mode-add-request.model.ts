import { BetTeamAddRequestResult } from "./advanced-mode/advanced-mode.model";
import { BetTypeAddRequest } from "./group-bet-types/group-bet-types.model";

export class AdvancedModeAddRequestModel {
  betTeamsResult: BetTeamAddRequestResult[];
  checkedBetTypes: BetTypeAddRequest[];
}