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

@Injectable({
  providedIn: 'root'
})
export class LogInfoService {
  constructor(
    private readonly wrongScoreService: WrongScoreService,
    private readonly commonService: CommonService) { }

  async getLogInfo(isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
    wrongScoreModels: WrongScoreModel[], mainMatchId: number): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoQueries(isEdit, requestId, filter, wrongScoreModels, mainMatchId);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;

    primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME
      ? this.assignResultsGetLogInfoRelatedEvent(viewModel.getLogInfoModels, wrongScoreModels)
      : this.assignResultsGetLogInfoToListModel(viewModel.getLogInfoModels, wrongScoreModels);
  }

  async refreshLogInfoForRelatedEvent(isEdit: boolean, requestId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
    logInfoRelatedEvent: LogInfoRelatedEvent): Promise<void> {
    const wrongScoreModel = {
      matchId: logInfoRelatedEvent.matchId,
      filterBy: this.wrongScoreService.getFilterByBaseOnSubIssueType(filter.subIssueTypeId),
      filterFromTransTime: logInfoRelatedEvent.voidTimeArea.fromDateTime,
      filterToTransTime: logInfoRelatedEvent.voidTimeArea.toDateTime,
      subIssueTypeId: Number(filter.subIssueTypeId),
      aaTime: logInfoRelatedEvent.voidTimeArea.aaTime,
      paTime: logInfoRelatedEvent.voidTimeArea.paTime,
      saTime: logInfoRelatedEvent.voidTimeArea.saTime
    } as WrongScoreModel;
    const getLogInfoQuery = this.initGetLogInfoQueries(isEdit, requestId, filter, [wrongScoreModel], null);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    logInfoRelatedEvent.voidTimeArea.fromDateTime = moment(viewModel.getLogInfoModels[0].logInfoDetail?.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    logInfoRelatedEvent.voidTimeArea.toDateTime = moment(viewModel.getLogInfoModels[0].logInfoDetail?.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    logInfoRelatedEvent.logInfoDetail = viewModel.getLogInfoModels[0].logInfoDetail;
    logInfoRelatedEvent.messageValidationLogInfo = StaticService.getValidationMessageList(viewModel.getLogInfoModels[0], logInfoRelatedEvent.voidTimeArea.fromDateTime, logInfoRelatedEvent.voidTimeArea.saTime);
  }

  private getWrongScoreModel(filter: FilterModel, wrongScoreModels: WrongScoreModel[], mainMatchId: number): WrongScoreGetLogInfoQuery[] {
    return wrongScoreModels.map(x => {
      return {
        scoreId: x.scoreId,
        matchId: x.matchId ? x.matchId : mainMatchId,
        wrongScore: x.wrongScore,
        filterBy: this.wrongScoreService.getFilterByBaseOnSubIssueType(filter.subIssueTypeId),
        filterFromTransTime: x.filterFromTransTime,
        filterToTransTime: x.filterToTransTime,
        subIssueTypeId: Number(filter.subIssueTypeId),
        aaTime: x.aaTime,
        paTime: x.paTime,
        saTime: x.saTime
      } as WrongScoreGetLogInfoQuery;
    });
  }
  /* istanbul ignore next */
  public initGetLogInfoQueries(isEdit: boolean, requestId: number, filter: FilterModel,
    wrongScoreModels: WrongScoreModel[], mainMatchId: number): GetLogInfoQuery {
    const getWrongScoreModels = this.getWrongScoreModel(filter, wrongScoreModels, mainMatchId);

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
