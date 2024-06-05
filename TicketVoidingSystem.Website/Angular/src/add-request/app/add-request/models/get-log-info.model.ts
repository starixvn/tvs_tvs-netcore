import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { TransInfoAddRequestModel } from './trans-info-add-request.model';

export class GetLogInfoViewModel {
  getLogInfoModels: GetLogInfoModel[];
  transInfoAddRequestModel: TransInfoAddRequestModel;
}

export class GetLogInfoModel {
  scoreId?: number;
  matchId?: number;
  validation: Validation;
  ticketRequest: TicketRequest[];
  logInfoDetail: LogInfoDetail;
  betTypeCount?: BetTypeCount[];
}

export class Validation {
  wrongScore?: string;
  isPoolHouseAffected: boolean;
  isInvalidTotalTickets: boolean;
  isExistedInOtherRequest: boolean;
  isExistsSecondAccept: boolean;
}

export class TicketRequest {
  wrongScore?: string;
  transIds: string;
  requestId: number;
  createdBy: string;
}

export class BetTypeCount {
  name: string;
  count: number;
}

export class ValidationMatchModel {
  matchId?: number;
  wrongScore?: string;
  message: ValidationMessage[];
}

export class ValidationMessage {
  isError: boolean;
  reason: string;
  isShowPopup?: boolean;
  transIds?: string;
  requestId?: number;
}