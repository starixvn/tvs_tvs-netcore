import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
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