import { AddRequestStore } from "../../../../../services/add-request.store";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { OthersModel } from "../../../../../component/others/others.model";
import { LogInfoWrongOuComponent } from "../log-info-wrong-ou/log-info-wrong-ou.component";
import { LogInfoWrongOu } from "./log-info-wrong-ou.model";
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
  allEvents: LogInfoWrongOu[];
  mainEvent: LogInfoWrongOu;
  eventLeagueComponent: EventLeagueComponent;
  logInfoComponents: LogInfoWrongOuComponent[];
  addRequestStore: AddRequestStore;
}