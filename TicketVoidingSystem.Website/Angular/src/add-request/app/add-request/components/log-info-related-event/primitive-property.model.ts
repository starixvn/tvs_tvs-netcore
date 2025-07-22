import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';
import { InfoSiteDBDownModel } from '../info-site-db-down/info-site-db-down.model';

export class PrimitiveProperty {
  isBlock = false;
  inputRelatedMatchId?: number;
  isShowLogInfoMainMatch = false;
  isShowRelatedEvents? = false;
  filterBy: number;
  transInfoAddRequestModel: TransInfoAddRequestModel;
  infoSiteDBDownModel: InfoSiteDBDownModel;
}
