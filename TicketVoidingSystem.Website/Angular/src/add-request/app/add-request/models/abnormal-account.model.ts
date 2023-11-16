import { AccountWinlostModel } from "../abnormal-accounts/models/account-winlost.model";

export class AbnormalAccountModel {
  accountWinlostModels: AccountWinlostModel[];
  productIds: string;
  statusIds: string;
  fromDate: string;
  toDate: string;
  subIssueTypeId: number;
}