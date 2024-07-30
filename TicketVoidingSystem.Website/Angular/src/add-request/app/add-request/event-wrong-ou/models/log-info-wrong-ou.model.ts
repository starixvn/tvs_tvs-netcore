import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { ValidationMessage } from "../../models/get-log-info.model";
import { LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { FilterWrongOuModel } from "./filter-wrong-ou.model";

export class LogInfoWrongOu {
  matchId: number;
  matchCode?: string;
  leagueName: string;
  isMainMatch: boolean;
  eventName: string;
  isPoolHouseAffected: boolean;
  poolHouseCheckedBetTypes: string;
  filterWrongOu = new FilterWrongOuModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  linkedLogsViewModel: LinkedLogsViewModel;
  isShowValidation: boolean;
}