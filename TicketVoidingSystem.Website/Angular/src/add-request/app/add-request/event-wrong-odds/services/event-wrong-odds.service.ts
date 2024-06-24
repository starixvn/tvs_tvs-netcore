import { Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { GetLinkedLogQuery, LinkedLogsViewModel } from "../../../../../utility/components/pool-house-ticket/linked-log/linked-log.model";
import { AllowanceRate, DateTimeFormat, PoolHouseTicketValue } from "../../../../../utility/constants/config";
import { AddRequestApiService } from "../../add-request-api.service";
import { FilterModel } from "../../filter/filter.model";
import { WrongOddsModel } from "../../models/event-wrong-odds.model";
import { FilterBetTeamConstant, FilterFavoriteTypeConstant, FilterOddsTypeConstant, FilterOuTypeConstant, FilterWrongOddsModel, OddsInfoModel } from "../models/filter-wrong-odds.model";
import { WrongOddsGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongOdds } from "../models/log-info-wrong-odds.model";

@Injectable({
  providedIn: 'root'
})

export class EventWrongOddsService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
  ) {}

  public initDefaultFilter(logInfoEvent: LogInfoWrongOdds): void {
    logInfoEvent.filterWrongOdds = new FilterWrongOddsModel();
    logInfoEvent.filterWrongOdds.filterOddsType = FilterOddsTypeConstant.VALUE;
    logInfoEvent.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
    logInfoEvent.filterWrongOdds.filterOuType = FilterOuTypeConstant.OVER;
    logInfoEvent.filterWrongOdds.betTeam = FilterBetTeamConstant.HOME;
    logInfoEvent.filterWrongOdds.oddsInfo = new OddsInfoModel();
    logInfoEvent.filterWrongOdds.oddsInfo.allowanceRate = AllowanceRate.ALLOWANCE_RATE[0].value;
    const currentMoment = moment.utc().tz('America/Caracas');
    logInfoEvent.filterWrongOdds.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    logInfoEvent.filterWrongOdds.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
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
      filterFavoriteType: logInfoEvent.filterWrongOdds.filterFavoriteType,
      favoriteValue: logInfoEvent.filterWrongOdds.favoriteValue,
      wrongOU: logInfoEvent.filterWrongOdds.wrongOU,
      spread: logInfoEvent.filterWrongOdds.oddsInfo.spread.toString(),
      allowanceRate: logInfoEvent.filterWrongOdds.oddsInfo.allowanceRate,
      correctOddsAwayUnder: logInfoEvent.filterWrongOdds.oddsInfo.correctOddsAwayUnder,
      correctOddsHomeOver: logInfoEvent.filterWrongOdds.oddsInfo.correctOddsHomeOver,
      fromOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.oddsInfo.fromOddsNotVoidAwayUnder,
      fromOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.oddsInfo.fromOddsNotVoidHomeOver,
      toOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.oddsInfo.toOddsNotVoidAwayUnder,
      toOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.oddsInfo.toOddsNotVoidHomeOver      
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
      logInfoQuery.wrongOU = logInfoEvent.filterWrongOdds.wrongOU;
      logInfoQuery.favoriteValue = logInfoEvent.filterWrongOdds.favoriteValue;

      logInfoQuery.spread = logInfoEvent.filterWrongOdds.oddsInfo.spread.toString();
      logInfoQuery.allowanceRate = logInfoEvent.filterWrongOdds.oddsInfo.allowanceRate;
      logInfoQuery.correctOddsAwayUnder = logInfoEvent.filterWrongOdds.oddsInfo.correctOddsAwayUnder;
      logInfoQuery.correctOddsHomeOver = logInfoEvent.filterWrongOdds.oddsInfo.correctOddsHomeOver;
      logInfoQuery.fromOddsNotVoidAwayUnder = logInfoEvent.filterWrongOdds.oddsInfo.fromOddsNotVoidAwayUnder;
      logInfoQuery.fromOddsNotVoidHomeOver = logInfoEvent.filterWrongOdds.oddsInfo.fromOddsNotVoidHomeOver;
      logInfoQuery.toOddsNotVoidAwayUnder = logInfoEvent.filterWrongOdds.oddsInfo.toOddsNotVoidAwayUnder;
      logInfoQuery.toOddsNotVoidHomeOver = logInfoEvent.filterWrongOdds.oddsInfo.toOddsNotVoidHomeOver;

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
      wrongOU: inputModels.wrongOU,
      liveIndicator: inputModels.liveIndicator
    } as FilterWrongOddsModel;

    return event;
  }
}