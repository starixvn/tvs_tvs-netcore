import { TransInfoAddRequestModel } from '../../models/trans-info-add-request.model';

export class PrimitiveProperty {
  isBlock = false;
  inputRelatedMatchId?: number;
  isShowLogInfoMainMatch = false;
  isShowRelatedEvents? = false;
  filterBy: number;
  transInfoAddRequestModel: TransInfoAddRequestModel;
}
