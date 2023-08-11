import { LogInfoDetail } from '../../../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';

export class LogInfoRedCard {
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
}