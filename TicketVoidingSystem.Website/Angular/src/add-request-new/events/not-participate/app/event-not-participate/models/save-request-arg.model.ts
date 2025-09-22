import { FilterModel } from "src/add-request-new/component/filter/filter.model";
import { EventLeagueComponent } from "../../../../../../utility/components/event-league/event-league.component";

import { ConfirmAddRequestModel } from "src/add-request-new/component/confirm-add-request/confirm-add-request.model";
import { OthersModel } from "src/add-request-new/component/others/others.model";
import { AddRequestStore } from "src/add-request-new/services/add-request.store";
import { FilterNotParticipateComponent } from "../filter-not-participate/filter-not-participate.component";
import { LogInfoNotParticipate } from "./log-info-not-participate.model";
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
  logInfoEvent: LogInfoNotParticipate;
  eventLeagueComponent: EventLeagueComponent;
  filterNotParticipateComponent: FilterNotParticipateComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}