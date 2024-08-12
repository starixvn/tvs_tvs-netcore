import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TeamFavorite, TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoWrongHdpComponent } from '../log-info-wrong-hdp/log-info-wrong-hdp.component';
import { FilterWithHdpModel } from '../models/filter-with-hdp.model';
import { LogInfoWrongHdp } from '../models/log-info-wrong-hdp.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly INPUT_HOME_FAVORITE_CLASS = 'home-favorite-input';
  private readonly INPUT_AWAY_FAVORITE_CLASS = 'away-favorite-input';
  private readonly INPUT_ACTUAL_MARKET_CLASS = 'actual-market-input';
  private readonly INPUT_HDP_VALUE_CLASS = 'hdp-value-input';

  constructor() {
  }

  public validateCommonData(eventLeagueComponent: EventLeagueComponent, logInfoComponents: LogInfoWrongHdpComponent[]): boolean {
    if (!eventLeagueComponent.isMatchIdValid()) {
      return false;
    }

    if (logInfoComponents.some(x => !x.filterWithHdpComponent.isValid())) {
      return false;
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

  public isValidInputRelatedEvent(inputMatchId: number, matchIdInputClass: string, allEvents: LogInfoWrongHdp[], tooltip: Tooltip): boolean {
    if (inputMatchId === allEvents.find(x => x.isMainMatch).matchId) {
      tooltip.display(matchIdInputClass, LABELS.INVALID_MATCHID);
      return false;
    }
    if (allEvents.filter(x => !x.isMainMatch).some(x => x.matchId === inputMatchId)) {
      tooltip.display(matchIdInputClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
      return false;
    }

    return true;
  }

  public isAllEventsValid(events: LogInfoWrongHdp[]): boolean {
    if (events.some(x => x.messageValidationLogInfo.some(y => y.isError))) {
      return false;
    }

    return true;
  }

  public isValidHdpWithSubTypeWrongHdpOrWrong1stHdp(teamFavorite: number, filterWithHdpModel: FilterWithHdpModel, tooltip: Tooltip): boolean {
    if (teamFavorite === TeamFavorite.HOME && !filterWithHdpModel.homeFavorite) {
      tooltip.display(this.INPUT_HOME_FAVORITE_CLASS, LABELS.REQUIRED_HOME_FAVORITE);

      return false;
    }

    if (teamFavorite === TeamFavorite.AWAY && !filterWithHdpModel.awayFavorite) {
      tooltip.display(this.INPUT_AWAY_FAVORITE_CLASS, LABELS.REQUIRED_AWAY_FAVORITE);

      return false;
    }

    if (!filterWithHdpModel.actualMarket) {
      tooltip.display(this.INPUT_ACTUAL_MARKET_CLASS, LABELS.REQUIRED_ACTUAL_MARKET);

      return false;
    }

    if (teamFavorite === TeamFavorite.HOME &&
      !StaticService.isCorrectFormatMultipleDecimal(filterWithHdpModel.homeFavorite, this.INPUT_HOME_FAVORITE_CLASS, tooltip, TEXT.INVALID_HDP)) {
      return false;
    }

    if (teamFavorite === TeamFavorite.AWAY &&
      !StaticService.isCorrectFormatMultipleDecimal(filterWithHdpModel.awayFavorite, this.INPUT_AWAY_FAVORITE_CLASS, tooltip, TEXT.INVALID_HDP)) {
      return false;
    }

    return true;
  }

  public isValidHdpWithSubTypeHomeAwayVirtualHedReverse(filterWithHdpModel: FilterWithHdpModel, tooltip: Tooltip): boolean {
    if (!filterWithHdpModel.hdpValue){
      tooltip.display(this.INPUT_HDP_VALUE_CLASS, LABELS.REQUIRED_HDP_VALUE);

      return false;
    }

    if (!StaticService.isCorrectFormatMultipleDecimal(filterWithHdpModel.hdpValue, this.INPUT_HDP_VALUE_CLASS, tooltip, TEXT.INVALID_HDP)) {
      return false;
    }

    return true;
  }

  public checkCanShowConfirmation(arg: SaveRequestArg): boolean {
    const isHasWarningTicket = arg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
    const isEditingByAnotherUser = arg.isEdit && arg.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = arg.isEdit && arg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && arg.filter.action !== arg.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }

  public isSubTypeWrongHdpOrWrong1stHdp(subIssueTypeId: string): boolean {
    return this.isSubTypeWrongHdp(subIssueTypeId) || this.isSubTypeWrong1stHdp(subIssueTypeId);
  }

  private isSubTypeWrongHdp(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.WRONG_HDP.toString();
  }

  private isSubTypeWrong1stHdp(subIssueTypeId: string): boolean {
    return subIssueTypeId === SubIssueTypeConstant.WRONG_1ST_HDP.toString();
  }
}