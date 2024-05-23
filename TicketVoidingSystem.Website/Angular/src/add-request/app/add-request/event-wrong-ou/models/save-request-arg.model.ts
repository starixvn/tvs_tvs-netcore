import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { LogInfoWrongOuComponent } from "../log-info-wrong-ou/log-info-wrong-ou.component";
import { LogInfoWrongOu } from "./log-info-wrong-ou.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId: number;
  requestedBy: string;
  userId: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  primitiveProps: PrimitiveProperty;
  allEvents: LogInfoWrongOu[];
  mainEvent: LogInfoWrongOu;
  leagueEventWrongOuComponent: LeagueEventRedCardComponent;
  logInfoComponents: LogInfoWrongOuComponent[];
  addRequestStore: AddRequestStore;
}