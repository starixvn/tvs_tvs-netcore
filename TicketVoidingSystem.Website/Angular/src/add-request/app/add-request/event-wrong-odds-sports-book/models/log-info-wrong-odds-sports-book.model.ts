import { BetTeamAddRequestResult } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { BetTypeAddRequest } from "../../../../../utility/components/advanced-mode-add-request/group-bet-types/group-bet-types.model";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { FilterWrongOddsSportsBookModel } from "./filter-wrong-odds-sports-book.model";

export class LogInfoWrongOddsSportsBook {
  matchId: number;
  filterWrongOddsSportsBook = new FilterWrongOddsSportsBookModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  checkedBetTypes: BetTypeAddRequest[];
  betTeamsResult: BetTeamAddRequestResult[];

  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
}