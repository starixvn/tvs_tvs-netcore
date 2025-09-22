import { inject, Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { DateTimeFormat } from "../../../../../../utility/constants/config";
import { SportType } from "../../../../../../utility/constants/sport.constant";
import { FilterModel } from "../../../../../component/filter/filter.model";
import { GetLinkedLogQuery, LinkedLogsViewModel } from '../../../../../component/pool-house-ticket/linked-log/linked-log.model';
import { PoolHouseTicketValue } from '../../../../../component/pool-house-ticket/pool-house-ticket.constant';
import { FilterBetType } from '../../../../../events/wrong-hdp/app/event-wrong-hdp/models/filter-with-hdp.model';
import { WrongOuModel } from "../../../../../models/event-wrong-ou.model";
import { AddRequestApiService } from "../../../../../services/add-request-api.service";
import { FilterWrongOuModel } from "../models/filter-wrong-ou.model";
import { WrongOuGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoWrongOu } from "../models/log-info-wrong-ou.model";

@Injectable()
export class EventWrongOuService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public async getLinkedLog(logInfoWrongOu: LogInfoWrongOu, filter: FilterModel): Promise<LinkedLogsViewModel> {
    if(logInfoWrongOu.sportType !== SportType.SOCCER)
    {
        return new LinkedLogsViewModel();
    }

    const query = {
      matchId: logInfoWrongOu.matchId,
      issueTypeId: Number(filter.issueTypeId),
      subIssueTypeId: Number(filter.subIssueTypeId),
      filterFromTransTime: logInfoWrongOu.filterWrongOu.filterFromTransTime,
      filterToTransTime: logInfoWrongOu.filterWrongOu.filterToTransTime,
      wrongMarket: logInfoWrongOu.filterWrongOu.wrongMarket,
      liveIndicator: logInfoWrongOu.filterWrongOu.liveIndicator
    } as GetLinkedLogQuery;

    return this.addRequestApiService.getLinkedLogs(query);
  }

  assignModelsToEvents(allEvents: LogInfoWrongOu[], inputModels: WrongOuModel[]): void {
    inputModels.forEach(x => {
      const event = new LogInfoWrongOu();
      event.matchId = x.matchId;
      event.matchCode = x.matchCode;
      event.leagueName = x.leagueName;
      event.isMainMatch = x.isMainMatch;
      event.eventName = x.name;
      event.logInfoDetail = x.logInfoDetail;
      event.poolHouseCheckedBetTypes = x.poolHouseCheckedBetTypes;
      event.linkedLogsViewModel = {
        isLinkGroup1X2: x.isLinkGroup1X2,
        isLinkGroupAIO: x.isLinkGroupAIO,
        result: null
      } as LinkedLogsViewModel;
      event.filterWrongOu = {
        filterFromTransTime: x.filterFromTransTime,
        filterToTransTime: x.filterToTransTime,
        actualMarket: x.actualMarket,
        wrongMarket: x.wrongMarket,
        liveIndicator: x.liveIndicator,
        filterBetType: new FilterBetType(x.filterBetIdX, x.filterBetIdY, x.filterBetTypeId)
      } as FilterWrongOuModel;
      event.eventDate = x.eventDate;
      event.sportType = x.sportType;

      allEvents.push(event);
    });
  }

  public initDefaultFilter(mainEvent: LogInfoWrongOu): void {
    mainEvent.filterWrongOu = new FilterWrongOuModel();
    const currentMoment = moment.utc().tz('America/Caracas');
    mainEvent.filterWrongOu.filterFromTransTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    mainEvent.filterWrongOu.filterToTransTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    mainEvent.filterWrongOu.actualMarket = '';
    mainEvent.filterWrongOu.wrongMarket = '';
    mainEvent.filterWrongOu.filterBetType = new FilterBetType();
  }

  public initDefaultMainEvent(allSelectedEvents: LogInfoWrongOu[]): LogInfoWrongOu {
    const mainEvent = new LogInfoWrongOu();
    mainEvent.isMainMatch = true;
    mainEvent.poolHouseCheckedBetTypes = PoolHouseTicketValue.SELECT_ALL_BETTYPE;
    this.initDefaultFilter(mainEvent);
    allSelectedEvents.push(mainEvent);

    return allSelectedEvents.find(x => x.isMainMatch);
  }

  public getWrongOuModel(filter: FilterModel, events: LogInfoWrongOu[]): WrongOuGetLogInfoQuery[] {
    return events.map(x => {
      const logInfoQuery = new WrongOuGetLogInfoQuery();
      logInfoQuery.matchId = x.matchId;
      logInfoQuery.subIssueTypeId = Number(filter.subIssueTypeId);
      logInfoQuery.poolHouseCheckedBetTypes = x.poolHouseCheckedBetTypes;
      logInfoQuery.isMainMatch = x.isMainMatch;
      logInfoQuery.wrongMarket = x.filterWrongOu.wrongMarket;
      logInfoQuery.filterFromTransTime = x.filterWrongOu.filterFromTransTime;
      logInfoQuery.filterToTransTime = x.filterWrongOu.filterToTransTime;
      logInfoQuery.liveIndicator = x.filterWrongOu.liveIndicator;
      logInfoQuery.filterBetTypeId = x.filterWrongOu.filterBetType.filterBetTypeId;
      logInfoQuery.filterBetIdX = x.filterWrongOu.filterBetType.filterBetIdX;
      logInfoQuery.filterBetIdY = x.filterWrongOu.filterBetType.filterBetIdY;
      if (x.isMainMatch) {
        logInfoQuery.isLinkGroup1X2 = x.linkedLogsViewModel.isLinkGroup1X2;
        logInfoQuery.isLinkGroupAIO = x.linkedLogsViewModel.isLinkGroupAIO;
      }
      return logInfoQuery;
    });
  }

  public resetPoolHouseCheckedBetTypes(logInfo: LogInfoWrongOu): void {
    logInfo.poolHouseCheckedBetTypes = logInfo.isMainMatch ? PoolHouseTicketValue.SELECT_ALL_BETTYPE : null;
  }
}
