import { MatchInfo } from "../../../../utility/models/event.model";
import { TransInfoAddRequestModel } from "../models/trans-info-add-request.model";

export class PrimitiveProperty {
  isBlockBetIds = false;
  isShowButtonRemoveInvalid = false;
  invalidTransIds: string;
  isHasUusTickets: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}
export interface CheckTransIdsQuery {
  matchId: number;
  transIds: string;
  requestId?: number;
  actionId: string;
  filterBy: number;
  issueTypeId: number;
  subIssueTypeId: number;
  isRemoveCustomerClass201: boolean;
  isRemoveCustomerClass4K: boolean;
}

export class CheckTransIdsViewModel {
  transInfoAddRequestModel: TransInfoAddRequestModel;
  match: MatchInfo;
  validation: ValidationAbnormalBet;
}

export interface ValidationAbnormalBet {
  invalidTransIds: string;
  movedTransIds: string;
  differentMatchTransIds: string;
  settledTransIds: string;
  unsupportedTransIds: string;
  existingReqTransIds: string;
  transIdsOfVIPCustomer: string;
  transIdsOfCustomerClass201: string;
  transIdsOfCustomerClass4K: string;
  cN88TransIds: string;
  nonLiveTransIds: string;
  differentLiveScoreTransIds: string;
  abWhiteListTransIds: string;
  isHasWarningRemovedTickets: boolean;
  isHasUusTickets: boolean;
  listBetteam: string;
  listBettype: string;
}
