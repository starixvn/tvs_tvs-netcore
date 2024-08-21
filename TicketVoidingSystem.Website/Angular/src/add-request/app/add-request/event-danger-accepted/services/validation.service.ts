import { Injectable, QueryList } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestStore } from '../../add-request.store';
import { FilterTimeAreaComponent } from '../../event-red-card/filter-time-area/filter-time-area.component';
import { LogInfoRedCardComponent } from '../../event-red-card/log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {
  }

  isHasAllowanceTime(event: LogInfoRedCard): boolean {
    if (event.voidTimeArea.paTime || event.voidTimeArea.aaTime || event.voidTimeArea.saTime ||
      (event.voidTimeArea.paTime === 0 && event.voidTimeArea.aaTime === 0 && event.voidTimeArea.saTime === 0)) {
      return true;
    }

    return false;
  }

  validateCommonData(filter: FilterModel, eventLeagueComponent: EventLeagueComponent,
    filterTimeAreaComponent: FilterTimeAreaComponent, logInfoComponents: QueryList<LogInfoRedCardComponent>, addRequestStore: AddRequestStore): boolean {
    addRequestStore.checkValidSubIssueTypeInFilter();
    if (!filter.subIssueTypeId) {
      return false;
    }

    if (!eventLeagueComponent.isMatchIdValid()) {
      return false;
    }

    if (!filterTimeAreaComponent.isValid()) {
      return false;
    }

    if (logInfoComponents.some(x => !x.filterTimeWithAllowanceComponent.isValid())) {
      return false;
    }

    return true;
  }

  
  isAllEventsValid(events: LogInfoRedCard[]): boolean {
    if (events.some(x => !this.isEventMatchValid(x))) {
      return false;
    } 

    return true;
  }
  
  isValidInputRelatedEvent(inputMatchId: number, inputMatchIdClass: string, allEvents: LogInfoRedCard[], tooltip: Tooltip): boolean {    
    if (inputMatchId === allEvents.find(x => x.isMainMatch).matchId) {
      tooltip.display(inputMatchIdClass, LABELS.INVALID_MATCHID);
      return false;
    }
    if (allEvents.filter(x => !x.isMainMatch).some(x => x.matchId === inputMatchId)) {
      tooltip.display(inputMatchIdClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
      return false;
    }

    return true;
  }

  private isEventMatchValid(event: LogInfoRedCard): boolean {
    if (event.isMainMatch && event.messageValidationLogInfo.some(x => x.isError)) {
      return false;
    }

    if (!event.isMainMatch && event.messageValidationLogInfo.some(x => x.isError && !x.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE))) {
      return false;
    }

    return true;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }

  isHasWarningRangeTime(fromDateTime: string, toDateTime: Date) {
    if(!fromDateTime || !toDateTime){
      return false;
    }

    const MILLISECONDS_IN_A_MINUTE = 60000;
    let fromTimeFilter = moment(fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);;
    let toTimeLogInfo = moment(toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const diffMilliseconds = toTimeLogInfo.diff(fromTimeFilter);

    return diffMilliseconds > MILLISECONDS_IN_A_MINUTE;
  }
}