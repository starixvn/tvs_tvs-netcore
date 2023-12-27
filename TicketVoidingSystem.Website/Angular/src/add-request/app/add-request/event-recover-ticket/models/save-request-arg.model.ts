import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { RecoverTicketModel } from "../../models/recover-ticket.model";
import { OthersModel } from "../../others/others.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  transIds: string;
  filter: FilterModel;
  filterBy: number;
  recoverTicketModel: RecoverTicketModel;
  others: OthersModel;
  addRequestStore: AddRequestStore;
  primitiveProps: PrimitiveProperty;
}