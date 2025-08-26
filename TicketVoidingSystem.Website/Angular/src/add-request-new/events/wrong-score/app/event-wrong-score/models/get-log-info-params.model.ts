import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../../../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { PrimitiveProperty } from '../event-wrong-score.model';

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