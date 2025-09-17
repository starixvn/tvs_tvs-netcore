
import { FilterModel } from "../../../../../component/filter/filter.model";
import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { LogInfoEarlyKickOff } from "./log-info-eko.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { AddRequestStore } from "../../../../../services/add-request.store";

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