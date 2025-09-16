import { LogInfoDetail } from "../../../../../../utility/models/log-info-detail.model";
import { LinkedLogsViewModel } from "../../../../../component/pool-house-ticket/linked-log/linked-log.model";
import { ValidationMessage } from "../../../../../models/get-log-info.model";
import { FilterWithHdpModel } from "./filter-with-hdp.model";

export class LogInfoWrongHdp {
  matchId: number;
  matchCode?: string;
  leagueName: string;
  isMainMatch: boolean;
  eventName: string;
  poolHouseCheckedBetTypes: string;
  filterWithHdp = new FilterWithHdpModel();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  linkedLogsViewModel: LinkedLogsViewModel;
  isShowValidation: boolean;
  eventDate?: Date;
  sportType: number;
}