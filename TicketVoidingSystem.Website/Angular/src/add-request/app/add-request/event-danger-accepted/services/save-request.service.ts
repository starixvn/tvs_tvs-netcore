import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TvDetectionType, TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { AddRequestQuery } from '../../models/add-request.query';
import { RedCardModel } from '../../models/event-red-card.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);

  async recheckLogInfoBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(arg.allEvents);

    if (!this.validationService.validateCommonData(arg.filter, arg.eventLeagueComponent, arg.filterTimeAreaComponent,
        arg.logInfoComponents, arg.addRequestStore, arg.tvDetectionComponent)) {
      return false;
    }

    arg.primitiveProps.isShowLogInfoMainMatch = false;
    arg.primitiveProps.infoSiteDBDownModel = null;
    arg.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoService.getLogInfo(arg.allEvents, arg.primitiveProps, arg.isEdit, arg.requestId, arg.filter, arg.defaultFilterTimeWithAllowance);
    arg.logInfoComponents.forEach(x => {
      x.filterTimeWithAllowanceComponent?.updateData();
      x.showValidationDetail();
    });
    arg.primitiveProps.isShowLogInfoMainMatch = true;
    arg.primitiveProps.isShowRelatedEvents = true;
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
    arg.confirmDangerAccepted.warningRelatedEvents = [];
    if (!arg.filter.isVoided) {
      arg.allEvents.filter(x => !x.isMainMatch).forEach(y => {
        y.messageValidationLogInfo.forEach(t => {
          if (t.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE)) {
            arg.confirmDangerAccepted.warningRelatedEvents.push(y.eventName);
          }
        });
      });
      arg.confirmDangerAccepted.isHasSettledTicket = arg.allEvents.some(x => x.logInfoDetail?.settleCount > 0);
      arg.confirmDangerAccepted.isHasWarningEvent = arg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
      arg.confirmDangerAccepted.isHasWarningEditTakeNoteRequest =
      (arg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && arg.filter.action !== arg.actionIdOfFirstTimeAccess) ? true : false;
      arg.confirmDangerAccepted.isHasWarningRangeTime = arg.allEvents.some(x => x.logInfoDetail?.isHasWarningRangeTime)
    }
    arg.confirmDangerAccepted.isHasAffectedTicketSiteDBDown = arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson.length > 0;
    arg.confirmDangerAccepted.requestId = arg.requestId;
    arg.confirmDangerAccepted.requestedBy = arg.requestedBy;
    arg.confirmDangerAccepted.isEditingByAnotherUser =
      this.validationService.isEditingByAnotherUser(arg.isEdit, Number(document.getElementById('body').getAttribute('user-id')), arg.userId);
    arg.confirmDangerAccepted.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmDangerAccepted.subIssueTypeName = arg.issueTypes.selectedSubIssueTypes.find(x => x.subIssueTypeId.toString() === arg.filter.subIssueTypeId).subIssueTypeName;
    arg.confirmDangerAccepted.isOpenDialog = true;
    arg.confirmDangerAccepted = _.clone(arg.confirmDangerAccepted);
  }

  async executeSaveRequestApi(args: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
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

  private validateVarCheck(allEvents: LogInfoRelatedEvent[]): boolean {
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
    query.isTest = arg.filter.isTest;
    query.actionId = arg.filter.action;
    query.isVoided = arg.filter.isVoided;
    query.mistakenBy = arg.others.mistakenBy;
    query.operatorsList = arg.others.operatorsList;
    query.provider = arg.others.provider;
    query.decidedBy = arg.others.decidedBy;
    query.source = arg.others.source;
    query.remark = arg.others.remark;
    
    if (!arg.filter.isVoided) {
      query.dangerAcceptedInfo = arg.allEvents.filter(x => x.logInfoDetail).map(x => {
        return this.assignEventToModel(x, arg, arg.allEvents.find(y => y.isMainMatch).tvDetectionModel);
      });
      query.siteDBDownInfoJson = arg.confirmDangerAccepted.isMarkTicketSiteDbDown && arg.confirmDangerAccepted.isHasAffectedTicketSiteDBDown 
        ? arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }

  private assignEventToModel(event: LogInfoRelatedEvent, arg: SaveRequestArg, tvDetectionModel: TvDetectionModel): RedCardModel {
    const model = {
      isMainMatch: event.isMainMatch,
      filterBy: arg.primitiveProps.filterBy,
      filterFromTransTime: arg.defaultFilterTimeWithAllowance.fromDateTime,
      filterToTransTime: arg.defaultFilterTimeWithAllowance.toDateTime,
      voidFromTime: event.voidTimeArea.fromDateTime,
      voidToTime: event.voidTimeArea.toDateTime,
      paTime: event.voidTimeArea.paTime,
      aaTime: event.voidTimeArea.aaTime,
      saTime: event.voidTimeArea.saTime,
      subIssueTypeId: event.subIssueTypeId,
      matchId: event.matchId,
      logInfoDetail: event.logInfoDetail,
      isCheckedVar: event.isCheckedVar,
      tvDetectionValue: tvDetectionModel.tvDetectionValue,
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
