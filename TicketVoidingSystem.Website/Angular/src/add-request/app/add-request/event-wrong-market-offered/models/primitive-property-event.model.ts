import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export class PrimitivePropertyEvent {
  isShowFilterArea: boolean;
  isShowValidation: boolean;
  isShowErrorNoBetType = false;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}
