import { UsernamesComponent } from "../../../../../utility/components/user-names/user-names.component";
import { AbnormalAccountModel } from "../../models/abnormal-account.model";
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { AccountTableComponent } from "../account-table/account-table.component";
import { ConfirmAbnormalAccountModel } from "../confirm-abnormal-account/confirm-abnormal-account.model";
import { EventDateFilterComponent } from "../event-date-filter/event-date-filter.component";
import { ProductFilterComponent } from "../product-filter/product-filter.component";
import { AccountWinlostModel } from "./account-winlost.model";
import { PrimitiveProperty } from "./primitive-property.model";

export class ValidationBusinessRuleArgs {
  requestId?: number;
  actionId: string;
  issueTypeId: string;
  usernamesComponent: UsernamesComponent;
  productFilterComponent: ProductFilterComponent;
  eventDateFilterComponent: EventDateFilterComponent;
  accountTableComponent: AccountTableComponent;
  primitiveProps: PrimitiveProperty;
  abnormalAccountModel: AbnormalAccountModel;
}

export class ValidationBusinessRuleOutput {
  isValid: boolean;
  confirmAbnormalAccountModel: ConfirmAbnormalAccountModel;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  accountWinlostModels: AccountWinlostModel[]
}