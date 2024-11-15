import { Injectable, QueryList } from '@angular/core';
import moment from 'moment-timezone';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestStore } from '../../add-request.store';
import { TvDetectionComponent } from '../../components/tv-detection/tv-detection.component';
import { FilterTimeAreaComponent } from '../../event-red-card/filter-time-area/filter-time-area.component';
import { LogInfoRedCardComponent } from '../../event-red-card/log-info-red-card/log-info-red-card.component';
import { LogInfoRedCard } from '../../event-red-card/log-info-red-card/log-info-red-card.model';
import { FilterModel } from '../../filter/filter.model';

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

  validateCommonData(filter: FilterModel, eventLeagueComponent: EventLeagueComponent, filterTimeAreaComponent: FilterTimeAreaComponent,
    logInfoComponents: QueryList<LogInfoRedCardComponent>, addRequestStore: AddRequestStore, tvDetectionComponent: TvDetectionComponent): boolean {
    addRequestStore.checkValidSubIssueTypeInFilter();

    return filter.subIssueTypeId
      && eventLeagueComponent.isMatchIdValid()
      && tvDetectionComponent.isValidality()
      && filterTimeAreaComponent.isValid()
      && logInfoComponents.toArray().every(x => x.filterTimeWithAllowanceComponent.isValid());
  }

  isAllEventsValid(events: LogInfoRedCard[]): boolean {
    return events.every(x => this.isEventMatchValid(x));
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
    const fromTimeFilter = moment(fromDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toTimeLogInfo = moment(toDateTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const diffMilliseconds = toTimeLogInfo.diff(fromTimeFilter);

    return diffMilliseconds > MILLISECONDS_IN_A_MINUTE;
  }
}