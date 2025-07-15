import { LogInfoRelatedEvent } from "../../../add-request/app/add-request/components/log-info-related-event/log-info-related-event.model";
import { Tooltip } from "../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../services/add-request.store";
import { ChildMatchModel } from "./related-event.model";
import { FilterTimeWithAllowance } from "../../../add-request/app/add-request/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { PrimitiveProperty } from "../../../add-request/app/add-request/components/log-info-related-event/primitive-property.model";
import { FilterModel } from "../../../add-request-new/component/filter/filter.model";

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