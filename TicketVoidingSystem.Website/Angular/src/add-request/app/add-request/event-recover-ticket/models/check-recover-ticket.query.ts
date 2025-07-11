export interface CheckRecoverTicketQuery {
  requestId?: number;
  transIds: string;
  filterBy?: number;
  productIds: string;
  matchId: number;
  isVoidAllArchivedTickets: boolean;
}