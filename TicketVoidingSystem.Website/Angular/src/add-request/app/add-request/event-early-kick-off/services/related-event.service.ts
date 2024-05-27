import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { MatchType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { AddRequestApiService } from '../../add-request-api.service';
import { FilterModel } from '../../filter/filter.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';
import { MatchModel } from '../../../../../utility/models/match.model';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly logInfoService: LogInfoService
  ) {}

  async getChildMatches(mainMatchId: number, filterModel: FilterModel, isMainMatch: boolean): Promise<ChildMatchModel[]> {
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(filterModel.issueTypeId);
    query.eventDate = filterModel.eventDate;
    query.matchId = mainMatchId;
    query.isMainMatch = isMainMatch;
    query.sportType = filterModel.sportType;

    return this.addRequestApiService.getChildMatchesInfo(query);
  }

  updateEvents(models: ChildMatchModel[], mainEvent: LogInfoEarlyKickOff, defaultSubIssueTypeId: string): LogInfoEarlyKickOff[] {
    const newEvents = models
      .map(x => {
        var matchModel = this.mapChildMatchToMatchModel(x, mainEvent.kickOffTime);
        return  {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          kickOffTime: mainEvent.kickOffTime,
          subIssueTypeId: Number(defaultSubIssueTypeId),
          eventName: `${x.matchId} - ${x.matchEvent}`,
          messageValidationLogInfo: null,
          isCollapse: true,
          isShowValidation: false,
          pagingModel: new PagingModel(),
          tableTicketsModel: new TableTicketsModel(),
          matchModel: matchModel,
        } as LogInfoEarlyKickOff;
      });
      this.updateTemplateForEvents(newEvents);
      
      return newEvents;
  }

  private updateTemplateForEvents(events: LogInfoEarlyKickOff[]){
    events.forEach(x => {
      x.templateValue = this.logInfoService.getTemplateValue(x);
      x.templateValue.kickOffTime = x.kickOffTime}
    );
  }
  
  public mapChildMatchToMatchModel(childMatch: ChildMatchModel, eventDate: string): MatchModel{
    return {
      sportType: childMatch.sportType,
      sportTypeName: childMatch.sportTypeName,
      sportTypeNameTraditional: childMatch.sportTypeNameTraditional,
      sportTypeNameSimplified: childMatch.sportTypeNameSimplified,
      sportTypeNameNewSimplified: childMatch.sportTypeNameNewSimplified,
      homeId: childMatch.homeId,
      homeName: childMatch.homeName,
      homeNameTraditional: childMatch.homeNameTraditional,
      homeNameSimplified: childMatch.homeNameSimplified,
      homeNameNewSimplified: childMatch.homeNameNewSimplified,
      awayId: childMatch.awayId,
      awayName: childMatch.awayName,
      awayNameTraditional: childMatch.awayNameTraditional,
      awayNameSimplified: childMatch.awayNameSimplified,
      awayNameNewSimplified: childMatch.awayNameNewSimplified,
      leagueId: childMatch.leagueId,
      leagueName: childMatch.leagueName,
      leagueNameTraditional: childMatch.leagueNameTraditional,
      leagueNameSimplified: childMatch.leagueNameSimplified,
      leagueNameNewSimplified: childMatch.leagueNameNewSimplified,
      kickOffTime: eventDate,
      matchId: childMatch.matchId,
      matchCode: childMatch.matchCode,
      leagueGroupId: childMatch.leagueGroupId,
      parentId: childMatch.parentId
      } as MatchModel;
  }
  

  async addRelatedEventByInput(addRelatedEventArg: AddRelatedEventArg): Promise<void> {
    if (!addRelatedEventArg.primitiveProps.inputRelatedMatchId) {
      addRelatedEventArg.tooltip.display(addRelatedEventArg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    } else {
      const matchId = Number(addRelatedEventArg.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, addRelatedEventArg.inputMatchIdClass, addRelatedEventArg.allEvents, addRelatedEventArg.tooltip)) {
        return;
      }
      addRelatedEventArg.addRequestStore.changeBlockingUiStatus(true);
      const models = await this.getChildMatches(matchId, addRelatedEventArg.filter, false);
      if (models.length === 0) {
        addRelatedEventArg.tooltip.display(addRelatedEventArg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        addRelatedEventArg.addRequestStore.changeBlockingUiStatus(false);
        return;
      }
      const newEvents = this.updateEvents(models, addRelatedEventArg.mainEvent, addRelatedEventArg.filter.subIssueTypeId);
      await this.logInfoService.getLogInfo(newEvents, addRelatedEventArg.isEdit, addRelatedEventArg.requestId, addRelatedEventArg.filter, addRelatedEventArg.primitiveProps);
      addRelatedEventArg.allEvents.push(...newEvents);
      addRelatedEventArg.allEvents = _.orderBy(_.uniqBy(addRelatedEventArg.allEvents, x => x.matchId), ['matchCode'], ['asc']);
      addRelatedEventArg.addRequestStore.changeBlockingUiStatus(false);
      addRelatedEventArg.primitiveProps.inputRelatedMatchId = null;
    }
  }

  public async getDataWhenSearch(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<void> {
    const eventsGetLogInfo = await this.preparingModelGetLogInfo(relatedEvents, arg);
    await this.logInfoService.getLogInfo(eventsGetLogInfo, arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps);
    this.addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo, arg.allEvents);
  }

  private async preparingModelGetLogInfo(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<LogInfoEarlyKickOff[]> {
    const newChildEvents = relatedEvents.filter(x => !arg.allEvents.some(y => y.matchId === x.matchId) && x.matchType === MatchType.LINK);
    const newEvents = this.updateEvents(newChildEvents, arg.mainEvent, arg.filter.subIssueTypeId);
    const eventsGetLogInfo = _.cloneDeep(arg.allEvents);
    eventsGetLogInfo.push(...newEvents);

    return eventsGetLogInfo;
  }

  private addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo: LogInfoEarlyKickOff[], originalAllEvents: LogInfoEarlyKickOff[]): void {
    eventsGetLogInfo.forEach(x => {
      if (!originalAllEvents.some(y => y.matchId === x.matchId) && !x.isInvalidTotalTickets) {
        originalAllEvents.push(x);
      } else {
        const event = originalAllEvents.find(y => y.matchId === x.matchId);
        if (event) {
          event.messageValidationLogInfo = x.messageValidationLogInfo;
          event.subIssueTypeId = x.subIssueTypeId;
        }
      }
    });
  }
}