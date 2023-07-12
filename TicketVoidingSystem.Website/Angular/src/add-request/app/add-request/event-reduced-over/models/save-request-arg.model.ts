import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
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
  leagueEventReducedOverComponent: LeagueEventRedCardComponent;
  filterReducedOverComponent: FilterReducedOverComponent;
  addRequestStore: AddRequestStore;
}