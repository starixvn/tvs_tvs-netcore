import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat, MatchType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AddRequestApiService } from '../../add-request-api.service';
import { AddRequestStore } from '../../add-request.store';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { PrimitiveProperty } from '../../components/log-info-related-event/primitive-property.model';
import { TvDetectionModel } from '../../components/tv-detection/tv-detection.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { Category, GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeDangerAcceptedConfig from '../../filter/sub-issue-type-dialog/sub-type-danger-accepted.json';
import { RedCardModel } from '../../models/event-red-card.model';
import { ChildMatchModel } from '../../models/related-event.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../../models/sub-type-link-match.model';
import { ValidationService } from './validation.service';

@Injectable()
export class EventDangerAcceptedService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);

  private readonly SUB_TYPE_AUTO_SELECT_LIST = [
    SubIssueTypeConstant.MAIN_CORNER,
    SubIssueTypeConstant.MAIN_CORNER_HOME,
    SubIssueTypeConstant.MAIN_CORNER_AWAY,
    SubIssueTypeConstant.MAIN_BOOKING_HOME,
    SubIssueTypeConstant.MAIN_BOOKING_AWAY,
    SubIssueTypeConstant.MAIN_GOAL_KICK,
    SubIssueTypeConstant.MAIN_CORNER,
    SubIssueTypeConstant.GOAL,
    SubIssueTypeConstant.GOAL_HOME,
    SubIssueTypeConstant.GOAL_AWAY
  ];

  assignModelsToEvents(allEvents: LogInfoRelatedEvent[], inputModels: RedCardModel[], primitiveProps: PrimitiveProperty, addRequestStore: AddRequestStore): void {
    inputModels.forEach(x => {
      const event = new LogInfoRelatedEvent();
      event.matchId = x.matchId;
      event.matchCode = x.matchCode;
      event.leagueName = x.leagueName;
      event.subIssueTypeId = x.subIssueTypeId;
      event.isCheckedVar = x.isCheckedVar;
      event.isMainMatch = x.isMainMatch;
      event.eventName = x.name;
      event.logInfoDetail = x.logInfoDetail;
      event.logInfoDetail.isHasWarningRangeTime = this.validationService.isHasWarningRangeTime(x.filterFromTransTime, x.logInfoDetail.transVoidToTime);
      event.voidTimeArea = this.getVoidTimeModel(x);
      event.tvDetectionModel = this.getTvDetectionModel(x);
      event.eventDate = x.eventDate;
      event.sportType = x.sportType;

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

  getVoidTimeModel(inputModel: RedCardModel): FilterTimeWithAllowance {
    return {
      fromDateTime: inputModel.voidFromTime,
        toDateTime: inputModel.voidToTime,
        aaTime: inputModel.aaTime,
        paTime: inputModel.paTime,
        saTime: inputModel.saTime
    } as FilterTimeWithAllowance;
  }

  getTvDetectionModel(inputModel: RedCardModel): TvDetectionModel {
    return {
      serviceAcceptTime: inputModel.serviceAcceptTime,
      actualTime: inputModel.actualTime,
      tvDetectionValue: inputModel.tvDetectionValue,
      minuteOffset: inputModel.minuteOffset,
      secondOffset: inputModel.secondOffset,
    } as TvDetectionModel;
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

  initDefaultMainEvent(allSelectedEvents: LogInfoRelatedEvent[]): LogInfoRelatedEvent {
    const mainEvent = new LogInfoRelatedEvent();
    mainEvent.isMainMatch = true;
    allSelectedEvents.push(mainEvent);

    return allSelectedEvents.find(x => x.isMainMatch);
  }

  async updateSubIssueTypeAndAllowanceTime(allEvents: LogInfoRelatedEvent[], mainEvent: LogInfoRelatedEvent, relatedEvents: ChildMatchModel[],
    defaultFilter: FilterTimeWithAllowance): Promise<void> {
    let subTypeLinkMatches = [];
    const linkEvents = allEvents.filter(x => relatedEvents.some(y => y.matchId === x.matchId && y.matchType === MatchType.LINK));
    if (this.SUB_TYPE_AUTO_SELECT_LIST.includes(mainEvent.subIssueTypeId) && linkEvents.length > 0) {
      subTypeLinkMatches = await this.getSubIssueTypeLinkMatch(mainEvent.subIssueTypeId, linkEvents.map(x => x.matchId).join(','));
    }

    this.updateSubIssueType(allEvents, subTypeLinkMatches, linkEvents, mainEvent);
    this.updateAllowanceTime(allEvents, defaultFilter);
  }

  private getSubIssueTypeId(handlingMatchId: number, subTypeLinkMatches: SubIssueTypeLinkMatch[], linkEvents: LogInfoRelatedEvent[], mainEvent: LogInfoRelatedEvent): number {
    const model = subTypeLinkMatches.find(x => x.matchId === handlingMatchId);
    if (linkEvents.some(y => y.matchId === handlingMatchId)) {
      return model?.subIssueTypeId ? model.subIssueTypeId : mainEvent.subIssueTypeId;
    } else {
      return mainEvent.subIssueTypeId;
    }
  }

  private updateSubIssueType(allEvents: LogInfoRelatedEvent[], subTypeLinkMatches: SubIssueTypeLinkMatch[], linkEvents: LogInfoRelatedEvent[], mainEvent: LogInfoRelatedEvent): void {
    allEvents.forEach(x => {
      x.subIssueTypeId = this.getSubIssueTypeId(x.matchId, subTypeLinkMatches, linkEvents, mainEvent);
    });
  }

  private updateAllowanceTime(allEvents: LogInfoRelatedEvent[], defaultFilter: FilterTimeWithAllowance): void {
    allEvents.forEach(x => {
      x.voidTimeArea = this.getNewFilterTimeWithAllowanceBySubIssueType(x, defaultFilter);
    });
  }

  private getNewFilterTimeWithAllowanceBySubIssueType(event: LogInfoRelatedEvent, defaultFilter: FilterTimeWithAllowance): FilterTimeWithAllowance {
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

  /* istanbul ignore next */
  private getGroupSubTypeIncludeAllowanceTime(subIssueTypeId: number): GroupButton {
    let group = null;
    const subIssueTypeDangerAcceptedConfig = SubIssueTypeDangerAcceptedConfig as Category[];
    subIssueTypeDangerAcceptedConfig.forEach(x => {
      x.groups.forEach(y => {
        if (y.buttonSelectAll?.some(t => t.subIssueTypeId === subIssueTypeId) || y.buttonSelectHomeAway?.some(t => t.subIssueTypeId === subIssueTypeId)) {
          group = y;
        }
      });
    });

    return group;
  }

  private async getSubIssueTypeLinkMatch(mainSubIssueTypeId: number, linkMatchIds: string): Promise<SubIssueTypeLinkMatch[]> {
    const query: SubIssueTypeLinkMatchQuery = {
      mainSubIssueTypeId: mainSubIssueTypeId,
      linkMatchIds: linkMatchIds
    };

    return this.addRequestApiService.getSubIssueTypeLinkMatch(query);
  }
}