import { inject, Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { WrongHdpModel } from '../../models/event-wrong-hdp.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongHdpService } from './event-wrong-hdp.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventWrongHdpService = inject(EventWrongHdpService);

  async recheckLogInfoBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoService.resetLogInfoOfEvent(arg.allEvents);
    arg.primitiveProps.isShowRelatedEvents = false;

    if (!this.validationService.validateCommonData(arg.eventLeagueComponent, arg.logInfoComponents)) {
      return false;
    }

    arg.addRequestStore.changeBlockingUiStatus(true);
    arg.mainEvent.linkedLogsViewModel = await this.eventWrongHdpService.getLinkedLog(arg.mainEvent, arg.filter);
    await this.logInfoService.getLogInfo(arg.allEvents, arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps);
    arg.logInfoComponents.forEach(x => x.logInfo.isShowValidation = true);
    arg.primitiveProps.isShowInfoSiteDBDown = true;
    arg.primitiveProps.isShowRelatedEvents = true;
    arg.addRequestStore.changeBlockingUiStatus(false);

    if (this.validationService.isAllEventsValid(arg.allEvents)) {
      return true;
    }

    return false;
  }

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    const isDataValid = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    arg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  private async executeSaveRequestApi(args: SaveRequestArg): Promise<void> {
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
    query.decidedBy = arg.others.decidedBy;
    query.remark = arg.others.remark;

    if (!arg.filter.isVoided) {
      const wrongHdpInfo = arg.allEvents.filter(x => x.logInfoDetail).map(x => {
        return this.getWrongHdpInfo(x, arg.filter.subIssueTypeId);
      });

      if (StaticService.isWrongHDP(arg.filter.issueTypeId)) {
        query.wrongHdpInfo = wrongHdpInfo;
      } else {
        query.wrong1stHdpInfo = wrongHdpInfo;
      }

      query.siteDBDownInfoJson = arg.confirmAddRequest.isMarkTicketSiteDbDown && arg.confirmAddRequest.isHasAffectedTicketSiteDBDown
        ? arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }

  public getWrongHdpInfo(logInfo: LogInfoWrongHdp, subIssueTypeId: string): WrongHdpModel {
    const model = new WrongHdpModel();

    model.isMainMatch = logInfo.isMainMatch;
    model.matchId = logInfo.matchId;
    model.logInfoDetail = logInfo.logInfoDetail;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.poolHouseCheckedBetTypes = logInfo.poolHouseCheckedBetTypes;
    model.filterFromTransTime = logInfo.filterWithHdp.filterFromTransTime;
    model.filterToTransTime = logInfo.filterWithHdp.filterToTransTime;
    model.liveIndicator = logInfo.filterWithHdp.liveIndicator;
    model.filterBetIdX = logInfo.filterWithHdp.filterBetType.filterBetIdX;
    model.filterBetIdY = logInfo.filterWithHdp.filterBetType.filterBetIdY;
    model.filterBetTypeId = logInfo.filterWithHdp.filterBetType.filterBetTypeId;
    if (logInfo.isMainMatch) {
      model.isLinkGroup1X2 = logInfo.linkedLogsViewModel.isLinkGroup1X2;
      model.isLinkGroupAIO = logInfo.linkedLogsViewModel.isLinkGroupAIO;
    }
    if (this.validationService.isSubTypeWrongHdpOrWrong1stHdp(subIssueTypeId)) {
      model.homeFavorite = logInfo.filterWithHdp.homeFavorite;
      model.awayFavorite = logInfo.filterWithHdp.awayFavorite;
      model.actualMarket = logInfo.filterWithHdp.actualMarket;
    } else {
      model.hdpValue = logInfo.filterWithHdp.hdpValue;
    }

    return model;
  }

  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.isHasSettledTicket = arg.allEvents.some(x => x.logInfoDetail?.settleCount > 0);;
      arg.confirmAddRequest.isHasWarningTicket = arg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
    }
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasAffectedTicketSiteDBDown = arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson.length > 0;
  }
}