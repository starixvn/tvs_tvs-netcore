import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { RedCardModel } from '../../models/event-red-card.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { ValidationService } from './validation-service';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {
  constructor(
    private readonly logInfoService: LogInfoService,
    private readonly validationService: ValidationService,
    private readonly addRequestService: AddRequestService,
    private readonly popupService: PopupService) {
  }

  async recheckLogInfoBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(arg.mainEvent);

    if (!this.validationService.validateCommonData(arg.filter, arg.leagueEventRedCardComponent, arg.filterTimeAreaComponent, arg.logInfoComponents, arg.addRequestStore)) {
      return false;
    }

    arg.primitiveProps.isShowLogInfoMainMatch = false;
    arg.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo([arg.mainEvent], arg.primitiveProps, arg.isEdit, arg.requestId, arg.filter, arg.defaultFilterTimeWithAllowance);
    arg.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
    arg.primitiveProps.isShowLogInfoMainMatch = true;
    arg.addRequestStore.changeBlockingUiStatus(false);

    if (!this.validateVarCheck(arg.mainEvent)) {
      return false;
    }

    if (!this.validationService.isEventMatchValid(arg.mainEvent)) {
      return false;
    }

    return true;
  }

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    const isDataValid = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    if (isDataValid) {
      this.showPopupConfirmSave(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    arg.confirmRedCard.isOpenDialog = true;
    arg.confirmRedCard.requestId = arg.requestId;
    arg.confirmRedCard.requestedBy = arg.requestedBy;
    arg.confirmRedCard.isEditingByAnotherUser =
      this.validationService.isEditingByAnotherUser(arg.isEdit, Number(document.getElementById('body').getAttribute('user-id')), arg.userId);
    arg.confirmRedCard.isHasWarningSettledTicket = arg.mainEvent.logInfoDetail?.settleCount > 0;
    arg.confirmRedCard.isHasWarningForRedCard = arg.mainEvent.messageValidationLogInfo?.length > 0;
    arg.confirmRedCard.isHasWarningEditTakeNoteRequest =
      (arg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && arg.filter.action !== arg.actionIdOfFirstTimeAccess);
    arg.confirmRedCard.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmRedCard.subIssueTypeName = arg.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === arg.filter.subIssueTypeId).subIssueTypeName;
    arg.confirmRedCard = _.clone(arg.confirmRedCard);
  }

  async onClickConfirmSave(arg: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    arg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(arg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  async executeSaveRequestApi(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
  }

  private validateVarCheck(event: LogInfoRedCard): boolean {
    if(StaticService.isShowVarCheck(event.subIssueTypeId) && (_.isNull(event.isCheckedVar) || _.isUndefined(event.isCheckedVar))) {
      event.isHighLightVarCheck = true;
      return false;
    }

    return true;
  }

  private initAddRequestQuery(arg: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = arg.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = arg.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = arg.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = arg.filter.issueTypeId;
    query.actionId = arg.filter.action;
    query.isTest = arg.filter.isTest;
    query.sportType = arg.filter.sportType;
    query.isVoided = arg.filter.isVoided;

    query.mistakenBy = arg.others.mistakenBy;
    query.decidedBy = arg.others.decidedBy;
    query.operatorsList = arg.others.operatorsList;
    query.provider = arg.others.provider;
    query.source = arg.others.source;
    query.remark = arg.others.remark;

    if (!arg.filter.isVoided) {
      query.redCardInfo = [arg.mainEvent].filter(x => x.logInfoDetail).map(x => {
        return {
          isMainMatch: x.isMainMatch,
          filterBy: arg.primitiveProps.filterBy,
          filterFromTransTime: arg.defaultFilterTimeWithAllowance.fromDateTime,
          filterToTransTime: arg.defaultFilterTimeWithAllowance.toDateTime,
          voidFromTime: x.voidTimeArea.fromDateTime,
          voidToTime: x.voidTimeArea.toDateTime,
          aaTime: x.voidTimeArea.aaTime,
          paTime: x.voidTimeArea.paTime,
          saTime: x.voidTimeArea.saTime,
          subIssueTypeId: x.subIssueTypeId,
          matchId: x.matchId,
          logInfoDetail: x.logInfoDetail,
          isChecked: x.isCheckedVar,
          isCheckedVar: x.isCheckedVar
        } as RedCardModel;
      });
    }

    return query;
  }
}
