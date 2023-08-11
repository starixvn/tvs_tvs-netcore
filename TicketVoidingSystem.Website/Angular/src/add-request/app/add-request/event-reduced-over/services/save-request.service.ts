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

  async recheckLogInfoBeforeSaveRequest(argWrongOdds: SaveRequestArg): Promise<boolean> {
    argWrongOdds.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoReducedOverService.resetLogInfoOfEvent(argWrongOdds.logInfoEvent);

    if (!this.validationService.validateCommonData(argWrongOdds.leagueEventReducedOverComponent, argWrongOdds.filterReducedOverComponent)) {
      return false;
    }

    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    argWrongOdds.primitiveProps.isShowValidation = false;
    await this.logInfoReducedOverService.getLogInfo(argWrongOdds.logInfoEvent, argWrongOdds.isEdit, argWrongOdds.requestId, argWrongOdds.filter, argWrongOdds.primitiveProps);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
    argWrongOdds.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argWrongOdds.logInfoEvent)) {
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

  private async executeSaveRequestApi(argWrongOdds: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongOdds);
    await this.addRequestService.executeSaveRequest(argWrongOdds.isEdit, argWrongOdds.requestId, query, argWrongOdds.addRequestStore);
  }

  private async onClickConfirmSave(argWrongOdds: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argWrongOdds.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOdds);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argWrongOdds);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(argWrongOdds: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argWrongOdds.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argWrongOdds.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argWrongOdds.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argWrongOdds.filter.issueTypeId;
    query.isTest = argWrongOdds.filter.isTest;
    query.actionId = argWrongOdds.filter.action;
    query.sportType = argWrongOdds.filter.sportType;
    query.isVoided = argWrongOdds.filter.isVoided;

    query.mistakenBy = argWrongOdds.others.mistakenBy;
    query.decidedBy = argWrongOdds.others.decidedBy;
    query.remark = argWrongOdds.others.remark;

    if (!argWrongOdds.filter.isVoided) {
      query.reducedOverInfo = this.eventReducedOverService.getReducedOverModel(Number(argWrongOdds.filter.subIssueTypeId), argWrongOdds.logInfoEvent);
    }

    return query;
  }
}