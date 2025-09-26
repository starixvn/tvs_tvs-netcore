import { AccountWinlostModel } from "../models/account-winlost.model";
import { TicketTableViewModel } from "../ticket-table/ticket-table.model";

export class AccountAffectedTicketModel {
  isOpen: boolean;
  selectedCustId: number;
  affectedTickets: TicketTableViewModel;
  transInfoJson: string;
  accountWinlostModels: AccountWinlostModel[];
  adjustedAccounts: AdjustedAccountModel[];

  constructor() {
    this.adjustedAccounts = [];
    this.accountWinlostModels = [];
  }
}

export class AdjustedAccountModel {
  custId: number;
  accountWinlostTables: AccountWinlostModel[];
  ticketTableViewModel: TicketTableViewModel;

  constructor() {
    this.accountWinlostTables = [];
    this.ticketTableViewModel = new TicketTableViewModel();
  }
}

export class TicketAdjustedAccountModel {
  custId: number;
  transId: string;
  isChecked: boolean;
}