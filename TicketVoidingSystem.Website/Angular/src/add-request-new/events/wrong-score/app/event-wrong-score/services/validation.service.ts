import { Injectable, QueryList } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestActionType, TVSRequestFilterBy } from '../../../../../../utility/constants/config';
import { LABELS } from '../../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../../utility/constants/sub-issue-type.constant';
import { FilterModel } from '../../../../../component/filter/filter.model';
import { LogInfoRelatedEventComponent } from '../../../../../component/log-info-related-event/log-info-related-event.component';
import { LogInfoRelatedEvent } from '../../../../../component/log-info-related-event/log-info-related-event.model';
import { TvDetectionComponent } from '../../../../../component/tv-detection/tv-detection.component';
import { WrongScoreModel } from '../../../../../models/event-wrong-score.model';
import { AddRequestStore } from '../../../../../services/add-request.store';
import { FilterWrongScoreComponent } from '../filter-wrong-score/filter-wrong-score.component';
import { SubIssueTypeRelatedEvent } from '../models/subIssue-type-related-event.model';
import { ValidationBusinessRuleArgs } from '../models/validation.model';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';

@Injectable()
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly TO_DATE_TIME_CLASS = 'to-date-time';

  public validateCommonData(filter: FilterModel, eventLeagueComponent: EventLeagueComponent, addRequestStore: AddRequestStore,
    filterWrongScoreComponent: FilterWrongScoreComponent, wrongScoreInfoComponents: WrongScoreInfoComponent[], tvDetectionComponent?: TvDetectionComponent): boolean {
    addRequestStore.checkValidSubIssueTypeInFilter();

    return filter.subIssueTypeId
      && eventLeagueComponent.isMatchIdValid()
      && this.isValidityTvDetection(tvDetectionComponent)
      && this.isValidityWhenFilter(filter, filterWrongScoreComponent, wrongScoreInfoComponents);
  }

  public isValidityTvDetection(tvDetectionComponent?: TvDetectionComponent): boolean {
    return tvDetectionComponent ? tvDetectionComponent.isValid() : true;
  }

  public isValidityWhenFilter(filter: FilterModel, filterWrongScoreComponent: FilterWrongScoreComponent, wrongScoreInfoComponents: WrongScoreInfoComponent[]): boolean {
    if (SubIssueTypeRelatedEvent.isSubTypeFilterByAcceptedTime(filter.subIssueTypeId)) {
      return filterWrongScoreComponent.isValid();
    }

    return wrongScoreInfoComponents.every(x => x.isValidDateTime());
  }

  public isValidToDateTime(toTimeComponent: DateFullTimeNewComponent, wrongScoreModel: WrongScoreModel): boolean {
    if (toTimeComponent && wrongScoreModel.filterToTransTime) {
      return toTimeComponent.validateWithTooltip();
    }

    return true;
  }

  public isFromTimeSameOrBeforeToTime(filterFromTransTime: string, filterToTransTime: string, tooltip: Tooltip): boolean {
    const fromDateTime = moment(filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toDateTime = moment(filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    if (!fromDateTime.isSameOrBefore(toDateTime)) {
      tooltip.display(this.FROM_DATE_TIME_CLASS, LABELS.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
      return false;
    }

    return true;
  }

  public isFromTimeSameOrAfterDefaultValue(wrongScoreModel: WrongScoreModel, originWrongScoreModels: WrongScoreModel[], tooltip: Tooltip): boolean {
    const momentFromTime = moment(wrongScoreModel.filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentDefaultFromTime = moment(_.find(originWrongScoreModels, { scoreId: wrongScoreModel.scoreId }).filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);

    if (momentFromTime.isBefore(momentDefaultFromTime)) {
      tooltip.display(this.FROM_DATE_TIME_CLASS, LABELS.FROM_TIME_MUST_GREATER_THAN_DEFAULT);
      return false;
    }

    return true;
  }

  public isToTimeSmallerThanFromTimeNextScore(index: number, wrongScoreModel: WrongScoreModel, originWrongScoreModels: WrongScoreModel[], tooltip: Tooltip): boolean {
    if (this.isLastScore(wrongScoreModel, originWrongScoreModels)) {
      return true;
    }

    const momentToTime = moment(wrongScoreModel.filterToTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const momentFromTimeNextScore = moment(originWrongScoreModels[index + 1].filterFromTransTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const comparingFromTimeNextScore = momentFromTimeNextScore.subtract(2, 'milliseconds').format(DateTimeFormat.FULL_DATE_TIME_FORMAT);
    if (momentToTime.isSameOrAfter(moment(comparingFromTimeNextScore, DateTimeFormat.FULL_DATE_TIME_FORMAT))) {
      tooltip.display(this.TO_DATE_TIME_CLASS, LABELS.TO_TIME_MUST_SMALLER_THAN_FOLLOWING_CONSECUTIVE_FROM_TIME);
      return false;
    }

    return true;
  }

  isAllWrongScoreModelsValid(args: ValidationBusinessRuleArgs): boolean {
    if(args.primitiveProps.filterBy === TVSRequestFilterBy.CHECK_TIME){
      return this.isValidAllEventCheckTime(args.mainEvent, args.relatedEvents);
    }
    return this.isValidAllScores(args.wrongScoreModels);
  }

  private isValidAllEventCheckTime(mainEvent: LogInfoRelatedEvent, relatedEvents: LogInfoRelatedEvent[]): boolean {
    if (mainEvent?.messageValidationLogInfo?.some(x => x.isError)) {
      return false;
      }

    return !relatedEvents.some(x => this.isInValidEventCheckWarning(x));
  }

  private isInValidEventCheckWarning(event: LogInfoRelatedEvent): boolean {
    return event?.messageValidationLogInfo?.some(x => x.isError && !x.reason.includes(LABELS.NO_VALID_TICKETS_IN_RANGE));
  }

  public isValidAllScores(wrongScores: WrongScoreModel[]): boolean {
    return wrongScores.some(x => x.messageValidationLogInfo?.every(y => !y.isError));
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  public isValidationHasWarningTicket(wrongScoreModels: WrongScoreModel[], relatedEvents: LogInfoRelatedEvent[]): boolean {
    return wrongScoreModels.some(x => x.messageValidationLogInfo?.length > 0) || relatedEvents.some(x => x.messageValidationLogInfo?.length > 0);
  }

  public isHasWarningSettledTicket(wrongScoreModels: WrongScoreModel[], relatedEvents: LogInfoRelatedEvent[]): boolean {
    return wrongScoreModels.some(x => x.logInfoDetail?.settleCount > 0) || relatedEvents.some(x => x.logInfoDetail?.settleCount > 0);
  }

  isHasAllowanceTime(event: LogInfoRelatedEvent): boolean {
    if (event.voidTimeArea.aaTime || event.voidTimeArea.paTime || event.voidTimeArea.saTime ||
      (event.voidTimeArea.aaTime === 0 && event.voidTimeArea.paTime === 0 && event.voidTimeArea.saTime === 0)) {
      return true;
    }

    return false;
  }

  isHasAllowanceTimeWrongScoreModel(event: WrongScoreModel): boolean {
    if (event.aaTime || event.paTime || event.saTime ||
      (event.aaTime === 0 && event.paTime === 0 && event.saTime === 0)) {
      return true;
    }

    return false;
  }

  public isValidAllSubIssueType(logInfoComponents: QueryList<LogInfoRelatedEventComponent>): boolean {
    return logInfoComponents.toArray().every(x => {
      if (!x.logInfo.subIssueTypeId) {
        x.showTooltipSubType();
        return false;
      }
      return true;
    });
  }

  public isSubTypeFilterByTransTimeAndAcceptedTime(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_NO_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.WRONG_INDICATION_SWAP_TEAM_SCORE_ONWARDS.toString();
  }

  public isLastScore(wrongScoreModel: WrongScoreModel, originWrongScoreModels: WrongScoreModel[]): boolean {
    return wrongScoreModel.scoreId === _.last(originWrongScoreModels).scoreId;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }

  isValidInputRelatedEvent(inputMatchId: number, inputMatchIdClass: string, mainMatchId: number, allEvents: LogInfoRelatedEvent[], tooltip: Tooltip): boolean {
    if (inputMatchId === mainMatchId) {
      tooltip.display(inputMatchIdClass, LABELS.INVALID_MATCHID);
      return false;
    }
    if (allEvents.filter(x => !x.isMainMatch).some(x => x.matchId === inputMatchId)) {
      tooltip.display(inputMatchIdClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
      return false;
    }

    return true;
  }
}