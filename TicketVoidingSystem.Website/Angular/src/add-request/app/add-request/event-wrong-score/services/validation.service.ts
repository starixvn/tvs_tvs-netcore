import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { AddRequestStore } from '../../add-request.store';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterModel } from '../../filter/filter.model';
import { WrongScoreModel } from '../../models/event-wrong-score.model';
import { FilterWrongScoreComponent } from '../filter-wrong-score/filter-wrong-score.component';
import { WrongScoreInfoComponent } from '../wrong-score-info/wrong-score-info.component';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly TO_DATE_TIME_CLASS = 'to-date-time';

  public validateCommonData(filter: FilterModel, leagueEventWrongScoreComponent: LeagueEventRedCardComponent, addRequestStore: AddRequestStore,
    filterWrongScoreComponent: FilterWrongScoreComponent, wrongScoreInfoComponents: WrongScoreInfoComponent[]): boolean {
    addRequestStore.checkValidSubIssueTypeInFilter();
    if (!filter.subIssueTypeId) {
      return false;
    }

    if (!leagueEventWrongScoreComponent.isMatchIdValid()) {
      return false;
    }
    
    if (this.isSubTypeFilterByAcceptedTime(filter.subIssueTypeId) && !filterWrongScoreComponent.isValid()) {
      return false;
    }

    if (!this.isSubTypeFilterByAcceptedTime(filter.subIssueTypeId) && wrongScoreInfoComponents.some(x => (!x.isValidDateTime()))) {
      return false;
    }
    
    return true;
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

  public isCheckedScoresHasError(wrongScores: WrongScoreModel[]): boolean {
    return wrongScores.some(x => x.messageValidationLogInfo.some(y => y.isError));
  }

  public isHasWarningEditTakeNoteRequest(isEdit: boolean, currentActionId: string, actionIdOfFirstTime: string) {
    return isEdit && currentActionId === TVSRequestActionType.TAKE_NOTE_ID.toString() && currentActionId !== actionIdOfFirstTime;
  }

  public isValidationHasWarningTicket(wrongScoreModels: WrongScoreModel[]): boolean {
    return wrongScoreModels.some(x => x.messageValidationLogInfo?.length > 0);
  }

  public isHasWarningSettledTicket(wrongScoreModels: WrongScoreModel[]): boolean {
    return wrongScoreModels.some(x => x.logInfoDetail?.settleCount > 0);
  }

  public getSelectedWrongScore(wrongScoreModels: WrongScoreModel[]): WrongScoreModel[] {
    return wrongScoreModels.filter(x => x.isChecked);
  }

  public isHasAllowanceTime(wrongScoreModel: WrongScoreModel): boolean {
    if (wrongScoreModel.aaTime || wrongScoreModel.paTime || wrongScoreModel.saTime ||
      (wrongScoreModel.aaTime === 0 && wrongScoreModel.paTime === 0 && wrongScoreModel.saTime === 0)) {
      return true;
    }

    return false;
  }

  public isSubTypeFilterByAcceptedTime(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_NO_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_HOME_GOAL_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_NO_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_AWAY_GOAL_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_NO_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_HOME_BOOKING_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_NO_ONWARDS.toString() ||
      subIssueTypeId === SubIssueTypeConstant.NO_INDICATION_AWAY_BOOKING_ONWARDS.toString();
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
}