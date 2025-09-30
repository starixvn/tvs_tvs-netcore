import { inject, Injectable } from '@angular/core';
import { TEXT } from '../../../../../../utility/constants/text';
import { StaticService } from '../../../../../../utility/services/static.service';
import { AddRequestQuery } from '../../../../../models/add-request.query';
import { AddRequestService } from '../../../../../services/add-request.service';
import { PopupService } from '../../../../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventReducedOverService } from './event-reduced-over.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoReducedOverService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventReducedOverService = inject(EventReducedOverService);

  async saveRequest(argReducedOver: SaveRequestArg): Promise<void> {
    const isDataValid = argReducedOver.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argReducedOver);
    argReducedOver.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argReducedOver);
    } else {
      argReducedOver.addRequestStore.changeSavingRequestStatus(false);
    }
    argReducedOver.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argReducedOver: SaveRequestArg): Promise<boolean> {
    argReducedOver.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoReducedOverService.resetLogInfoOfEvent(argReducedOver.logInfoEvent);

    if (!this.validationService.validateCommonData(argReducedOver.eventLeagueComponent, argReducedOver.filterReducedOverComponent)) {
      return false;
    }

    argReducedOver.addRequestStore.changeBlockingUiStatus(true);
    argReducedOver.primitiveProps.isShowValidation = false;
    argReducedOver.primitiveProps.infoSiteDBDownModel = null;
    await this.logInfoReducedOverService.getLogInfo(argReducedOver.logInfoEvent, argReducedOver.isEdit, argReducedOver.requestId, argReducedOver.filter, argReducedOver.primitiveProps);
    argReducedOver.addRequestStore.changeBlockingUiStatus(false);
    argReducedOver.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argReducedOver.logInfoEvent)) {
      return true;
    }

    return false;
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

  private async executeSaveRequestApi(argReducedOver: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argReducedOver);
    await this.addRequestService.executeSaveRequest(argReducedOver.isEdit, argReducedOver.requestId, query, argReducedOver.addRequestStore);
  }

  public async onClickConfirmSave(argReducedOver: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argReducedOver.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argReducedOver);
    argReducedOver.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argReducedOver);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argReducedOver.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(argReducedOver: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argReducedOver.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argReducedOver.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argReducedOver.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argReducedOver.filter.issueTypeId;
    query.isTest = argReducedOver.filter.isTest;
    query.actionId = argReducedOver.filter.action;
    query.isVoided = argReducedOver.filter.isVoided;
    query.mistakenBy = argReducedOver.others.mistakenBy;
    query.decidedBy = argReducedOver.others.decidedBy;
    query.remark = argReducedOver.others.remark;

    if (!argReducedOver.filter.isVoided) {
      query.reducedOverInfo = this.eventReducedOverService.getReducedOverModel(Number(argReducedOver.filter.subIssueTypeId), argReducedOver.logInfoEvent);
      query.siteDBDownInfoJson = argReducedOver.confirmAddRequest.isMarkTicketSiteDbDown
        ? argReducedOver.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }
}