import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { ConfirmAddRequestModel } from '../../confirm-add-request/confirm-add-request.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventTechnicalErrorService } from './event-technical-error.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoTechnicalErrorService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventTechnicalErrorService = inject(EventTechnicalErrorService);

  async saveRequest(argTechnicalError: SaveRequestArg): Promise<void> {
    const isDataValid = argTechnicalError.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argTechnicalError);
    argTechnicalError.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argTechnicalError);
    } else {
      argTechnicalError.addRequestStore.changeSavingRequestStatus(false);
    }
    argTechnicalError.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argTechnicalError: SaveRequestArg): Promise<boolean> {
    argTechnicalError.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoTechnicalErrorService.resetLogInfoOfEvent(argTechnicalError.logInfoEvent);

    if (!this.validationService.validateCommonData(argTechnicalError.eventLeagueComponent, argTechnicalError.filterTimeComponent, argTechnicalError.advancedModeComponent)) {
      return false;
    }

    argTechnicalError.addRequestStore.changeBlockingUiStatus(true);
    argTechnicalError.primitiveProps.isShowValidation = false;
    await this.logInfoTechnicalErrorService.getLogInfo(argTechnicalError.logInfoEvent, argTechnicalError.isEdit, argTechnicalError.requestId, argTechnicalError.filter, argTechnicalError.primitiveProps);
    argTechnicalError.addRequestStore.changeBlockingUiStatus(false);
    argTechnicalError.primitiveProps.isShowValidation = true;

    return this.validationService.isValidLogInfoEvent(argTechnicalError.logInfoEvent);
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
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
    arg.confirmAddRequest =  new ConfirmAddRequestModel();
  }

  private async executeSaveRequestApi(argTechnicalError: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argTechnicalError);
    await this.addRequestService.executeSaveRequest(argTechnicalError.isEdit, argTechnicalError.requestId, query, argTechnicalError.addRequestStore);
  }

  async onClickConfirmSave(argTechnicalError: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argTechnicalError.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argTechnicalError);
    argTechnicalError.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argTechnicalError);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argTechnicalError.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(argTechnicalError: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argTechnicalError.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argTechnicalError.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argTechnicalError.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argTechnicalError.filter.issueTypeId;
    query.isTest = argTechnicalError.filter.isTest;
    query.actionId = argTechnicalError.filter.action;
    query.isVoided = argTechnicalError.filter.isVoided;

    query.mistakenBy = argTechnicalError.others.mistakenBy;
    query.decidedBy = argTechnicalError.others.decidedBy;
    query.remark = argTechnicalError.others.remark;

    if (!argTechnicalError.filter.isVoided) {
      query.technicalErrorInfo = this.eventTechnicalErrorService.getTechnicalErrorModel(Number(argTechnicalError.filter.subIssueTypeId), argTechnicalError.logInfoEvent);
    }

    return query;
  }
}