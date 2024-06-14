import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { LogInfoWrongHdpComponent } from "../log-info-wrong-hdp/log-info-wrong-hdp.component";
import { LogInfoWrongHdp } from "./log-info-wrong-hdp.model";
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
  allEvents: LogInfoWrongHdp[];
  mainEvent: LogInfoWrongHdp;
  leagueEventWrongHdpComponent: LeagueEventRedCardComponent;
  logInfoComponents: LogInfoWrongHdpComponent[];
  addRequestStore: AddRequestStore;
}