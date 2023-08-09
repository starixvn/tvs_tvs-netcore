import { MatchInfo } from "../../../../../utility/models/event.model";
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export interface CheckDuplicateTicketsQuery {
  matchId: number;
  transIds: string;
  requestId?: number;
  actionId: string;
  filterBy: number;
  subIssueTypeId: number;
}

export class CheckDuplicateTicketsViewModel {
  transInfoAddRequestModel: TransInfoAddRequestModel;
  match: MatchInfo;
  validation: ValidationDuplicateTickets;
}

export class ValidationDuplicateTickets {
  invalidTransIds: string;
  movedTransIds: string;
  differentMatchTransIds: string;
  settledTransIds: string;
  unsupportedTransIds: string;
  existingReqTransIds: string;
}
