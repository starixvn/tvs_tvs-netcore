import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterReducedOverComponent } from "../filter-reduced-over/filter-reduced-over.component";
import { LogInfoReducedOver } from "./log-info-reduced-over.model";
import { PrimitivePropertyEvent } from "./primitive-property-event.model";
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

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
}