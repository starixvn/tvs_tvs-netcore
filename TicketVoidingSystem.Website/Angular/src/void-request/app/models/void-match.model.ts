
import { Message } from "../../..//utility/components/template-message/messages/message";
import { LogInfoDetail } from "../../..//utility/models/log-info-detail.model";
import { VoidPageCommonItem } from "./void-page-common-item.model";

export class VoidMatch extends VoidPageCommonItem {
  logInfoDetail?: LogInfoDetail;
  templateMessage?: Message;
  isAllLiveTickets: boolean;
  isAllNonLiveTickets: boolean;
  isCheckedEarlyEvent: boolean;
  wrongMarket?: string;
  actualMarket?: string;
  hdpValue?: string;
  isCheckedVar?: boolean;
  isMainMatch: boolean;
  isPoolHouseAffected: boolean;
}