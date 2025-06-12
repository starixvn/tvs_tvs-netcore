import { inject, Injectable, model } from '@angular/core';
import _ from 'lodash';
import moment from 'moment';
import { DateTimeFormat, MatchType, TVSRequestFilterBy } from '../../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { Category, GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeWrongScoreConfig from '../../filter/sub-issue-type-dialog/sub-type-wrong-score.json';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../../models/sub-type-link-match.model';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { LogInfoService } from './log-info.service';
import { ValidationService } from './validation.service';

@Injectable()
export class RelatedEventService {
  static SubIssueTypeMapHasRelatedEvent = new Map<number, number>([
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_KICK_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_KICK_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK],
    [SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_HOME],
    [SubIssueTypeConstant.NO_INDICATION_HOME_CORNER_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_HOME],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_CORNER_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_AWAY],
    [SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING],
    [SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS, SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING]
  ]);

  private readonly addRequestApiService = inject(AddRequestApiService);
  private readonly logInfoService = inject(LogInfoService);
  private readonly validationService = inject(ValidationService);

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.addRequestApiService.getChildMatches(query);
  }

  assignChildMatchToLogInfoModel(models: ChildMatchModel[], defaultFilterTimeWithAllowance: FilterTimeWithAllowance): WrongScoreModel[] {
    const newEvents = models
      .map(x => {
        return {
          matchId: x.matchId,
          filterBy: TVSRequestFilterBy.CHECK_TIME,
          filterFromTransTime: defaultFilterTimeWithAllowance.fromDateTime,
          filterToTransTime: defaultFilterTimeWithAllowance.toDateTime,
          matchType: x.matchType,
        } as WrongScoreModel;
      });

    return newEvents;
  }

  getChildMatchSubIssueType(filterSubTypeId: number): number | null {
    return RelatedEventService.SubIssueTypeMapHasRelatedEvent.get(filterSubTypeId) || null;
  }

  updateChildMatchSubIssueType(wrongScoreModel: WrongScoreModel, filterSubTypeId: number): void {
    const childMatchSubIssueTypeId = this.getChildMatchSubIssueType(filterSubTypeId);
    wrongScoreModel.subIssueTypeId = childMatchSubIssueTypeId;
  }

  private getGroupSubTypeIncludeAllowanceTime(subIssueTypeId: number): GroupButton {
    let group = null;
    const subIssueTypeConfig = SubIssueTypeWrongScoreConfig as Category[];
    subIssueTypeConfig.forEach(x => {
      x.groups.forEach(y => {
        if (y.buttonSelectAll?.some(t => t.subIssueTypeId === subIssueTypeId) || y.buttonSelectHomeAway?.some(t => t.subIssueTypeId === subIssueTypeId)) {
          group = y;
        }
      });
    });

    return group;
  }

  updateAllowanceTime(wrongScoreModel: WrongScoreModel): void {
    if (!wrongScoreModel.subIssueTypeId) {
      return;
    }

    const group = this.getGroupSubTypeIncludeAllowanceTime(wrongScoreModel.subIssueTypeId);
    wrongScoreModel.aaTime = Number(group.aa);
    wrongScoreModel.paTime = Number(group.pa);
    wrongScoreModel.saTime = Number(group.sa);
  }

  updateChildMatchSubIssueTypeAndAllowanceTime(wrongScoreModels: WrongScoreModel[], filterSubTypeId: number) {
    wrongScoreModels.forEach(x => {
      if (x.matchType !== MatchType.LINK && !x.isMainMatch) {
        this.updateChildMatchSubIssueType(x, filterSubTypeId);
        this.updateAllowanceTime(x);
      }
    });
  }

  async updateSubIssueTypeAndAllowanceTime(wrongScoreModels: WrongScoreModel[], filterSubTypeId: number) {
    this.updateChildMatchSubIssueTypeAndAllowanceTime(wrongScoreModels, filterSubTypeId);
    await this.updateLinkMatchSubIssueTypeAndAllowanceTime(wrongScoreModels, filterSubTypeId);
  }

  async updateLinkMatchSubIssueTypeAndAllowanceTime(wrongScoreModels: WrongScoreModel[], mainSubIssueTypeId: number) {
    let subTypeLinkMatches = [];
    subTypeLinkMatches = await this.getSubIssueTypeLinkMatch(mainSubIssueTypeId, wrongScoreModels.map(x => x.matchId).join(','));

    subTypeLinkMatches.forEach(x => {
      if (this.isLinkMatchSubIssueTypeAutoAdd(x.subIssueTypeId)) {
        const wrongScoreModel = wrongScoreModels.find(y => y.matchId === x.matchId && y.matchType === MatchType.LINK);
        if (wrongScoreModel) {
          wrongScoreModel.subIssueTypeId = x.subIssueTypeId;
          this.updateAllowanceTime(wrongScoreModel);
        }
      }
    });
  }

  isLinkMatchSubIssueTypeAutoAdd(subIssueTypeId): boolean {
    const SUB_TYPE_AUTO_SELECT_LIST = [...RelatedEventService.SubIssueTypeMapHasRelatedEvent.values()];
    return SUB_TYPE_AUTO_SELECT_LIST.includes(subIssueTypeId);
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
      if (!this.validationService.isValidInputRelatedEvent(matchId, arg.inputMatchIdClass, arg.mainEvent.matchId, arg.allEvents, arg.tooltip)) {
        return;
      }
      arg.primitiveProps.isBlock = true;
      const models = await this.getGetInfoChildMatch(matchId, false, arg.mainEvent.sportType, arg.mainEvent.eventDate.toString());

      if (!models || models?.length === 0) {
        arg.tooltip.display(arg.inputMatchIdClass, LABELS.INVALID_MATCHID);
        arg.primitiveProps.isBlock = false;
        return;
      }
      await this.addNewLogInfoRelatedEvent(models, arg);
      arg.primitiveProps.isBlock = false;
      arg.primitiveProps.inputRelatedMatchId = null;
    }
  }

  async addNewLogInfoRelatedEvent(newRelatedEvents: ChildMatchModel[], arg: AddRelatedEventArg){
    const newEvents = this.assignChildMatchToLogInfoModel(newRelatedEvents, arg.defaultFilterTimeWithAllowance);
    await this.updateSubIssueTypeAndAllowanceTime(newEvents, Number(arg.filter.subIssueTypeId));
    await this.logInfoService.getLogInfo(arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps, newEvents, arg.mainEvent.matchId, arg.defaultFilterTimeWithAllowance);
    for (const event of newEvents) {
      const relatedEventModel = await this.getLogInfoRelatedEvent(event, newRelatedEvents);
      arg.allEvents.push(relatedEventModel);
    }
  }

  async getGetInfoChildMatch(matchId: number, isMainMatch: boolean,sportType: number, eventDate?: string): Promise<ChildMatchModel[]> {
    const query = new GetChildMatchQuery();
    query.issueTypeId = Number(IssueTypeConstant.WRONG_SCORE);
    query.eventDate = eventDate ? moment(eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
    query.matchId = matchId;
    query.isMainMatch = isMainMatch;
    query.sportType = sportType;
    const models = await this.getChildMatches(query);

    return models;
  }

  public async getDataRelatedEventWhenSearch(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<void> {
    const eventsGetLogInfo = await this.preparingModelGetLogInfo(relatedEvents, arg);
    await this.logInfoService.getLogInfo(arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps, eventsGetLogInfo, arg.mainEvent.matchId, arg.defaultFilterTimeWithAllowance);
    this.updateLogInfoMainEvent(eventsGetLogInfo, arg.mainEvent);
    this.updateLogInfoRelatedEvent(eventsGetLogInfo, arg.allEvents, relatedEvents);
    arg.allEvents = _.orderBy(_.uniqBy(arg.allEvents, x => x.matchId), ['matchCode'], ['asc']);
  }

  private async preparingModelGetLogInfo(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<WrongScoreModel[]> {
    const newLinkEvents = relatedEvents.filter(x => !arg.allEvents.some(y => y.matchId === x.matchId) && x.matchType === MatchType.LINK);
    const newEvents = this.assignChildMatchToLogInfoModel(newLinkEvents, arg.defaultFilterTimeWithAllowance);
    await this.updateSubIssueTypeAndAllowanceTime(newEvents, Number(arg.filter.subIssueTypeId));
    const originRelatedEvents = arg.allEvents.map(x => this.logInfoService.mapRelatedEventToWrongScoreModel(x, arg.defaultFilterTimeWithAllowance));
    const eventsGetLogInfo = [arg.mainEvent, ...originRelatedEvents, ...newEvents.filter(x => x.subIssueTypeId)];

    return eventsGetLogInfo;
  }

  updateLogInfoMainEvent(eventsGetLogInfo: WrongScoreModel[], mainEvent: WrongScoreModel){
    const mainEventLogInfo = eventsGetLogInfo.find(x => x.isMainMatch);
    mainEvent.logInfoDetail = mainEventLogInfo.logInfoDetail;
    mainEvent.messageValidationLogInfo = mainEventLogInfo.messageValidationLogInfo;
    mainEvent.voidFromTime = mainEventLogInfo.voidFromTime;
    mainEvent.voidFromTime = mainEventLogInfo.voidToTime;
  }

  async updateLogInfoRelatedEvent(eventsGetLogInfo: WrongScoreModel[], allOldEvents: LogInfoRelatedEvent[], relatedEvents: ChildMatchModel[]) {
    if(!allOldEvents || allOldEvents.length === 0){
      return;
    }
    const allRelatedEventLogInfo = eventsGetLogInfo.filter(x => !x.isMainMatch);
    for (const event of allRelatedEventLogInfo) {
      const relatedEvent = allOldEvents.find(y => y.matchId === event.matchId);
      if (relatedEvent) {
        relatedEvent.logInfoDetail = event.logInfoDetail;
        relatedEvent.messageValidationLogInfo = event.messageValidationLogInfo;
        if (this.validationService.isHasAllowanceTime(relatedEvent)) {
          relatedEvent.voidTimeArea.fromDateTime = moment(event.logInfoDetail?.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          relatedEvent.voidTimeArea.toDateTime = moment(event.logInfoDetail?.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
        }
      }
      else if (event.logInfoDetail) {
        const relatedEventModel = await this.getLogInfoRelatedEvent(event, relatedEvents);
        allOldEvents.push(relatedEventModel);
      }
    }
  }

  public async getLogInfoRelatedEvent(model: WrongScoreModel, allEventChild: ChildMatchModel[], evenDate?: string): Promise<LogInfoRelatedEvent> {
    let eventChild = allEventChild.find(y => y.matchId === model.matchId);
    if (!eventChild) {
      const models = await this.getGetInfoChildMatch(model.matchId, false, model.sportType, evenDate);
      eventChild = models[0];
    }
    const isHasAllowanceTime = this.validationService.isHasAllowanceTimeWrongScoreModel(model);
    const voidTimeArea = new FilterTimeWithAllowance();
    voidTimeArea.fromDateTime = isHasAllowanceTime ? model.voidFromTime : model.filterFromTransTime;
    voidTimeArea.toDateTime = isHasAllowanceTime ? model.voidToTime : model.filterToTransTime;
    voidTimeArea.aaTime = model.aaTime;
    voidTimeArea.paTime = model.paTime;
    voidTimeArea.saTime = model.saTime;

    const logInfoRelatedEventModel = {
      logInfoDetail: model.logInfoDetail,
      messageValidationLogInfo: model.messageValidationLogInfo,
      voidTimeArea: voidTimeArea,
      matchId: model.matchId,
      subIssueTypeId: model.subIssueTypeId,
      matchCode: eventChild.matchCode,
      leagueName: eventChild.leagueName,
      eventName: `${eventChild.matchId} - ${eventChild.matchEvent}`,
      sportType: eventChild.sportType,
    } as LogInfoRelatedEvent;

    return logInfoRelatedEventModel;
  }

  async assignModelsToEvents(allEvents: LogInfoRelatedEvent[], wrongScoreModels: WrongScoreModel[], allChildEvent: ChildMatchModel[]) {
    const eventDate = wrongScoreModels.find(x => x.isMainMatch)?.eventDate;
    const eventDateQuery = eventDate ? moment(eventDate).format(DateTimeFormat.SHORT_DATE_FORMAT) : null;
    for (const wrongScoreModel of wrongScoreModels) {
      if (wrongScoreModel.isMainMatch) {
        continue;
      }
      const relatedEventModel = await this.getLogInfoRelatedEvent(wrongScoreModel, allChildEvent, eventDateQuery);
      allEvents.push(relatedEventModel);
    }
  }

  assignMainEvent(event: WrongScoreModel): LogInfoRelatedEvent {
    const voidTimeArea = new FilterTimeWithAllowance();
    voidTimeArea.fromDateTime = event.filterFromTransTime;
    voidTimeArea.toDateTime = event.filterToTransTime;
    voidTimeArea.aaTime = event.aaTime;
    voidTimeArea.paTime = event.paTime;
    voidTimeArea.saTime = event.saTime;

    const logInfoRelatedEventModel = {
      logInfoDetail: event.logInfoDetail,
      messageValidationLogInfo: event.messageValidationLogInfo,
      voidTimeArea: voidTimeArea,
      matchId: event.matchId,
      subIssueTypeId: event.subIssueTypeId
    } as LogInfoRelatedEvent;

    return logInfoRelatedEventModel;
  }
}
