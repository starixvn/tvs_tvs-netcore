import { TicketAdjustedAccountModel } from "../events/abnormal-accounts/app/abnormal-accounts/account-affected-ticket/account-affected-ticket.model";
import { AccountWinlostModel } from "../events/abnormal-accounts/app/abnormal-accounts/models/account-winlost.model";

export class AbnormalAccountModel {
  usernames: string;
  productIds: string;
  statusIds: string;
  fromDate: string;
  toDate: string;
  subIssueTypeId: number;
  adjustedTickets: TicketAdjustedAccountModel[];
  accountWinlostModels: AccountWinlostModel[];
}