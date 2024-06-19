import { LinkedLogsViewModel } from "../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { FilterWrongOddsModel } from "./filter-wrong-odds.model";

export class LogInfoWrongOdds {
  matchId: number;
  isPoolHouseAffected: boolean;
  poolHouseCheckedBetTypes: string;
  filterWrongOdds = new FilterWrongOddsModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  linkedLogsViewModel: LinkedLogsViewModel;
  oddsInfo: OddsInfoModel;
}

export class OddsInfoModel {
  matchId: number;
  spread: number;
  allowanceRate: number;
  correctOddsHomeOver: number;
  correctOddsAwayUnder: number;
  fromOddsNotVoidHomeOver: number;
  toOddsNotVoidHomeOver	: number;
  fromOddsNotVoidAwayUnder: number;
  toOddsNotVoidAwayUnder: number;
}