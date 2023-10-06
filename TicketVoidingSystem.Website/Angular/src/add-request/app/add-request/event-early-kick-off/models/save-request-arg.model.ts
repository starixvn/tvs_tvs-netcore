import { DateFullTimeNewComponent } from "../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component";
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { LeagueEventRedCardComponent } from "../../event-red-card/league-event-red-card/league-event-red-card.component";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { LogInfoEarlyKickOff } from "./log-info-eko.model";
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
  allEvents: LogInfoEarlyKickOff[];
  leagueEventComponent: LeagueEventRedCardComponent;
  tooltip: Tooltip;
  kickOffTimeComponent: DateFullTimeNewComponent;
  addRequestStore: AddRequestStore;
  isSaveAndVoid: boolean;
}