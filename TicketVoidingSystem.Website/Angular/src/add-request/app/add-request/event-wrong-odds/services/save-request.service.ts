import { Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { WrongOddsModel } from '../../models/event-wrong-odds.model';
import { PopupService } from '../../services/popup.service';
import { FilterOddsTypeConstant } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventWrongOddsService } from './event-wrong-odds.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class SaveRequestService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logInfoWrongOddsService: LogInfoService,
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
    private readonly eventWrongOddsService: EventWrongOddsService,
  ) { }


  async saveRequest(argWrongOdds: SaveRequestArg): Promise<void> {
    const isDataValid = argWrongOdds.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(argWrongOdds);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.proceedSaveRequest(argWrongOdds);
    } else {
      argWrongOdds.addRequestStore.changeSavingRequestStatus(false);
    }
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(argWrongOdds: SaveRequestArg): Promise<boolean> {
    argWrongOdds.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoWrongOddsService.resetLogInfoOfEvent(argWrongOdds.logInfoEvent);
    argWrongOdds.primitiveProps.isShowValidation = false;

    if (!this.validationService.validateCommonData(argWrongOdds.leagueEventWrongOddsComponent, argWrongOdds.filterWrongOddsComponent)) {
      return false;
    }

    argWrongOdds.addRequestStore.changeBlockingUiStatus(true);
    argWrongOdds.logInfoEvent.linkedLogsViewModel = await this.eventWrongOddsService.getLinkedLog(argWrongOdds.logInfoEvent, argWrongOdds.filter);
    await this.logInfoWrongOddsService.getLogInfo(argWrongOdds.logInfoEvent, argWrongOdds.isEdit, argWrongOdds.requestId, argWrongOdds.filter, argWrongOdds.primitiveProps);
    argWrongOdds.addRequestStore.changeBlockingUiStatus(false);
    argWrongOdds.primitiveProps.isShowValidation = true;

    if (this.validationService.isValidLogInfoEvent(argWrongOdds.logInfoEvent)) {
      return true;
    }

    return false;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    if (this.validationService.checkCanShowConfirmationWrongOdds(arg)) {
      this.popupService.showConfirm(
        this.getMessageConfirmationWrongOdds(arg),
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

  private getMessageConfirmationWrongOdds(argWrongOdds: SaveRequestArg): string {
    let message = '';
    if (argWrongOdds.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError)) {
      message = `${message}<div>There are some warnings in this request.</div>`;
    }

    if (argWrongOdds.isEdit && argWrongOdds.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argWrongOdds.filter.action !== argWrongOdds.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;
    }

    if (argWrongOdds.isEdit && argWrongOdds.userId !== Number(document.getElementById('body').getAttribute('user-id'))) {
      message = `${message}<div style="color:red">Please remind this request ${argWrongOdds.requestId} is confirmed by ${argWrongOdds.requestedBy}.</div>`;
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
      query.wrongOddsInfo = this.getWrongOddsInfo(argWrongOdds.logInfoEvent, argWrongOdds.filter.subIssueTypeId);
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
    model.filterFavoriteType = logInfoWrongOdds.filterWrongOdds.filterFavoriteType;
    model.filterOddsType = logInfoWrongOdds.filterWrongOdds.filterOddsType;
    model.filterOuType = logInfoWrongOdds.filterWrongOdds.filterOuType;

    model.correctOdds = logInfoWrongOdds.filterWrongOdds.correctOdds;
    model.isLinkGroup1X2 = logInfoWrongOdds.linkedLogsViewModel.isLinkGroup1X2;
    model.isLinkGroupAIO = logInfoWrongOdds.linkedLogsViewModel.isLinkGroupAIO;

    if (logInfoWrongOdds.filterWrongOdds.filterOddsType === FilterOddsTypeConstant.VALUE) {
      model.oddsValue = logInfoWrongOdds.filterWrongOdds.oddsValue;
    } else {
      model.fromOdds = logInfoWrongOdds.filterWrongOdds.fromOdds;
      model.toOdds = logInfoWrongOdds.filterWrongOdds.toOdds;
    }

    if (this.validationService.isSubTypeOuOr1stOu(subIssueTypeId)) {
      model.ouValue = logInfoWrongOdds.filterWrongOdds.ouValue;
    } else {
      model.betTeam = logInfoWrongOdds.filterWrongOdds.betTeam;
      model.favoriteValue = logInfoWrongOdds.filterWrongOdds.favoriteValue;
    }

    return [model];
  }
}