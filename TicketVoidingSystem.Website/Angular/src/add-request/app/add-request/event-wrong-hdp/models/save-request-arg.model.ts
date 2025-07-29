import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { OthersModel } from "../../others/others.model";
import { LogInfoWrongHdpComponent } from "../log-info-wrong-hdp/log-info-wrong-hdp.component";
import { LogInfoWrongHdp } from "./log-info-wrong-hdp.model";
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
  allEvents: LogInfoWrongHdp[];
  mainEvent: LogInfoWrongHdp;
  eventLeagueComponent: EventLeagueComponent;
  logInfoComponents: LogInfoWrongHdpComponent[];
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}