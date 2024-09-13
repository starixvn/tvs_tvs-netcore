
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { FilterWrongOddsModel } from "./filter-wrong-odds.model";

export class LogInfoWrongOdds {
  matchId: number;
  isPoolHouseAffected: boolean;
  poolHouseCheckedBetTypes: string;
  filterWrongOdds = new FilterWrongOddsModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  linkedLogsViewModel: LinkedLogsViewModel;
  isShowValidation: boolean;
  isSportTypeSoccer: boolean;
}
