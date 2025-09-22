import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { ValidationMessage } from '../../../../../models/get-log-info.model';
import { FilterReducedOverModel } from './filter-reduced-over.model';

export class LogInfoReducedOver {
  matchId: number;
  filterReducedOvers: FilterReducedOverModel[] = [];
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
}