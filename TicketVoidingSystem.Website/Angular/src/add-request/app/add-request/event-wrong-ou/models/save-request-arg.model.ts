import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { LogInfoWrongOuComponent } from "../log-info-wrong-ou/log-info-wrong-ou.component";
import { LogInfoWrongOu } from "./log-info-wrong-ou.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";

export class SaveRequestArg {
  requestId: number;
  requestedBy: string;
  userId: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  primitiveProps: PrimitiveProperty;
  allEvents: LogInfoWrongOu[];
  mainEvent: LogInfoWrongOu;
  eventLeagueComponent: EventLeagueComponent;
  logInfoComponents: LogInfoWrongOuComponent[];
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}