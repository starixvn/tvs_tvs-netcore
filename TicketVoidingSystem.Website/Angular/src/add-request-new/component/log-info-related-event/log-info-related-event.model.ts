import { LogInfoDetail } from '../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../events/models/get-log-info.model';
import { FilterTimeWithAllowance } from '../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { TvDetectionModel } from '../tv-detection/tv-detection.model';

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
  parentId?: number;
}

export class BaseLogInfoQuery {
  filterFromTransTime: string;
  filterToTransTime: string;
  matchId: number;
  filterBy: number;
  subIssueTypeId: number;
  aaTime: number;
  paTime: number;
  saTime: number;
}