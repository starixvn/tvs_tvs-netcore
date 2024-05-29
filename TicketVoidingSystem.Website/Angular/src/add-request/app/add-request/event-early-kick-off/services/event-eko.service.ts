import { Injectable } from "@angular/core";
import moment from 'moment-timezone';
import { PagingModel } from "../../../../../utility/components/paging/paging/paging.model";
import { FilterModel } from "../../filter/filter.model";
import { EarlyKickOffModel } from "../../models/event-eko.model";
import { EarlyKickOffGetLogInfoQuery } from "../models/get-log-info.query";
import { LogInfoEarlyKickOff } from "../models/log-info-eko.model";
import { TableTicketsModel } from "../tickets-list/table-tickets.model";

@Injectable({
  providedIn: 'root'
})

export class EventEarlyKickOffService {
  assignModelsToEvents(allEvents: LogInfoEarlyKickOff[], inputModels: EarlyKickOffModel[], filter: FilterModel): void {
    inputModels.forEach(x => {
      const event = new LogInfoEarlyKickOff();
      event.matchId = x.matchId;
      event.matchCode = x.matchCode;
      event.leagueName = x.leagueName;
      event.isMainMatch = x.isMainMatch;
      event.eventName = x.name;
      event.kickOffTime = x.kickOffTime;
      event.subIssueTypeId = x.subIssueTypeId;
      event.isCollapse = filter.isVoided || !x.isMainMatch;
      event.matchModel = x.match;
      allEvents.push(event);
    });
  }

  public initDefaultMainEvent(allSelectedEvents: LogInfoEarlyKickOff[], subIssueTypeId: string): LogInfoEarlyKickOff {
    const mainEvent = new LogInfoEarlyKickOff();
    mainEvent.isMainMatch = true;
    mainEvent.isShowValidation = false;
    mainEvent.tableTicketsModel = new TableTicketsModel();
    mainEvent.pagingModel = new PagingModel();
    mainEvent.isCollapse = false;
    mainEvent.subIssueTypeId = Number(subIssueTypeId);
    mainEvent.kickOffTime = moment().tz('Etc/GMT-8').format('YYYY-MM-DD HH:mm:ss.SSS');
    allSelectedEvents.push(mainEvent);

    return allSelectedEvents.find(x => x.isMainMatch);
  }

  public getEarlyKickOffModel(filter: FilterModel, events: LogInfoEarlyKickOff[]): EarlyKickOffGetLogInfoQuery[] {
    return events.map(x => {
      const logInfoQuery = new EarlyKickOffGetLogInfoQuery();
      logInfoQuery.matchId = x.matchId;
      logInfoQuery.subIssueTypeId = Number(filter.subIssueTypeId);
      logInfoQuery.kickOffTime = x.kickOffTime
      logInfoQuery.isMainMatch = x.isMainMatch;

      return logInfoQuery;
    });
  }
}
