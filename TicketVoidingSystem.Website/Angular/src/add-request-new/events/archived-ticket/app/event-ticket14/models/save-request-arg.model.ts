import { FilterModel } from "../../../../../../add-request-new/component/filter/filter.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { EventTicket14Model } from "../../../../../../add-request-new/events/models/event-ticket-14.model";
import { OthersModel } from "../../../../../../add-request-new/component/others/others.model";
import { AddRequestStore } from "../../../../../../add-request-new/events/services/add-request.store";

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