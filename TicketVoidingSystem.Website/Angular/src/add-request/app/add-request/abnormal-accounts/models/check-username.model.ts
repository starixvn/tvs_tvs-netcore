import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export interface CheckValidUsernamesQuery {
  usernames: string;
  requestId?: number;
  actionId: string;
  productIds: string;
  statusIds: string;
  fromDate: string;
  toDate: string;
}


export class CheckUsernamesViewModel {
  validation: ValidationAbnormalAccount;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}

export class ValidationAbnormalAccount {
  isBeingMoveBetDate: boolean;
  isExistedInOtherRequest: boolean;
  isInvalidTotalTicket: boolean;
  invalidUserName: string;
  matchIds: string;
  numberOfTickets: number;
  isExceededTotalUsernames: boolean;
  transInfo: string;
}