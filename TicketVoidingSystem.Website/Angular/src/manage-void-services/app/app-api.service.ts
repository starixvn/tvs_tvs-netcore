import { inject, Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../edit-request/app/request.model';
import { Result } from '../../utility/models/result';
import { HttpService } from '../../utility/services/http.service';
import { SelectVoidBetAutomationInfoQuery, VoidBetAutomationModel } from './app.model';
import { InsertBetTicket14ResultModel } from './correct-summary-ticket/correct-summary-ticket.model';
import { GetLetsTalkModel, LetsTalkModel, UpdateLetsTalkModel } from './letstalk/letstalk.model';
import { AutoVoidRequestQueueModel, GetAutoVoidRequestQueueModel, UpdateAutoVoidRequestQueueModel } from './scanning-auto-void/scanning-auto-void.model';
import { TicketVoidingQueueModel, UpdateTicketVoidingQueueModel } from './void/void.model';
import { UpdateVoidingHistory, VoidingHistoryModel } from './voiding-history/voiding-history.model';

@Injectable({
  providedIn: 'root'
})
export class AppApiService {
  private readonly httpService = inject(HttpService);

  async getVoidBetAutomationInfo(query: SelectVoidBetAutomationInfoQuery): Promise<VoidBetAutomationModel> {
    return this.httpService.postJson(query, `api/ManageVoidServices/GetVoidBetAutomationServiceInfo`);
  }

  async updateVoidBetAutomationInfo(model: VoidBetAutomationModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateVoidBetAutomationServiceInfo`);
  }

  async getAutoVoidRequestQueue(model: GetAutoVoidRequestQueueModel): Promise<AutoVoidRequestQueueModel[]> {
    return this.httpService.postJson(model, `api/ManageVoidServices/GetAutoVoidRequestQueue`);
  }

  async updateAutoVoidRequestQueue(model: UpdateAutoVoidRequestQueueModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateAutoVoidRequestQueue`);
  }

  async getTicketVoidingQueue(voidingHistoryId: number): Promise<TicketVoidingQueueModel[]> {
    return this.httpService.postJson({ voidingHistoryId }, `api/ManageVoidServices/GetTicketVoidingQueue`);
  }

  async updateTicketVoidingQueue(model: UpdateTicketVoidingQueueModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateTicketVoidingQueue`);
  }

  async getVoidingHistory(requestId: number): Promise<VoidingHistoryModel[]> {
    return this.httpService.postJson({ requestId }, `api/ManageVoidServices/GetVoidingHistory`);
  }

  async updateVoidingHistory(model: UpdateVoidingHistory): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateVoidingHistory`);
  }

  async getLetsTalk(model: GetLetsTalkModel): Promise<LetsTalkModel[]> {
    return this.httpService.postJson(model, `api/ManageVoidServices/GetLetstalk`);
  }

  async updateLetstalk(model: UpdateLetsTalkModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateLetstalk`);
  }

  async getRequestNoAuth(id: number): Promise<RequestDetailViewModel> {
    return this.httpService.getJson(`api/ManageRequest/GetRequestNoAuth/${id}`);
  }

  async insertBetTicket14(transIds: string): Promise<InsertBetTicket14ResultModel> {
    return this.httpService.postJson({ transIds }, `api/ManageVoidServices/InsertBetTicket14`);
  }

  async updateSummaryTicket19999(): Promise<Result<null>> {
    return this.httpService.getJson(`api/ManageVoidServices/UpdateSummaryTicket19999`);
  }
}
