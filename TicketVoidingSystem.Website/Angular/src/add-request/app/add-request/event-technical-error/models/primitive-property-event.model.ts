import { InfoSiteDBDownModel } from "../../components/info-site-db-down/info-site-db-down.model";
import { TransInfoAddRequestModel } from "../../models/trans-info-add-request.model";

export class PrimitivePropertyEvent {
  isShowValidation: boolean;
  isShowBetTypeCount: boolean;
  isShowErrorNoBetType = false;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  infoSiteDBDownModel: InfoSiteDBDownModel;
}
