import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment';
import { PagingModel } from '../../../../../utility/components/paging/paging/paging.model';
import { DateTimeFormat } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { MatchModel } from '../../../../../utility/models/match.model';
import { AddRequestApiService } from '../../add-request-api.service';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { TableTicketsModel } from '../tickets-list/table-tickets.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly validationService: ValidationService,
    private readonly logInfoService: LogInfoService
  ) { }

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.addRequestApiService.getChildMatches(query);
  }

  mapChildMatchesToEvents(models: ChildMatchModel[], mainEvent: LogInfoEarlyKickOff): LogInfoEarlyKickOff[] {
    const newEvents = models
      .map(x => {
        const matchModel = this.mapChildMatchToMatchModel(x, mainEvent.kickOffTime);
        return {
          matchId: x.matchId,
          matchCode: x.matchCode,
          leagueName: x.leagueName,
          isMainMatch: false,
          kickOffTime: mainEvent.kickOffTime,
          eventName: `${x.matchId} - ${x.matchEvent}`,
          messageValidationLogInfo: null,
          isCollapse: true,
          isShowValidation: false,
          pagingModel: new PagingModel(),
          tableTicketsModel: new TableTicketsModel(),
          matchModel: matchModel,
          sportType: x.sportType
        } as LogInfoEarlyKickOff;
      });

    return newEvents;
  }

  public mapChildMatchToMatchModel(childMatch: ChildMatchModel, eventDate: string): MatchModel {
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
      const query = new GetChildMatchQuery();
      query.issueTypeId = Number(addRelatedEventArg.filter.issueTypeId);
      query.eventDate = addRelatedEventArg.mainEvent.matchModel.eventDate ? moment(addRelatedEventArg.mainEvent.matchModel.eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
      query.matchId = matchId
      query.isMainMatch = false;
      query.sportType = addRelatedEventArg.mainEvent.sportType;
      
      const models = await this.getChildMatches(query);
      if (models.length === 0) {
        addRelatedEventArg.tooltip.display(addRelatedEventArg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        addRelatedEventArg.addRequestStore.changeBlockingUiStatus(false);
        return;
      }
      const newEvents = this.mapChildMatchesToEvents(models, addRelatedEventArg.mainEvent);
      const getLogInfoResult = await this.logInfoService.getLogInfo(newEvents, addRelatedEventArg.isEdit, addRelatedEventArg.requestId, addRelatedEventArg.filter);
      this.logInfoService.assignResultLogInfoToEvents(newEvents, getLogInfoResult.getLogInfoModels);
      addRelatedEventArg.allEvents.push(...newEvents);
      addRelatedEventArg.allEvents = _.orderBy(_.uniqBy(addRelatedEventArg.allEvents, x => x.matchId), ['matchCode'], ['asc']);
      addRelatedEventArg.addRequestStore.changeBlockingUiStatus(false);
      addRelatedEventArg.primitiveProps.inputRelatedMatchId = null;
    }
  }
}