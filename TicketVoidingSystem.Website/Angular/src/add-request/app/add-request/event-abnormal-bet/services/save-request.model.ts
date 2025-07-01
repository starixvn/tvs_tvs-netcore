import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { AbnormalBetModel } from '../../models/abnormal-bet.model';
import { OthersModel } from '../../others/others.model';
import { ConfirmAbnormalBetComponent } from '../confirm-abnormal-bet/confirm-abnormal-bet.component';
import { ConfirmAbnormalBetModel } from '../confirm-abnormal-bet/confirm-abnormal-bet.model';
import { PrimitiveProperty } from '../event-abnormal-bet.model';

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  filter: FilterModel;
  primitiveProps: PrimitiveProperty;
  abnormalBetModel: AbnormalBetModel;
  others: OthersModel;
  confirmAbnormalBetModel: ConfirmAbnormalBetModel;
  confirmAbnormalBetComponent: ConfirmAbnormalBetComponent;
  addRequestStore: AddRequestStore;
  siteDBDownInfoJson?: string;
}