import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { MatchModel } from '../../../../../utility/models/match.model';

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
  match: MatchModel;
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
