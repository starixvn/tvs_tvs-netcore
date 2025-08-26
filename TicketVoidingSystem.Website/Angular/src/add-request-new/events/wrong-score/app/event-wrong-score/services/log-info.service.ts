import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat, TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { CommonService } from '../../../../../../utility/services/common.service';
import { StaticService } from '../../../../../../utility/services/static.service';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { GetLogInfoQuery } from '../../../../../models/add-request.query';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { GetLogInfoModel } from '../../../../../models/get-log-info.model';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { WrongScoreGetLogInfoQuery } from '../event-wrong-score.model';
import { GetLogInfoParams } from '../models/get-log-info-params.model';
import { EventWrongScoreService } from './event-wrong-score.service';
import { ValidationService } from './validation.service';

@Injectable()
export class LogInfoService {
  private readonly commonService = inject(CommonService);
  private readonly validationService = inject(ValidationService);
  private readonly eventWrongScoreService = inject(EventWrongScoreService);

  async getLogInfo(params: GetLogInfoParams): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoQueries(params);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);
    params.primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    params.primitiveProps.infoSiteDBDownModel = viewModel.infoSiteDBDownModel;

    params.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME
      ? this.assignResultsGetLogInfoRelatedEvent(viewModel.getLogInfoModels, params)
      : this.assignResultsGetLogInfoToListModel(viewModel.getLogInfoModels, params.wrongScoreModels);
  }

  mapWrongScoreGetLogInfoQuery(wrongScoreModel: WrongScoreModel, filterBy: number, defaultFilterTimeWithAllowance: FilterTimeWithAllowance): WrongScoreGetLogInfoQuery {
    const wrongScoreGetLogInfoQuery = new WrongScoreGetLogInfoQuery();
    wrongScoreGetLogInfoQuery.scoreId = wrongScoreModel.scoreId;
    wrongScoreGetLogInfoQuery.matchId = wrongScoreModel.matchId;
    wrongScoreGetLogInfoQuery.filterBy = filterBy;
    wrongScoreGetLogInfoQuery.subIssueTypeId = wrongScoreModel.subIssueTypeId;

    if (wrongScoreModel.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      wrongScoreGetLogInfoQuery.filterFromTransTime = defaultFilterTimeWithAllowance.fromDateTime;
      wrongScoreGetLogInfoQuery.filterToTransTime = defaultFilterTimeWithAllowance.toDateTime;
      wrongScoreGetLogInfoQuery.aaTime = wrongScoreModel.aaTime;
      wrongScoreGetLogInfoQuery.paTime = wrongScoreModel.paTime;
      wrongScoreGetLogInfoQuery.saTime = wrongScoreModel.saTime;
    }
    else {
      wrongScoreGetLogInfoQuery.filterFromTransTime = wrongScoreModel.filterFromTransTime;
      wrongScoreGetLogInfoQuery.filterToTransTime = wrongScoreModel.filterToTransTime;
    }

    return wrongScoreGetLogInfoQuery;
  }

  getWrongScoreQueryHasManyScores(params: GetLogInfoParams, filterBy: number): WrongScoreGetLogInfoQuery[] {
    return params.wrongScoreModels.map(x => {
      return this.mapWrongScoreGetLogInfoQuery(x, filterBy, params.defaultFilterTimeWithAllowance);
    });
  }

  getWrongScoreQueryHasRelatedEvent(params: GetLogInfoParams, filterBy: number): WrongScoreGetLogInfoQuery[] {
    const allEvents = [params.mainEvent, ...params.relatedEvents]
    const relatedEventsGetLogInfoQuery = allEvents.map(event => {
      const wrongScoreGetLogInfoQuery = new WrongScoreGetLogInfoQuery();
      wrongScoreGetLogInfoQuery.filterFromTransTime = event.isMainMatch || this.validationService.isHasAllowanceTime(event) ? params.defaultFilterTimeWithAllowance.fromDateTime : event.voidTimeArea.fromDateTime;
      wrongScoreGetLogInfoQuery.filterToTransTime = event.isMainMatch || this.validationService.isHasAllowanceTime(event) ? params.defaultFilterTimeWithAllowance.toDateTime : event.voidTimeArea.toDateTime;
      wrongScoreGetLogInfoQuery.matchId = event.matchId;
      wrongScoreGetLogInfoQuery.filterBy = filterBy;
      wrongScoreGetLogInfoQuery.subIssueTypeId = event.subIssueTypeId;
      wrongScoreGetLogInfoQuery.aaTime = event.isMainMatch ? params.defaultFilterTimeWithAllowance.aaTime : event.voidTimeArea.aaTime;
      wrongScoreGetLogInfoQuery.paTime = event.isMainMatch ? params.defaultFilterTimeWithAllowance.paTime : event.voidTimeArea.paTime;
      wrongScoreGetLogInfoQuery.saTime = event.isMainMatch ? params.defaultFilterTimeWithAllowance.saTime : event.voidTimeArea.saTime;

      return wrongScoreGetLogInfoQuery;
    });

    return relatedEventsGetLogInfoQuery;
  }

  private getWrongScoreModel(params: GetLogInfoParams): WrongScoreGetLogInfoQuery[] {
    const filterBy = this.eventWrongScoreService.getFilterByBaseOnSubIssueType(params.filter.subIssueTypeId);

    if (params.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME) {
      return this.getWrongScoreQueryHasRelatedEvent(params, filterBy);
    }
    else {
      return this.getWrongScoreQueryHasManyScores(params, filterBy);
    }
  }

  /* istanbul ignore next */
  public initGetLogInfoQueries(params: GetLogInfoParams): GetLogInfoQuery {
    const getWrongScoreModels = this.getWrongScoreModel(params);

    const query: GetLogInfoQuery = {
      requestId: params.isEdit ? params.requestId : null,
      actionId: Number(params.filter.action),
      issueTypeId: Number(params.filter.issueTypeId),
      subIssueTypeId: Number(params.filter.subIssueTypeId),
      wrongScoreModels: getWrongScoreModels,
      isShowLogOnly: false,
    };

    return query;
  }

  private assignResultsGetLogInfoRelatedEvent(logInfoModels: GetLogInfoModel[], params: GetLogInfoParams): void {
    const logInfoMainEvent = logInfoModels.find(x => x.matchId === params.mainEvent.matchId);
    this.assignResultsGetLogInfoForRelatedEvent(logInfoMainEvent, params.mainEvent);

    params.relatedEvents.forEach(event => {
      const logInfoRelatedEvent = logInfoModels.find(x => x.matchId === event.matchId);
      this.assignResultsGetLogInfoForRelatedEvent(logInfoRelatedEvent, event);
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

  assignResultsGetLogInfoForRelatedEvent(logInfoModel: GetLogInfoModel, event: LogInfoRelatedEvent): void {
    event.logInfoDetail = logInfoModel.logInfoDetail;
    event.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel, event.voidTimeArea.fromDateTime, event.voidTimeArea.saTime);
    if (this.validationService.isHasAllowanceTime(event) && logInfoModel.logInfoDetail) {
      event.voidTimeArea.fromDateTime = moment(logInfoModel.logInfoDetail.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
      event.voidTimeArea.toDateTime = moment(logInfoModel.logInfoDetail.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    }
  }

  /* istanbul ignore next */
  public clearDataValidation(wrongScoreModels: WrongScoreModel[], events: LogInfoRelatedEvent[], mainEvent: LogInfoRelatedEvent) {
    wrongScoreModels?.forEach(x => {
      x.logInfoDetail = null;
      x.messageValidationLogInfo = null;
      x.voidFromTime = null;
      x.voidToTime = null;
    });
    events?.forEach(x => {
      x.logInfoDetail = null;
      x.messageValidationLogInfo = null;
    });

    if (mainEvent) {
      mainEvent.logInfoDetail = null;
      mainEvent.messageValidationLogInfo = null;
    }
  }
}
