import { Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../add-request/app/add-request/models/request.model';
import { GetBetTypesQuery, GroupBetTypesModel } from '../../utility/components/advanced-mode/group-bettypes/group-bettypes.model';
import { MatchModel } from '../../utility/models/match.model';
import { VoidedReason } from '../../utility/models/reason.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { IssueInfo } from './../../utility/models/issue-type.model';
import { GetTicketsQuery } from './models/get-tickets.query';
import { RequestLastModifiedDate } from './models/request-last-modified-date.model';
import { InsertQueueResult, VoidTicketsQuery } from './models/void-tickets.query';
import { TicketsModel } from './tickets-list/tickets.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getRemark(): Promise<string[]> {
    return this.httpService.getJson(`TicketVoidingSystem/VoidRequest/GetRemark`);
  }

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`TicketVoidingSystem/ManageRequest/GetRequest/${id}`);
  }

  async getMatch(matchId: number): Promise<MatchModel> {
    return this.httpService.postJson({ matchId, isMatch3rd: false }, 'Match/GetInfo');
  }

  async getIssueInfo(subId: number): Promise<IssueInfo> {
    return this.httpService.getJson(`TicketVoiding/GetIssueTypeName?subId=${subId}`);
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'TicketVoidingSystem/VoidRequest/GetTickets');
  }

  async getTicketsMini(query: GetTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'TicketVoidingSystem/VoidRequest/GetTicketsMini');
  }

  async getVoidedReason(subId: number, sportTypeId: number): Promise<VoidedReason> {
    return this.httpService.getJson(`TicketVoiding/GetVoidedReason?subId=${subId}&sportTypeId=${sportTypeId}`);
  }

  async insertQueue(query: VoidTicketsQuery): Promise<Result<InsertQueueResult>> {
    return this.httpService.postJson(query, 'TicketVoidingSystem/VoidRequest/InsertQueue');
  }

  async exportExcel(query: GetTicketsQuery) {
    const url = 'TicketVoidingSystem/VoidRequest/ExportExcel';
    return this.httpService.downloadFile(query, url);
  }

  async getGroupBetTypes(query: GetBetTypesQuery): Promise<GroupBetTypesModel> {
    return this.httpService.postJson(query, `BetTypes/GetGroupBetTypesNg`);
  }

  async getLastModifiedDate(requestId: number): Promise<RequestLastModifiedDate> {
    return this.httpService.postJson({requestId}, `TicketVoiding/GetLastModifiedDate`);
  }
}
