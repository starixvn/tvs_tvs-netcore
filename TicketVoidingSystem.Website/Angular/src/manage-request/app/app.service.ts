import { Injectable } from '@angular/core';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { BriefInfo } from './models/brief-info.model';
import { GetGeneralInfoQuery } from './models/get-general-info.query';
import { GetRequestsQuery } from './models/get-requests.query';
import { RequestModel } from './request-list/request.model';
import { GeneralInfoViewModel } from './ticket-list/request-info/request-info.model';
import { TicketsModel } from './ticket-list/tickets/tickets.model';
import { TicketsQuery } from './ticket-list/tickets/tickets.query';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  async getRequests(query: GetRequestsQuery): Promise<RequestModel[]> {
    return this.httpService.postJson(query, 'api/ManageRequest/GetRequests');
  }

  async exportRequest(query: GetRequestsQuery, timeoutEvent?: () => void) {
    const url = 'api/ManageRequest/ExportRequest';
    return this.httpService.downloadFile(query, url, timeoutEvent);
  }

  async getVoidedTickets(query: TicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'api/ManageRequest/GetVoidedTickets');
  }

  async exportTickets(query: TicketsQuery) {
    const url = 'api/ManageRequest/ExportVoidedTickets';
    return this.httpService.downloadFile(query, url);
  }

  async checkBy(requestId: number, isCheck: boolean): Promise<Result<string>> {
    return this.httpService.postJson({ requestId, isCheck }, 'api/ManageRequest/CheckBy');
  }

  async getGeneralInfo(query: GetGeneralInfoQuery): Promise<GeneralInfoViewModel> {
    return this.httpService.postJson(query, `api/ManageRequest/GetGeneralInfo`);
  }

  async GetBriefInfo(query: GetGeneralInfoQuery): Promise<BriefInfo[]> {
    return this.httpService.postJson(query, `api/ManageRequest/GetBriefInfo`);
  }

  async SaveBriefInfoNote(requestId: number, briefInfoNote: string): Promise<BriefInfo[]> {
    return this.httpService.postJson({requestId, briefInfoNote, isVoided: true}, `api/ManageRequest/UpdateRequest`);
  }
}
