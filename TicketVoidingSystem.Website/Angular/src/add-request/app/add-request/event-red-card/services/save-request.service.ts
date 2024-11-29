import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TvDetectionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { RedCardModel } from '../../models/event-red-card.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { ValidationService } from './validation.service';

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
    this.logInfoService.resetLogInfoOfEvent(arg.allEvents);

    if (!this.validationService.validateCommonData(arg.filter, arg.eventLeagueComponent, arg.filterTimeAreaComponent,
      arg.logInfoComponents, arg.addRequestStore, arg.tvDetectionComponent)) {
      return false;
    }

    arg.primitiveProps.isShowLogInfoMainMatch = false;
    arg.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(arg.allEvents, arg.primitiveProps, arg.isEdit, arg.requestId, arg.filter, arg.defaultFilterTimeWithAllowance);
    arg.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
    arg.primitiveProps.isShowLogInfoMainMatch = true;
    arg.addRequestStore.changeBlockingUiStatus(false);

    if (!this.validateVarCheck(arg.allEvents)) {
      return false;
    }

    if (!this.validationService.isAllEventsValid(arg.allEvents)) {
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
    arg.confirmRedCard.requestId = arg.requestId;
    arg.confirmRedCard.requestedBy = arg.requestedBy;
    arg.confirmRedCard.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmRedCard.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
    arg.confirmRedCard.isHasSettledTicket = arg.allEvents.some(x => x.logInfoDetail?.settleCount > 0);
    arg.confirmRedCard.isHasWarningTicket = arg.allEvents.some(x => x.messageValidationLogInfo?.length > 0);
    arg.confirmRedCard.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmRedCard.subIssueTypeName = arg.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === arg.filter.subIssueTypeId).subIssueTypeName;
    arg.confirmRedCard.voidAction = arg.filter.actions.find(x => x.value === arg.filter.action).name;
    arg.confirmRedCard.isOpen = true;
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

  private validateVarCheck(allEvents: LogInfoRedCard[]): boolean {
    let isSelectedVarAllEvents = true;
    allEvents.forEach(x => {
      if(StaticService.isShowVarCheck(x.subIssueTypeId) && (_.isNull(x.isCheckedVar) || _.isUndefined(x.isCheckedVar))) {
        x.isHighLightVarCheck = true;
        isSelectedVarAllEvents = false;
      }
    });

    return isSelectedVarAllEvents;
  }

  private initAddRequestQuery(arg: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = arg.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = arg.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = arg.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = arg.filter.issueTypeId;
    query.actionId = arg.filter.action;
    query.isTest = arg.filter.isTest;
    query.isVoided = arg.filter.isVoided;

    query.mistakenBy = arg.others.mistakenBy;
    query.decidedBy = arg.others.decidedBy;
    query.operatorsList = arg.others.operatorsList;
    query.provider = arg.others.provider;
    query.source = arg.others.source;
    query.remark = arg.others.remark;

    if (!arg.filter.isVoided) {
      query.redCardInfo = arg.allEvents.filter(x => x.logInfoDetail).map(x => {
        return this.assignEventToModel(x, arg, arg.allEvents.find(y => y.isMainMatch).tvDetectionModel);
      });
    }

    return query;
  }

  private assignEventToModel(logInfoEvent: LogInfoRedCard, arg: SaveRequestArg, tvDetectionModel: TvDetectionModel): RedCardModel {
    const model = {
      isMainMatch: logInfoEvent.isMainMatch,
      filterBy: arg.primitiveProps.filterBy,
      filterFromTransTime: arg.defaultFilterTimeWithAllowance.fromDateTime,
      filterToTransTime: arg.defaultFilterTimeWithAllowance.toDateTime,
      voidFromTime: logInfoEvent.voidTimeArea.fromDateTime,
      voidToTime: logInfoEvent.voidTimeArea.toDateTime,
      aaTime: logInfoEvent.voidTimeArea.aaTime,
      paTime: logInfoEvent.voidTimeArea.paTime,
      saTime: logInfoEvent.voidTimeArea.saTime,
      subIssueTypeId: logInfoEvent.subIssueTypeId,
      matchId: logInfoEvent.matchId,
      logInfoDetail: logInfoEvent.logInfoDetail,
      isChecked: logInfoEvent.isCheckedVar,
      isCheckedVar: logInfoEvent.isCheckedVar,
      tvDetectionValue: tvDetectionModel.tvDetectionValue
    } as RedCardModel;

    if (model.tvDetectionValue !== TvDetectionType.NONE) {
      model.serviceAcceptTime = tvDetectionModel.serviceAcceptTime;
      model.actualTime = tvDetectionModel.actualTime;
      model.minuteOffset = tvDetectionModel.minuteOffset;
      model.secondOffset = tvDetectionModel.secondOffset;
    }

    return model;
  }
}
