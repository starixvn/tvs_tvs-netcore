import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export class PrimitivePropertyEvent {
  isShowValidation: boolean;
  isShowBetTypeCount: boolean;
  isShowErrorNoBetType = false;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}
