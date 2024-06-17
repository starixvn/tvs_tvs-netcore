import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterWrongOddsComponent } from "../filter-wrong-odds/filter-wrong-odds.component";
import { LogInfoWrongOdds } from "./log-info-wrong-odds.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

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
  eventLeagueComponent: EventLeagueComponent;
  filterWrongOddsComponent: FilterWrongOddsComponent;
  addRequestStore: AddRequestStore;
}