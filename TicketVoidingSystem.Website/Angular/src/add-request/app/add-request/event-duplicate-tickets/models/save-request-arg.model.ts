import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { PermissionManage } from '../../../../../manage-request/app/models/permission-manage.model';
import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { AddRequestStore } from '../../add-request.store';
import { LeagueEventAbnormalComponent } from '../../event-abnormal-bet/league-event-abnormal/league-event-abnormal.component';
import { FilterModel } from '../../filter/filter.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from './primitive-property.model';

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  permission: PermissionManage;
  primitiveProps: PrimitiveProperty;
  duplicateTicketsModel: DuplicateTicketsModel;
  others: OthersModel;
  betIdsComponent: BetIdsComponent;
  leagueEventComponent: LeagueEventAbnormalComponent;
  addRequestStore: AddRequestStore;
  tooltip: Tooltip;

}
