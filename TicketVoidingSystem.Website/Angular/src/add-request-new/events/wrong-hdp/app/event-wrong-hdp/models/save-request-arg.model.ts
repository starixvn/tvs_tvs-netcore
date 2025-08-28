import { AddRequestStore } from "../../../../../services/add-request.store";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { LogInfoWrongHdpComponent } from "../log-info-wrong-hdp/log-info-wrong-hdp.component";
import { LogInfoWrongHdp } from "./log-info-wrong-hdp.model";
import { PrimitiveProperty } from "./primitive-property.model";
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';

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
}