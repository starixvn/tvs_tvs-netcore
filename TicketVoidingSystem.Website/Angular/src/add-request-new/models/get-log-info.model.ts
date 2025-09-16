import { Item } from '../../utility/models/item.model';
import { LogInfoDetail } from '../../utility/models/log-info-detail.model';
import { InfoSiteDBDownModel } from '../component/info-site-db-down/info-site-db-down.model';
import { TransInfoAddRequestModel } from './trans-info-add-request.model';

export class GetLogInfoViewModel {
  getLogInfoModels: GetLogInfoModel[];
  transInfoAddRequestModel: TransInfoAddRequestModel;
  infoSiteDBDownModel: InfoSiteDBDownModel;
}

export class GetLogInfoModel {
  id?: number; // wrong market offered
  scoreId?: number; // wrong score
  matchId?: number; // issue type have child match
  validation: Validation;
  ticketRequest: TicketRequest[];
  logInfoDetail: LogInfoDetail;
  betTypeCount?: BetTypeCountModel[];
}

export class Validation {
  wrongScore?: string;
  isInvalidTotalTickets: boolean;
  isExistedInOtherRequest: boolean;
  isExistsSecondAccept: boolean;
  isHasSettledTicket: boolean;
  isHasInstantlySettledTicket: boolean;
}

export class TicketRequest {
  wrongScore?: string;
  transIds: string;
  requestId: number;
  createdBy: string;
}

export class BetTypeCountModel {
  betTypeName: string;
  ticketsCount: number;
  betTypeId: number;
  betId: number;
  playerName: string;
}

export class GroupBetTypeCountModel {
  name: string;
  items: Item[];
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