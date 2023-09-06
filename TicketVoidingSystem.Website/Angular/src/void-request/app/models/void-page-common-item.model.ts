
import { RequestDetailViewModel } from "../../../edit-request/app/request.model";
import { PagingModel } from "../../../utility/components/paging/paging/paging.model";
import { Message } from "../../../utility/components/template-message/messages/message";
import { TemplateValue } from "../../../utility/components/template-message/template-message/template.model";
import { AffectedLicensee } from "../../../utility/models/affected-licensee.model";
import { SubIssueType } from "../../../utility/models/issue-type.model";
import { MatchModel } from "../../../utility/models/match.model";
import { VoidedReason } from "../../../utility/models/reason.model";
import { TicketsModel } from "../tickets-list/tickets.model";

export class VoidPageCommonItem {
  templateValue: TemplateValue;
  voidTicketsMini: TicketsModel;
  voidTicketsFull: TicketsModel;
  pagingVoidTickets: PagingModel;
  affectedLicensee: AffectedLicensee;
  chinaViewLicensee: AffectedLicensee;
  affectedInstantLicensee: AffectedLicensee;
  cashOutLicensee: AffectedLicensee;

  subIssueType?: SubIssueType;
  displayIssueTypeName: string;
  voidReason?: VoidedReason;
  matchModel?: MatchModel;
  detailViewModel: RequestDetailViewModel;

  templateMessage?: Message;
  isLoadedTicketFull: boolean;
  isShowTemplateMessage: boolean;
  isBlockBetList: boolean;
  isShowTicketFull: boolean;

  constructor() {
    this.voidTicketsFull = new TicketsModel();
    this.pagingVoidTickets = new PagingModel();
    this.affectedLicensee = new AffectedLicensee();
    this.affectedInstantLicensee = new AffectedLicensee();
    this.chinaViewLicensee = new AffectedLicensee();
    this.cashOutLicensee = new AffectedLicensee();
  }
}