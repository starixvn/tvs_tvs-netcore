import { LogInfoDetail } from "../../../../utility/models/log-info-detail.model";
import { VoidPageCommonItem } from "../../models/void-page-common-item.model";

export class VoidWrongMarketOfferedModel extends VoidPageCommonItem {
  logInfoDetail?: LogInfoDetail;
  isAllLiveTickets: boolean;
  isAllNonLiveTickets: boolean;
}