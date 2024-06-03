import { AdvancedModeAddRequestComponent } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component";
import { EventLeagueComponent } from "../../../../../utility/components/event-league/event-league.component";
import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterTimeComponent } from "../filter-time/filter-time.component";
import { LogInfoWrongMarketOffered } from "./log-info-wrong-market-offered.model";
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
  logInfoEvent: LogInfoWrongMarketOffered;
  eventLeagueComponent: EventLeagueComponent;
  filterTimeComponent: FilterTimeComponent;
  advancedModeComponent: AdvancedModeAddRequestComponent;
  addRequestStore: AddRequestStore;
}