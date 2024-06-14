import { PagingModel } from "../../../../utility/components/paging/paging/paging.model";
import { VoidedReason } from "../../../../utility/models/reason.model";
import { VoidPageCommonItem } from "../../models/void-page-common-item.model";
import { TicketsModel } from "../../tickets-list/tickets.model";

export class VoidAbnormalBetModel extends VoidPageCommonItem {
  super() {
    this.voidTicketsFull = new TicketsModel();
    this.pagingVoidTickets = new PagingModel();
    this.voidReason = new VoidedReason();
    this.licenseeAffectedList = [];
  }
}