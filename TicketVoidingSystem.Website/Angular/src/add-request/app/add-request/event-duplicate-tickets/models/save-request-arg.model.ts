import { AddRequestStore } from '../../add-request.store';
import { LeagueEventAbnormalComponent } from '../../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../../filter/filter.model';
import { EventDuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from './primitive-property.model';

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  transIds: string;
  filter: FilterModel;
  filterBy: number;
  primitiveProps: PrimitiveProperty;
  duplicateTicketsModel: EventDuplicateTicketsModel;
  others: OthersModel;
  leagueEventAbnormalComponent: LeagueEventAbnormalComponent;
  addRequestStore: AddRequestStore;
}