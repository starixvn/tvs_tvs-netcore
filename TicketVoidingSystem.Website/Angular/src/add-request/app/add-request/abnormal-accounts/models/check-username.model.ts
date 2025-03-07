import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";
import { AccountWinlostModel } from "./account-winlost.model";

export interface CheckValidUsernamesQuery {
  usernames: string;
  requestId?: number;
  actionId: string;
  productIds: string;
  statusIds: string;
  fromDate: string;
  toDate: string;
  isVoidAllArchivedTickets: boolean;
  accountWinlostModels: AccountWinlostModel[];
}


export class CheckUsernamesViewModel {
  validation: ValidationAbnormalAccount;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  accountWinlostModels: AccountWinlostModel[];
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
  isTicketLimitExceeded: boolean;
}