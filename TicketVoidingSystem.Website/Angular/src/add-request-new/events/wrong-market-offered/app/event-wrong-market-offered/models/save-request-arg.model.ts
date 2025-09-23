import { AddRequestStore } from "../../../../../services/add-request.store";
import { AdvancedModeAddRequestComponent } from "../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component";
import { EventLeagueComponent } from "../../../../../../utility/components/event-league/event-league.component";
import { FilterTimeComponent } from "../filter-time/filter-time.component";
import { LogInfoWrongMarketOffered } from "./log-info-wrong-market-offered.model";
import { PrimitivePropertyEvent } from "./primitive-property-event.model";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { ConfirmAddRequestModel } from "../../../../../component/confirm-add-request/confirm-add-request.model";
import { IssueTypes } from "../../../../../component/filter/issue-types.model";

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
  confirmAddRequest: ConfirmAddRequestModel;
  issueTypes: IssueTypes;
}