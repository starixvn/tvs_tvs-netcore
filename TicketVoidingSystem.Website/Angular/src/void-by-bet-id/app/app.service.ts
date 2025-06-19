import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { GetTicketsQuery, TicketsViewModel } from './model/get-tickets.query';
import { MatchModel } from 'src/utility/models/match.model';
import { CommonService } from 'src/utility/services/common.service';
import { SubIssueType } from 'src/utility/components/template-message/template-message/template-setting.model';
import { Result } from '../../utility/models/result';
import { VoidTicketsRequest } from './model/void-by-bet-id.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  httpService = inject(HttpService);
  commonService = inject(CommonService);

  async getRemark(): Promise<string[]> {
    return this.httpService.getJson(`api/VoidByBetId/GetRemark`);
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsViewModel> {
    return this.httpService.postJson<GetTicketsQuery, TicketsViewModel>(query, 'api/VoidByBetId/GetTickets');
  }

  async getAbnormalBetSubIssueTypes(): Promise<SubIssueType[]> {
    return this.httpService.getJson('api/VoidByBetId/GetAbnormalBetSubIssueTypes');
  }

  async voidBet(query: VoidTicketsRequest): Promise<Result<null>[]> {
    return this.httpService.postJson<VoidTicketsRequest, Result<null>[]>(query, 'api/VoidByBetId/VoidBet');
  }

  async getVoidResultCache(guid: string): Promise<Result<null>[]> {
    return this.httpService.postJson<{ guid: string }, Result<null>[]>({ guid: guid }, `api/SharedApi/GetVoidResultCache`);
  }

  async exportExcel(query: GetTicketsQuery) {
    return this.httpService.downloadFile(query, 'api/VoidByBetId/ExportExcel');
  }

}
