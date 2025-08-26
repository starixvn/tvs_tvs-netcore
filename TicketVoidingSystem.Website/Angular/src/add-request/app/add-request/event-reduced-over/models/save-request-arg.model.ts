import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterReducedOverComponent } from "../filter-reduced-over/filter-reduced-over.component";
import { LogInfoReducedOver } from "./log-info-reduced-over.model";
import { PrimitivePropertyEvent } from "./primitive-property-event.model";

export class SaveRequestArg {
  requestId: number;
  requestedBy: string;
  userId: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  primitiveProps: PrimitivePropertyEvent;
  logInfoEvent: LogInfoReducedOver;
  eventLeagueComponent: EventLeagueComponent;
  filterReducedOverComponent: FilterReducedOverComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}