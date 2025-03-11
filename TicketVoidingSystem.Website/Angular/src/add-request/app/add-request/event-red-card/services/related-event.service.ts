import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MatchType, DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { EventRedCardService } from './event-red-card.service';
import { AddRelatedEventArg } from '../../models/add-related-event.model';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly logInfoService: LogInfoService,
    private readonly eventRedCardService: EventRedCardService,
  ) {}

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.addRequestApiService.getChildMatches(query);
  }

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
      
      const models = await this.getChildMatches(query);
      if (models.length === 0) {
        arg.tooltip.display(arg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        arg.primitiveProps.isBlock = false;
        return;
      }
      const newEvents = this.assignChildMatchToLogInfoModel(models, arg.defaultFilterTimeWithAllowance, arg.mainEvent.subIssueTypeId);
      await this.eventRedCardService.updateSubIssueTypeAndAllowanceTime(newEvents, arg.mainEvent, arg.originalRelatedEvents, arg.defaultFilterTimeWithAllowance);
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
    const newChildEvents = relatedEvents.filter(x => !arg.allEvents.some(y => y.matchId === x.matchId) && x.matchType === MatchType.LINK);
    const newEvents = this.assignChildMatchToLogInfoModel(newChildEvents, arg.defaultFilterTimeWithAllowance, arg.mainEvent.subIssueTypeId);
    const eventsGetLogInfo = _.cloneDeep(arg.allEvents);
    eventsGetLogInfo.push(...newEvents);
    await this.eventRedCardService.updateSubIssueTypeAndAllowanceTime(eventsGetLogInfo, arg.mainEvent, relatedEvents, arg.defaultFilterTimeWithAllowance);

    return eventsGetLogInfo;
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
          event.sportType = x.sportType;
        }
      }
    });
  }
}
