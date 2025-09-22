import { TransInfoAddRequestModel } from "../../../../../models/trans-info-add-request.model";
import { InfoSiteDBDownModel } from "./../../../../../component/info-site-db-down/info-site-db-down.model";

export class PrimitiveProperty {
  isBlock: boolean;
  inputRelatedMatchId: string;
  isShowRelatedEvents: boolean;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  infoSiteDBDownModel: InfoSiteDBDownModel;
  isShowInfoSiteDBDown: boolean;
}
