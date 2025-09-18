import { inject, Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { AllowanceRate, DateTimeFormat } from "../../../../../../utility/constants/config";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { GetLinkedLogQuery, LinkedLogsViewModel } from '../../../../../component/pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketValue } from '../../../../../component/pool-house-ticket/pool-house-ticket.constant';
import { WrongOddsModel } from "../../../../../models/event-wrong-odds.model";
import { AddRequestApiService } from "../../../../../services/add-request-api.service";
import { FilterFavoriteTypeConstant, FilterWrongOddsModel } from "../models/filter-wrong-odds.model";
import { WrongOddsGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongOdds } from "../models/log-info-wrong-odds.model";
import { ValidationService } from './validation.service';

@Injectable()
export class EventWrongOddsService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);

  public initDefaultFilter(logInfoEvent: LogInfoWrongOdds): void {
    logInfoEvent.filterWrongOdds = new FilterWrongOddsModel();
    logInfoEvent.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
    logInfoEvent.filterWrongOdds.allowanceRate = AllowanceRate.ALLOWANCE_RATE[0].value;
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
      spread: logInfoEvent.filterWrongOdds.spread.toString(),
      allowanceRate: logInfoEvent.filterWrongOdds.allowanceRate,
      correctOddsAwayUnder: logInfoEvent.filterWrongOdds.correctOddsAwayUnder,
      correctOddsHomeOver: logInfoEvent.filterWrongOdds.correctOddsHomeOver,
      fromOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder,
      fromOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver,
      toOddsNotVoidAwayUnder: logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder,
      toOddsNotVoidHomeOver: logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver
    } as GetLinkedLogQuery;

    if (this.validationService.isSubTypeOuOr1stOu(filter.subIssueTypeId)) {
      query.wrongOU = logInfoEvent.filterWrongOdds.wrongOU;
    } else {
      query.filterFavoriteType = logInfoEvent.filterWrongOdds.filterFavoriteType;
      query.favoriteValue = logInfoEvent.filterWrongOdds.favoriteValue;
    }

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
      logInfoQuery.spread = logInfoEvent.filterWrongOdds.spread.toString();
      logInfoQuery.allowanceRate = logInfoEvent.filterWrongOdds.allowanceRate;
      logInfoQuery.correctOddsAwayUnder = logInfoEvent.filterWrongOdds.correctOddsAwayUnder;
      logInfoQuery.correctOddsHomeOver = logInfoEvent.filterWrongOdds.correctOddsHomeOver;
      logInfoQuery.fromOddsNotVoidAwayUnder = logInfoEvent.filterWrongOdds.fromOddsNotVoidAwayUnder;
      logInfoQuery.fromOddsNotVoidHomeOver = logInfoEvent.filterWrongOdds.fromOddsNotVoidHomeOver;
      logInfoQuery.toOddsNotVoidAwayUnder = logInfoEvent.filterWrongOdds.toOddsNotVoidAwayUnder;
      logInfoQuery.toOddsNotVoidHomeOver = logInfoEvent.filterWrongOdds.toOddsNotVoidHomeOver;

      if (this.validationService.isSubTypeOuOr1stOu(filter.subIssueTypeId)) {
        logInfoQuery.wrongOU = logInfoEvent.filterWrongOdds.wrongOU;
      } else {
        logInfoQuery.filterFavoriteType = logInfoEvent.filterWrongOdds.filterFavoriteType;
        logInfoQuery.favoriteValue = logInfoEvent.filterWrongOdds.favoriteValue;
      }

      return logInfoQuery;
  }

  assignModelsToEvents(inputModels: WrongOddsModel): LogInfoWrongOdds {
    const event = new LogInfoWrongOdds();
    event.matchId = inputModels.matchId;
    event.sportType = inputModels.sportType;
    event.logInfoDetail = inputModels.logInfoDetail;
    event.poolHouseCheckedBetTypes = inputModels.poolHouseCheckedBetTypes;
    event.linkedLogsViewModel = {
      isLinkGroup1X2: inputModels.isLinkGroup1X2,
      isLinkGroupAIO: inputModels.isLinkGroupAIO,
      result: null
    } as LinkedLogsViewModel;

    event.filterWrongOdds = {
      filterFromTransTime: inputModels.filterFromTransTime,
      filterToTransTime: inputModels.filterToTransTime,
      liveIndicator: inputModels.liveIndicator,
      spread: inputModels.spread,
      allowanceRate: inputModels.allowanceRate,
      correctOddsHomeOver: inputModels.correctOddsHomeOver,
      correctOddsAwayUnder: inputModels.correctOddsAwayUnder,
      fromOddsNotVoidHomeOver: inputModels.fromOddsNotVoidHomeOver,
      toOddsNotVoidHomeOver: inputModels.toOddsNotVoidHomeOver,
      fromOddsNotVoidAwayUnder: inputModels.fromOddsNotVoidAwayUnder,
      toOddsNotVoidAwayUnder: inputModels.toOddsNotVoidAwayUnder
    } as FilterWrongOddsModel;

    if (this.validationService.isSubTypeOuOr1stOu(inputModels.subIssueTypeId.toString())) {
      event.filterWrongOdds.wrongOU = inputModels.wrongOU;
      event.filterWrongOdds.filterFavoriteType = FilterFavoriteTypeConstant.HOME;
    } else {
      event.filterWrongOdds.filterFavoriteType = inputModels.filterFavoriteType;
      event.filterWrongOdds.favoriteValue = inputModels.favoriteValue;
    }

    return event;
  }

  public resetPoolHouseCheckedBetTypes(logInfo: LogInfoWrongOdds): void {
    logInfo.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
  }
}