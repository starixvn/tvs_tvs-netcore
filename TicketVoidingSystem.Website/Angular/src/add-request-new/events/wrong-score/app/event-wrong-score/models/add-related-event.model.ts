import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { LogInfoRelatedEvent } from "../../../../../component/log-info-related-event/log-info-related-event.model";
import { FilterTimeWithAllowance } from "../../../../../events/red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { PrimitiveProperty } from "../event-wrong-score.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  relatedEvents: LogInfoRelatedEvent[];
  mainEvent: LogInfoRelatedEvent;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
}