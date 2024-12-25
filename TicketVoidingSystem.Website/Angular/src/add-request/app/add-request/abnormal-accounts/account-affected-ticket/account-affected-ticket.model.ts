import { Selection } from "src/utility/models/selection.model";
import { TicketsModel } from "../../pool-house-ticket/tickets/tickets.model";
import { AccountWinlostModel } from "../models/account-winlost.model";

export class AccountAffectedTicketModel {
  isOpen: boolean;
  usernames: Selection[];
  selectedCustId: string;
  affectedTickets: TicketsModel;
  transInfoJson: string;
  accountWinlostModels: AccountWinlostModel[];
}