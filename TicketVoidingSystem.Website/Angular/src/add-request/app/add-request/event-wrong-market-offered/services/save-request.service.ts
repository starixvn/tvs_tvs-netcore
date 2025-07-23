import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongMarketOfferedService } from './event-wrong-market-offfered.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly logInfoService = inject(LogInfoService);
  private readonly validationService = inject(ValidationService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly popupService = inject(PopupService);
  private readonly eventWrongMarketOfferedService = inject(EventWrongMarketOfferedService);

  async saveRequest(argWrongMarketOffered: SaveRequestArg): Promise<void> {
    const isDataValid = argWrongMarketOffered.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongMarketOffered);
    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argWrongMarketOffered);
    } else {
      argWrongMarketOffered.addRequestStore.changeSavingRequestStatus(false);
    }
    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argWrongMarketOffered: SaveRequestArg): Promise<boolean> {
    argWrongMarketOffered.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(argWrongMarketOffered.logInfoEvent);

    if (!this.validationService.validateCommonData(argWrongMarketOffered.eventLeagueComponent, argWrongMarketOffered.filterTimeComponent, argWrongMarketOffered.advancedModeComponent)) {
      return false;
    }

    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(true);
    argWrongMarketOffered.primitiveProps.isShowValidation = false;
    await this.logInfoService.getLogInfo(argWrongMarketOffered.logInfoEvent, argWrongMarketOffered.isEdit, argWrongMarketOffered.requestId, argWrongMarketOffered.filter, argWrongMarketOffered.primitiveProps);
    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(false);
    argWrongMarketOffered.primitiveProps.isShowValidation = true;

    return this.validationService.isValidLogInfoEvent(argWrongMarketOffered.logInfoEvent);
  }

  private async executeSaveRequestApi(argWrongMarketOffered: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongMarketOffered);
    await this.addRequestService.executeSaveRequest(argWrongMarketOffered.isEdit, argWrongMarketOffered.requestId, query, argWrongMarketOffered.addRequestStore);
  }

  async onClickConfirmSave(argWrongMarketOffered: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = argWrongMarketOffered.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongMarketOffered);
    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(argWrongMarketOffered);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    argWrongMarketOffered.addRequestStore.changeBlockingUiStatus(false);
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoItems.some(x => x.logInfoDetail?.settleCount > 0);
      arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.logInfoItems.every(y => y.messageValidationLogInfo.length > 0 && y.messageValidationLogInfo.every(t => !t.isError));
      arg.confirmAddRequest.extraWarningModel = this.eventWrongMarketOfferedService.getExtraWarningModel(arg.logInfoEvent.logInfoItems);
    }
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasAffectedTicketSiteDBDown = arg.primitiveProps.infoSiteDBDownModel.siteDBDownInfoJson.length > 0;

    arg.confirmAddRequest = _.clone(arg.confirmAddRequest);
  }

  private initAddRequestQuery(argWrongMarketOffered: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = argWrongMarketOffered.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = argWrongMarketOffered.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = argWrongMarketOffered.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = argWrongMarketOffered.filter.issueTypeId;
    query.isTest = argWrongMarketOffered.filter.isTest;
    query.actionId = argWrongMarketOffered.filter.action;
    query.isVoided = argWrongMarketOffered.filter.isVoided;
    query.mistakenBy = argWrongMarketOffered.others.mistakenBy;
    query.decidedBy = argWrongMarketOffered.others.decidedBy;
    query.remark = argWrongMarketOffered.others.remark;
    query.siteDBDownInfoJson = argWrongMarketOffered.confirmAddRequest.isMarkTicketSiteDbDown ? argWrongMarketOffered.primitiveProps.infoSiteDBDownModel.siteDBDownInfoJson : null;

    if (!argWrongMarketOffered.filter.isVoided) {
      query.wrongMarketOfferedInfo = this.eventWrongMarketOfferedService.getWrongMarketOfferedModel(Number(argWrongMarketOffered.filter.subIssueTypeId), argWrongMarketOffered.logInfoEvent);
    }

    return query;
  }
}