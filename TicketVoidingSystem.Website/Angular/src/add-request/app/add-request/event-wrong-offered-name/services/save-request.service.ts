import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOfferedNameService } from './event-wrong-offered-name.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly validationService = inject(ValidationService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly eventWrongOfferedNameService = inject(EventWrongOfferedNameService);

  async saveRequest(argWrongOfferedName: SaveRequestArg): Promise<void> {
    const isDataValid = argWrongOfferedName.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOfferedName);
    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argWrongOfferedName);
    } else {
      argWrongOfferedName.addRequestStore.changeSavingRequestStatus(false);
    }
    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argWrongOfferedName: SaveRequestArg): Promise<boolean> {
    argWrongOfferedName.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(argWrongOfferedName.logInfoEvent);

    if (!this.validationService.validateCommonData(argWrongOfferedName.eventLeagueComponent, argWrongOfferedName.filterWrongOfferedNameComponent)) {
      return false;
    }

    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(true);
    argWrongOfferedName.primitiveProps.isShowLogInfo = false;
    await this.logInfoService.getLogInfo(argWrongOfferedName.logInfoEvent, argWrongOfferedName.isEdit, argWrongOfferedName.requestId,
      argWrongOfferedName.filter, argWrongOfferedName.primitiveProps);

    if (!this.validationService.isAccountHasAddRequestPermission(argWrongOfferedName.filter.action, argWrongOfferedName.logInfoEvent.isHasInstantlySettledTicket,
      argWrongOfferedName.logInfoEvent.isHasSettledTicket, argWrongOfferedName.permission)) {
      argWrongOfferedName.addRequestStore.changeBlockingUiStatus(false);
      return false;
    }

    argWrongOfferedName.primitiveProps.isShowLogInfo = true;
    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(false);

    return this.validationService.isValidLogInfoEvent(argWrongOfferedName.logInfoEvent);
  }

  async onClickConfirmSave(argWrongOfferedName: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argWrongOfferedName.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOfferedName);
    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argWrongOfferedName);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argWrongOfferedName.addRequestStore.changeBlockingUiStatus(false);
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
    arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoDetail?.settleCount > 0;
    arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.messageValidationLogInfo?.length > 0;
    arg.confirmAddRequest.isShowSubIssueType = true;
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
  }

  private async executeSaveRequestApi(argWrongOfferedName: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongOfferedName);
    await this.addRequestService.executeSaveRequest(argWrongOfferedName.isEdit, argWrongOfferedName.requestId, query, argWrongOfferedName.addRequestStore);
  }

  private initAddRequestQuery(argWrongOfferedName: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argWrongOfferedName.primitiveProps.transInfoAddRequest?.transInfoJson;
    query.unMarkTransIds = argWrongOfferedName.primitiveProps.transInfoAddRequest?.unMarkTransIds;
    query.markTransIds = argWrongOfferedName.primitiveProps.transInfoAddRequest?.markTransIds;
    query.issueTypeId = argWrongOfferedName.filter.issueTypeId;
    query.isTest = argWrongOfferedName.filter.isTest;
    query.actionId = argWrongOfferedName.filter.action;
    query.isVoided = argWrongOfferedName.filter.isVoided;
    query.mistakenBy = argWrongOfferedName.others.mistakenBy;
    query.decidedBy = argWrongOfferedName.others.decidedBy;
    query.remark = argWrongOfferedName.others.remark;
    if (!argWrongOfferedName.filter.isVoided) {
      query.wrongOfferedNameInfo = this.eventWrongOfferedNameService.initWrongMarketOfferedModel(
        Number(argWrongOfferedName.filter.subIssueTypeId), argWrongOfferedName.logInfoEvent);
    }

    return query;
  }
}