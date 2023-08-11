import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterWrongOddsComponent } from "../filter-wrong-odds/filter-wrong-odds.component";
import { LogInfoWrongOdds } from "./log-info-wrong-odds.model";
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
  logInfoEvent: LogInfoWrongOdds;
  leagueEventWrongOddsComponent: LeagueEventRedCardComponent;
  filterWrongOddsComponent: FilterWrongOddsComponent;
  addRequestStore: AddRequestStore;
}