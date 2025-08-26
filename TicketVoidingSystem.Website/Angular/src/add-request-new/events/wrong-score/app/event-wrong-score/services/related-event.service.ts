import { inject, Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { DateTimeFormat, MatchType } from '../../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../../../../utility/constants/labels';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { GetChildMatchQuery } from '../../../../../models/get-child-match.query';
import { ChildMatchModel } from '../../../../../models/related-event.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../../../../../models/sub-type-link-match.model';
import { AddRequestApiService } from '../../../../../services/add-request-api.service';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { SubIssueTypeRelatedEvent } from '../models/subIssue-type-related-event.model';
import { CreateMapService } from './create-map.service';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class RelatedEventService {
  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly validationService = inject(ValidationService);
  private readonly createMapService = inject(CreateMapService);

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.addRequestApiService.getChildMatches(query);
  }

  private async getSubIssueTypeLinkMatch(mainSubIssueTypeId: number, linkMatchIds: string): Promise<SubIssueTypeLinkMatch[]> {
    const query: SubIssueTypeLinkMatchQuery = {
      mainSubIssueTypeId: mainSubIssueTypeId,
      linkMatchIds: linkMatchIds
    };

    return this.addRequestApiService.getSubIssueTypeLinkMatch(query);
  }

  async addRelatedEventByInput(arg: AddRelatedEventArg): Promise<void> {
    if (!arg.primitiveProps.inputRelatedMatchId) {
      arg.tooltip.display(arg.inputMatchIdClass, LABELS.REQUIRED_MATCHID);
    } else {
      const matchId = Number(arg.primitiveProps.inputRelatedMatchId);
      if (!this.validationService.isValidInputRelatedEvent(matchId, arg.inputMatchIdClass, arg.mainEvent.matchId, arg.relatedEvents, arg.tooltip)) {
        return;
      }
      arg.primitiveProps.isBlock = true;
      const models = await this.getGetInfoChildMatch(matchId, false, arg.mainEvent.sportType, arg.mainEvent.eventDate.toString());

      if (!models || models?.length === 0) {
        arg.tooltip.display(arg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        arg.primitiveProps.isBlock = false;
        return;
      }

      await this.addEventByInputAndSelected(models, arg);
      arg.primitiveProps.isBlock = false;
      arg.primitiveProps.inputRelatedMatchId = null;
    }
  }

  async addEventByInputAndSelected(newRelatedEvents: ChildMatchModel[], arg: AddRelatedEventArg) {
    const childMatchSubIssueTypeId = SubIssueTypeRelatedEvent.getChildMatchSubIssueType(arg.filter.subIssueTypeId);

    newRelatedEvents.forEach(x => {
      const newRelatedEvent = this.createMapService.createNewLogInfoRelatedEvent(x, arg.defaultFilterTimeWithAllowance, childMatchSubIssueTypeId);
      arg.relatedEvents.push(newRelatedEvent);
    });
    await this.logInfoService.getLogInfo(this.createMapService.createGetLogInfoParams(arg));
  }

  async updateEventAutoGetLinkMatch(childEvents: ChildMatchModel[], arg: AddRelatedEventArg) {
    const newLinkEvents = childEvents.filter(x => !arg.relatedEvents.some(y => y.matchId === x.matchId) && this.isAutoSelectMatch(arg.mainEvent, x.matchType));
    const subTypeLinkMatches = await this.getSubIssueTypeLinkMatch(Number(arg.filter.subIssueTypeId), newLinkEvents.map(x => x.matchId).join(','));

    subTypeLinkMatches.forEach(x => {
      if (SubIssueTypeRelatedEvent.isLinkMatchSubIssueTypeAutoAdd(x.subIssueTypeId)) {
        const childEvent = childEvents.find(y => y.matchId === x.matchId);
        const newRelatedEvent = this.createMapService.createNewLogInfoRelatedEvent(childEvent, arg.defaultFilterTimeWithAllowance, x.subIssueTypeId);
        arg.relatedEvents.push(newRelatedEvent);
      }
    });
  }

  private isAutoSelectMatch(mainEvent: LogInfoRelatedEvent, matchType: number): boolean {
    return mainEvent.parentId !== mainEvent.matchId && matchType === MatchType.LINK;
  }

  async getGetInfoChildMatch(matchId: number, isMainMatch: boolean, sportType: number, eventDate?: string): Promise<ChildMatchModel[]> {
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(IssueTypeConstant.WRONG_SCORE);
    query.eventDate = eventDate ? moment(eventDate, DateTimeFormat.FULL_DATE_TIME_FORMAT).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
    query.matchId = matchId;
    query.isMainMatch = isMainMatch;
    query.sportType = sportType;
    const models = await this.getChildMatches(query);

    return models;
  }

  public async getDataRelatedEventWhenSearch(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<void> {
    await this.updateEventAutoGetLinkMatch(relatedEvents, arg);
    await this.logInfoService.getLogInfo(this.createMapService.createGetLogInfoParams(arg));
  }

  async assignModelsToEvents(allEvents: LogInfoRelatedEvent[], wrongScoreModels: WrongScoreModel[], allChildEvent: ChildMatchModel[], eventDate: Date) {
    const eventDateQuery = eventDate ? moment(eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
    for (const wrongScoreModel of wrongScoreModels) {
      if (wrongScoreModel.isMainMatch) {
        continue;
      }
      const relatedEventModel = await this.assignLogInfoRelatedEvent(wrongScoreModel, allChildEvent, eventDateQuery);
      allEvents.push(relatedEventModel);
    }
  }

  public async assignLogInfoRelatedEvent(model: WrongScoreModel, allEventChild: ChildMatchModel[], evenDate?: string): Promise<LogInfoRelatedEvent> {
    const logInfoRelatedEventModel = this.createMapService.assignMainEvent(model);

    let eventChild = allEventChild.find(y => y.matchId === model.matchId);
      if (!eventChild) {
        const models = await this.getGetInfoChildMatch(model.matchId, false, model.sportType, evenDate);
        eventChild = models[0];
      }
      logInfoRelatedEventModel.matchCode = eventChild.matchCode;
      logInfoRelatedEventModel.leagueName = eventChild.leagueName;
      logInfoRelatedEventModel.eventName = `${eventChild.matchId} - ${eventChild.matchEvent}`;
      logInfoRelatedEventModel.sportType = eventChild.sportType;
      logInfoRelatedEventModel.isMainMatch = false;

    return logInfoRelatedEventModel;
  }
}
