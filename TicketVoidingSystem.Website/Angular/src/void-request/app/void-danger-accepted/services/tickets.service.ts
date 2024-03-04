import { Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { PagingConstant } from '../../../../utility/components/paging/paging/paging.model';
import { MatchModel } from '../../../../utility/models/match.model';
import { AppService } from '../../app.service';
import { GetTicketsQuery } from '../../models/get-tickets.query';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor(
    private readonly appService: AppService
  ) { }

  initTicketQuery(match: MatchModel, requestDetail: RequestDetailViewModel): GetTicketsQuery {
    const query = new GetTicketsQuery();
    query.pageIndex = PagingConstant.INDEX_ZERO;
    query.pageSize = PagingConstant.SIZE_ONE;
    query.match = match;
    query.requestId = requestDetail.requestId;
    query.issueTypeId = requestDetail.request.issueTypeId;
      
    return query;
  }

  async getVoidTicketsMini(ticketQuery: GetTicketsQuery): Promise<TicketsModel> {
    const voidTickets = await this.appService.getTicketsMini(ticketQuery);

    return voidTickets;
  }

  async loadVoidTicketsFullOnFirstTime(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel): Promise<void> {
    voidMatch.pagingVoidTickets.selection = [PagingConstant.SIZE_ONE, PagingConstant.SIZE_TWO, PagingConstant.SIZE_THREE, PagingConstant.SIZE_FOUR];
    voidMatch.pagingVoidTickets.pageSize = PagingConstant.SIZE_ONE;
    const query = this.initTicketQuery(voidMatch.matchModel, requestDetail);
    await this.getVoidTicketsFull(voidMatch, query);
    voidMatch.isLoadedTicketFull = true;
  }

  async loadVoidTicketsFullOnPagingChange(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel): Promise<void> {
    const query = this.initTicketQuery(voidMatch.matchModel, requestDetail);
    query.pageIndex = voidMatch.pagingVoidTickets.page - 1;
    query.pageSize = voidMatch.pagingVoidTickets.pageSize;
    await this.getVoidTicketsFull(voidMatch, query);
  }

  async exportTicketsAsExcelFile(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel): Promise<void> {
    voidMatch.isBlockBetList = true;
    const query = this.initTicketQuery(voidMatch.matchModel, requestDetail);
    query.pageIndex = voidMatch.pagingVoidTickets.page - 1;
    query.pageSize = voidMatch.pagingVoidTickets.pageSize;
    await this.appService.exportExcel(query);
    voidMatch.isBlockBetList = false;
  }

  private async getVoidTicketsFull(voidMatch: VoidMatch, ticketQuery: GetTicketsQuery): Promise<void> {
    voidMatch.isBlockBetList = true;
    voidMatch.isShowTicketFull = true;
    const data = await this.appService.getTickets(ticketQuery);
    voidMatch.voidTicketsFull.initData(data);
    voidMatch.pagingVoidTickets.total = data.total;
    voidMatch.affectedLicensee.licenseesName = data.licenseesName;
    voidMatch.affectedLicensee.show = true;
    voidMatch.chinaViewLicensee.licenseesName = data.chinaViewLicenseesName;
    voidMatch.jollyViewLicensee.licenseesName = data.jollyViewLicenseesName;
    voidMatch.jollySportsCVLicensee.licenseesName = data.jollySportsCvLicenseesName;
    voidMatch.chinaViewLicensee.show = true;
    voidMatch.jollyViewLicensee.show = true;
    voidMatch.jollySportsCVLicensee.show = true;
    voidMatch.affectedInstantLicensee.licenseesName = data.instantLicenseesName;
    voidMatch.affectedInstantLicensee.show = true;    
    voidMatch.cashOutLicensee.licenseesName = data.cashOutLicenseesName;
    voidMatch.cancelCashOutLicensee.licenseesName = data.cancelCashOutLicenseesName;
    voidMatch.cashOutLicensee.show = true;
    voidMatch.cancelCashOutLicensee.show = true;
    voidMatch.isBlockBetList = false;
  }
}