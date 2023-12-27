export interface CheckRecoverTicketQuery {
  transIds: string;
  filterBy?: number;
  productIds: string;
  subIssueTypeId: number;
}