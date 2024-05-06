export interface CheckRecoverTicketQuery {
  requestId?: number;
  transIds: string;
  filterBy?: number;
  productIds: string;
  subIssueTypeId: number;
  isVoidAllArchivedTickets: boolean;
}