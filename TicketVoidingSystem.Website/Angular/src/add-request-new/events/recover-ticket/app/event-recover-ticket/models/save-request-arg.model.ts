import { BetIdsComponent } from "../../../../../../utility/components/bet-ids/bet-ids.component";
import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { RecoverTicketModel } from "../../../../../models/recover-ticket.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  transIds: string;
  filter: FilterModel;
  filterBy: number;
  recoverTicketModel: RecoverTicketModel;
  others: OthersModel;
  betIdsComponent: BetIdsComponent;
  addRequestStore: AddRequestStore;
  primitiveProps: PrimitiveProperty;
  tooltip: Tooltip;
}