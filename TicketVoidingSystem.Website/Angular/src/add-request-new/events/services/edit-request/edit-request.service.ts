import { inject, Injectable } from '@angular/core';
import { RequestModel } from '../../models/request.model';
import { SignalRService } from '../../../../utility/services/signal-r.service.native';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { AddRequestApiService } from '../add-request-api.service';
import { LogInfoService } from './log-info.service';
import { ObjectService } from './object.service';

@Injectable({
  providedIn: 'root'
})
export class EditRequestService {
  addRequestApiService = inject(AddRequestApiService);
  signalRService = inject(SignalRService);
  logInfoService = inject(LogInfoService);
  objectService = inject(ObjectService);
  
  getRequestId() {
    const url = window.location.href;
    const params = url.split('/');

    return parseInt(params[params.length - 1], 10);
  }

  isActionEditRequest() {
    const url = window.location.href;
    return url.includes('/Edit');
  }

  async getDataEditRequest(requestId: number, requestModel: RequestModel, primitiveProperty: PrimitiveProperty){
    let detailViewModel = await this.addRequestApiService.getRequestById(requestId);
    primitiveProperty = this.objectService.getPrimitiveProperty(detailViewModel, requestId);
    await this.logInfoService.getLogInfo(primitiveProperty, detailViewModel);
    this.objectService.mapRequestModel(requestModel, detailViewModel, primitiveProperty);
  }
}
