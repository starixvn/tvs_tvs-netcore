import { DateFullTimeNewComponent } from "../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component";
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from "../../../../../utility/components/tooltip/tooltip.model";
import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { OthersModel } from "../../others/others.model";
import { ConfirmEarlyKickOffModel } from "../confirm-eko/confirm-eko.model";
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
  mainEvent: LogInfoEarlyKickOff;
  eventLeagueComponent: EventLeagueComponent;
  tooltip: Tooltip;
  kickOffTimeComponent: DateFullTimeNewComponent;
  addRequestStore: AddRequestStore;
  isSaveAndVoid: boolean;
  confirmEarlyKickOff: ConfirmEarlyKickOffModel;
  permission: PermissionAddRequest;
}