import { Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../add-request/app/add-request/models/request.model';
import { VoidedReason } from '../../utility/models/reason.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
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
    return this.httpService.getJson(`api/VoidRequest/GetRemark`);
  }

  async getRequestById(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`api/ManageRequest/GetRequest/${id}`);
  }

  async getTickets(query: GetTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'api/VoidRequest/GetTickets');
  }

  async getTicketsMini(query: GetTicketsQuery): Promise<TicketsModel> {
    return this.httpService.postJson(query, 'api/VoidRequest/GetTicketsMini');
  }

  async getVoidedReason(subId: number, sportTypeId: number): Promise<VoidedReason> {
    return this.httpService.postJson({subId: subId, sportTypeId: sportTypeId}, `api/VoidRequest/GetVoidedReason`);
  }

  async insertQueue(query: VoidTicketsQuery): Promise<Result<InsertQueueResult>> {
    return this.httpService.postJson(query, 'api/VoidRequest/InsertQueue');
  }

  async exportExcel(query: GetTicketsQuery) {
    const url = 'api/VoidRequest/ExportExcel';
    return this.httpService.downloadFile(query, url);
  }

  async getLastModifiedDate(requestId: number): Promise<RequestLastModifiedDate> {
    return this.httpService.postJson({requestId}, `api/VoidRequest/GetLastModifiedDate`);
  }
}
