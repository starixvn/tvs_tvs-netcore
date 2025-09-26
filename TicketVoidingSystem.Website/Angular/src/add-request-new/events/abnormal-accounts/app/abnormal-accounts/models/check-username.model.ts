import { TransInfoAddRequestModel } from "../../../../../models/trans-info-add-request.model";
import { AccountWinlostModel } from "./account-winlost.model";
import { InfoSiteDBDownModel } from "../../../../../component/info-site-db-down/info-site-db-down.model";

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
  isRemoveCreditCashService: boolean;
}


export class CheckUsernamesViewModel {
  validation: ValidationAbnormalAccount;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  accountWinlostModels: AccountWinlostModel[];
  infoSiteDBDownModel: InfoSiteDBDownModel;
}

export class ValidationAbnormalAccount {
  isBeingMoveBetDate: boolean;
  isExistedInOtherRequest: boolean;
  isInvalidTotalTicket: boolean;
  invalidUserName: string;
  matchIds: string;
  numberOfTickets: number;
  usernamesOfCreditCashService: string;
  isExceededTotalUsernames: boolean;
  transInfo: string;
  isTicketLimitExceeded: boolean;
}