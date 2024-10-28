import { EventLeagueComponent } from "../../../../../utility/components/event-league/event-league.component";
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { IssueTypes } from "../../filter/issue-types.model";
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { OthersModel } from "../../others/others.model";
import { FilterWrongOfferedNameComponent } from "../filter-wrong-offered-name/filter-wrong-offered-name.component";
import { LogInfoWrongOfferedName } from "./log-info-wrong-offered-name.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId: number;
  requestedBy: string;
  userId: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  issueTypes: IssueTypes;
  primitiveProps: PrimitiveProperty;
  logInfoEvent: LogInfoWrongOfferedName;
  eventLeagueComponent: EventLeagueComponent;
  filterWrongOfferedNameComponent: FilterWrongOfferedNameComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
  permission: PermissionAddRequest;
}