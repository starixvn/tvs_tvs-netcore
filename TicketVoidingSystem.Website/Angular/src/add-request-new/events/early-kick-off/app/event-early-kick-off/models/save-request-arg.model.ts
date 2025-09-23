import { FilterModel } from "../../../../../component/filter/filter.model";
import { DateFullTimeNewComponent } from "../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component";
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from "../../../../../../utility/components/tooltip/tooltip.model";
import { ConfirmEarlyKickOffModel } from "../confirm-eko/confirm-eko.model";
import { LogInfoEarlyKickOff } from "./log-info-eko.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { PermissionAddRequest } from "../../../../../models/permission-add-request.model";
import { IssueTypes } from "../../../../../component/filter/issue-types.model";

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
  confirmEarlyKickOff: ConfirmEarlyKickOffModel;
  permission: PermissionAddRequest;
  issueTypes: IssueTypes;
}