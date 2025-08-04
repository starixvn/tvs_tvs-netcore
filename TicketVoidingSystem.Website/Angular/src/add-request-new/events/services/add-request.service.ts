import { inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { Guid } from 'guid-typescript';
import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AddRequestQuery } from '../models/add-request.query';
import { AddRequestResultModel } from '../models/request.model';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestStore } from './add-request.store';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class AddRequestService {

  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly popupService = inject(PopupService);
  private readonly commonService = inject(CommonService);

  async executeSaveRequest(isEdit: boolean, requestId: number, query: AddRequestQuery, addRequestStore: AddRequestStore): Promise<void> {
    if (isEdit) {
      query.requestId = requestId;
      await this.editRequest(query, addRequestStore);
    } else {
      await this.addRequest(query, addRequestStore);
    }
  }

  private async addRequest(query: AddRequestQuery, addRequestStore: AddRequestStore): Promise<void> {
    addRequestStore.changeSavingRequestStatus(true);
    query.guid = `AddRequest-${Guid.create().toString()}`;
    query.sessionTime = this.getTimeFilterTicket(addRequestStore);
    const result = await this.addRequestApiService.addRequest(query);
    if (result) {
      this.handleAfterAddRequest(query, result, addRequestStore);
    } else {
      this.getAddResultCache(query, addRequestStore);
    }
  }

  private getAddResultCache(query: AddRequestQuery, addRequestStore: AddRequestStore) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const result = await this.commonService.getResultCache<AddRequestResultModel>(query.guid);
        if (result) {
          this.handleAfterAddRequest(query, result, addRequestStore);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  private handleAfterAddRequest(query: AddRequestQuery, addResult: Result<AddRequestResultModel>, addRequestStore: AddRequestStore) {
    if (addResult.isSuccessful) {
      this.popupService.showAddedRequestSuccessful(query, addResult.data, () => this.reloadPageOrBackToManagePage(query.issueTypeId))
    } else {
      this.popupService.showSaveRequestError(query, addResult, LABELS.ADD_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private async editRequest(query: AddRequestQuery, addRequestStore: AddRequestStore) {
    addRequestStore.changeSavingRequestStatus(true);

    const result = await this.addRequestApiService.editRequest(query);
    if (result.isSuccessful) {
      this.popupService.showEditedRequestSuccessful(query, result.data, () => this.reloadPageOrBackToManagePage(query.issueTypeId));
    } else {
      this.popupService.showSaveRequestError(query, result, LABELS.EDIT_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private reloadPageOrBackToManagePage(issueTypeId: string) {
    StaticService.isAbnormalBet(issueTypeId)
      ? window.location.reload()
      : window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  private getTimeFilterTicket(addRequestStore: AddRequestStore): number {
    const startTime = addRequestStore.getStartTimeFilterTicket;
    return dayjs().diff(dayjs(startTime), 'second');
  }
}
