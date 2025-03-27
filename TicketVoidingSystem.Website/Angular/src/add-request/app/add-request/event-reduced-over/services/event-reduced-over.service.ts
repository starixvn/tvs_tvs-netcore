import { Injectable } from "@angular/core";
import { LogInfoDetail } from "../../../../../utility/models/log-info-detail.model";
import { StaticService } from "../../../../../utility/services/static.service";
import { ReducedOverModel } from "../../models/event-reduced-over.model";
import { FilterReducedOverModel } from "../models/filter-reduced-over.model";
import { ReducedOverGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoReducedOver } from "../models/log-info-reduced-over.model";

@Injectable()
export class EventReducedOverService {

  public getReducedOverGetLogInfoModel(subIssueTypeId: number, matchId: number, filterReducedOverModels: FilterReducedOverModel[]): ReducedOverGetLogInfoQuery[] {
    return filterReducedOverModels.map(x => this.createReducedOverGetLogInfoQuery(x, matchId, Number(subIssueTypeId)));
  }

  public getReducedOverModel(subIssueTypeId: number, logInfoEvent: LogInfoReducedOver): ReducedOverModel[] {
    return logInfoEvent.filterReducedOvers.map(x => this.createReducedOverModel(x, logInfoEvent.matchId, Number(subIssueTypeId), logInfoEvent.logInfoDetail));
  }

  public assignModelsToEvents(inputModels: ReducedOverModel[]): LogInfoReducedOver {
    const logInfo = new LogInfoReducedOver();
    logInfo.matchId = inputModels[0].matchId;
    logInfo.logInfoDetail = inputModels[0].logInfoDetail;
    logInfo.filterReducedOvers = inputModels.map(x => this.createFilterReducedOverModel(x));

    return logInfo;
  }

  private createFilterReducedOverModel(inputModel: ReducedOverModel): FilterReducedOverModel {
    const model = new FilterReducedOverModel();
    model.betTypeIds = inputModel.betTypeIds.split(',');
    model.wicketOver = inputModel.wicketOver;
    model.playerIds = inputModel.playerIds.split(',');
    model.runs = inputModel.runs;
    model.nonLive = inputModel.nonLive;
    model.live = inputModel.live;

    return model;
  }

  private createReducedOverGetLogInfoQuery(inputModel: FilterReducedOverModel, matchId: number, subIssueTypeId: number): ReducedOverGetLogInfoQuery {
    const model = new ReducedOverGetLogInfoQuery();
    model.matchId = matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.betTypeIds = inputModel.betTypeIds.join(',');
    model.wicketOver = inputModel.wicketOver;
    model.filterWicketOver = StaticService.convertStringToBetId8xxx(inputModel.wicketOver);
    model.playerIds = inputModel.playerIds.join(',');
    model.runs = inputModel.runs;
    model.nonLive = inputModel.nonLive;
    model.live = inputModel.live;

    return model;
  }

  private createReducedOverModel(inputModel: FilterReducedOverModel, matchId: number, subIssueTypeId: number, logInfoDetail: LogInfoDetail): ReducedOverModel {
    const model = new ReducedOverModel();
    model.betTypeIds = inputModel.betTypeIds.join(',');
    model.wicketOver = inputModel.wicketOver;
    model.filterWicketOver = StaticService.convertStringToBetId8xxx(inputModel.wicketOver);
    model.playerIds = inputModel.playerIds.join(',');
    model.runs = inputModel.runs;
    model.nonLive = inputModel.nonLive;
    model.live = inputModel.live;
    model.matchId = matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.logInfoDetail = logInfoDetail;

    return model;
  }
}