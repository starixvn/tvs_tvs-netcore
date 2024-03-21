
import { PagingModel } from "../../..//utility/components/paging/paging/paging.model";
import { Message } from "../../..//utility/components/template-message/messages/message";
import { TemplateValue } from "../../..//utility/components/template-message/template-message/template.model";
import { SubIssueType } from "../../..//utility/models/issue-type.model";
import { LogInfoDetail } from "../../..//utility/models/log-info-detail.model";
import { MatchModel } from "../../..//utility/models/match.model";
import { VoidedReason } from "../../..//utility/models/reason.model";
import { TicketsModel } from "../../..//void-request/app/tickets-list/tickets.model";
import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';

export class VoidMatch {
  subIssueType?: SubIssueType;
  displayIssueTypeName: string;
  matchModel?: MatchModel;
  voidTicketsMini?: TicketsModel;
  voidReason?: VoidedReason;
  templateValue?: TemplateValue;
  logInfoDetail?: LogInfoDetail;
  voidTicketsFull?: TicketsModel;
  pagingVoidTickets: PagingModel;
  isShowTicketFull: boolean;
  isLoadedTicketFull: boolean;
  isBlockBetList: boolean;
  licenseeAffectedList: AffectedLicensee[];
  isShowTemplateMessage: boolean;
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

  constructor() {
    this.voidTicketsFull = new TicketsModel();
    this.pagingVoidTickets = new PagingModel();  
    this.voidReason = new VoidedReason();
    this.licenseeAffectedList = [];
  }
}