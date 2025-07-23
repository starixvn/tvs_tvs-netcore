import { UsernamesComponent } from "../../../../../utility/components/user-names/user-names.component";
import { AddRequestStore } from "../../add-request.store";
import { FilterModel } from "../../filter/filter.model";
import { IssueTypes } from "../../filter/issue-types.model";
import { AbnormalAccountModel } from "../../models/abnormal-account.model";
import { OthersModel } from "../../others/others.model";
import { AccountTableComponent } from "../account-table/account-table.component";
import { ConfirmAbnormalAccountComponent } from "../confirm-abnormal-account/confirm-abnormal-account.component";
import { ConfirmAbnormalAccountModel } from "../confirm-abnormal-account/confirm-abnormal-account.model";
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
  confirmAddRequest: ConfirmAbnormalAccountModel;
  confirmAddRequestComponent: ConfirmAbnormalAccountComponent;
  issueTypes: IssueTypes;
  isValidateFromConfirmPopup: boolean;
}