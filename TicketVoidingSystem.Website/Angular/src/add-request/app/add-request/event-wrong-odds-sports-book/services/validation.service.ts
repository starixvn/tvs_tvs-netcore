import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AdvancedModeAddRequestComponent } from '../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { FilterWrongOddsSportsBookComponent } from '../filter-wrong-odds-sports-book/filter-wrong-odds-sports-book.component';
import { FilterOddsTypeConstant, FilterWrongOddsSportsBookModel } from '../models/filter-wrong-odds-sports-book.model';
import { LogInfoWrongOddsSportsBook } from '../models/log-info-wrong-odds-sports-book.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly ODDS_VALUE_INPUT_CLASS = 'odds-value-input';
  private readonly CORRECT_ODDS_INPUT_CLASS = 'correct-odds-input';
  private readonly FROM_ODDS_CLASS = 'from-odds';
  private readonly TO_ODDS_CLASS = 'to-odds';
  private readonly FILTER_LIVE_INDICATOR_CLASS = 'filter-live-indicator';
  private readonly checkPermissionService = inject(CheckAddPermissionService);

  public isAccountHasAddRequestPermission(action: string, isHasInstantlySettledTicket: boolean, isHasSettledTicket: boolean, permission: PermissionAddRequest): boolean {
    return this.checkPermissionService.isAccountHasAddRequestPermission(action, isHasInstantlySettledTicket, isHasSettledTicket, permission);
  }

  public validateCommonData(eventLeague: EventLeagueComponent, filterTimeComponent: FilterWrongOddsSportsBookComponent, advancedMode?: AdvancedModeAddRequestComponent): boolean {
    if (!eventLeague.isMatchIdValid()) {
      return false;
    }

    if (!filterTimeComponent.isValidity()) {
      return false;
    }

    if (advancedMode && !advancedMode.isValidity()) {
      return false;
    }

    return true;
  }

  public isFromTimeSameOrBeforeToTime(filterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel, tooltip: Tooltip): boolean {
    return StaticService.isFromTimeSameOrBeforeToTime(filterWrongOddsSportsBookModel.fromDateTime, filterWrongOddsSportsBookModel.fromDateTime, tooltip, this.FROM_DATE_TIME_CLASS);

  }

  public isValidFilterWrongOddsSportsBook(filterWrongOddsSportsBookModel: FilterWrongOddsSportsBookModel, tooltip: Tooltip): boolean {
    if (!this.isValidFilterOddsType(filterWrongOddsSportsBookModel, tooltip)) {
      return false;
    }

    if (!this.isValidFilterCorrectValue(filterWrongOddsSportsBookModel, tooltip)) {
      return false;
    }

    if (!this.isValidFilterLiveIndicator(filterWrongOddsSportsBookModel, tooltip)) {
      return false;
    }

    return true;
  }

  public isValidLogInfoEvent(logInfoWrongOddsSportsBook: LogInfoWrongOddsSportsBook): boolean {
    return !logInfoWrongOddsSportsBook.messageValidationLogInfo.some(y => y.isError);
  }

  private isValidFilterLiveIndicator(filter: FilterWrongOddsSportsBookModel, tooltip: Tooltip): boolean {
    if (_.isNull(filter.liveIndicator) || _.isUndefined(filter.liveIndicator)) {
      tooltip.display(this.FILTER_LIVE_INDICATOR_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidFilterCorrectValue(filter: FilterWrongOddsSportsBookModel, tooltip: Tooltip): boolean {
    if (!filter.correctOdds) {
      tooltip.display(this.CORRECT_ODDS_INPUT_CLASS, TEXT.REQUIRED_FIELD);
      return false;
    }

    return StaticService.isCorrectFormatMultipleDecimal(filter.correctOdds, this.CORRECT_ODDS_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS);
  }

  private isValidFilterOddsType(filter: FilterWrongOddsSportsBookModel, tooltip: Tooltip): boolean {
    return (filter.filterOddsType === FilterOddsTypeConstant.VALUE && this.isValidFilterOddsValue(filter.oddsValue, tooltip))
      || (filter.filterOddsType === FilterOddsTypeConstant.RANGE && this.isValidFilterOddsRange(filter.fromOdds, filter.toOdds, tooltip));
  }

  public isValidFilterOddsValue(oddsValue: string, tooltip: Tooltip): boolean {
    if (oddsValue) {
      if (!StaticService.isCorrectFormatMultipleDecimal(oddsValue, this.ODDS_VALUE_INPUT_CLASS, tooltip, TEXT.INVALID_ODDS)) {
        return false;
      }

      return this.isOddsValueHaveNotZeroNumber(oddsValue, tooltip, this.ODDS_VALUE_INPUT_CLASS);
    }

    return true;
  }

  public isOddsValueHaveNotZeroNumber(oddsValue: string, tooltip: Tooltip, elementClass: string): boolean {
    if (oddsValue.split('&').some(x => parseFloat(x) === 0)) {
      tooltip.display(elementClass, TEXT.INVALID_ODDS);
      return false;
    }

    return true;
  }

  private isValidFilterOddsRange(fromOdds: string, toOdds: string, tooltip: Tooltip): boolean {
    if (!fromOdds && !toOdds) {
      tooltip.display(this.FROM_ODDS_CLASS, TEXT.REQUIRED_FIELD);
      return true;
    }

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

    if (!this.isOddsValueHaveNotZeroNumber(fromOdds, tooltip, this.FROM_ODDS_CLASS) ||
        !this.isOddsValueHaveNotZeroNumber(toOdds, tooltip, this.TO_ODDS_CLASS)) {
      return false;
    }

    return true;
  }

  public checkCanShowConfirmationWrongOdds(argWrongOdds: SaveRequestArg): boolean {
    const isHasWarningTicket = argWrongOdds.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argWrongOdds.isEdit && argWrongOdds.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argWrongOdds.isEdit
      && argWrongOdds.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && argWrongOdds.filter.action !== argWrongOdds.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
