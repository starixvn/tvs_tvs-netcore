import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterNotParticipateComponent } from "../filter-not-participate/filter-not-participate.component";
import { LogInfoNotParticipate } from "./log-info-not-participate.model";
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
  logInfoEvent: LogInfoNotParticipate;
  leagueEventNotParticipateComponent: LeagueEventRedCardComponent;
  filterNotParticipateComponent: FilterNotParticipateComponent;
  addRequestStore: AddRequestStore;
}