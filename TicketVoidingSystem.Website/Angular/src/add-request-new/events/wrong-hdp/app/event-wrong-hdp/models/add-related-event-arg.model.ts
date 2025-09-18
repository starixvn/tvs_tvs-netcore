import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { ChildMatchModel } from "../../../../../models/related-event.model";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { FilterWithHdpModel } from "./filter-with-hdp.model";
import { LogInfoWrongHdp } from "./log-info-wrong-hdp.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class AddRelatedEventArg {
  tooltip: Tooltip;
  requestId: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  defaultFilterWithHdpModel: FilterWithHdpModel;
  allEvents: LogInfoWrongHdp[];
  mainEvent: LogInfoWrongHdp;
  addRequestStore: AddRequestStore;
  inputMatchIdClass: string;
  originalRelatedEvents: ChildMatchModel[];
}