import { AdvancedModeAddRequestComponent } from "../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component";
import { EventLeagueComponent } from "../../../../../utility/components/event-league/event-league.component";
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { FilterTimeTechnicalErrorComponent } from "../filter-time-technical-error/filter-time-technical-error.component";
import { LogInfoTechnicalError } from "./log-info-technical-error.model";
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
  logInfoEvent: LogInfoTechnicalError;
  eventLeagueComponent: EventLeagueComponent;
  filterTimeComponent: FilterTimeTechnicalErrorComponent;
  advancedModeComponent: AdvancedModeAddRequestComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}