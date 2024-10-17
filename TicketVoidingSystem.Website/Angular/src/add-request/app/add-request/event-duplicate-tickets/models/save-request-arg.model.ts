import { BetIdsComponent } from '../../../../../utility/components/bet-ids/bet-ids.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { DuplicateTicketsModel } from '../../models/event-duplicate-tickets.model';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { OthersModel } from '../../others/others.model';
import { PrimitiveProperty } from './primitive-property.model';

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  actionIdOfFirstTimeAccess: string;
  filter: FilterModel;
  permission: PermissionAddRequest;
  primitiveProps: PrimitiveProperty;
  duplicateTicketsModel: DuplicateTicketsModel;
  others: OthersModel;
  betIdsComponent: BetIdsComponent;
  addRequestStore: AddRequestStore;
  tooltip: Tooltip;
}
