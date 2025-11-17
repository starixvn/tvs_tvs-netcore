import { inject, Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { TEXT } from '../../utility/constants/text';
import { Result } from '../../utility/models/result';
import { CommonService } from '../../utility/services/common.service';
import { StaticService } from '../../utility/services/static.service';
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
    query.sessionTime = addRequestStore.getTimeFilterTicket();
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
      this.popupService.showSaveRequestError(addResult.errorMsg, TEXT.ADD_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private async editRequest(query: AddRequestQuery, addRequestStore: AddRequestStore) {
    addRequestStore.changeSavingRequestStatus(true);

    const result = await this.addRequestApiService.editRequest(query);
    if (result.isSuccessful) {
      this.popupService.showEditedRequestSuccessful(result.data, () => this.reloadPageOrBackToManagePage(query.issueTypeId));
    } else {
      this.popupService.showSaveRequestError(result.errorMsg, TEXT.EDIT_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private reloadPageOrBackToManagePage(issueTypeId: string) {
    StaticService.isAbnormalBet(issueTypeId)
      ? window.location.reload()
      : window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }
}
