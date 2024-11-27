import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
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
      this.showPopupConfirmSave(argWrongOddsSportsBook);
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

    if (!this.validationService.isAccountHasAddRequestPermission(argWrongOddsSportsBook.filter.action, argWrongOddsSportsBook.logInfoEvent.isHasInstantlySettledTicket,
      argWrongOddsSportsBook.logInfoEvent.isHasSettledTicket, argWrongOddsSportsBook.permission)) {
      argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(false);
      return false;
    }

    argWrongOddsSportsBook.primitiveProps.isShowValidation = true;
    argWrongOddsSportsBook.addRequestStore.changeBlockingUiStatus(false);

    if (this.validationService.isValidLogInfoEvent(argWrongOddsSportsBook.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
    arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoDetail?.settleCount > 0;
    arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.messageValidationLogInfo?.length > 0;
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
  }

  private async executeSaveRequestApi(argWrongOddsSportsBook: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongOddsSportsBook);
    await this.addRequestService.executeSaveRequest(argWrongOddsSportsBook.isEdit, argWrongOddsSportsBook.requestId, query, argWrongOddsSportsBook.addRequestStore);
  }

  async onClickConfirmSave(argWrongOddsSportsBook: SaveRequestArg) {
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
      query.wrongOddsSportsBookInfo = this.eventWrongOddsSportsBookService.getWrongOddsSportsBookModel(
        argWrongOddsSportsBook.logInfoEvent, argWrongOddsSportsBook.filter.subIssueTypeId);
    }

    return query;
  }
}