import { Tooltip } from "../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../add-request.store";
import { FilterTimeWithAllowance } from "../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model";
import { LogInfoRelatedEvent } from "../components/log-info-related-event/log-info-related-event.model";
import { FilterModel } from "../filter/filter.model";
import { ChildMatchModel } from "./related-event.model";
import { PrimitiveProperty } from "../components/log-info-related-event/primitive-property,mdel";

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
  subIssueTypeId: string;
}