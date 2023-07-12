import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { ChildMatchModel } from "../../models/related-event.model";
import { FilterWrongOuModel } from "./filter-wrong-ou.model";
import { LogInfoWrongOu } from "./log-info-wrong-ou.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterWrongOuModel: FilterWrongOuModel;
  allEvents: LogInfoWrongOu[];
  mainEvent: LogInfoWrongOu;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
  originalRelatedEvents: ChildMatchModel[];
}