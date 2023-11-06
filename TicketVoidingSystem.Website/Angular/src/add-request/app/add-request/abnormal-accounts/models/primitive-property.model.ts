import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export class PrimitiveProperty {
  isBlockUsernames: boolean;
  isCancelValidate = false;
  isShowError = false;
  isBeingMoveBetDate: boolean;
  isInvalidTotalTicket: boolean;
  isShowAccountWinLost = false;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}