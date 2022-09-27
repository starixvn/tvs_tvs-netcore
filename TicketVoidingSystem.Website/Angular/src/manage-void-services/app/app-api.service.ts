import { Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { SelectVoidBetAutomationInfoQuery, VoidBetAutomationModel } from './app.model';
import { VoidServiceModel } from './checking-void-status/checking-void-status.model';
import { AutoVoidRequestQueueModel, UpdateAutoVoidRequestQueueModel } from './scanning-auto-void/scanning-auto-void.model';
import { TicketVoidingQueueModel } from './void/void.model';

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

  async getAutoVoidRequestQueue(broadcastSessionId: string): Promise<AutoVoidRequestQueueModel[]> {
    return this.httpService.postJson<any, AutoVoidRequestQueueModel[]>({ broadcastSessionId }, `api/ManageVoidServices/GetAutoVoidRequestQueue`);
  }

  async updateAutoVoidRequestQueue(model: UpdateAutoVoidRequestQueueModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateAutoVoidRequestQueue`);
  }

  async getTicketVoidingQueue(voidingHistoryId: number): Promise<TicketVoidingQueueModel[]> {
    return this.httpService.postJson<any, TicketVoidingQueueModel[]>({ voidingHistoryId }, `api/ManageVoidServices/GetTicketVoidingQueue`);
  }

  // async updateTicketVoidingQueue(model: UpdateAutoVoidRequestQueueModel): Promise<boolean> {
  //   return this.httpService.postJson(model, `api/ManageVoidServices/UpdateTicketVoidingQueue`);
  // }

  async getVoidServiceData(broadcastSessionId: string): Promise<VoidServiceModel[]> {
    return this.httpService.postJson<any, VoidServiceModel[]>({ broadcastSessionId }, `api/ManageVoidServices/GetVoidServiceData`);
  }

  async updateVoidServiceData(broadcastSessionId: string): Promise<VoidServiceModel[]> {
    return this.httpService.postJson<any, VoidServiceModel[]>({ broadcastSessionId }, `api/ManageVoidServices/GetVoidServiceData`);
  }
}
