import { Injectable } from '@angular/core';
import _ from 'lodash';
import { MatchType, DateTimeFormat } from '../../../../../utility/constants/config';
import { AddRequestApiService } from '../../add-request-api.service';
import { LogInfoRelatedEvent } from '../../components/log-info-related-event/log-info-related-event.model';
import { FilterTimeWithAllowance } from '../../event-red-card/filter-time-with-allowance/filter-time-with-allowance.model';
import { GetChildMatchQuery } from '../../models/get-child-match.query';
import { ChildMatchModel } from '../../models/related-event.model';
import { LogInfoService } from './log-info.service';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { Category, GroupButton } from '../../filter/sub-issue-type-dialog/sub-issue-type-json.model';
import SubIssueTypeWrongScoreConfig from '../../filter/sub-issue-type-dialog/sub-type-wrong-score.json';
import { AddRelatedEventArg } from '../models/add-related-event.model';
import { SubIssueTypeLinkMatch, SubIssueTypeLinkMatchQuery } from '../../models/sub-type-link-match.model';
import { LABELS } from '../../../../../utility/constants/labels';
import { ValidationService } from './validation.service';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class RelatedEventService {
  constructor(
    private readonly addRequestApiService: AddRequestApiService,
    private readonly logInfoService: LogInfoService,
    private readonly validationService: ValidationService) { }

  async getChildMatches(query: GetChildMatchQuery): Promise<ChildMatchModel[]> {
    return this.addRequestApiService.getChildMatches(query);
  }

  assignChildMatchToLogInfoModel(models: ChildMatchModel[], defaultFilterTimeWithAllowance: FilterTimeWithAllowance): WrongScoreModel[] {
    const newEvents = models
      .map(x => {
        return {
          matchId: x.matchId,
          filterBy: 2,
          filterFromTransTime: defaultFilterTimeWithAllowance.fromDateTime,
          filterToTransTime: defaultFilterTimeWithAllowance.toDateTime,
          matchType: x.matchType,
        } as WrongScoreModel;
      });

    return newEvents;
  }

  getChildMatchSubIssueType(filterSubTypeId: number): number | null {
    const subIssueTypeMap = new Map<number, number>([
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

    return subIssueTypeMap.get(filterSubTypeId) || null;
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
    }
    )
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
    const SUB_TYPE_AUTO_SELECT_LIST = [SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_HOME,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_AWAY,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_GOAL_KICK,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_HOME,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_CORNER_AWAY,
    SubIssueTypeConstant.WRONG_SCORE_NEXT_BOOKING];
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
      const newEvents = this.assignChildMatchToLogInfoModel(models, arg.defaultFilterTimeWithAllowance);
      await this.updateSubIssueTypeAndAllowanceTime(newEvents, Number(arg.filter.subIssueTypeId));
      await this.logInfoService.getLogInfo(arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps, newEvents, arg.wrongScoreModels[0].matchId, arg.defaultFilterTimeWithAllowance);
      newEvents.forEach(x => {
        arg.allEvents.push(this.getLogInfoRelatedEvent(x, models.find(y => y.matchId === x.matchId)));
      });
      arg.primitiveProps.isBlock = false;
      arg.primitiveProps.inputRelatedMatchId = null;
    }
  }


  public async getDataRelatedEventWhenSearch(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<void> {
    const eventsGetLogInfo = await this.preparingModelGetLogInfo(relatedEvents, arg);
    await this.logInfoService.getLogInfo(arg.isEdit, arg.requestId, arg.filter, arg.primitiveProps, eventsGetLogInfo, arg.wrongScoreModels[0].matchId, arg.defaultFilterTimeWithAllowance);
    this.addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo, arg.wrongScoreModels, arg.allEvents, relatedEvents);
  }

  private async preparingModelGetLogInfo(relatedEvents: ChildMatchModel[], arg: AddRelatedEventArg): Promise<WrongScoreModel[]> {
    const newLinkEvents = relatedEvents.filter(x => !arg.wrongScoreModels.some(y => y.matchId === x.matchId) && x.matchType === MatchType.LINK);
    const newEvents = this.assignChildMatchToLogInfoModel(newLinkEvents, arg.defaultFilterTimeWithAllowance);
    await this.updateSubIssueTypeAndAllowanceTime(newEvents, Number(arg.filter.subIssueTypeId));
    const eventsGetLogInfo = _.cloneDeep(arg.wrongScoreModels);
    eventsGetLogInfo.push(...newEvents.filter(x => x.subIssueTypeId));

    return eventsGetLogInfo;
  }

  private addNewRelatedEventHaveTicketOrUpdateExistedEvent(eventsGetLogInfo: WrongScoreModel[], wrongScoreModels: WrongScoreModel[],
    allEvents: LogInfoRelatedEvent[], relatedEvents: ChildMatchModel[]): void {
    const eventHasLogInfo = eventsGetLogInfo.filter(x => x.logInfoDetail);
    eventHasLogInfo.forEach(x => {
      const eventChild = relatedEvents.find(y => y.matchId === x.matchId);
      if (!wrongScoreModels.some(y => y.matchId === x.matchId)) {
        wrongScoreModels.push(x);
        allEvents.push(this.getLogInfoRelatedEvent(x, eventChild));
      } else {
        const event = wrongScoreModels.find(y => y.matchId === x.matchId);
        event.logInfoDetail = x.logInfoDetail;
        event.messageValidationLogInfo = x.messageValidationLogInfo;
        event.voidFromTime = x.voidFromTime;
        event.voidFromTime = x.voidToTime;
        event.aaTime = x.aaTime;
        event.paTime = x.paTime;
        event.saTime = x.saTime;
        event.subIssueTypeId = x.subIssueTypeId;

        if (!event.isMainMatch) {
          const relatedEvent = allEvents.find(y => y.matchId === x.matchId);
          relatedEvent.logInfoDetail = x.logInfoDetail;
          relatedEvent.messageValidationLogInfo = x.messageValidationLogInfo;
          relatedEvent.voidTimeArea.aaTime = 2;
          relatedEvent.voidTimeArea.paTime = x.paTime;
          relatedEvent.voidTimeArea.saTime = x.saTime;
          relatedEvent.voidTimeArea.fromDateTime = moment(x.logInfoDetail?.voidFromTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          relatedEvent.voidTimeArea.toDateTime = moment(x.logInfoDetail?.voidToTime).format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
          relatedEvent.subIssueTypeId = x.subIssueTypeId;
        }
      }
    });
  }
  public getLogInfoRelatedEvent(model: WrongScoreModel, eventChild: ChildMatchModel): LogInfoRelatedEvent {
    const voidTimeArea: FilterTimeWithAllowance = {
      fromDateTime: model.voidFromTime,
      toDateTime: model.voidToTime,
      aaTime: model.aaTime,
      paTime: model.paTime,
      saTime: model.saTime
    };

    const logInfoRelatedEventModel = {
      logInfoDetail: model.logInfoDetail,
      messageValidationLogInfo: model.messageValidationLogInfo,
      voidTimeArea: voidTimeArea,
      matchId: model.matchId,
      subIssueTypeId: model.subIssueTypeId,
      matchCode: eventChild.matchCode,
      leagueName: eventChild.leagueName,
      eventName: `${eventChild.matchId} - ${eventChild.matchEvent}`,
      sportType: eventChild.sportType
    } as LogInfoRelatedEvent;

    return logInfoRelatedEventModel;
  }
}
