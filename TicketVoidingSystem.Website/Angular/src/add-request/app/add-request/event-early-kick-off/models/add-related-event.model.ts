
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { LogInfoEarlyKickOff } from "./log-info-eko.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  allEvents: LogInfoEarlyKickOff[];
  mainEvent: LogInfoEarlyKickOff;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
}