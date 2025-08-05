import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { EarlyKickOffModel } from '../../models/event-eko.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { PopupService } from '../../services/popup.service';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly popupService = inject(PopupService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly validationService = inject(ValidationService);
  private readonly addRequestApiService = inject(AddRequestService);
  private readonly checkPermissionService = inject(CheckAddPermissionService);

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    const isDataValid = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    if (isDataValid) {
      this.showPopupConfirmSave(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  async recheckLogInfoBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(arg.allEvents);
    arg.primitiveProps.infoSiteDBDownModel = null;
    if (!this.validationService.validateCommonData(arg.eventLeagueComponent, arg.kickOffTimeComponent)) {
      return false;
    }

    arg.addRequestStore.changeBlockingUiStatus(true);
    const getLogInfoResult = await this.logInfoService.getLogInfo(arg.allEvents, arg.isEdit, arg.requestId, arg.filter);
    this.logInfoService.assignResultLogInfoToEvents(arg.allEvents, getLogInfoResult.getLogInfoModels);
    arg.primitiveProps.transInfoAddRequestModel = getLogInfoResult.transInfoAddRequestModel;
    arg.primitiveProps.infoSiteDBDownModel = getLogInfoResult.infoSiteDBDownModel;

    if (!this.checkPermissionService.isAccountHasAddRequestPermission(arg.filter.action,
      arg.allEvents.some(x => x.isHasInstantlySettledTicket), arg.allEvents.some(x => x.isHasSettledTicket), arg.permission)) {
      arg.addRequestStore.changeBlockingUiStatus(false);
      return false;
    }

    arg.primitiveProps.isShowLogInfoEvents = true;
    arg.mainEvent.isCollapse = arg.mainEvent.isInvalidTotalTickets ? false : true;
    arg.addRequestStore.changeBlockingUiStatus(false);

    if (this.validationService.isAllEventsValid(arg.allEvents)) {
      return true;
    }

    return false;
  }

  public async onClickConfirmSave(arg: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(arg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
  }

  private async executeSaveRequestApi(arg: SaveRequestArg): Promise<void> {
    arg.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initAddRequestQuery(arg);
    await this.addRequestApiService.executeSaveRequest(arg.isEdit, arg.requestId, query, arg.addRequestStore);
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.issueTypeId = args.filter.issueTypeId;
    query.unMarkTransIds = args.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = args.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.removeTransIds = args.primitiveProps.transInfoAddRequestModel?.removeTransIds;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;
    query.mistakenBy = args.others.mistakenBy;
    query.operatorsList = args.others.operatorsList;
    query.provider = args.others.provider;
    query.source = args.others.source;
    query.decidedBy = args.others.decidedBy;
    query.remark = args.others.remark;
    query.transInfoJson = args.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    if (!args.filter.isVoided) {
      query.earlyKickOffInfo = args.allEvents.filter(x => !x.isInvalidTotalTickets).map(x => this.getEarlyKickOffModel(x, args.filter.subIssueTypeId));
      query.siteDBDownInfoJson = args.confirmEarlyKickOff.isMarkTicketSiteDbDown && args.confirmEarlyKickOff.isHasAffectedTicketSiteDBDown
        ? args.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }

  public getEarlyKickOffModel(event: LogInfoEarlyKickOff, subIssueTypeId: string): EarlyKickOffModel {
    const model = new EarlyKickOffModel();
    model.isMainMatch = event.isMainMatch;
    model.matchId = event.matchId;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.isMainMatch = event.isMainMatch;
    model.kickOffTime = event.kickOffTime;

    return model;
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    arg.confirmEarlyKickOff.warningRelatedEvents = [];
    if (!arg.filter.isVoided) {
      arg.allEvents.filter(x => !x.isMainMatch).forEach(y => {
        if (y.isInvalidTotalTickets) {
          arg.confirmEarlyKickOff.warningRelatedEvents.push(y.eventName);
        }
      });
      arg.confirmEarlyKickOff.isHasWarningEvent = arg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
      arg.confirmEarlyKickOff.isHasWarningEditTakeNoteRequest =
        (arg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && arg.filter.action !== arg.actionIdOfFirstTimeAccess) ? true : false;
    }

    arg.confirmEarlyKickOff.issueTypeName = arg.issueTypes.issueTypes.find(x => x.issueTypeId.toString() === arg.filter.issueTypeId).issueTypeName;
    arg.confirmEarlyKickOff.actionName = TVSRequestActionType.NAME_MAPPING[arg.filter.action];
    arg.confirmEarlyKickOff.requestId = arg.requestId;
    arg.confirmEarlyKickOff.requestedBy = arg.requestedBy;
    arg.confirmEarlyKickOff.isEditingByAnotherUser = this.validationService.isEditingByAnotherUser(arg.isEdit, Number(document.getElementById('body').getAttribute('user-id')), arg.userId);
    arg.confirmEarlyKickOff.isHasSettledTicket = arg.allEvents.some(x => x.isHasSettledTicket);
    arg.confirmEarlyKickOff.isOpenDialog = true;
    arg.confirmEarlyKickOff.isHasAffectedTicketSiteDBDown = arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson.length > 0;
    arg.confirmEarlyKickOff = _.clone(arg.confirmEarlyKickOff);
  }
}
