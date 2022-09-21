import { Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { SelectVoidBetAutomationInfoQuery, VoidBetAutomationModel } from './app.model';
import { AutoVoidRequestQueueModel } from './scanning-auto-void/scanning-auto-void.model';

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

  async getAutoVoidRequestQueue(broadcastSessionId: string): Promise<AutoVoidRequestQueueModel> {
    return this.httpService.postJson({broadcastSessionId}, `api/ManageVoidServices/GetAutoVoidRequestQueue`);
  }
}
