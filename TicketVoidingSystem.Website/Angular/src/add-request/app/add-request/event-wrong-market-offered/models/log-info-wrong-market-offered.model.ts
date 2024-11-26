import { BetTeamAddRequestResult } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode/advanced-mode.model";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { Selection } from '../../../../../utility/models/selection.model';
import { BetTypeCountModel, ValidationMessage } from "../../models/get-log-info.model";
import { FilterWrongMarketOfferedModel } from "./filter-wrong-market-offered.model";

export class LogInfoWrongMarketOffered {
  matchId: number;
  filterWrongMarketOfferedModels: FilterWrongMarketOfferedModel[] = [];
  logInfoItems: LogInfoItem[] = [];
  betTeamsResult: BetTeamAddRequestResult[];
  allBetTypesSelection: Selection[];
}

export class LogInfoItem {
  id: number;
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  betTypeCount: BetTypeCountModel[];
}