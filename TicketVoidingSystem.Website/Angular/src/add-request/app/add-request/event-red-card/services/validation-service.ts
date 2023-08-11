import { Injectable, QueryList } from '@angular/core';
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