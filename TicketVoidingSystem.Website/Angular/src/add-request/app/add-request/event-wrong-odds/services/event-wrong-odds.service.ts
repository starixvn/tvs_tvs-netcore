import { Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { GetLinkedLogQuery, LinkedLogsViewModel } from "../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model";
import { DateTimeFormat, PoolHouseTicketValue } from "../../../../../utility/constants/config";
import { AddRequestApiService } from "../../add-request-api.service";
import { FilterModel } from "../../filter/filter.model";
import { WrongOddsModel } from "../../models/event-wrong-odds.model";
import { FilterBetTeamConstant, FilterFavoriteTypeConstant, FilterOddsTypeConstant, FilterOuTypeConstant, FilterWrongOddsModel } from "../models/filter-wrong-odds.model";
import { WrongOddsGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongOdds } from "../models/log-info-wrong-odds.model";

@Injectable({
  providedIn: 'root'
})

export class EventWrongOddsService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
  ) {}

  public initDefaultFilter(loginfoEvent: LogInfoWrongOdds): void {
    loginfoEvent.filterWrongOdds = new FilterWrongOddsModel();
    loginfoEvent.filterWrongOdds.filterOddsType = FilterOddsTypeConstant.VALUE;
    loginfoEvent.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
    loginfoEvent.filterWrongOdds.filterOuType = FilterOuTypeConstant.OVER;
    loginfoEvent.filterWrongOdds.betTeam = FilterBetTeamConstant.HOME;

    const currentMoment = moment.utc().tz('America/Caracas');
    loginfoEvent.filterWrongOdds.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    loginfoEvent.filterWrongOdds.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  public initDefaultLogInfoWrongOdds(): LogInfoWrongOdds {
    const event = new LogInfoWrongOdds();
    event.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    this.initDefaultFilter(event);

    return event;
  }

  public async getLinkedLog(logInfoEvent: LogInfoWrongOdds, filter: FilterModel): Promise<LinkedLogsViewModel> {
    const query = {
      matchId: logInfoEvent.matchId,
      issueTypeId: Number(filter.issueTypeId),
      subIssueTypeId: Number(filter.subIssueTypeId),
      filterFromTransTime: logInfoEvent.filterWrongOdds.filterFromTransTime,
      filterToTransTime: logInfoEvent.filterWrongOdds.filterToTransTime,
      liveIndicator: logInfoEvent.filterWrongOdds.liveIndicator,
      filterOddsType: logInfoEvent.filterWrongOdds.filterOddsType,
      filterFavoriteType: logInfoEvent.filterWrongOdds.filterFavoriteType,
      filterOuType: logInfoEvent.filterWrongOdds.filterOuType,
      favoriteValue: logInfoEvent.filterWrongOdds.favoriteValue,
      oddsValue: logInfoEvent.filterWrongOdds.oddsValue,
      fromOdds: logInfoEvent.filterWrongOdds.fromOdds,
      toOdds: logInfoEvent.filterWrongOdds.toOdds,
      betTeam: logInfoEvent.filterWrongOdds.betTeam,
      ouValue: logInfoEvent.filterWrongOdds.ouValue,
      correctOdds: logInfoEvent.filterWrongOdds.correctOdds
    } as GetLinkedLogQuery;

    return this.addRequestApiService.getLinkedLogs(query);
  }

  public getWrongOddsModel(filter: FilterModel, logInfoEvent: LogInfoWrongOdds): WrongOddsGetLogInfoQuery {
    const logInfoQuery = new WrongOddsGetLogInfoQuery();
      logInfoQuery.matchId = logInfoEvent.matchId;
      logInfoQuery.subIssueTypeId = Number(filter.subIssueTypeId);
      logInfoQuery.poolHouseCheckedBetTypes = logInfoEvent.poolHouseCheckedBetTypes;
      logInfoQuery.filterFromTransTime = logInfoEvent.filterWrongOdds.filterFromTransTime;
      logInfoQuery.filterToTransTime = logInfoEvent.filterWrongOdds.filterToTransTime;
      logInfoQuery.liveIndicator = logInfoEvent.filterWrongOdds.liveIndicator;
      logInfoQuery.isLinkGroup1X2 = logInfoEvent.linkedLogsViewModel.isLinkGroup1X2;
      logInfoQuery.isLinkGroupAIO = logInfoEvent.linkedLogsViewModel.isLinkGroupAIO;
      logInfoQuery.filterFavoriteType = logInfoEvent.filterWrongOdds.filterFavoriteType;
      logInfoQuery.filterOddsType = logInfoEvent.filterWrongOdds.filterOddsType;
      logInfoQuery.filterOuType = logInfoEvent.filterWrongOdds.filterOuType;
      logInfoQuery.oddsValue = logInfoEvent.filterWrongOdds.oddsValue;
      logInfoQuery.fromOdds = logInfoEvent.filterWrongOdds.fromOdds;
      logInfoQuery.toOdds = logInfoEvent.filterWrongOdds.toOdds;
      logInfoQuery.correctOdds = logInfoEvent.filterWrongOdds.correctOdds;
      logInfoQuery.betTeam = logInfoEvent.filterWrongOdds.betTeam;
      logInfoQuery.ouValue = logInfoEvent.filterWrongOdds.ouValue;
      logInfoQuery.favoriteValue = logInfoEvent.filterWrongOdds.favoriteValue;

      return logInfoQuery;
  }

  assignModelsToEvents(inputModels: WrongOddsModel): LogInfoWrongOdds {
    const event = new LogInfoWrongOdds();
    event.matchId = inputModels.matchId;
    event.logInfoDetail = inputModels.logInfoDetail;
    event.poolHouseCheckedBetTypes = inputModels.poolHouseCheckedBetTypes;
    event.isPoolHouseAffected = inputModels.isPoolHouseAffected;
    event.linkedLogsViewModel = {
      isLinkGroup1X2: inputModels.isLinkGroup1X2,
      isLinkGroupAIO: inputModels.isLinkGroupAIO,
      result: null
    } as LinkedLogsViewModel;
    event.filterWrongOdds = {
      filterFromTransTime: inputModels.filterFromTransTime,
      filterToTransTime: inputModels.filterToTransTime,
      filterOddsType: inputModels.filterOddsType,
      filterOuType: inputModels.filterOuType,
      filterFavoriteType: inputModels.filterFavoriteType,
      oddsValue: inputModels.oddsValue,
      fromOdds: inputModels.fromOdds,
      toOdds: inputModels.toOdds,
      betTeam: inputModels.betTeam,
      correctOdds: inputModels.correctOdds,
      favoriteValue: inputModels.favoriteValue,
      ouValue: inputModels.ouValue,
      liveIndicator: inputModels.liveIndicator
    } as FilterWrongOddsModel;

    return event;
  }
}