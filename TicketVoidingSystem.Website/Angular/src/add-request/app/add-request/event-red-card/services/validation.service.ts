import { Injectable, QueryList } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestStore } from '../../add-request.store';
import { FilterModel } from '../../filter/filter.model';
import { FilterTimeAreaComponent } from '../filter-time-area/filter-time-area.component';
import { LeagueEventRedCardComponent } from '../league-event-red-card/league-event-red-card.component';
import { LogInfoRedCardComponent } from '../log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {
  }

  isHasAllowanceTime(event: LogInfoRedCard): boolean {
    if (event.voidTimeArea.aaTime || event.voidTimeArea.paTime || event.voidTimeArea.saTime ||
      (event.voidTimeArea.aaTime === 0 && event.voidTimeArea.paTime === 0 && event.voidTimeArea.saTime === 0)) {
      return true;
    }

    return false;
  }

  validateCommonData(filter: FilterModel, leagueEventRedCardComponent: LeagueEventRedCardComponent,
    filterTimeAreaComponent: FilterTimeAreaComponent, logInfoComponents: QueryList<LogInfoRedCardComponent>, addRequestStore: AddRequestStore): boolean {
    addRequestStore.checkValidSubIssueTypeInFilter();
    if (!filter.subIssueTypeId) {
      return false;
    }

    if (!leagueEventRedCardComponent.isMatchIdValid()) {
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

  isEventMatchValid(event: LogInfoRedCard): boolean {
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

}