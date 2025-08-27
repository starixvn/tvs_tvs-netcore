import { inject, Injectable } from '@angular/core';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventOtherIssuesService } from './event-other-issues.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoOtherIssuesService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventOtherIssuesService = inject(EventOtherIssuesService);

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
    argOtherIssues.primitiveProps.infoSiteDBDownModel = null;
    await this.logInfoOtherIssuesService.getLogInfo(argOtherIssues.logInfoEvent, argOtherIssues.requestId, argOtherIssues.filter, argOtherIssues.primitiveProps);

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
    arg.confirmAddRequest.isShowSubIssueType = !StaticService.isMatchEarlyCompleted(arg.filter.issueTypeId);
    arg.confirmAddRequest.isOpen = true;
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
      const otherIssuesInfo = this.eventOtherIssuesService.getOtherIssuesModel(
        argOtherIssues.logInfoEvent, argOtherIssues.filter.subIssueTypeId, argOtherIssues.filter.issueTypeId);
      if(StaticService.isOtherIssues(argOtherIssues.filter.issueTypeId)){
        query.otherIssuesInfo = otherIssuesInfo;
      } else {
        query.matchEarlyCompletedInfo = otherIssuesInfo;
      }
      query.siteDBDownInfoJson = argOtherIssues.confirmAddRequest.isMarkTicketSiteDbDown
        ? argOtherIssues.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }
}