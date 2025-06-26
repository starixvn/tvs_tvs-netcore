import { UsernamesComponent } from "../../../../../utility/components/user-names/user-names.component";
import { AbnormalAccountModel } from "../../models/abnormal-account.model";
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { AccountTableComponent } from "../account-table/account-table.component";
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
  numberOfTicketsExistedInRequest: number;
  usernamesOfCreditCashService: string;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  accountWinlostModels: AccountWinlostModel[];
  isWarringTooHighTickets: boolean;
}