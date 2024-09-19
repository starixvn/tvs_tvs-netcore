import { Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { DateTimeFormat } from "../../../../../utility/constants/config";
import { AddRequestApiService } from "../../add-request-api.service";
import { FilterModel } from "../../filter/filter.model";
import { WrongHdpModel } from "../../models/event-wrong-hdp.model";
import { GetLinkedLogQuery, LinkedLogsViewModel } from '../../pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketValue } from '../../pool-house-ticket/pool-house-ticket.constant';
import { FilterWithHdpModel } from "../models/filter-with-hdp.model";
import { WrongHdpGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongHdp } from "../models/log-info-wrong-hdp.model";
import { ValidationService } from "./validation.service";

@Injectable({
  providedIn: 'root'
})

export class EventWrongHdpService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService
  ) { }

  public async getLinkedLog(logInfoWrongHdp: LogInfoWrongHdp, filter: FilterModel): Promise<LinkedLogsViewModel> {
    const query = {
      matchId: logInfoWrongHdp.matchId,
      issueTypeId: Number(filter.issueTypeId),
      subIssueTypeId: Number(filter.subIssueTypeId),
      filterFromTransTime: logInfoWrongHdp.filterWithHdp.filterFromTransTime,
      filterToTransTime: logInfoWrongHdp.filterWithHdp.filterToTransTime,
      awayFavorite: logInfoWrongHdp.filterWithHdp.awayFavorite,
      homeFavorite: logInfoWrongHdp.filterWithHdp.homeFavorite,
      hdpValue: logInfoWrongHdp.filterWithHdp.hdpValue,
      liveIndicator: logInfoWrongHdp.filterWithHdp.liveIndicator
    } as GetLinkedLogQuery;

    return this.addRequestApiService.getLinkedLogs(query);
  }

  assignModelsToEvents(allEvents: LogInfoWrongHdp[], inputModels: WrongHdpModel[]): void {
    inputModels.forEach(x => {
      const event = new LogInfoWrongHdp();
      event.matchId = x.matchId;
      event.matchCode = x.matchCode;
      event.leagueName = x.leagueName;
      event.isMainMatch = x.isMainMatch;
      event.eventName = x.name;
      event.logInfoDetail = x.logInfoDetail;
      event.poolHouseCheckedBetTypes = x.poolHouseCheckedBetTypes;
      event.isPoolHouseAffected = x.isPoolHouseAffected;
      event.linkedLogsViewModel = {
        isLinkGroup1X2: x.isLinkGroup1X2,
        isLinkGroupAIO: x.isLinkGroupAIO,
        result: null
      } as LinkedLogsViewModel;
      event.filterWithHdp = {
        filterFromTransTime: x.filterFromTransTime,
        filterToTransTime: x.filterToTransTime,
        homeFavorite: x.homeFavorite,
        awayFavorite: x.awayFavorite,
        actualMarket: x.actualMarket,
        hdpValue: x.hdpValue,
        liveIndicator: x.liveIndicator
      } as FilterWithHdpModel;
      event.eventDate = x.eventDate;
      event.sportType = x.sportType;

      allEvents.push(event);
    });
  }

  public initDefaultFilter(mainEvent: LogInfoWrongHdp): void {
    mainEvent.filterWithHdp = new FilterWithHdpModel();
    const currentMoment = moment.utc().tz('America/Caracas');
    mainEvent.filterWithHdp.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    mainEvent.filterWithHdp.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    mainEvent.filterWithHdp.actualMarket = '';
    mainEvent.filterWithHdp.awayFavorite = '';
    mainEvent.filterWithHdp.homeFavorite = '';
    mainEvent.filterWithHdp.hdpValue = '';
  }

  public initDefaultMainEvent(allSelectedEvents: LogInfoWrongHdp[]): LogInfoWrongHdp {
    const mainEvent = new LogInfoWrongHdp();
    mainEvent.isMainMatch = true;
    mainEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    this.initDefaultFilter(mainEvent);
    allSelectedEvents.push(mainEvent);

    return allSelectedEvents.find(x => x.isMainMatch);
  }

  public getWrongHdpModel(filter: FilterModel, events: LogInfoWrongHdp[]): WrongHdpGetLogInfoQuery[] {
    return events.map(x => {
      const logInfoQuery = new WrongHdpGetLogInfoQuery();
      logInfoQuery.matchId = x.matchId;
      logInfoQuery.subIssueTypeId = Number(filter.subIssueTypeId);
      logInfoQuery.poolHouseCheckedBetTypes = x.poolHouseCheckedBetTypes;
      logInfoQuery.isMainMatch = x.isMainMatch;
      logInfoQuery.filterFromTransTime = x.filterWithHdp.filterFromTransTime;
      logInfoQuery.filterToTransTime = x.filterWithHdp.filterToTransTime;
      logInfoQuery.liveIndicator = x.filterWithHdp.liveIndicator;
      if (x.isMainMatch) {
        logInfoQuery.isLinkGroup1X2 = x.linkedLogsViewModel.isLinkGroup1X2;
        logInfoQuery.isLinkGroupAIO = x.linkedLogsViewModel.isLinkGroupAIO;
      }
      if (this.validationService.isSubTypeWrongHdpOrWrong1stHdp(filter.subIssueTypeId)) {
        logInfoQuery.homeFavorite = x.filterWithHdp.homeFavorite;
        logInfoQuery.awayFavorite = x.filterWithHdp.awayFavorite;
      } else {
        logInfoQuery.hdpValue = x.filterWithHdp.hdpValue;
      }

      return logInfoQuery;
    });
  }
}
