import { inject, Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
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
      this.proceedSaveRequest(argNotParticipate);
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
    await this.logInfoNotParticipateService.getLogInfo(argNotParticipate.logInfoEvent, argNotParticipate.isEdit, argNotParticipate.requestId, argNotParticipate.filter, argNotParticipate.primitiveProps);
    argNotParticipate.addRequestStore.changeBlockingUiStatus(false);
    argNotParticipate.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argNotParticipate.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    if (this.validationService.checkCanShowConfirmationNotParticipate(arg)) {
      this.popupService.showConfirm(
        this.getMessageConfirmationNotParticipate(arg),
        async () => {
          await this.onClickConfirmSave(arg);
        },
        () => {
          arg.addRequestStore.changeSavingRequestStatus(false);
        });
    } else {
      this.executeSaveRequestApi(arg);
    }
  }

  private getMessageConfirmationNotParticipate(argNotParticipate: SaveRequestArg): string {
    let message = '';
    if (argNotParticipate.logInfoEvent.logInfoDetail.settleCount > 0) {
      message = `${message}<div class="text-red">The request has settled ticket(s).</div>`;
    }

    if (argNotParticipate.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError)) {
      message = `${message}<div>There are some warnings in this request.</div>`;
    }

    if (argNotParticipate.isEdit && argNotParticipate.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argNotParticipate.filter.action !== argNotParticipate.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;
    }

    if (argNotParticipate.isEdit && argNotParticipate.userId !== Number(document.getElementById('body').getAttribute('user-id'))) {
      message = `${message}<div style="color:red">Please remind this request ${argNotParticipate.requestId} is confirmed by ${argNotParticipate.requestedBy}.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }

  private async executeSaveRequestApi(argNotParticipate: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argNotParticipate);
    await this.addRequestService.executeSaveRequest(argNotParticipate.isEdit, argNotParticipate.requestId, query, argNotParticipate.addRequestStore);
  }

  private async onClickConfirmSave(argNotParticipate: SaveRequestArg) {
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
    }

    return query;
  }
}