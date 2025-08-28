import { FilterModel } from "../../../../../component/filter/filter.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { EventTicket14Model } from "../../../../../models/event-ticket-14.model";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  transIds: string;
  filter: FilterModel;
  filterBy: number;
  eventTicket14Model: EventTicket14Model;
  others: OthersModel;
  addRequestStore: AddRequestStore;
  primitiveProps: PrimitiveProperty;
}