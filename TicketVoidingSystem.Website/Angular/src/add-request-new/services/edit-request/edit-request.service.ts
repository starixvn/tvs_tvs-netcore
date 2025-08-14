import { inject, Injectable } from '@angular/core';
import { EventBaseService } from '../../../add-request-new/component/event-base-layout/event-base.service';
import { RequestModel } from '../../models/request.model';
import { AddRequestApiService } from '../add-request-api.service';
import { LogInfoService } from './log-info.service';
import { ObjectService } from './object.service';
import { IssueTypeConstant } from '../../../utility/constants/issue-type.constant';
import { PrimitiveProperty } from '../../../add-request-new/models/primitive-property.model';

@Injectable({
  providedIn: 'root'
})
export class EditRequestService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly objectService = inject(ObjectService);
  private readonly eventBaseService = inject(EventBaseService);

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
    if (detailViewModel === null) {
      this.eventBaseService.backToAccessDeniedPage();
    } else {
      const newPrimitiveProperty = this.objectService.getPrimitiveProperty(detailViewModel, requestId);
      Object.assign(primitiveProperty, newPrimitiveProperty);
      await this.logInfoService.getLogInfo(primitiveProperty, detailViewModel);
      this.objectService.mapRequestModel(requestModel, detailViewModel, primitiveProperty);
    }
  }

  getIssueTypeId(): string | undefined {
    const url = window.location.href.toLowerCase();
    
    for (const [key, value] of IssueTypeConstant.NAVIGATE_ADD_REQUEST.entries()) {
      if (url.includes(value.toLowerCase())) {
        return key;
      }
    }
    
    this.eventBaseService.backToAccessDeniedPage();
  }
}
