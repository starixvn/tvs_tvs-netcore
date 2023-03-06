import { Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { SelectVoidBetAutomationInfoQuery, VoidBetAutomationModel } from './app.model';
import { GetLetstalkModel, LetstalkModel, UpdateLetstalkModel } from './letstalk/letstalk.model';
import { AutoVoidRequestQueueModel, GetAutoVoidRequestQueueModel, UpdateAutoVoidRequestQueueModel } from './scanning-auto-void/scanning-auto-void.model';
import { TicketVoidingQueueModel, UpdateTicketVoidingQueueModel } from './void/void.model';
import { UpdateVoidingHistory, VoidingHistoryModel } from './voiding-history/voiding-history.model';

@Injectable()
export class AppApiService {
  constructor(
    private readonly httpService: HttpService
  ) { }

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
  
  async getLetstalk(model: GetLetstalkModel): Promise<LetstalkModel[]> {
    return this.httpService.postJson(model, `api/ManageVoidServices/GetLetstalk`);
  }

  async updateLetstalk(model: UpdateLetstalkModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateLetstalk`);
  }
}
