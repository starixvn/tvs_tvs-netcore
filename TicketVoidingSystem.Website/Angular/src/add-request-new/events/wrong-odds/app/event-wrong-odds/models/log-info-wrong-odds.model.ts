import { LogInfoDetail } from "../../../../../../utility/models/log-info-detail.model";
import { LinkedLogsViewModel } from "../../../../../component/pool-house-ticket/linked-log/linked-log.model";
import { ValidationMessage } from "../../../../../models/get-log-info.model";
import { FilterWrongOddsModel } from "./filter-wrong-odds.model";

export class LogInfoWrongOdds {
  matchId: number;
  poolHouseCheckedBetTypes: string;
  filterWrongOdds = new FilterWrongOddsModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  linkedLogsViewModel: LinkedLogsViewModel;
  isShowValidation: boolean;
  sportType: number;
}
