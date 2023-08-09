import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export class PrimitiveProperty {
  isBlockBetIds = false;
  isShowButtonRemoveInvalid = false;
  invalidTransIds: string;
  //isHasUusTickets: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}