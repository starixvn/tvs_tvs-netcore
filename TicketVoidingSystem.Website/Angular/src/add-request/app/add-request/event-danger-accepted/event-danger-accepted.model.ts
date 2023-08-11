import { Tooltip } from "../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../add-request.store";
import { PrimitiveProperty } from "../event-red-card/event-red-card.model";
import { FilterTimeWithAllowance } from "../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { LogInfoRedCard } from "../event-red-card/log-info-red-card/log-info-red-card.model";
import { FilterModel } from "../filter/filter.model";
import { ChildMatchModel } from "../models/related-event.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  allEvents: LogInfoRedCard[];
  mainEvent: LogInfoRedCard;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
  originalRelatedEvents: ChildMatchModel[];
}