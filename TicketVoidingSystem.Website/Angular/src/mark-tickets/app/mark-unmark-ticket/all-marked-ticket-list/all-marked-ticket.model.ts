export class AllMarkedTicketModel {
  no?: number;
  matchId: string;
  kickOffTime?: Date;
  htScore?: string;
  ftScore?: string;
  userId: number;
  username?: string;
  createdDate: Date;
  event?: string;
  total?: number;
  isChecked?: boolean;
  childMatchId?:  string;
}

export class AllMarkedTicketsModel {
  ticketList: Array<AllMarkedTicketModel>;
  totalItems: number;
}
