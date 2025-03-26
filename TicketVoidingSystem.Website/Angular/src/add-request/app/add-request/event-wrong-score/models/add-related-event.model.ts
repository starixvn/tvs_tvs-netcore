import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { LogInfoRelatedEvent } from "../../components/log-info-related-event/log-info-related-event.model";
import { FilterTimeWithAllowance } from "../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { FilterModel } from "../../filter/filter.model";
import { WrongScoreModel } from "../../models/event-wrong-score.model";
import { PrimitiveProperty } from "../event-wrong-score.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  allEvents: LogInfoRelatedEvent[];
  mainEvent: WrongScoreModel;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
}