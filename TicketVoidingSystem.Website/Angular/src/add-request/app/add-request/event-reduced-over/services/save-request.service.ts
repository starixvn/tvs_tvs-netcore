import { Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventReducedOverService } from './event-reduced-over.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class SaveRequestService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logInfoReducedOverService: LogInfoService,
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly eventReducedOverService: EventReducedOverService
  ) { }

  async saveRequest(argReducedOver: SaveRequestArg): Promise<void> {
    const isDataValid = argReducedOver.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argReducedOver);
    argReducedOver.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.proceedSaveRequest(argReducedOver);
    } else {
      argReducedOver.addRequestStore.changeSavingRequestStatus(false);
    }
    argReducedOver.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argReducedOver: SaveRequestArg): Promise<boolean> {
    argReducedOver.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoReducedOverService.resetLogInfoOfEvent(argReducedOver.logInfoEvent);

    if (!this.validationService.validateCommonData(argReducedOver.leagueEventReducedOverComponent, argReducedOver.filterReducedOverComponent)) {
      return false;
    }

    argReducedOver.addRequestStore.changeBlockingUiStatus(true);
    argReducedOver.primitiveProps.isShowValidation = false;
    await this.logInfoReducedOverService.getLogInfo(argReducedOver.logInfoEvent, argReducedOver.isEdit, argReducedOver.requestId, argReducedOver.filter, argReducedOver.primitiveProps);
    argReducedOver.addRequestStore.changeBlockingUiStatus(false);
    argReducedOver.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argReducedOver.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    if (this.validationService.checkCanShowConfirmationReducedOver(arg)) {
      this.popupService.showConfirm(
        this.getMessageConfirmationReducedOver(arg),
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

  private getMessageConfirmationReducedOver(argReducedOver: SaveRequestArg): string {
    let message = '';
    if (argReducedOver.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError)) {
      message = `${message}<div>There are some warnings in this request.</div>`;
    }

    if (argReducedOver.isEdit && argReducedOver.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argReducedOver.filter.action !== argReducedOver.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;
    }

    if (argReducedOver.isEdit && argReducedOver.userId !== Number(document.getElementById('body').getAttribute('user-id'))) {
      message = `${message}<div style="color:red">Please remind this request ${argReducedOver.requestId} is confirmed by ${argReducedOver.requestedBy}.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }

  private async executeSaveRequestApi(argReducedOver: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argReducedOver);
    await this.addRequestService.executeSaveRequest(argReducedOver.isEdit, argReducedOver.requestId, query, argReducedOver.addRequestStore);
  }

  private async onClickConfirmSave(argReducedOver: SaveRequestArg) {
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
    query.sportType = argReducedOver.filter.sportType;
    query.isVoided = argReducedOver.filter.isVoided;

    query.mistakenBy = argReducedOver.others.mistakenBy;
    query.decidedBy = argReducedOver.others.decidedBy;
    query.remark = argReducedOver.others.remark;

    if (!argReducedOver.filter.isVoided) {
      query.reducedOverInfo = this.eventReducedOverService.getReducedOverModel(Number(argReducedOver.filter.subIssueTypeId), argReducedOver.logInfoEvent);
    }

    return query;
  }
}