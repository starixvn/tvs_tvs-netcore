import { ConfirmAddRequestModel } from "src/add-request-new/component/confirm-add-request/confirm-add-request.model";
import { FilterModel } from "src/add-request-new/component/filter/filter.model";
import { OthersModel } from "src/add-request-new/component/others/others.model";
import { PermissionAddRequest } from "src/add-request-new/models/permission-add-request.model";
import { AddRequestStore } from "src/add-request-new/services/add-request.store";
import { AdvancedModeAddRequestComponent } from "src/utility/components/advanced-mode-add-request/advanced-mode-add-request.component";
import { EventLeagueComponent } from "src/utility/components/event-league/event-league.component";
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