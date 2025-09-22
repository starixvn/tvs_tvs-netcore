import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { BetTypeCountModel, ValidationMessage } from "../../models/get-log-info.model";
import { FilterNotParticipateModel } from "./filter-not-participate.model";

export class LogInfoNotParticipate {
  matchId: number;
  filterNotParticipates: FilterNotParticipateModel[] = [];
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  betTypeCount: BetTypeCountModel[];
}