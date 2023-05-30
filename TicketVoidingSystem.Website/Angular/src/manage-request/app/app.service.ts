import { Injectable } from '@angular/core';
import { GeneralInfoViewModel } from '../../utility/components/request-info/request-info.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { CopyRequestInfoQuery } from './models/copy-request-info.query';
import { GetGeneralInfoQuery } from './models/get-general-info.query';
import { GetRequestsQuery } from './models/get-requests.query';
import { RequestModel } from './request-list/request.model';
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
    return this.httpService.postJson(query, 'TicketVoidingSystem/ManageRequest/GetRequests');
  }

  async exportRequest(query: GetRequestsQuery) {
    const url = 'TicketVoidingSystem/ManageRequest/ExportRequest';
    return this.httpService.downloadFile(query, url);
  }

  async getVoidedTickets(query: TicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'TicketVoidingSystem/ManageRequest/GetVoidedTickets');
  }

  async exportTickets(query: TicketsQuery) {
    const url = 'TicketVoidingSystem/ManageRequest/ExportVoidedTickets';
    return this.httpService.downloadFile(query, url);
  }

  async checkBy(requestId: number, isCheck: boolean): Promise<Result<string>> {
    return this.httpService.postJson({ requestId, isCheck }, 'TicketVoidingSystem/ManageRequest/CheckBy');
  }

  async getGeneralInfo(query: GetGeneralInfoQuery): Promise<GeneralInfoViewModel> {
    return this.httpService.postJson(query, `TicketVoidingSystem/ManageRequest/GetGeneralInfo`);
  }

  async copyRequestInfo(query: CopyRequestInfoQuery): Promise<string> {
    return this.httpService.postJson(query, `TicketVoidingSystem/ManageRequest/CopyRequestInfo`);
  }
}
