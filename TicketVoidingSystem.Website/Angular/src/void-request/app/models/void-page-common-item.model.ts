import { RequestDetailViewModel } from "../../../add-request-new/models/request-detail.model";
import { AffectedLicensee } from '../../../utility/components/licensee-affected-list/licensee-affected-list.model';
import { PagingModel } from "../../../utility/components/paging/paging.model";
import { Message } from "../../../utility/components/template-message/messages/message";
import { TemplateValue } from "../../../utility/components/template-message/template-message/template.model";
import { SubIssueType } from "../../../utility/models/issue-type.model";
import { MatchModel } from "../../../utility/models/match.model";
import { VoidedReason } from "../../../utility/models/reason.model";
import { TicketsModel } from "../tickets-list/tickets.model";

export class VoidPageCommonItem {
  id: number;
  templateValue: TemplateValue;
  voidTicketsMini: TicketsModel;
  voidTicketsFull: TicketsModel;
  pagingVoidTickets: PagingModel;
  licenseeAffectedList: AffectedLicensee[] = [];
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
  requestDetailId?: number;

  constructor() {
    this.voidTicketsFull = new TicketsModel();
    this.pagingVoidTickets = new PagingModel();
    this.licenseeAffectedList = []
  }
}