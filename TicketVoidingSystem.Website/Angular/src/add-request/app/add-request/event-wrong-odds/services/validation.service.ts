import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { FilterWrongOddsComponent } from '../filter-wrong-odds/filter-wrong-odds.component';
import { FilterWrongOddsModel } from '../models/filter-wrong-odds.model';
import { LogInfoWrongOdds } from '../models/log-info-wrong-odds.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly CORRECT_ODDS_INPUT_CLASS = 'correct-odds-input';
  private readonly FAVORITE_INPUT_CLASS = 'favorite-input';
  private readonly OU_INPUT_CLASS = 'ou-input';
  private readonly FILTER_LIVE_INDICATOR_CLASS = 'filter-live-indicator';
  private readonly SPREAD_INPUT_CLASS = 'spread-input';

  public validateCommonData(eventLeagueComponent: EventLeagueComponent, filterWrongOddsComponent: FilterWrongOddsComponent): boolean {
    return eventLeagueComponent.isMatchIdValid() && filterWrongOddsComponent.isValid();
  }

  public isFromTimeSameOrBeforeToTime(filterWrongOddsModel: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    return StaticService.isFromTimeSameOrBeforeToTime(filterWrongOddsModel.filterFromTransTime, filterWrongOddsModel.filterFromTransTime, tooltip, this.FROM_DATE_TIME_CLASS);
  }

  public isValidFilterWrongOdds(filterWrongOddsModel: FilterWrongOddsModel, tooltip: Tooltip, subIssueTypeId: string): boolean {
    if (!this.isSubTypeOuOr1stOu(subIssueTypeId) && !this.isValidFilterFavorite(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (this.isSubTypeOuOr1stOu(subIssueTypeId) && !this.isValidFilterOu(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isValidFilterLiveIndicator(filterWrongOddsModel, tooltip)) {
      return false;
    }

    if (!this.isValidSpread(filterWrongOddsModel.spread, tooltip)){
      return false;
    }

    if (!this.isValidFilterCorrectOdds(filterWrongOddsModel.correctOddsHomeOver, filterWrongOddsModel.spread, tooltip)) {
      return false;
    }

    return true;
  }

  public isValidLogInfoEvent(logInfoWrongOdds: LogInfoWrongOdds): boolean {
    return !logInfoWrongOdds.messageValidationLogInfo.some(y => y.isError);
  }

  private isValidFilterLiveIndicator(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (_.isNull(filter.liveIndicator) || _.isUndefined(filter.liveIndicator)) {
      tooltip.display(this.FILTER_LIVE_INDICATOR_CLASS, TEXT.REQUIRED_FIELD);
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
      && argWrongOdds.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argWrongOdds.filter.action !== argWrongOdds.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }

  private isValidFilterOu(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (!filter.wrongOU) {
      tooltip.display(this.OU_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatSingleDecimal(filter.wrongOU, this.OU_INPUT_CLASS, tooltip, TEXT.INVALID_INPUT);
  }

  private isValidFilterFavorite(filter: FilterWrongOddsModel, tooltip: Tooltip): boolean {
    if (!filter.favoriteValue) {
      tooltip.display(this.FAVORITE_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatSingleDecimal(filter.favoriteValue, this.FAVORITE_INPUT_CLASS, tooltip, TEXT.INVALID_INPUT);
  }

  public isValidSpread(spread: string, tooltip: Tooltip){
    const isCorrectFormatSingleDecimal = StaticService.isCorrectFormatSingleDecimal(spread, this.SPREAD_INPUT_CLASS, tooltip, TEXT.REQUIRED_SPREAD);
    const spreadValue = Number(spread);
    if(!isCorrectFormatSingleDecimal || spreadValue < 0 || spreadValue > 1){
      tooltip.display(this.SPREAD_INPUT_CLASS, TEXT.REQUIRED_SPREAD);
      return false;
    }

    return true;
  }

  public isValidFilterCorrectOdds(homeCorrectOdds: string, spread: string, tooltip: Tooltip): boolean {
    const isCorrectFormatSingleDecimal = StaticService.isCorrectFormatSingleDecimal(homeCorrectOdds, this.CORRECT_ODDS_INPUT_CLASS, tooltip, TEXT.REQUIRED_CORRECT_ODDS);
    const homeCorrectOddsValue = Number(homeCorrectOdds);
    const spreadValue = Number(spread);
    if (!isCorrectFormatSingleDecimal || Math.abs(Number(homeCorrectOddsValue)) < spreadValue || Math.abs(Number(homeCorrectOddsValue)) > 1) {
      tooltip.display(this.CORRECT_ODDS_INPUT_CLASS, TEXT.REQUIRED_CORRECT_ODDS);
      return false;
    }

    return true;
  }
}
