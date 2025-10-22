import { inject, Injectable } from '@angular/core';
import { PrimitiveProperty } from '../../models/primitive-property.model';
import { RequestModel } from '../../models/request.model';
import { AddRequestApiService } from '../add-request-api.service';
import { LogInfoService } from './log-info.service';
import { ObjectService } from './object.service';

@Injectable({
  providedIn: 'root'
})
export class EditRequestService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly objectService = inject(ObjectService);

  getRequestId() {
    const url = window.location.href;
    const params = url.split('/');

    return parseInt(params[params.length - 1], 10);
  }

  isActionEditRequest() {
    const pathname = window.location.pathname.toLowerCase();
    return pathname.includes('/edit/');
  }

  async getDataEditRequest(requestId: number, requestModel: RequestModel, primitiveProperty: PrimitiveProperty){
    const detailViewModel = await this.addRequestApiService.getRequestById(requestId);
    if (detailViewModel !== null) {
      const newPrimitiveProperty = this.objectService.getPrimitiveProperty(detailViewModel, requestId);
      Object.assign(primitiveProperty, newPrimitiveProperty);
      await this.logInfoService.getLogInfo(primitiveProperty, detailViewModel);
      this.objectService.mapRequestModel(requestModel, detailViewModel, primitiveProperty);
    }
  }
}
