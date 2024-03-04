import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestStore } from './add-request.store';
import { AddRequestQuery } from './models/add-request.query';
import { AddRequestResultModel } from './models/request.model';
import { PopupService } from './services/popup.service';

@Injectable({
  providedIn: 'root'
})
export class AddRequestService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly popupService: PopupService,
    private readonly commonService: CommonService
  ) { }

  async executeSaveRequest(isEdit: boolean, requestId: number, query: AddRequestQuery, addRequestStore: AddRequestStore, isSaveAndVoid?: boolean): Promise<void> {
    if (isEdit) {
      query.requestId = requestId;
      await this.editRequest(query, addRequestStore, isSaveAndVoid);
    } else {
      await this.addRequest(query, query.issueTypeId, addRequestStore, isSaveAndVoid);
    }
  }

  private async addRequest(query: AddRequestQuery, issueTypeId: string, addRequestStore: AddRequestStore, isSaveAndVoid: boolean): Promise<void> {
    addRequestStore.changeSavingRequestStatus(true);
    query.guid = `AddRequest-${Guid.create().toString()}`;
    const result = await this.addRequestApiService.addRequest(query);
    if (result) {
      this.handleAfterAddRequest(result, issueTypeId, addRequestStore, isSaveAndVoid);
    } else {
      this.getAddResultCache(query.guid, issueTypeId, addRequestStore, isSaveAndVoid);
    }
  }

  private getAddResultCache(guid: string, issueTypeId: string, addRequestStore: AddRequestStore, isSaveAndVoid: boolean) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const result = await this.commonService.getResultCache<AddRequestResultModel>(guid);
        if (result) {
          this.handleAfterAddRequest(result, issueTypeId, addRequestStore, isSaveAndVoid);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  private handleAfterAddRequest(addResult: Result<AddRequestResultModel>, issueTypeId: string, addRequestStore: AddRequestStore, isSaveAndVoid: boolean) {
    if (addResult.isSuccessful) {
      if (isSaveAndVoid) {
        this.goToVoidPage(Number(addResult.data.requestId));
      } else {
        this.isShowResultWithoutMatches(issueTypeId)
          ? this.popupService.showAddedRequestSuccessful(addResult.data.requestId, () => this.reloadPageOrBackToManagePage(issueTypeId))
          : this.popupService.showAddedRequestSuccessfulWithMatches(addResult.data.requestId, addResult.data.matchId, () => this.reloadPageOrBackToManagePage(issueTypeId));
      }
    } else {
      this.popupService.showSaveRequestError(addResult.errorMsg, LABELS.ADD_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private async editRequest(query: AddRequestQuery, addRequestStore: AddRequestStore, isSaveAndVoid: boolean) {
    addRequestStore.changeSavingRequestStatus(true);

    const result = await this.addRequestApiService.editRequest(query);
    if (result.isSuccessful) {
      this.popupService.showEditedRequestSuccessful(query.requestId, () => this.reloadPageOrBackToManagePage(query.issueTypeId));
    } else {
      this.popupService.showSaveRequestError(result.errorMsg, LABELS.EDIT_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private goToVoidPage(requestId: number): void {
    window.location.assign(`TicketVoidingSystem/VoidRequest/Index/${requestId}`);
  }

  private reloadPageOrBackToManagePage(issueTypeId: string) {
    StaticService.isAbnormalBet(issueTypeId) || StaticService.isAbnormalBetRealMember(issueTypeId) ?
      window.location.reload() : window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }

  private isShowResultWithoutMatches(issueTypeId: string): boolean {
    return StaticService.isAbnormalAccount(issueTypeId)
      || StaticService.isArchivedTicket(issueTypeId)
      || StaticService.isRecoverTicket(issueTypeId);
  }
}
