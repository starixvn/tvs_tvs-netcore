import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../utility/constants/config';
import { LABELS } from '../../../utility/constants/labels';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { StaticService } from '../../../utility/services/static.service';
import { AddRequestApiService } from './add-request-api.service';
import { AddRequestStore } from './add-request.store';
import { AddRequestQuery } from './models/add-request.query';
import { AddRequestResultModel, RequestModel } from './models/request.model';
import { TransInfoAddRequestModel } from './models/trans-info-add-request.model';
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

  async executeSaveRequest(isEdit: boolean, requestId: number, query: AddRequestQuery, addRequestStore: AddRequestStore): Promise<void> {
    if (isEdit) {
      query.requestId = requestId;
      await this.editRequest(query, addRequestStore);
    } else {
      await this.addRequest(query, query.issueTypeId, addRequestStore);
    }
  }

  private async addRequest(query: AddRequestQuery, issueTypeId: string, addRequestStore: AddRequestStore): Promise<void> {
    addRequestStore.changeSavingRequestStatus(true);
    query.guid = `AddRequest-${Guid.create().toString()}`;
    const result = await this.addRequestApiService.addRequest(query);
    if (result) {
      this.handleAfterAddRequest(result, issueTypeId, addRequestStore);
    } else {
      this.getAddResultCache(query.guid, issueTypeId, addRequestStore);
    }
  }

  private getAddResultCache(guid: string, issueTypeId: string, addRequestStore: AddRequestStore) {
    let isChecking = false;
    const interval = setInterval(async () => {
      if (!isChecking) {
        isChecking = true;
        const result = await this.commonService.getResultCache<AddRequestResultModel>(guid);
        if (result) {
          this.handleAfterAddRequest(result, issueTypeId, addRequestStore);
          clearInterval(interval);
        }
        isChecking = false;
      }
    }, 2000);
  }

  private handleAfterAddRequest(addResult: Result<AddRequestResultModel>, issueTypeId: string, addRequestStore: AddRequestStore) {
    if (addResult.isSuccessful) {
      StaticService.isAbnormalAccount(issueTypeId) || StaticService.isArchivedTicket(issueTypeId) ?
        this.popupService.showAddedRequestSuccessful(addResult.data.requestId,
          () => this.reloadPageOrBackToManagePage(issueTypeId))
         : this.popupService.showAddedRequestSuccessfulWithMatches(addResult.data.requestId, addResult.data.matchId,
          () => this.reloadPageOrBackToManagePage(issueTypeId));
    } else {
      this.popupService.showSaveRequestError(addResult.errorMsg, LABELS.ADD_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private async editRequest(query: AddRequestQuery, addRequestStore: AddRequestStore) {
    addRequestStore.changeSavingRequestStatus(true);

    const result = await this.addRequestApiService.editRequest(query);
    if (result.isSuccessful) {
      this.popupService.showEditedRequestSuccessful(query.requestId, () => this.reloadPageOrBackToManagePage(query.issueTypeId));
    } else {
      this.popupService.showSaveRequestError(result.errorMsg, LABELS.EDIT_REQUEST_RESULT_TITLE);
    }

    addRequestStore.changeSavingRequestStatus(false);
  }

  private reloadPageOrBackToManagePage(issueTypeId: string) {
    StaticService.isAbnormalBet(issueTypeId) || StaticService.isAbnormalBetRealMember(issueTypeId) ?
      window.location.reload() : window.location.assign(`TicketVoidingSystem/ManageRequest/Index`);
  }
}

export class EarlyKickOffService {
  static initAddRequestQuery(requestModel: RequestModel, transInfoAddRequestModel: TransInfoAddRequestModel): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = transInfoAddRequestModel?.markTransIds;

    query.issueTypeId = requestModel.filter.issueTypeId;
    query.subIssueTypeId = requestModel.filter.subIssueTypeId;
    query.actionId = requestModel.filter.action;
    query.isTest = requestModel.filter.isTest;
    query.sportType = requestModel.filter.sportType;
    query.matchId = requestModel.eventDetail.matchId;
    query.kickOffTime = moment(requestModel.eventDetail.kickOffTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    query.isVoided = requestModel.filter.isVoided;

    query.mistakenBy = requestModel.others.mistakenBy;
    query.decidedBy = requestModel.others.decidedBy;
    query.operatorsList = requestModel.others.operatorsList;
    query.provider = requestModel.others.provider;
    query.source = requestModel.others.source;
    query.remark = requestModel.others.remark;

    return query;
  }
}
