import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment';
import { DateTimeFormat, MatchType, SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { AddRelatedEventArg } from '../../models/add-related-event.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { EventDangerAcceptedService } from './event-danger-accepted.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class RelatedEventService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly validationService = inject(ValidationService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly eventDangerAcceptedService = inject(EventDangerAcceptedService);

  assignChildMatchToLogInfoModel(models: ChildMatchModel[], defaultFilter: FilterTimeWithAllowance, defaultSubIssueTypeId: number): LogInfoRelatedEvent[] {
    const newEvents = models
      .map(x => {
        const voidTimeArea: FilterTimeWithAllowance = {
          fromDateTime: defaultFilter.fromDateTime,
          toDateTime: defaultFilter.toDateTime,
          aaTime: defaultFilter.aaTime,
          paTime: defaultFilter.paTime,
          saTime: defaultFilter.saTime
        };
        return  {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          subIssueTypeId: defaultSubIssueTypeId,
          voidTimeArea: voidTimeArea,
          logInfoDetail: null,
          messageValidationLogInfo: null,
          sportType: x.sportType
        } as LogInfoRelatedEvent;
      });

      return newEvents;
  }

  async addRelatedEventByInput(arg: AddRelatedEventArg): Promise<void> {
    if (!arg.primitiveProps.inputRelatedMatchId) {
      arg.tooltip.display(arg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    } else {
      const matchId = Number(arg.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, arg.inputMatchIdClass, arg.allEvents, arg.tooltip)) {
        return;
      }
      arg.primitiveProps.isBlock = true;
      const query = new GetChildMatchQuery();
      query.issueTypeId = Number(arg.filter.issueTypeId);
      query.eventDate = arg.mainEvent.eventDate ? moment(arg.mainEvent.eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
      query.matchId = matchId
      query.isMainMatch = false;
      query.sportType = arg.mainEvent.sportType;

      const models = await this.addRequestApiService.getChildMatches(query);
      if (!models ||models.length === 0) {
        arg.tooltip.display(arg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        arg.primitiveProps.isBlock = false;
        return;
      }
      const newEvents = this.assignChildMatchToLogInfoModel(models, arg.defaultFilterTimeWithAllowance, arg.mainEvent.subIssueTypeId);
      await this.eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime(newEvents, arg.mainEvent, arg.originalRelatedEvents, arg.defaultFilterTimeWithAllowance);
      await this.logInfoService.getLogInfo(newEvents, arg.primitiveProps, arg.isEdit, arg.requestId, arg.filter, arg.defaultFilterTimeWithAllowance);
      this.logInfoService.updateIsCheckedVar(newEvents, arg.mainEvent.isCheckedVar);

      arg.allEvents.push(...newEvents);
      arg.primitiveProps.isBlock = false;
      arg.primitiveProps.inputRelatedMatchId = null;
    }
  }


  public async getDataWhenSearch(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<void> {
    const eventsGetLogInfo = await this.preparingModelGetLogInfo(relatedEvents, arg);
    await this.logInfoService.getLogInfo(eventsGetLogInfo, arg.primitiveProps, arg.isEdit, arg.requestId, arg.filter, arg.defaultFilterTimeWithAllowance);
    this.addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo, arg.allEvents);
  }

  private async preparingModelGetLogInfo(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<LogInfoRelatedEvent[]> {
    const newChildEvents = relatedEvents.filter(x => !arg.allEvents.some(y => y.matchId === x.matchId) && this.isAutoSelectMatch(arg.filter.subIssueTypeId, x.matchType, arg.mainEvent));
    const newEvents = this.assignChildMatchToLogInfoModel(newChildEvents, arg.defaultFilterTimeWithAllowance, arg.mainEvent.subIssueTypeId);
    const eventsGetLogInfo = _.cloneDeep(arg.allEvents);
    eventsGetLogInfo.push(...newEvents);
    await this.eventDangerAcceptedService.updateSubIssueTypeAndAllowanceTime(eventsGetLogInfo, arg.mainEvent, relatedEvents, arg.defaultFilterTimeWithAllowance);

    return eventsGetLogInfo;
  }

  private isAutoSelectMatch(subIssueTypeId: string, matchType: number, mainEvent: LogInfoRelatedEvent): boolean { 
    return (SubIssueTypeGroup.SUBTYPE_AUTO_SELECT_LIST.includes(Number(subIssueTypeId)) && matchType === MatchType.CHILD)
      || (mainEvent.parentId !== mainEvent.matchId && matchType === MatchType.LINK);
  }

  private addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo: LogInfoRelatedEvent[], originalAllEvents: LogInfoRelatedEvent[]): void {
    eventsGetLogInfo.forEach(x => {
      if (!originalAllEvents.some(y => y.matchId === x.matchId) && x.logInfoDetail) {
        originalAllEvents.push(x);
      } else {
        const event = originalAllEvents.find(y => y.matchId === x.matchId);
        if (event) {
          event.logInfoDetail = x.logInfoDetail;
          event.messageValidationLogInfo = x.messageValidationLogInfo;
          event.voidTimeArea = x.voidTimeArea;
          event.subIssueTypeId = x.subIssueTypeId;
        }
      }
    });
  }
}
