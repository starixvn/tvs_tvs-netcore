import { UsernamesComponent } from "../../../../../utility/components/user-names/user-names.component";
import { AddRequestStore } from "../../add-request.store";
import { ConfirmAddRequestModel } from "../../confirm-add-request/confirm-add-request.model";
import { FilterModel } from "../../filter/filter.model";
import { AbnormalAccountModel } from "../../models/abnormal-account.model";
import { OthersModel } from "../../others/others.model";
import { AccountTableComponent } from "../account-table/account-table.component";
import { EventDateFilterComponent } from "../event-date-filter/event-date-filter.component";
import { ProductFilterComponent } from "../product-filter/product-filter.component";
import { PrimitiveProperty } from "./primitive-property.model";

export class SaveRequestArg {
  requestId?: number;
  isEdit: boolean;
  filter: FilterModel;
  userId: number;
  requestedBy: string;
  primitiveProps: PrimitiveProperty;
  abnormalAccountModel: AbnormalAccountModel;
  usernamesComponent: UsernamesComponent;
  others: OthersModel;
  addRequestStore: AddRequestStore;
  actionIdOfFirstTimeAccess: string;
  productFilterComponent: ProductFilterComponent;
  eventDateFilterComponent: EventDateFilterComponent;
  accountTableComponent: AccountTableComponent;
  confirmAddRequest: ConfirmAddRequestModel;
}