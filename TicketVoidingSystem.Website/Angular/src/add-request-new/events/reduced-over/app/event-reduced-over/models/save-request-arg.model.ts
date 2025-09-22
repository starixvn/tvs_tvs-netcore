import { ConfirmAddRequestModel } from 'src/add-request-new/component/confirm-add-request/confirm-add-request.model';
import { FilterModel } from 'src/add-request-new/component/filter/filter.model';
import { OthersModel } from 'src/add-request-new/component/others/others.model';
import { AddRequestStore } from 'src/add-request-new/services/add-request.store';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { FilterReducedOverComponent } from '../filter-reduced-over/filter-reduced-over.component';
import { LogInfoReducedOver } from './log-info-reduced-over.model';
import { PrimitivePropertyEvent } from './primitive-property-event.model';

export class SaveRequestArg {
  requestId: number;
  requestedBy: string;
  userId: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  others: OthersModel;
  primitiveProps: PrimitivePropertyEvent;
  logInfoEvent: LogInfoReducedOver;
  eventLeagueComponent: EventLeagueComponent;
  filterReducedOverComponent: FilterReducedOverComponent;
  addRequestStore: AddRequestStore;
  confirmAddRequest: ConfirmAddRequestModel;
}