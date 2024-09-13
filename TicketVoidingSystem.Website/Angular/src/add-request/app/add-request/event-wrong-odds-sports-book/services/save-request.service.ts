import { Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOddsSportsBookService } from './event-wrong-odds-sports-book.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class SaveRequestService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logInfoWrongOddsSportsBookService: LogInfoService,
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly eventWrongOddsSportsBookService: EventWrongOddsSportsBookService
  ) { }

  async saveRequest(argWrongOddsSportsBook: SaveRequestArg): Promise<void> {
    const isDataValid = argWrongOddsSportsBook.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOddsSportsBook);
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.proceedSaveRequest(argWrongOddsSportsBook);
    } else {
      argWrongOddsSportsBook.addRequestStore.changeSavingRequestStatus(false);
    }
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argWrongOddsSportsBook: SaveRequestArg): Promise<boolean> {
    argWrongOddsSportsBook.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoWrongOddsSportsBookService.resetLogInfoOfEvent(argWrongOddsSportsBook.logInfoEvent);

    if (!this.validationService.validateCommonData(argWrongOddsSportsBook.eventLeagueComponent, argWrongOddsSportsBook.filterWrongOddsSportsBookComponent, argWrongOddsSportsBook.advancedModeComponent)) {
      return false;
    }

    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(true);
    argWrongOddsSportsBook.primitiveProps.isShowValidation = false;
    await this.logInfoWrongOddsSportsBookService.getLogInfo(argWrongOddsSportsBook.logInfoEvent, argWrongOddsSportsBook.isEdit, argWrongOddsSportsBook.requestId, argWrongOddsSportsBook.filter, argWrongOddsSportsBook.primitiveProps);
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(false);
    argWrongOddsSportsBook.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argWrongOddsSportsBook.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    this.popupService.showConfirm(
      this.getMessageConfirmationWrongOddsSportsBook(arg),
      async () => {
        await this.onClickConfirmSave(arg);
      },
      () => {
        arg.addRequestStore.changeSavingRequestStatus(false);
      });
  }

  private getMessageConfirmationWrongOddsSportsBook(argWrongOddsSportsBook: SaveRequestArg): string {
    let message = '';
    if (argWrongOddsSportsBook.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError)) {
      message = `${message}<div>There are some warnings in this request.</div>`;
    }

    if (argWrongOddsSportsBook.isEdit && argWrongOddsSportsBook.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argWrongOddsSportsBook.filter.action !== argWrongOddsSportsBook.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;
    }

    if (argWrongOddsSportsBook.isEdit && argWrongOddsSportsBook.userId !== Number(document.getElementById('body').getAttribute('user-id'))) {
      message = `${message}<div style="color:red">Please remind this request ${argWrongOddsSportsBook.requestId} is confirmed by ${argWrongOddsSportsBook.requestedBy}.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }

  private async executeSaveRequestApi(argWrongOddsSportsBook: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongOddsSportsBook);
    await this.addRequestService.executeSaveRequest(argWrongOddsSportsBook.isEdit, argWrongOddsSportsBook.requestId, query, argWrongOddsSportsBook.addRequestStore);
  }

  private async onClickConfirmSave(argWrongOddsSportsBook: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argWrongOddsSportsBook.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOddsSportsBook);
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argWrongOddsSportsBook);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(argWrongOddsSportsBook: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argWrongOddsSportsBook.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argWrongOddsSportsBook.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argWrongOddsSportsBook.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argWrongOddsSportsBook.filter.issueTypeId;
    query.isTest = argWrongOddsSportsBook.filter.isTest;
    query.actionId = argWrongOddsSportsBook.filter.action;
    query.isVoided = argWrongOddsSportsBook.filter.isVoided;

    query.mistakenBy = argWrongOddsSportsBook.others.mistakenBy;
    query.decidedBy = argWrongOddsSportsBook.others.decidedBy;
    query.remark = argWrongOddsSportsBook.others.remark;

    if (!argWrongOddsSportsBook.filter.isVoided) {
      query.wrongOddsSportsBookInfo= this.eventWrongOddsSportsBookService.getWrongOddsSportsBookModel(
        argWrongOddsSportsBook.logInfoEvent, argWrongOddsSportsBook.filter.subIssueTypeId);
    }

    return query;
  }
}