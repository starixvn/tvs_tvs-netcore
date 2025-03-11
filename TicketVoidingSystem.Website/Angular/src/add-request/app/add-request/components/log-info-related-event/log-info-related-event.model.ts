import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { TvDetectionModel } from '../tv-detection/tv-detection.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';

export class LogInfoRelatedEvent {
  matchId: number;
  matchCode?: string;
  leagueName: string;
  isMainMatch: boolean;
  eventName: string;
  subIssueTypeId: number;
  isCheckedVar?: boolean;
  isHighLightVarCheck?: boolean;
  voidTimeArea = new FilterTimeWithAllowance();
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
  tvDetectionModel = new TvDetectionModel();
  eventDate?: Date;
  sportType: number;
}