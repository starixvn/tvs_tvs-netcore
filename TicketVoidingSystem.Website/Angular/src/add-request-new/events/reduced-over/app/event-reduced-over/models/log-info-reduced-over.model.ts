import { ValidationMessage } from 'src/add-request-new/models/get-log-info.model';
import { LogInfoDetail } from '../../../../../../utility/models/log-info-detail.model';
import { FilterReducedOverModel } from './filter-reduced-over.model';

export class LogInfoReducedOver {
  matchId: number;
  filterReducedOvers: FilterReducedOverModel[] = [];
  logInfoDetail = new LogInfoDetail();
  messageValidationLogInfo?: ValidationMessage[];
}