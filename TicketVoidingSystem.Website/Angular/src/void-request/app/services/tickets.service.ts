import { Injectable, inject } from '@angular/core';
import _ from 'lodash';
import { RequestDetailViewModel } from '../../../edit-request/app/request.model';
import { PagingConstant } from '../../../utility/components/paging/paging/paging.model';
import { MatchModel } from '../../../utility/models/match.model';
import { AppService } from '../app.service';
import { GetTicketsQuery } from '../models/get-tickets.query';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { TicketsModel } from '../tickets-list/tickets.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  appService = inject(AppService);

  initTicketQuery(requestDetail: RequestDetailViewModel, matchModel?: MatchModel, requestDetailId?: number): GetTicketsQuery {
    const query = new GetTicketsQuery();
    query.pageIndex = PagingConstant.INDEX_ZERO;
    query.pageSize = PagingConstant.SIZE_ONE;
    query.match = matchModel;
    query.requestId = requestDetail.requestId;
    query.issueTypeId = requestDetail.request.issueTypeId;
    query.requestDetailId = requestDetailId;

    return query;
  }

  async getVoidTicketsMini(ticketQuery: GetTicketsQuery): Promise<TicketsModel> {
    return this.appService.getTicketsMini(ticketQuery);
  }

  async loadVoidTicketsFullOnFirstTime(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel): Promise<void> {
    voidPageItem.pagingVoidTickets.selection = [PagingConstant.SIZE_ONE, PagingConstant.SIZE_TWO, PagingConstant.SIZE_THREE, PagingConstant.SIZE_FOUR];
    voidPageItem.pagingVoidTickets.pageSize = PagingConstant.SIZE_ONE;
    const query = this.initTicketQuery(requestDetail, voidPageItem.matchModel, voidPageItem.requestDetailId);
    await this.getVoidTicketsFull(voidPageItem, query);
    voidPageItem.isLoadedTicketFull = true;
  }

  async loadVoidTicketsFullOnPagingChange(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel): Promise<void> {
    const query = this.initTicketQuery(requestDetail, voidPageItem.matchModel, voidPageItem.requestDetailId);
    query.pageIndex = voidPageItem.pagingVoidTickets.page - 1;
    query.pageSize = voidPageItem.pagingVoidTickets.pageSize;
    await this.getVoidTicketsFull(voidPageItem, query);
  }

  async exportTicketsAsExcelFile(voidPageItem: VoidPageCommonItem, requestDetail: RequestDetailViewModel): Promise<void> {
    voidPageItem.isBlockBetList = true;
    const query = this.initTicketQuery(requestDetail, voidPageItem.matchModel, voidPageItem.requestDetailId);
    query.pageIndex = voidPageItem.pagingVoidTickets.page - 1;
    query.pageSize = voidPageItem.pagingVoidTickets.pageSize;
    await this.appService.exportExcel(query);
    voidPageItem.isBlockBetList = false;
  }

  private async getVoidTicketsFull(voidPageItem: VoidPageCommonItem, ticketQuery: GetTicketsQuery): Promise<void> {
    voidPageItem.isBlockBetList = true;
    voidPageItem.isShowTicketFull = true;
    const data = await this.appService.getTickets(ticketQuery);
    voidPageItem.voidTicketsFull.initData(data);
    voidPageItem.pagingVoidTickets.total = data.total;
    voidPageItem.isBlockBetList = false;
    voidPageItem.licenseeAffectedList = data.licenseeAffectedList;
    voidPageItem.licenseeAffectedList = _.clone(voidPageItem.licenseeAffectedList);
  }
}