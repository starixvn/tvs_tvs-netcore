import { inject, Injectable } from '@angular/core';
import { TEXT } from '../../../../../../utility/constants/text';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { AddRequestService } from '../../../../../services/add-request.service';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventNotParticipateService } from './event-not-participate.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoNotParticipateService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventNotParticipateService = inject(EventNotParticipateService);

  async saveRequest(argNotParticipate: SaveRequestArg): Promise<void> {
    const isDataValid = argNotParticipate.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argNotParticipate);
    argNotParticipate.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argNotParticipate);
    } else {
      argNotParticipate.addRequestStore.changeSavingRequestStatus(false);
    }
    argNotParticipate.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argNotParticipate: SaveRequestArg): Promise<boolean> {
    argNotParticipate.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoNotParticipateService.resetLogInfoOfEvent(argNotParticipate.logInfoEvent);

    if (!this.validationService.validateCommonData(argNotParticipate.eventLeagueComponent, argNotParticipate.filterNotParticipateComponent)) {
      return false;
    }

    argNotParticipate.addRequestStore.changeBlockingUiStatus(true);
    argNotParticipate.primitiveProps.isShowValidation = false;
    argNotParticipate.primitiveProps.infoSiteDBDownModel = null;
    await this.logInfoNotParticipateService.getLogInfo(argNotParticipate.logInfoEvent, argNotParticipate.isEdit, argNotParticipate.requestId, argNotParticipate.filter, argNotParticipate.primitiveProps);
    argNotParticipate.addRequestStore.changeBlockingUiStatus(false);
    argNotParticipate.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argNotParticipate.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private async executeSaveRequestApi(argNotParticipate: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argNotParticipate);
    await this.addRequestService.executeSaveRequest(argNotParticipate.isEdit, argNotParticipate.requestId, query, argNotParticipate.addRequestStore);
  }

  async onClickConfirmSave(argNotParticipate: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argNotParticipate.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argNotParticipate);
    argNotParticipate.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argNotParticipate);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argNotParticipate.addRequestStore.changeBlockingUiStatus(false);
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoDetail?.settleCount > 0;
      arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.messageValidationLogInfo?.length > 0;
    }
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
  }

  private initAddRequestQuery(argNotParticipate: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argNotParticipate.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argNotParticipate.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argNotParticipate.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argNotParticipate.filter.issueTypeId;
    query.isTest = argNotParticipate.filter.isTest;
    query.actionId = argNotParticipate.filter.action;
    query.isVoided = argNotParticipate.filter.isVoided;

    query.mistakenBy = argNotParticipate.others.mistakenBy;
    query.decidedBy = argNotParticipate.others.decidedBy;
    query.remark = argNotParticipate.others.remark;

    if (!argNotParticipate.filter.isVoided) {
      query.notParticipateInfo = this.eventNotParticipateService.getNotParticipateModel(Number(argNotParticipate.filter.subIssueTypeId), argNotParticipate.logInfoEvent);
      query.siteDBDownInfoJson = argNotParticipate.confirmAddRequest.isMarkTicketSiteDbDown
        ? argNotParticipate.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }
}