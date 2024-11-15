import { Injectable } from '@angular/core';
import { TvDetectionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { PopupService } from '../../services/popup.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from './save-request.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from './validation.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class SaveRequestService {
  private readonly ACTUAL_SCORE_CLASS = 'input-actual-score';

  constructor(
    private readonly validationService: ValidationService,
    private readonly addRequestService: AddRequestService,
    private readonly logInfoService: LogInfoService,
    private readonly popupService: PopupService,
  ) { }

  async onYesConfirmAddRequest(args: SaveRequestArg): Promise<void> {
    // validate again
    const validation = args.isVoided ? { isValid: true } as ValidationBusinessRuleOutput : await this.checkValidationBeforeSaveRequest(args as ValidationBusinessRuleArgs);
    if (validation.isValid) {
      await this.saveRequest(args);
    } else {
      this.popupService.showError('There are some invalid in this request, please check again!');
      args.addRequestStore.changeSavingRequestStatus(false);
    }
  }

  async saveRequest(args: SaveRequestArg): Promise<void> {
    args.addRequestStore.changeBlockingUiStatus(true);
    const query = this.initAddRequestQuery(args);
    await this.addRequestService.executeSaveRequest(args.isEdit, args.requestId, query, args.addRequestStore);
    args.addRequestStore.changeBlockingUiStatus(false);
  }

  async checkValidationBeforeSaveRequest(args: ValidationBusinessRuleArgs): Promise<ValidationBusinessRuleOutput> {
    args.addRequestStore.changeSavingRequestStatus(true);
    if (!this.validationService.validateCommonData(args.filter, args.leagueEventWrongScoreComponent, args.addRequestStore,
      args.filterWrongScoreComponent, args.wrongScoreInfoComponents, args.tvDetectionComponent)) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    if (!args.primitiveProps.actualScore) {
      args.tooltip.display(this.ACTUAL_SCORE_CLASS, LABELS.REQUIRED_ACTUAL_SCORE);
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    args.addRequestStore.changeBlockingUiStatus(true);
    this.logInfoService.clearDataValidation(args.wrongScoreModels);
    await this.logInfoService.getLogInfo(args.isEdit, args.requestId,
      args.leagueEventWrongScoreComponent.selectedMatch.matchId, args.filter, args.primitiveProps, args.wrongScoreModels);
    args.addRequestStore.changeBlockingUiStatus(false);

    if (!this.validationService.isValidAllScores(args.wrongScoreModels)) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    return {
      isValid: true,
      transInfo: ''
    } as ValidationBusinessRuleOutput;
  }

  /* istanbul ignore next */
  private initAddRequestQuery(args: SaveRequestArg): AddRequestQuery {
    const query: AddRequestQuery = new AddRequestQuery();
    query.transInfoJson = args.primitiveProps.transInfoAddRequestModel?.transInfoJson;
    query.unMarkTransIds = args.primitiveProps.transInfoAddRequestModel?.unMarkTransIds;
    query.markTransIds = args.primitiveProps.transInfoAddRequestModel?.markTransIds;
    query.issueTypeId = args.filter.issueTypeId;
    query.subIssueTypeId = args.filter.subIssueTypeId;
    query.actionId = args.filter.action;
    query.isTest = args.filter.isTest;
    query.isVoided = args.filter.isVoided;

    query.mistakenBy = args.others.mistakenBy;
    query.decidedBy = args.others.decidedBy;
    query.operatorsList = args.others.operatorsList;
    query.provider = args.others.provider;
    query.source = args.others.source;
    query.remark = args.others.remark;

    if (!args.filter.isVoided) {
      query.wrongScoreInfo = this.getWrongScoreInfoForSaveRequest(args);
    }
    return query;
  }

  /* istanbul ignore next */
  private getWrongScoreInfoForSaveRequest(args: SaveRequestArg): WrongScoreModel[] {
    args.wrongScoreModels.forEach(x => {
      x.actualScore = args.primitiveProps.actualScore;
      x.filterBy = args.primitiveProps.filterBy;
      x.subIssueTypeId = Number(args.filter.subIssueTypeId);
      x.matchId = args.leagueEventWrongScoreComponent.selectedMatch.matchId;
      x.isCheckedVar = args.primitiveProps.isCheckedVar;
      x.tvDetectionValue = args.tvDetectionComponent.model.tvDetectionValue;

      if (x.tvDetectionValue !== TvDetectionType.NONE) {
        x.serviceAcceptTime = args.tvDetectionComponent.model.serviceAcceptTime;
        x.actualTime = args.tvDetectionComponent.model.actualTime;
        x.minuteOffset = args.tvDetectionComponent.model.minuteOffset;
        x.secondOffset = args.tvDetectionComponent.model.secondOffset;
      }
    });

    return args.wrongScoreModels;
  }
}