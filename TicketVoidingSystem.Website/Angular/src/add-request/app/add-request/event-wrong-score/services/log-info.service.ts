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

@Injectable({
  providedIn: 'root'
})
export class LogInfoService {
  constructor(
    private readonly wrongScoreService: WrongScoreService,
    private readonly commonService: CommonService) {
  }

  async getLogInfo(isEdit: boolean, requestId: number, matchId: number, filter: FilterModel, primitiveProps: PrimitiveProperty,
    wrongScoreModels: WrongScoreModel[]): Promise<void> {
    const getLogInfoQuery = this.initGetLogInfoQueries(isEdit, requestId, matchId, filter, wrongScoreModels);
    const viewModel = await this.commonService.getLogInfo(getLogInfoQuery);

    primitiveProps.transInfoAddRequestModel = viewModel.transInfoAddRequestModel;
    primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME ?
      this.assignResultsGetLogInfoToModel(viewModel.getLogInfoModels[0], wrongScoreModels[0]) :
      this.assignResultsGetLogInfoToListModel(viewModel.getLogInfoModels, wrongScoreModels);
  }

  /* istanbul ignore next */
  public initGetLogInfoQueries(isEdit: boolean, requestId: number, matchId: number, filter: FilterModel,
    wrongScoreModels: WrongScoreModel[]): GetLogInfoQuery {
    const wrongScoresForGetLogInfo = this.getWrongScoreModel(matchId, filter, wrongScoreModels);

    const query: GetLogInfoQuery = {
      requestId: isEdit ? requestId : null,
      actionId: Number(filter.action),
      issueTypeId: Number(filter.issueTypeId),
      subIssueTypeId: Number(filter.subIssueTypeId),
      wrongScoreModels: wrongScoresForGetLogInfo,
      isShowLogOnly: false,
    };

    return query;
  }
  
  private getWrongScoreModel(matchId: number, filter: FilterModel, wrongScoreModels: WrongScoreModel[]): WrongScoreGetLogInfoQuery[] {
    return wrongScoreModels.map(x => {
      return {
        scoreId: x.scoreId,
        matchId: matchId,
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
    wrongScoreModel.messageValidationLogInfo = StaticService.getValidationMessageList(logInfoModel);
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
}
