import { Selection } from "src/utility/models/selection.model";
import { TicketTableViewModel } from "../../components/ticket-table/ticket-table.model";
import { AccountWinlostModel } from "../models/account-winlost.model";

export class AccountAffectedTicketModel {
  isOpen: boolean;
  usernames: Selection[];
  selectedCustId: string;
  affectedTickets: TicketTableViewModel;
  transInfoJson: string;
  accountWinlostModels: AccountWinlostModel[];
}

export class AdjustedAccountModel {
  custId: number;
  accountWinlostTables: AccountWinlostModel[] = [];
  ticketTableViewModel: TicketTableViewModel;
}