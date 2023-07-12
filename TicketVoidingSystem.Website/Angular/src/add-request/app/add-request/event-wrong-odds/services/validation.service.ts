import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';
import { FilterOddsTypeConstant, FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly ODDS_VALUE_INPUT_CLASS = 'odds-value-input';
  private readonly CORRECT_ODDS_INPUT_CLASS = 'correct-odds-input';
  private readonly FROM_ODDS_CLASS = 'from-odds';
  private readonly TO_ODDS_CLASS = 'to-odds';
  private readonly FAVORITE_INPUT_CLASS = 'favorite-input';
  private readonly OU_INPUT_CLASS = 'ou-input';
  private readonly FILTER_LIVE_INDICATOR_CLASS = 'filter-live-indicator';
  private readonly FILTER_BET_TEAM_CLASS = 'filter-bet-team';

  constructor() {
  }

  public validateCommonData(leagueEventComponent: LeagueEventRedCardComponent, filterWrongOddsComponent: FilterWrongOddsComponent): boolean {
    if (!leagueEventComponent.isMatchIdValid()) {
      return false;
    }

    if (!filterWrongOddsComponent.isValid()) {
      return false;
    }

    return true;
  }

  public isFromTimeSameOrBeforeToTime(filterWrongOddsModel: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    return StaticService.isFromTimeSameOrBeforeToTime(filterWrongOddsModel.filterFromTransTime, filterWrongOddsModel.filterFromTransTime, tooltip, this.FROM_DATE_TIME_CLASS);

  }

  public isValidFilterWrongOdds(filterWrongOddsModel: FilterWrongOddsModel, tooltip: Tooltip, subIssueTypeId: string): boolean {
    if (!this.isValidFilterOddsType(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isValidFilterCorrectValue(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isSubTypeOuOr1stOu(subIssueTypeId) && !this.isValidFilterFavorite(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (this.isSubTypeOuOr1stOu(subIssueTypeId) && !this.isValidFilterOu(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isValidFilterLiveIndicator(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isSubTypeOuOr1stOu(subIssueTypeId) && !this.isValidFilterBetTeam(filterWrongOddsModel, tooltip)) {
      return false;
    }

    return true;
  }

  public isValidLogInfoEvent(logInfoWrongOdds: LogInfoWrongOdds): boolean {
    return !logInfoWrongOdds.messageValidationLogInfo.some(y => y.isError);
  }

  private isValidFilterBetTeam(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (_.isNull(filter.betTeam) || _.isUndefined(filter.betTeam) || _.isEmpty(filter.betTeam)) {
      tooltip.display(this.FILTER_BET_TEAM_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidFilterLiveIndicator(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (_.isNull(filter.liveIndicator) || _.isUndefined(filter.liveIndicator)) {
      tooltip.display(this.FILTER_LIVE_INDICATOR_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidFilterOu(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (!filter.ouValue) {
      tooltip.display(this.OU_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatMultipleDecimal(filter.ouValue, this.OU_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS);
  }

  private isValidFilterFavorite(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (!filter.favoriteValue) {
      tooltip.display(this.FAVORITE_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatMultipleDecimal(filter.favoriteValue, this.FAVORITE_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS);
  }

  private isValidFilterCorrectValue(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (!filter.correctOdds) {
      tooltip.display(this.CORRECT_ODDS_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatMultipleDecimal(filter.correctOdds, this.CORRECT_ODDS_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS);
  }

  private isValidFilterOddsType(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
   return (filter.filterOddsType === FilterOddsTypeConstant.VALUE && this.isValidFilterOddsValue(filter.oddsValue, tooltip))
    || (filter.filterOddsType === FilterOddsTypeConstant.RANGE && this.isValidFilterOddsRange(filter.fromOdds, filter.toOdds, tooltip));
  }

  private isValidFilterOddsValue(oddsValue: string, tooltip: Tooltip): boolean {
    if (!oddsValue) {
      tooltip.display(this.ODDS_VALUE_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    if(!StaticService.isCorrectFormatMultipleDecimal(oddsValue, this.ODDS_VALUE_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS)) {
      return false;
    }

    if (this.isValidOddsValueHaveNotZero(oddsValue, tooltip, this.ODDS_VALUE_INPUT_CLASS)) {
      return false;
    }

    return true;
  }

  public isValidOddsValueHaveNotZero(oddsValue: string, tooltip: Tooltip, elementClass: string): boolean {
    if (oddsValue.split('&').some(x => Number(x) === 0)) {
      tooltip.display(elementClass, TEXT.INVALID_ODDS);
      return true;
    }

    return false;
  }

  private isValidFilterOddsRange(fromOdds: string, toOdds: string, tooltip: Tooltip): boolean {
    if (!fromOdds) {
      tooltip.display(this.FROM_ODDS_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!toOdds) {
      tooltip.display(this.TO_ODDS_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!StaticService.isCorrectFormatSingleDecimal(fromOdds, this.FROM_ODDS_CLASS, tooltip, TEXT.INVALID_ODDS) ||
      !StaticService.isCorrectFormatSingleDecimal(toOdds, this.TO_ODDS_CLASS, tooltip, TEXT.INVALID_ODDS)) {
        return false;
    }

    if (this.isValidOddsValueHaveNotZero(fromOdds, tooltip, this.FROM_ODDS_CLASS)) {
      return false;
    }

    if (this.isValidOddsValueHaveNotZero(toOdds, tooltip, this.TO_ODDS_CLASS)) {
      return false;
    }

    return true;
  }

  public isSubTypeOuOr1stOu(subIssueTypeId: string): boolean {
    return this.isSubTypeOu(subIssueTypeId) || this.isSubType1stOu(subIssueTypeId);
  }

  private isSubTypeOu(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.OVER_UNDER.toString();
  }

  private isSubType1stOu(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER.toString();
  }

  public checkCanShowConfirmationWrongOdds(argWrongOdds: SaveRequestArg): boolean {
    const isHasWarningTicket = argWrongOdds.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argWrongOdds.isEdit && argWrongOdds.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argWrongOdds.isEdit
      && argWrongOdds.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && argWrongOdds.filter.action !== argWrongOdds.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
