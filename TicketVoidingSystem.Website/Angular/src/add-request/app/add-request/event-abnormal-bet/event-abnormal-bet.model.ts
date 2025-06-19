import { MatchInfo } from "../../../../utility/models/event.model";
import { TransInfoAddRequestModel } from "../models/trans-info-add-request.model";

export class PrimitiveProperty {
  isBlockBetIds = false;
  isShowButtonRemoveInvalid = false;
  invalidTransIds: string;
  isHasUusTickets: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  isBlockUI = false;
}
export interface CheckTransIdsQuery {
  transIds: string;
  requestId?: number;
  actionId: string;
  filterBy: number;
  issueTypeId: number;
  subIssueTypeId: number;
  isRemoveCustomerClass201: boolean;
  isRemoveCustomerClass4K: boolean;
  isRemoveCreditCashService: boolean;
  isAddSettledTickets: boolean;
  isVoidAllArchivedTickets: boolean;
}

export class CheckTransIdsViewModel {
  transInfoAddRequestModel: TransInfoAddRequestModel;
  matches: MatchInfo[];
  validation: ValidationAbnormalBet;
  abnormalBetTicketRequests: AbnormalBetTicketViewModel[];
  sendLetstalkModels: SendLetstalkModel[];
}

export class ValidationAbnormalBet {
  invalidTransIds: string;
  movedTransIds: string;
  differentMatchTransIds: string;
  settledTransIds: string;
  unsupportedTransIds: string;
  existingReqTransIds: string;
  transIdsOfVIPCustomer: string;
  transIdsOfCustomerClass201: string;
  transIdsOfCustomerClass4K: string;
  transIdsOfCreditCashService: string;
  nonLiveTransIds: string;
  differentLiveScoreTransIds: string;
  abWhiteListTransIds: string;
  isHasWarningRemovedTickets: boolean;
  isHasUusTickets: boolean;
}


export interface SendLetstalkModel {
  matchId: number;
  isHasUusTickets: boolean;
  listBetteam: string;
  listBettype: string;
}

export class AbnormalBetTicketViewModel {
  no: number
  betId: string
  leagueName: string
  matchEvent: string
  matchId?: number
  transDate: string
  member: string
  betType: string
  odds: string
  stake: string
  winLoss: string
  currency: string
  status: string
  creator: string
  score: string
  hdp: string
  choice: string
  remarkId?: number
  remark: string
  vip: string
  customerClass: string
}

export class ExportExcelAbnormalBet {
  requestId?: number
  tickets: AbnormalBetTicketViewModel[]
}