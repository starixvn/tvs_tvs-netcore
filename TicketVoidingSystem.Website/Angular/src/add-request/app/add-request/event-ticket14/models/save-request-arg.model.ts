import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { EventTicket14Model } from "../../models/event-ticket-14.model";
import { OthersModel } from "../../others/others.model";
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