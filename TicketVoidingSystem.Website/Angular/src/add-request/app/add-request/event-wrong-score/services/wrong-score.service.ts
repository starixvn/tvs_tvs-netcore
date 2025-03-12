import { EventEmitter, Injectable, QueryList } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateTimeFormat, TVSRequestFilterBy, TimeZone } from '../../../../../utility/constants/config';
import { StaticService } from '../../../../../utility/services/static.service';
import { AddRequestApiService } from '../../add-request-api.service';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { LastTimeScore, LastTimeScoreQuery } from '../../models/last-time-score.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';
import { ValidationService } from './validation.service';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';

@Injectable({
  providedIn: 'root'
})

export class WrongScoreService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService
  ) { }

  public initDefaultFilterWrongScore(): FilterTimeWithAllowance {
    const filterWrongScoreModel = new FilterTimeWithAllowance();
    const currentMoment = moment.utc().tz(TimeZone.AMERICA_CARACAS);
    filterWrongScoreModel.fromDateTime = moment.utc().tz(TimeZone.AMERICA_CARACAS).millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    filterWrongScoreModel.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return filterWrongScoreModel;
  }

  public getFilterWrongScore(wrongScoreModel: WrongScoreModel): FilterTimeWithAllowance {
    const filterWrongScoreModel = new FilterTimeWithAllowance();
    filterWrongScoreModel.fromDateTime = wrongScoreModel.filterFromTransTime;
    filterWrongScoreModel.toDateTime = wrongScoreModel.filterToTransTime;
    filterWrongScoreModel.aaTime = wrongScoreModel.aaTime;
    filterWrongScoreModel.paTime = wrongScoreModel.paTime;
    filterWrongScoreModel.saTime = wrongScoreModel.saTime;

    return filterWrongScoreModel;
  }

  getTvDetectionModel(inputModel: WrongScoreModel): TvDetectionModel {
    return {
      serviceAcceptTime: inputModel.serviceAcceptTime,
      actualTime: inputModel.actualTime,
      tvDetectionValue: inputModel.tvDetectionValue,
      minuteOffset: inputModel.minuteOffset,
      secondOffset: inputModel.secondOffset,
    } as TvDetectionModel;
  }

  public createMainWrongScoreModel(filterWrongScore: FilterTimeWithAllowance) {
    const model = new WrongScoreModel();
    model.filterFromTransTime = filterWrongScore.fromDateTime;
    model.filterToTransTime = filterWrongScore.toDateTime;
    model.aaTime = filterWrongScore.aaTime;
    model.paTime = filterWrongScore.paTime;
    model.saTime = filterWrongScore.saTime;
    model.isChecked = true;

    return model;
  }

  async handleCheckedLastScore(originWrongScoreModels: WrongScoreModel[], wrongScoreModel: WrongScoreModel,
    updateByOriginWrongScoreModelEvent: EventEmitter<WrongScoreModel[]>, matchId: number, actionId: number, filterBy: number): Promise<void> {
    const wrongScores = await this.getWrongScores(matchId);
    _.find(originWrongScoreModels, { scoreId: wrongScoreModel.scoreId }).filterToTransTime =
      _.find(wrongScores, { scoreId: wrongScoreModel.scoreId }).filterToTransTime;
    if (wrongScores.length !== originWrongScoreModels.length) {
      wrongScores.forEach(x => {
        if (!originWrongScoreModels.some(y => y.scoreId === x.scoreId)) {
          x.matchId =
            originWrongScoreModels.push(_.cloneDeep(x));
        }
      });
      updateByOriginWrongScoreModelEvent.emit(originWrongScoreModels);
      wrongScoreModel.filterToTransTime = _.find(originWrongScoreModels, { scoreId: wrongScoreModel.scoreId }).filterToTransTime;
    } else {
      await this.getLastTimeTicket(wrongScoreModel, actionId, matchId, filterBy);
    }
  }

  /* istanbul ignore next */
  public setNullAllowanceTime(wrongScoreModel: WrongScoreModel) {
    wrongScoreModel.aaTime = null;
    wrongScoreModel.paTime = null;
    wrongScoreModel.saTime = null;
  }

  public getSelectedWrongScores(wrongScoreModels: WrongScoreModel[]): WrongScoreModel[] {
    return wrongScoreModels.filter(x => x.isChecked || x.isMainMatch);
  }

  public getFilterByBaseOnSubIssueType(subIssueTypeId: string): number {
    if (this.validationService.isSubTypeFilterByAcceptedTime(subIssueTypeId)) {
      return TVSRequestFilterBy.CHECK_TIME;
    } else if (this.validationService.isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId)) {
      return TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME;
    } else {
      return TVSRequestFilterBy.TRANS_TIME;
    }
  }

  public getSelectedWrongScoreComponents(wrongScoreInfoComponents: QueryList<WrongScoreInfoComponent>): WrongScoreInfoComponent[] {
    const components = wrongScoreInfoComponents.filter(x => x.wrongScoreModel.isChecked);

    return components;
  }

  private async getLastTimeTicket(wrongScoreModel: WrongScoreModel, actionId: number, matchId: number, filterBy: number): Promise<void> {
    const lastTimeModel = await this.getLastTimeScore(wrongScoreModel, actionId, matchId, filterBy);
    wrongScoreModel.filterToTransTime = lastTimeModel.lastTime;
  }

  private async getWrongScores(matchId: number): Promise<WrongScoreModel[]> {
    const models = await this.addRequestApiService.getWrongScores(matchId);

    return models;
  }

  private async getLastTimeScore(wrongScoreModel: WrongScoreModel, actionId: number, matchId: number, filterBy: number): Promise<LastTimeScore> {
    const query: LastTimeScoreQuery = {
      matchId: matchId,
      actionId: actionId,
      scoreId: wrongScoreModel.scoreId,
      filterBy: filterBy,
      filterFromTransTime: wrongScoreModel.filterFromTransTime
    };
    const data = await this.addRequestApiService.getLastTimeScore(query);

    return data;
  }

  public getDurationTime(filterFromTransTime: string, filterToTransTime: string): string {
    const fromTime = moment(filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTime = moment(filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return StaticService.getDurations(fromTime, toTime);
  }
}
