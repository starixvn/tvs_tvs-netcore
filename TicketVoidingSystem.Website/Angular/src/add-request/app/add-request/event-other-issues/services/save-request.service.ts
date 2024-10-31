import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventOtherIssuesService } from './event-other-issues.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class SaveRequestService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logInfoOtherIssuesService: LogInfoService,
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly eventOtherIssuesService: EventOtherIssuesService
  ) { }

  async saveRequest(argOtherIssues: SaveRequestArg): Promise<void> {
    const isDataValid = argOtherIssues.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argOtherIssues);
    argOtherIssues.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argOtherIssues);
    } else {
      argOtherIssues.addRequestStore.changeSavingRequestStatus(false);
    }
    argOtherIssues.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argOtherIssues: SaveRequestArg): Promise<boolean> {
    argOtherIssues.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoOtherIssuesService.resetLogInfoOfEvent(argOtherIssues.logInfoEvent);

    if (!this.validationService.validateCommonData(argOtherIssues.eventLeagueComponent, argOtherIssues.filterOtherIssuesComponent, argOtherIssues.advancedModeComponent)) {
      return false;
    }

    argOtherIssues.addRequestStore.changeBlockingUiStatus(true);
    argOtherIssues.primitiveProps.isShowValidation = false;
    await this.logInfoOtherIssuesService.getLogInfo(argOtherIssues.logInfoEvent, argOtherIssues.isEdit, argOtherIssues.requestId, argOtherIssues.filter, argOtherIssues.primitiveProps);

    if (!this.validationService.isAccountHasAddRequestPermission(argOtherIssues.filter.action, argOtherIssues.logInfoEvent.isHasInstantlySettledTicket,
      argOtherIssues.logInfoEvent.isHasSettledTicket, argOtherIssues.permission)) {
      argOtherIssues.addRequestStore.changeBlockingUiStatus(false);
      return false;
    }

    argOtherIssues.primitiveProps.isShowValidation = true;
    argOtherIssues.addRequestStore.changeBlockingUiStatus(false);

    if (this.validationService.isValidLogInfoEvent(argOtherIssues.logInfoEvent)) {
      return true;
    }

    return false;
  }

  async onClickConfirmSave(argOtherIssues: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argOtherIssues.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argOtherIssues);
    argOtherIssues.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argOtherIssues);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argOtherIssues.addRequestStore.changeBlockingUiStatus(false);
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
    arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoDetail?.settleCount > 0;
    arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.messageValidationLogInfo?.length > 0;
    arg.confirmAddRequest.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmAddRequest.voidAction = arg.filter.actions.find(x => x.value === arg.filter.action).name;
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
  }

  private async executeSaveRequestApi(argOtherIssues: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argOtherIssues);
    await this.addRequestService.executeSaveRequest(argOtherIssues.isEdit, argOtherIssues.requestId, query, argOtherIssues.addRequestStore);
  }

  private initAddRequestQuery(argOtherIssues: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argOtherIssues.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argOtherIssues.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argOtherIssues.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argOtherIssues.filter.issueTypeId;
    query.isTest = argOtherIssues.filter.isTest;
    query.actionId = argOtherIssues.filter.action;
    query.isVoided = argOtherIssues.filter.isVoided;
    query.mistakenBy = argOtherIssues.others.mistakenBy;
    query.decidedBy = argOtherIssues.others.decidedBy;
    query.remark = argOtherIssues.others.remark;
    if (!argOtherIssues.filter.isVoided) {
      query.otherIssuesInfo = this.eventOtherIssuesService.getOtherIssuesModel(
        argOtherIssues.logInfoEvent, argOtherIssues.filter.subIssueTypeId);
    }

    return query;
  }
}