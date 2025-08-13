import { EventEmitter, inject, Injectable, QueryList } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateTimeFormat, TimeZone } from '../../../../../../utility/constants/config';
import { StaticService } from '../../../../../../utility/services/static.service';
import { WrongScoreModel } from '../../../../models/event-wrong-score.model';
import { LastTimeScore, LastTimeScoreQuery } from '../../../../models/last-time-score.model';
import { FilterTimeWithAllowance } from '../../../../red-card/app/event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AddRequestApiService } from '../../../../services/add-request-api.service';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';

@Injectable()
export class WrongScoreService {
  private readonly addRequestApiService = inject(AddRequestApiService);

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
    const wrongScores = await this.callApiGetWrongScores(matchId);
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

  public getSelectedWrongScoreComponents(wrongScoreInfoComponents: QueryList<WrongScoreInfoComponent>): WrongScoreInfoComponent[] {
    return wrongScoreInfoComponents.filter(x => x.wrongScoreModel.isChecked);
  }

  private async getLastTimeTicket(wrongScoreModel: WrongScoreModel, actionId: number, matchId: number, filterBy: number): Promise<void> {
    const lastTimeModel = await this.getLastTimeScore(wrongScoreModel, actionId, matchId, filterBy);
    wrongScoreModel.filterToTransTime = lastTimeModel.lastTime;
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

  async callApiGetWrongScores(matchId: number): Promise<WrongScoreModel[]> {
    const data = await this.addRequestApiService.getWrongScores(matchId);

    return data;
  }

  updateByOriginWrongScoreModel(originWrongScoreModels: WrongScoreModel[], wrongScoreModels: WrongScoreModel[]) {
    originWrongScoreModels.forEach(x => {
      if (!wrongScoreModels.some(y => y.scoreId === x.scoreId)) {
        wrongScoreModels.push(_.cloneDeep(x));
      }
    });
    wrongScoreModels = _.orderBy(_.uniqBy(wrongScoreModels, x => x.scoreId), ['scoreId'], ['asc']);
  }

  getTimeSelectedScore(wrongScoreModels: WrongScoreModel[]): string {
    let fromTime = '';
    let toTime = '';
    if (wrongScoreModels.filter(x => x.isChecked)[0].logInfoDetail) {
      fromTime = this.displayFullDateTimeFormat(wrongScoreModels.filter(x => x.isChecked)[0].logInfoDetail.voidFromTime);
    }
    if (wrongScoreModels.filter(x => x.isChecked)[wrongScoreModels.filter(x => x.isChecked).length - 1].logInfoDetail) {
      toTime = this.displayFullDateTimeFormat(wrongScoreModels.filter(x => x.isChecked)[wrongScoreModels.filter(x => x.isChecked).length - 1].logInfoDetail.voidToTime);
    }
    return `${fromTime} - ${toTime}`;
  }

  public displayFullDateTimeFormat(time: Date): string {
    return moment(time).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }
}
