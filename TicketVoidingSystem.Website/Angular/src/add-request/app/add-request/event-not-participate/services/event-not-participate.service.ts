import { Injectable } from "@angular/core";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { NotParticipateModel } from "../../models/event-not-participate.model";
import { FilterNotParticipateModel } from "../models/filter-not-participate.model";
import { NotParticipateGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoNotParticipate } from "../models/log-info-not-participate.model";

@Injectable()
export class EventNotParticipateService {
  public getNotParticipateGetLogInfoModel(subIssueTypeId: number, matchId: number, filterNotParticipateModels: FilterNotParticipateModel[]): NotParticipateGetLogInfoQuery[] {
    return filterNotParticipateModels.map(x => this.createNotParticipateGetLogInfoQuery(x, matchId, Number(subIssueTypeId)));
  }

  public getNotParticipateModel(subIssueTypeId: number, logInfoEvent: LogInfoNotParticipate): NotParticipateModel[] {
    return logInfoEvent.filterNotParticipates.map(x => this.createNotParticipateModel(x, logInfoEvent.matchId, Number(subIssueTypeId), logInfoEvent.logInfoDetail));
  }

  public assignModelsToEvents(inputModels: NotParticipateModel[]): LogInfoNotParticipate {
    const logInfo = new LogInfoNotParticipate();
    logInfo.matchId = inputModels[0].matchId;
    logInfo.logInfoDetail = inputModels[0].logInfoDetail;
    logInfo.filterNotParticipates = inputModels.map(x => this.createFilterNotParticipateModel(x));

    return logInfo;
  }

  private createFilterNotParticipateModel(inputModel: NotParticipateModel): FilterNotParticipateModel {
    const model = new FilterNotParticipateModel();
    model.playerId = inputModel.playerId;
    model.betTypeIds = inputModel.betTypeIds.split(',');

    return model;
  }

  private createNotParticipateGetLogInfoQuery(inputModel: FilterNotParticipateModel, matchId: number, subIssueTypeId: number): NotParticipateGetLogInfoQuery {
    const model = new NotParticipateGetLogInfoQuery();
    model.matchId = matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.betTypeIds = inputModel.betTypeIds.join(',');
    model.playerId = inputModel.playerId

    return model;
  }

  private createNotParticipateModel(inputModel: FilterNotParticipateModel, matchId: number, subIssueTypeId: number, logInfoDetail: LogInfoDetail): NotParticipateModel {
    const model = new NotParticipateModel();
    model.betTypeIds = inputModel.betTypeIds.join(',');
    model.playerId = inputModel.playerId
    model.matchId = matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.logInfoDetail = logInfoDetail;

    return model;
  }
}