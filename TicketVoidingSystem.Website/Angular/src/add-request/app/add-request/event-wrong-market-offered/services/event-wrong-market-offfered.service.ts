import { Injectable } from "@angular/core";
import { WrongMarketOfferedModel } from "../../models/event-wrong-market-offered.model";
import { FilterWrongMarketOfferedModel } from "../models/filter-wrong-market-offered.model";
import { WrongMarketOfferedGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongMarketOffered } from "../models/log-info-wrong-market-offered.model";

@Injectable({
  providedIn: 'root'
})

export class EventWrongMarketOfferedService {
  constructor() { }

  public getWrongMarketOfferedGetLogInfoModel(subIssueTypeId: number, logInfo: LogInfoWrongMarketOffered): WrongMarketOfferedGetLogInfoQuery {
    return this.createWrongMarketOfferedGetLogInfoQuery(logInfo, Number(subIssueTypeId));
  }

  public getWrongMarketOfferedModel(subIssueTypeId: number, logInfoEvent: LogInfoWrongMarketOffered): WrongMarketOfferedModel {
    const model = new WrongMarketOfferedModel();
    model.filterFromTransTime = logInfoEvent.filterWrongMarketOfferedModel.fromDateTime;
    model.filterToTransTime = logInfoEvent.filterWrongMarketOfferedModel.toDateTime;
    model.matchId = logInfoEvent.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.logInfoDetail = logInfoEvent.logInfoDetail;
    model.betTeamsResult = logInfoEvent.betTeamsResult;
    model.betTypeCount = logInfoEvent.betTypeCount;
    model.selectedAllBetTypes = logInfoEvent.selectedAllBetTypes;
    return model;
  }

  public assignModelsToEvents(inputModel: WrongMarketOfferedModel): LogInfoWrongMarketOffered {
    const logInfo = new LogInfoWrongMarketOffered();
    logInfo.matchId = inputModel.matchId;
    logInfo.logInfoDetail = inputModel.logInfoDetail;
    logInfo.filterWrongMarketOfferedModel = this.createFilterWrongMarketOfferedModel(inputModel);
    logInfo.betTypeCount = inputModel.betTypeCount;
    logInfo.betTeamsResult = inputModel.betTeamsResult;
    logInfo.selectedAllBetTypes = inputModel.selectedAllBetTypes;

    return logInfo;
  }

  private createFilterWrongMarketOfferedModel(inputModel: WrongMarketOfferedModel): FilterWrongMarketOfferedModel {
    const model = new FilterWrongMarketOfferedModel();
    model.fromDateTime = inputModel.filterFromTransTime;
    model.toDateTime = inputModel.filterToTransTime;

    return model;
  }

  private createWrongMarketOfferedGetLogInfoQuery(logInfo: LogInfoWrongMarketOffered, subIssueTypeId: number): WrongMarketOfferedGetLogInfoQuery {
    const model = new WrongMarketOfferedGetLogInfoQuery();
    model.matchId = logInfo.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.filterFromTransTime = logInfo.filterWrongMarketOfferedModel.fromDateTime;
    model.filterToTransTime = logInfo.filterWrongMarketOfferedModel.toDateTime;
    model.betTeamsResult = logInfo.betTeamsResult;
    return model;
  }
}