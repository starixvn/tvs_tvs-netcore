import { AdvancedModeAddRequestComponent } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component";
import { EventLeagueComponent } from "../../../../../utility/components/event-league/event-league.component";
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { OthersModel } from "../../others/others.model";
import { FilterOtherIssuesComponent } from "../filter-other-issues/filter-other-issues.component";
import { LogInfoOtherIssues } from "./log-info-other-issues.model";
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
  logInfoEvent: LogInfoOtherIssues;
  eventLeagueComponent: EventLeagueComponent;
  filterOtherIssuesComponent: FilterOtherIssuesComponent;
  addRequestStore: AddRequestStore;
  advancedModeComponent: AdvancedModeAddRequestComponent;
  confirmAddRequest: ConfirmAddRequestModel;
  permission: PermissionAddRequest;
}