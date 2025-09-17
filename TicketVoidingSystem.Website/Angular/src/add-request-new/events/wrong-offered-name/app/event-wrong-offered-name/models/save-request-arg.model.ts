import { EventLeagueComponent } from "../../../../../../utility/components/event-league/event-league.component";
import { AddRequestStore } from "../../../../../services/add-request.store";
import { ConfirmAddRequestModel } from "../../../../../component/confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { PermissionAddRequest } from "../../../../../models/permission-add-request.model";
import { OthersModel } from "../../../../../component/others/others.model";
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
  primitiveProps: PrimitiveProperty;
  logInfoEvent: LogInfoWrongOfferedName;
  eventLeagueComponent: EventLeagueComponent;
  filterWrongOfferedNameComponent: FilterWrongOfferedNameComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
  permission: PermissionAddRequest;
}