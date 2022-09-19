import { Injectable } from '@angular/core';
import { HttpService } from '../../utility/services/http.service';
import { SelectVoidBetAutomationInfoQuery, VoidBetAutomationModel } from './app.model';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  async getVoidBetAutomationInfo(query: SelectVoidBetAutomationInfoQuery): Promise<VoidBetAutomationModel> {
    return this.httpService.postJson(query, `api/ManageVoidServices/GetVoidBetAutomationServiceInfo`);
  }

  async updateVoidBetAutomationInfo(model: VoidBetAutomationModel): Promise<boolean> {
    return this.httpService.postJson(model, `api/ManageVoidServices/UpdateVoidBetAutomationServiceInfo`);
  }
}
