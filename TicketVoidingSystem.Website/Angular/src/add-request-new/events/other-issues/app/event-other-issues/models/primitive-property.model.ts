import { InfoSiteDBDownModel } from "src/add-request-new/component/info-site-db-down/info-site-db-down.model";
import { TransInfoAddRequestModel } from "src/add-request-new/models/trans-info-add-request.model";

export class PrimitiveProperty {
  isBlock: boolean;
  isShowValidation: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  isShowErrorNoBetType: boolean;
  isShowAdvancedModeBetTypes: boolean;
  infoSiteDBDownModel: InfoSiteDBDownModel;
}
