import { FilterModel } from '../../filter/filter.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../event-wrong-score.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';

export class GetLogInfoParams {
  isEdit: boolean;
  requestId: number;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  wrongScoreModels?: WrongScoreModel[];
  mainEvent?: LogInfoRelatedEvent;
  relatedEvents?: LogInfoRelatedEvent[];
  defaultFilterTimeWithAllowance?: FilterTimeWithAllowance;
}