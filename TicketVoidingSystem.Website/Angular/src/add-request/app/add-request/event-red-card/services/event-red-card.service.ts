import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { AddRequestStore } from '../../add-request.store';
import { PrimitiveProperty } from '../event-red-card.model';
import { FilterTimeWithAllowance } from '../filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRedCard } from '../log-info-red-card/log-info-red-card.model';
import { Category, GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeRedCardConfig from '../../filter/sub-issue-type-dialog/sub-type-red-card.json';
import { RedCardModel } from '../../models/event-red-card.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { SubIssueTypeLinkMatch } from '../../models/sub-type-link-match.model';

@Injectable({
  providedIn: 'root'
})
export class EventRedCardService {
  constructor(
  ) { }

  assignModelsToEvents(allEvents: LogInfoRedCard[], inputModels: RedCardModel[], primitiveProps: PrimitiveProperty, addRequestStore: AddRequestStore): void {
    inputModels.forEach(x => {
      const event = new LogInfoRedCard();
      event.matchId = x.matchId;
      event.matchCode = x.matchCode;
      event.leagueName = x.leagueName;
      event.subIssueTypeId = x.subIssueTypeId;
      event.isCheckedVar = x.isCheckedVar;
      event.isMainMatch = x.isMainMatch;
      event.eventName = x.name;
      event.logInfoDetail = x.logInfoDetail;
      event.voidTimeArea = {
        fromDateTime: x.voidFromTime,
        toDateTime: x.voidToTime,
        aaTime: x.aaTime,
        paTime: x.paTime,
        saTime: x.saTime
      } as FilterTimeWithAllowance;

      allEvents.push(event);
    });

    const inputMainEvent = inputModels.find(x => x.isMainMatch);
    addRequestStore.changeAllowanceTime({
      aaTime: inputMainEvent.aaTime,
      paTime: inputMainEvent.paTime,
      saTime: inputMainEvent.saTime,
    });
    primitiveProps.filterBy = inputMainEvent.filterBy;
  }

  updateDefaultFilterTime(defaultFilter: FilterTimeWithAllowance, inputModels: RedCardModel[]): void {
    const eventSource = inputModels.find(x => x.isMainMatch);
    defaultFilter.fromDateTime = eventSource.filterFromTransTime;
    defaultFilter.toDateTime = eventSource.filterToTransTime;
  }

  initDefaultFilterTime(defaultFilter: FilterTimeWithAllowance): void {
    const currentMoment = moment.utc().tz('America/Caracas');
    defaultFilter.fromDateTime = moment.utc().tz('America/Caracas').millisecond(0).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    defaultFilter.toDateTime = currentMoment.format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
  }

  initDefaultMainEvent(allSelectedEvents: LogInfoRedCard[]): LogInfoRedCard {
    const mainEvent = new LogInfoRedCard();
    mainEvent.isMainMatch = true;
    allSelectedEvents.push(mainEvent);

    return allSelectedEvents.find(x => x.isMainMatch);
  }

  async updateSubIssueTypeAndAllowanceTime(allEvents: LogInfoRedCard[], mainEvent: LogInfoRedCard, relatedEvents: ChildMatchModel[],
    defaultFilter: FilterTimeWithAllowance): Promise<void> {
    const subTypeLinkMatches = [];
    const linkEvents = [];
    this.updateSubIssueType(allEvents, subTypeLinkMatches, linkEvents, mainEvent);
    this.updateAllowanceTime(allEvents, defaultFilter);
  }

  private getSubIssueTypeId(handlingMatchId: number, subTypeLinkMatches: SubIssueTypeLinkMatch[], linkEvents: LogInfoRedCard[], mainEvent: LogInfoRedCard): number {
    const model = subTypeLinkMatches.find(x => x.matchId === handlingMatchId);
    if (linkEvents.some(y => y.matchId === handlingMatchId)) {
      return model?.subIssueTypeId ? model.subIssueTypeId : mainEvent.subIssueTypeId;
    } else {
      return mainEvent.subIssueTypeId;
    }
  }

  private updateSubIssueType(allEvents: LogInfoRedCard[], subTypeLinkMatches: SubIssueTypeLinkMatch[], linkEvents: LogInfoRedCard[], mainEvent: LogInfoRedCard): void {
    allEvents.forEach(x => {
      x.subIssueTypeId = this.getSubIssueTypeId(x.matchId, subTypeLinkMatches, linkEvents, mainEvent);
    });
  }

  private updateAllowanceTime(allEvents: LogInfoRedCard[], defaultFilter: FilterTimeWithAllowance): void {
    allEvents.forEach(x => {
      x.voidTimeArea = this.getNewFilterTimeWithAllowanceBySubIssueType(x, defaultFilter);
    });
  }

  private getNewFilterTimeWithAllowanceBySubIssueType(event: LogInfoRedCard, defaultFilter: FilterTimeWithAllowance): FilterTimeWithAllowance {
    const group = this.getGroupSubTypeIncludeAllowanceTime(event.subIssueTypeId);
    const voidTimeArea = {
      aaTime: Number(group.aa),
      paTime: Number(group.pa),
      saTime: Number(group.sa),
      fromDateTime: defaultFilter.fromDateTime,
      toDateTime: defaultFilter.toDateTime
    } as FilterTimeWithAllowance;

    return voidTimeArea;
  }

  private getGroupSubTypeIncludeAllowanceTime(subIssueTypeId: number): GroupButton {
    let group = null;
    const subIssueTypeRedCardConfig = SubIssueTypeRedCardConfig as Category[];
    subIssueTypeRedCardConfig.forEach(x => {
      x.groups.forEach(y => {
        if (y.buttonSelectAll.some(t => t.subIssueTypeId === subIssueTypeId) || y.buttonSelectHomeAway.some(t => t.subIssueTypeId === subIssueTypeId)) {
          group = y;
        }
      });
    });

    return group;
  }

}