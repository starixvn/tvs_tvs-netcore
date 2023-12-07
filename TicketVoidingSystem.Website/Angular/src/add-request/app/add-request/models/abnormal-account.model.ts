import { AccountWinlostModel } from "../abnormal-accounts/models/account-winlost.model";

export class AbnormalAccountModel {
  usernames: string;
  productIds: string;
  statusIds: string;
  fromDate: string;
  toDate: string;
  subIssueTypeId: number;
  accountWinlostModels: AccountWinlostModel[];
}