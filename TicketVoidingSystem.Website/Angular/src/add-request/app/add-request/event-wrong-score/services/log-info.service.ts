import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { CommonService } from '../../../../../utility/services/common.service';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterModel } from '../../filter/filter.model';
import { GetLogInfoQuery } from '../../models/add-request.query';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { GetLogInfoModel } from '../../models/get-log-info.model';
import { PrimitiveProperty, WrongScoreGetLogInfoQuery } from '../event-wrong-score.model';
import { WrongScoreService } from './wrong-score.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class LogInfoService {
  constructor(
    private readonly wrongScoreService: WrongScoreService,
    private readonly commonService: CommonService,
    private readonly validationService: ValidationService) { }

  async getLogInfo(isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
    wrongScoreModels: WrongScoreModel[], mainMatchId: number, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoQueries(isEdit, requestId, filter, wrongScoreModels, mainMatchId, defaultFilterTimeWithAllowance);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;

    primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME
      ? this.assignResultsGetLogInfoRelatedEvent(viewModel.getLogInfoModels, wrongScoreModels)
      : this.assignResultsGetLogInfoToListModel(viewModel.getLogInfoModels, wrongScoreModels);
  }

  async refreshLogInfoForRelatedEvent(isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
    logInfoRelatedEvent: LogInfoRelatedEvent, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): Promise<void> {
    const wrongScoreModel = this.mapRelatedEventToWrongScoreModel(logInfoRelatedEvent);
    
    const getLogInfoQuery = this.initGetLogInfoQueries(isEdit, requestId, filter, [wrongScoreModel], null, defaultFilterTimeWithAllowance);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    logInfoRelatedEvent.voidTimeArea.fromDateTime = moment(viewModel.getLogInfoModels[0].logInfoDetail?.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    logInfoRelatedEvent.voidTimeArea.toDateTime = moment(viewModel.getLogInfoModels[0].logInfoDetail?.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    logInfoRelatedEvent.logInfoDetail = viewModel.getLogInfoModels[0].logInfoDetail;
    logInfoRelatedEvent.messageValidationLogInfo = StaticService.getValidationMessageList(viewModel.getLogInfoModels[0], logInfoRelatedEvent.voidTimeArea.fromDateTime, logInfoRelatedEvent.voidTimeArea.saTime);
  }

  mapRelatedEventToWrongScoreModel(logInfoRelatedEvent: LogInfoRelatedEvent){
    const wrongScoreModel = new WrongScoreModel();
    wrongScoreModel.matchId = logInfoRelatedEvent.matchId;
    wrongScoreModel.filterBy = this.wrongScoreService.getFilterByBaseOnSubIssueType(logInfoRelatedEvent.subIssueTypeId.toString());
    wrongScoreModel.filterFromTransTime = logInfoRelatedEvent.voidTimeArea.fromDateTime;
    wrongScoreModel.filterToTransTime = logInfoRelatedEvent.voidTimeArea.toDateTime;
    wrongScoreModel.subIssueTypeId = logInfoRelatedEvent.subIssueTypeId;
    wrongScoreModel.aaTime = logInfoRelatedEvent.voidTimeArea.aaTime;
    wrongScoreModel.paTime = logInfoRelatedEvent.voidTimeArea.paTime;
    wrongScoreModel.saTime = logInfoRelatedEvent.voidTimeArea.saTime;

    return wrongScoreModel;
  }
  private getWrongScoreModel(filter: FilterModel, wrongScoreModels: WrongScoreModel[], mainMatchId: number, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): WrongScoreGetLogInfoQuery[] {
    
    return wrongScoreModels.map(x => {
      const filterBy = this.wrongScoreService.getFilterByBaseOnSubIssueType(filter.subIssueTypeId);
      if (this.validationService.isHasAllowanceTimeWrongScoreModel(x) && x.filterBy === TVSRequestFilterBy.CHECK_TIME) {
        x.filterFromTransTime = defaultFilterTimeWithAllowance.fromDateTime;
        x.filterToTransTime = defaultFilterTimeWithAllowance.toDateTime;
      } 
      const wrongScoreGetLogInfoQuery = new WrongScoreGetLogInfoQuery();
      wrongScoreGetLogInfoQuery.scoreId = x.scoreId;
      wrongScoreGetLogInfoQuery.matchId = x.matchId ? x.matchId : mainMatchId;
      wrongScoreGetLogInfoQuery.wrongScore = x.wrongScore;
      wrongScoreGetLogInfoQuery.filterBy = filterBy;
      wrongScoreGetLogInfoQuery.filterFromTransTime = x.filterFromTransTime;
      wrongScoreGetLogInfoQuery.filterToTransTime = x.filterToTransTime;
      wrongScoreGetLogInfoQuery.subIssueTypeId = x.subIssueTypeId ? x.subIssueTypeId : Number(filter.subIssueTypeId);
      wrongScoreGetLogInfoQuery.aaTime = x.aaTime;
      wrongScoreGetLogInfoQuery.paTime = x.paTime;
      wrongScoreGetLogInfoQuery.saTime = x.saTime;
  
      return wrongScoreGetLogInfoQuery;
    });
  }

  /* istanbul ignore next */
  public initGetLogInfoQueries(isEdit: boolean, requestId: number, filter: FilterModel,
    wrongScoreModels: WrongScoreModel[], mainMatchId: number, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): GetLogInfoQuery {
    const getWrongScoreModels = this.getWrongScoreModel(filter, wrongScoreModels, mainMatchId, defaultFilterTimeWithAllowance);

    const query: GetLogInfoQuery = {
      requestId: isEdit ? requestId : null,
      actionId: Number(filter.action),
      issueTypeId: Number(filter.issueTypeId),
      subIssueTypeId: Number(filter.subIssueTypeId),
      wrongScoreModels: getWrongScoreModels,
      isShowLogOnly: false,
    };

    return query;
  }

  private assignResultsGetLogInfoRelatedEvent(logInfoModels: GetLogInfoModel[], wrongScoreModels: WrongScoreModel[]): void {
    logInfoModels.forEach(model => {
      const wrongScoreModel = wrongScoreModels.find(y => y.matchId === model.matchId);
      this.assignResultsGetLogInfoToModel(model, wrongScoreModel);
    });
  }

  /* istanbul ignore next */
  private assignResultsGetLogInfoToListModel(logInfoModels: GetLogInfoModel[], wrongScoreModels: WrongScoreModel[]): void {
    logInfoModels.forEach(model => {
      const wrongScoreModel = wrongScoreModels.find(y => y.scoreId === model.scoreId);
      this.assignResultsGetLogInfoToModel(model, wrongScoreModel);
    });
  }

  /* istanbul ignore next */
  private assignResultsGetLogInfoToModel(logInfoModel: GetLogInfoModel, wrongScoreModel: WrongScoreModel): void {
    wrongScoreModel.voidFromTime = moment(logInfoModel.logInfoDetail?.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    wrongScoreModel.voidToTime = moment(logInfoModel.logInfoDetail?.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    wrongScoreModel.logInfoDetail = logInfoModel.logInfoDetail;
    wrongScoreModel.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel, wrongScoreModel.filterFromTransTime, wrongScoreModel.saTime);
  }

  /* istanbul ignore next */
  public clearDataValidation(wrongScoreModels: WrongScoreModel[]) {
    wrongScoreModels.forEach(x => {
      x.logInfoDetail = null;
      x.messageValidationLogInfo = null;
      x.voidFromTime = null;
      x.voidToTime = null;
    });
  }

  public resetLogInfoOfEvent(events: LogInfoRelatedEvent[]): void {
    events.forEach(event => {
      event.logInfoDetail = null;
      event.messageValidationLogInfo = null;
    });
  }
}
