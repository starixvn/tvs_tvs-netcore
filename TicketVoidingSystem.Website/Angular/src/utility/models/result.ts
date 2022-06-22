import { CheckProcessModel } from '../../utility/models/check-process.model';
export class Result<T> {
  errorCode: number;
  errorMsg: string;
  isSuccessful: boolean;
  data?: T;
}

export class RecoverResult extends Result<string> {
    isSettledBet: boolean;
}

export class SqlResult {
  ErrCode: number;
  ErrMsg: string;
  isSuccessful: boolean;
}

export interface CheckValidTransIdsResult extends CheckProcessModel {
  invalidTransIds: string;
  movedTransIds: string;
  differentMatchTransIds: string;
  settledTransIds: string;
  unsupportedTransIds: string;
  existingReqTransIds: string;
  transIdsOfVIPCustomer: string;
  transIdsOfCustomerClass1: string;
  cN88TransIds: string;
  nonLiveTransIds: string;
  differentLiveScoreTransIds: string;
  abWhiteListTransIds: string;
  isCheckAutoCal: boolean;
  isHasWarningRemovedTickets: boolean;
}