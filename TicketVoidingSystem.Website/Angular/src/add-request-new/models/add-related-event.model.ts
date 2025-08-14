import { LogInfoRelatedEvent } from "../../add-request/app/add-request/components/log-info-related-event/log-info-related-event.model";
import { PrimitiveProperty } from "../../add-request/app/add-request/components/log-info-related-event/primitive-property.model";
import { FilterTimeWithAllowance } from "../../add-request/app/add-request/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { Tooltip } from "../../utility/components/tooltip/tooltip.model";
import { FilterModel } from "../component/filter/filter.model";
import { AddRequestStore } from "../services/add-request.store";
import { ChildMatchModel } from "./related-event.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterTimeWithAllowance: FilterTimeWithAllowance;
  allEvents: LogInfoRelatedEvent[];
  mainEvent: LogInfoRelatedEvent;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
  originalRelatedEvents: ChildMatchModel[];
}