import { inject, Injectable } from '@angular/core';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { StaticService } from 'src/utility/services/static.service';

@Injectable()
export class SaveRequestService {
  private readonly validationService = inject(ValidationService);
  private readonly logInfoWrongOddsService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly eventWrongOddsService = inject(EventWrongOddsService);

  async saveRequest(argWrongOdds: SaveRequestArg): Promise<void> {
    const isDataValid = argWrongOdds.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOdds);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.showPopupConfirmSave(argWrongOdds);
    } else {
      argWrongOdds.addRequestStore.changeSavingRequestStatus(false);
    }
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
  }

  
  private showPopupConfirmSave(arg: SaveRequestArg) {
    if (!arg.filter.isVoided) {
      arg.confirmAddRequest.isHasWarningTakenNote = StaticService.isHasWarningTakenNote(arg.filter.action, arg.actionIdOfFirstTimeAccess);
      arg.confirmAddRequest.isHasSettledTicket = arg.logInfoEvent.logInfoDetail?.settleCount > 0;
      arg.confirmAddRequest.isHasWarningTicket = arg.logInfoEvent.messageValidationLogInfo?.length > 0;
    }
    arg.confirmAddRequest.isOpen = true;
    arg.confirmAddRequest.requestId = arg.requestId;
    arg.confirmAddRequest.requestedBy = arg.requestedBy;
    arg.confirmAddRequest.isEditingByAnotherUser = StaticService.isEditingByAnotherUser(arg.isEdit, arg.userId);
    arg.confirmAddRequest.isHasAffectedTicketSiteDBDown = arg.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson.length > 0;
  }

  async recheckLogInfoBeforeSaveRequest(argWrongOdds: SaveRequestArg): Promise<boolean> {
    argWrongOdds.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoWrongOddsService.resetLogInfoOfEvent(argWrongOdds.logInfoEvent);
    argWrongOdds.primitiveProps.infoSiteDBDownModel = null;
    argWrongOdds.logInfoEvent.isShowValidation = false;

    if (!this.validationService.validateCommonData(argWrongOdds.eventLeagueComponent, argWrongOdds.filterWrongOddsComponent)) {
      return false;
    }

    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    argWrongOdds.logInfoEvent.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(argWrongOdds.logInfoEvent, argWrongOdds.filter);
    await this.logInfoWrongOddsService.getLogInfo(argWrongOdds.logInfoEvent, argWrongOdds.isEdit, argWrongOdds.requestId, argWrongOdds.filter, argWrongOdds.primitiveProps);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
    argWrongOdds.logInfoEvent.isShowValidation = true;

    return this.validationService.isValidLogInfoEvent(argWrongOdds.logInfoEvent);
  }

  private async executeSaveRequestApi(argWrongOdds: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(argWrongOdds);
    await this.addRequestService.executeSaveRequest(argWrongOdds.isEdit, argWrongOdds.requestId, query, argWrongOdds.addRequestStore);
  }

  async onClickConfirmSave(argWrongOdds: SaveRequestArg) {
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
    query.isVoided = argWrongOdds.filter.isVoided;

    query.mistakenBy = argWrongOdds.others.mistakenBy;
    query.decidedBy = argWrongOdds.others.decidedBy;
    query.remark = argWrongOdds.others.remark;

    if (!argWrongOdds.filter.isVoided) {
      query.wrongOddsInfo = this.getWrongOddsInfo(argWrongOdds.logInfoEvent, argWrongOdds.filter.subIssueTypeId);
      query.siteDBDownInfoJson = argWrongOdds.confirmAddRequest.isMarkTicketSiteDbDown && argWrongOdds.confirmAddRequest.isHasAffectedTicketSiteDBDown
        ? argWrongOdds.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }

  public getWrongOddsInfo(logInfoWrongOdds: LogInfoWrongOdds, subIssueTypeId: string): WrongOddsModel[] {
    const model = new WrongOddsModel();

    model.matchId = logInfoWrongOdds.matchId;
    model.logInfoDetail = logInfoWrongOdds.logInfoDetail;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.poolHouseCheckedBetTypes = logInfoWrongOdds.poolHouseCheckedBetTypes;
    model.filterFromTransTime = logInfoWrongOdds.filterWrongOdds.filterFromTransTime;
    model.filterToTransTime = logInfoWrongOdds.filterWrongOdds.filterToTransTime;
    model.liveIndicator = logInfoWrongOdds.filterWrongOdds.liveIndicator;
    model.isLinkGroup1X2 = logInfoWrongOdds.linkedLogsViewModel.isLinkGroup1X2;
    model.isLinkGroupAIO = logInfoWrongOdds.linkedLogsViewModel.isLinkGroupAIO;

    model.spread = logInfoWrongOdds.filterWrongOdds.spread.toString();
    model.allowanceRate = logInfoWrongOdds.filterWrongOdds.allowanceRate;
    model.correctOddsHomeOver = logInfoWrongOdds.filterWrongOdds.correctOddsHomeOver;
    model.correctOddsAwayUnder = logInfoWrongOdds.filterWrongOdds.correctOddsAwayUnder;

    model.fromOddsNotVoidHomeOver = logInfoWrongOdds.filterWrongOdds.fromOddsNotVoidHomeOver;
    model.toOddsNotVoidHomeOver = logInfoWrongOdds.filterWrongOdds.toOddsNotVoidHomeOver;
    model.fromOddsNotVoidAwayUnder = logInfoWrongOdds.filterWrongOdds.fromOddsNotVoidAwayUnder;
    model.toOddsNotVoidAwayUnder = logInfoWrongOdds.filterWrongOdds.toOddsNotVoidAwayUnder;

    if (this.validationService.isSubTypeOuOr1stOu(subIssueTypeId)) {
      model.wrongOU = logInfoWrongOdds.filterWrongOdds.wrongOU;
    } else {
      model.filterFavoriteType = logInfoWrongOdds.filterWrongOdds.filterFavoriteType;
      model.favoriteValue = logInfoWrongOdds.filterWrongOdds.favoriteValue;
    }

    return [model];
  }
}