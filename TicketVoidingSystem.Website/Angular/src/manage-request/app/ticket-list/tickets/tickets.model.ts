export class TicketsModel {
  groups: Array<GroupTickets> = [];
  totalTicketsProcessed: number;
  totalCancelCashOutProcessed: number;
  licenseeNames: string;
  cancelCashOutLicenseesName: string;
  generalBetTypeCombinations: string;
}

export class BettypeCombination {
  bettypes: string;
  voidingHistoryId: number;
}

export class GroupTickets {
  name: string;
  isCollapse: boolean;
  displayTotalTickets: number;
  tickets: Array<TicketModel>;
}

export class TicketModel {
  no?: number;
  betId: string;
  transDate: string;
  member: string;
  betType: string;
  odds: string;
  stake: string;
  winLoss: string;
  currency: string;
  status: string;
  creator: string;
  score: string;
  handicap: string;
  choice: string;
  voidTime: string;
  isCashOut: boolean;
  subTransId: string;
  isHybrid: boolean;
}
