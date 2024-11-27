import { Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { DateTimeFormat } from "../../../../../utility/constants/config";
import { ExtraWarningModel } from "../../confirm-add-request/confirm-add-request.model";
import { WrongMarketOfferedModel } from "../../models/event-wrong-market-offered.model";
import { FilterWrongMarketOfferedModel } from "../models/filter-wrong-market-offered.model";
import { WrongMarketOfferedGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoItem, LogInfoWrongMarketOffered } from "../models/log-info-wrong-market-offered.model";

@Injectable({
  providedIn: 'root'
})

export class EventWrongMarketOfferedService {

  initDefaultTime(): FilterWrongMarketOfferedModel {
    const currentMoment = moment.utc().tz('America/Caracas');
    const model = new FilterWrongMarketOfferedModel();
    model.fromDateTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    model.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);

    return model;
  }

  getWrongMarketOfferedGetLogInfoModel(subIssueTypeId: number, logInfo: LogInfoWrongMarketOffered): WrongMarketOfferedGetLogInfoQuery[] {
    return logInfo.filterWrongMarketOfferedModels.map(filterItem => this.createWrongMarketOfferedGetLogInfoQuery(logInfo, subIssueTypeId, filterItem));
  }

  getWrongMarketOfferedModel(subIssueTypeId: number, logInfoEvent: LogInfoWrongMarketOffered): WrongMarketOfferedModel[] {
     return logInfoEvent.logInfoItems.filter(x => x.logInfoDetail)
      .map(x => x.filterTime)
      .map(filterItem => this.createWrongMarketOfferedModel(subIssueTypeId, logInfoEvent, filterItem));
  }

  createWrongMarketOfferedModel(subIssueTypeId: number, logInfoEvent: LogInfoWrongMarketOffered,
    filterItem: FilterWrongMarketOfferedModel): WrongMarketOfferedModel {
    const model = new WrongMarketOfferedModel();
    model.id = filterItem.id;
    model.filterFromTransTime = filterItem.fromDateTime;
    model.filterToTransTime = filterItem.toDateTime;
    model.matchId = logInfoEvent.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.betTeamsResult = logInfoEvent.betTeamsResult;
    model.logInfoDetail = logInfoEvent.logInfoItems.find(x => x.id === filterItem.id).logInfoDetail;
    model.betTypeCount = logInfoEvent.logInfoItems.find(x => x.id === filterItem.id).betTypeCount;
    model.allBetTypesSelection = logInfoEvent.allBetTypesSelection;
    return model;
  }

  assignModelsToEvents(inputModels: WrongMarketOfferedModel[]): LogInfoWrongMarketOffered {
    const logInfo = new LogInfoWrongMarketOffered();
    logInfo.matchId = inputModels[0].matchId;
    logInfo.betTeamsResult = inputModels[0].betTeamsResult;
    logInfo.allBetTypesSelection = inputModels[0].allBetTypesSelection;
    logInfo.logInfoItems = inputModels.map(x => this.createLogInfoItem(x));
    logInfo.filterWrongMarketOfferedModels = inputModels.map(x => this.createFilterWrongMarketOfferedModel(x));

    return logInfo;
  }

  getExtraWarningModel(logInfoItems: LogInfoItem[]) {
    const excludeTimeRange = logInfoItems.filter(x => !x.logInfoDetail).map(x => `${x.filterTime.fromDateTime} - ${x.filterTime.toDateTime}`);
    if (excludeTimeRange.length === 0) {
      return null;
    }

    return {
      title: 'Time range(s) excluded when creating new request because having no valid tickets:',
      messages: excludeTimeRange
    } as ExtraWarningModel;
  }

  private createLogInfoItem(inputModel: WrongMarketOfferedModel): LogInfoItem {
    return {
      id: inputModel.id,
      logInfoDetail: inputModel.logInfoDetail,
      betTypeCount: inputModel.betTypeCount
    } as LogInfoItem;
  }

  private createFilterWrongMarketOfferedModel(inputModel: WrongMarketOfferedModel): FilterWrongMarketOfferedModel {
    const model = new FilterWrongMarketOfferedModel();
    model.id = inputModel.id;
    model.fromDateTime = inputModel.filterFromTransTime;
    model.toDateTime = inputModel.filterToTransTime;

    return model;
  }

  private createWrongMarketOfferedGetLogInfoQuery(logInfo: LogInfoWrongMarketOffered, subIssueTypeId: number,
    filterItem: FilterWrongMarketOfferedModel): WrongMarketOfferedGetLogInfoQuery {
    const model = new WrongMarketOfferedGetLogInfoQuery();
    model.matchId = logInfo.matchId;
    model.subIssueTypeId = subIssueTypeId;
    model.id = filterItem.id;
    model.filterFromTransTime = filterItem.fromDateTime;
    model.filterToTransTime = filterItem.toDateTime;
    model.betTeamsResult = logInfo.betTeamsResult;
    return model;
  }
}