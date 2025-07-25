import { inject, Injectable } from '@angular/core';
import { TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestService } from '../../add-request.service';
import { AddRequestQuery } from '../../models/add-request.query';
import { PopupService } from '../../services/popup.service';
import { LogInfoService } from './log-info.service';
import { SaveRequestArg } from '../models/save-request.model';
import { ValidationBusinessRuleArgs, ValidationBusinessRuleOutput } from '../models/validation.model';
import { ValidationService } from './validation.service';
import { CreateMapService } from './create-map.service';

@Injectable()
export class SaveRequestService {
  private readonly ACTUAL_SCORE_CLASS = 'input-actual-score';
  private readonly validationService = inject(ValidationService);
  private readonly addRequestService = inject(AddRequestService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly popupService = inject(PopupService);
  private readonly createMapService = inject(CreateMapService);
  
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
    this.logInfoService.clearDataValidation(args.wrongScoreModels, args.relatedEvents, args.mainEvent);
    args.primitiveProps.infoSiteDBDownModel = null;
    await this.logInfoService.getLogInfo(this.createMapService.createGetLogInfoParams(args));
    args.addRequestStore.changeBlockingUiStatus(false);
    if (!this.validationService.isAllWrongScoreModelsValid(args)) {
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
      query.wrongScoreInfo = args.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME 
        ? this.getWrongScoresHasRelatedEvent(args) : this.getWrongScoresHasManyScores(args);
      query.siteDBDownInfoJson = args.isMarkTicketSiteDbDown ? args.primitiveProps.infoSiteDBDownModel?.siteDBDownInfoJson : null;
    }

    return query;
  }

  getWrongScoresHasRelatedEvent(args: SaveRequestArg){
    const allEvents = [args.mainEvent, ...args.relatedEvents]
      .map(x => this.createMapService.mapRelatedEventToWrongScoreModel(x, args)).filter(x => x.logInfoDetail);

    return allEvents;
  }

  getWrongScoresHasManyScores(args: SaveRequestArg){
    return args.wrongScoreModels.filter(x => x.logInfoDetail).map(x => this.createMapService.mapWrongScoreSaveRequestModel(x, args));
  }
}