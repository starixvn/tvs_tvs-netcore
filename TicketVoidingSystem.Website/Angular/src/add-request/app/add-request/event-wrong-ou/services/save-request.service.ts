import { Injectable } from '@angular/core';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { WrongOuModel } from '../../models/event-wrong-ou.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})

export class SaveRequestService {
  constructor(
    private readonly validationService: ValidationService,
    private readonly logInfoWrongOuService: LogInfoService,
    private readonly popupService: PopupService,
    private readonly addRequestService: AddRequestService,
  ) { }

  async saveRequest(arg: SaveRequestArg): Promise<void> {
    const isDataValid = arg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(arg);
    arg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValid) {
      this.proceedSaveRequest(arg);
    } else {
      arg.addRequestStore.changeSavingRequestStatus(false);
    }
    arg.addRequestStore.changeBlockingUiStatus(false);
  }

  async recheckLogInfoBeforeSaveRequest(arg: SaveRequestArg): Promise<boolean> {
    arg.addRequestStore.changeSavingRequestStatus(true);
    this.logInfoWrongOuService.resetLogInfoOfEvent(arg.allEvents);

    if (!this.validationService.validateCommonData(arg.leagueEventWrongOuComponent, arg.logInfoComponents)) {
      return false;
    }

    arg.addRequestStore.changeBlockingUiStatus(true);
    await this.logInfoWrongOuService.getLogInfo(arg.allEvents, arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps);
    arg.logInfoComponents.forEach(x => {
      x.showValidationDetail();
    });
    arg.primitiveProps.isShowRelatedEvents = true;
    arg.addRequestStore.changeBlockingUiStatus(false);

    if (this.validationService.isAllEventsValid(arg.allEvents)) {
      return true;
    }

    return false;
  }

  private proceedSaveRequest(arg: SaveRequestArg) {
    if (this.validationService.checkCanShowConfirmationWrongOu(arg)) {
      this.popupService.showConfirm(
        this.getMessageConfirmationWrongOu(arg),
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

  private getMessageConfirmationWrongOu(saveRequestArg: SaveRequestArg): string {
    let message = '';
    if (saveRequestArg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError))) {
      message = `${message}<div>There are some warnings in this request.</div>`;
    }

    if (saveRequestArg.isEdit && saveRequestArg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && saveRequestArg.filter.action !== saveRequestArg.actionIdOfFirstTimeAccess) {
      message = `${message}<div>Ticket(s) on request will be unmarked.</div>`;      
    }

    if (saveRequestArg.isEdit && saveRequestArg.userId !== Number(document.getElementById('body').getAttribute('user-id'))) {
      message = `${message}<div style="color:red">Please remind this request ${saveRequestArg.requestId} is confirmed by ${saveRequestArg.requestedBy}.</div>`;
    }

    return `${message}<div class='mg-top-10'><i class="fa fa-question-circle text-confirm"></i> ARE YOU SURE YOU WANT TO PROCESS WITH ABOVE INFO?</div>`;
  }
  
  private async executeSaveRequestApi(saveRequestArg: SaveRequestArg): Promise<void> {
    const query = this.initAddRequestQuery(saveRequestArg);
    await this.addRequestService.executeSaveRequest(saveRequestArg.isEdit, saveRequestArg.requestId, query, saveRequestArg.addRequestStore);
  }
  
  private async onClickConfirmSave(saveRequestArg: SaveRequestArg) {
    // validate again for make sure
    const isDataValidAgain = saveRequestArg.filter.isVoided ? true : await this.recheckLogInfoBeforeSaveRequest(saveRequestArg);
    saveRequestArg.addRequestStore.changeBlockingUiStatus(true);
    if (isDataValidAgain) {
      await this.executeSaveRequestApi(saveRequestArg);
    } else {
      this.popupService.showError(TEXT.INVALID_DATA_IN_REQUEST);
    }
    saveRequestArg.addRequestStore.changeBlockingUiStatus(false);
  }

  private initAddRequestQuery(saveRequestArg: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = saveRequestArg.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = saveRequestArg.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = saveRequestArg.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = saveRequestArg.filter.issueTypeId;
    query.isTest = saveRequestArg.filter.isTest;
    query.actionId = saveRequestArg.filter.action;
    query.sportType = saveRequestArg.filter.sportType;
    query.isVoided = saveRequestArg.filter.isVoided;

    query.mistakenBy = saveRequestArg.others.mistakenBy;
    query.decidedBy = saveRequestArg.others.decidedBy;
    query.remark = saveRequestArg.others.remark;

    if (!saveRequestArg.filter.isVoided) {
      const wrongOuInfo = saveRequestArg.allEvents.filter(x => x.logInfoDetail).map(x => {
        return this.getWrongOuInfo(x, saveRequestArg.filter.subIssueTypeId);
      });

      if (StaticService.isWrongOU(saveRequestArg.filter.issueTypeId)) {
        query.wrongOuInfo = wrongOuInfo;
      } else {
        query.wrong1stOuInfo = wrongOuInfo;
      }
    }

    return query;
  }

  public getWrongOuInfo(logInfoWrongOu: LogInfoWrongOu, subIssueTypeId: string): WrongOuModel {
    const model = new WrongOuModel();

    model.isMainMatch = logInfoWrongOu.isMainMatch;
    model.matchId = logInfoWrongOu.matchId;
    model.logInfoDetail = logInfoWrongOu.logInfoDetail;
    model.subIssueTypeId = Number(subIssueTypeId);
    model.poolHouseCheckedBetTypes = logInfoWrongOu.poolHouseCheckedBetTypes;
    model.filterFromTransTime = logInfoWrongOu.filterWrongOu.filterFromTransTime;
    model.filterToTransTime = logInfoWrongOu.filterWrongOu.filterToTransTime;
    model.liveIndicator = logInfoWrongOu.filterWrongOu.liveIndicator;
    model.wrongMarket = logInfoWrongOu.filterWrongOu.wrongMarket;
    model.actualMarket =  logInfoWrongOu.filterWrongOu.actualMarket;
    if (logInfoWrongOu.isMainMatch) {
      model.isLinkGroup1X2 = logInfoWrongOu.linkedLogsViewModel.isLinkGroup1X2;
      model.isLinkGroupAIO = logInfoWrongOu.linkedLogsViewModel.isLinkGroupAIO;
    }

    return model;
  }
}