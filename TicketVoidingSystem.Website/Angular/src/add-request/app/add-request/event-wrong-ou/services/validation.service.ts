import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { DateTimeFormat, TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { LogInfoWrongOuComponent } from '../log-info-wrong-ou/log-info-wrong-ou.component';
import { FilterWrongOuModel } from '../models/filter-wrong-ou.model';
import { LogInfoWrongOu } from '../models/log-info-wrong-ou.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly INPUT_WRONG_MARKET_CLASS = 'wrong-market-input';
  private readonly INPUT_ACTUAL_MARKET_CLASS = 'actual-market-input';

  public validateCommonData(eventLeagueComponent: EventLeagueComponent, logInfoComponents: LogInfoWrongOuComponent[]): boolean {
    if (!eventLeagueComponent.isMatchIdValid()) {
      return false;
    }

    if (logInfoComponents.some(x => !x.filterWrongOuComponent.isValid())) {
      return false;
    }

    return true;
  }

  public isFromTimeSameOrBeforeToTime(fromTime: string, toTime: string, tooltip: Tooltip): boolean {
    const fromDateTime = moment(fromTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    const toDateTime = moment(toTime, DateTimeFormat.FULL_DATE_TIME_FORMAT);
    if (!fromDateTime.isSameOrBefore(toDateTime)) {
      tooltip.display(this.FROM_DATE_TIME_CLASS, TEXT.FROM_TIME_MUST_SMALLER_THAN_TO_TIME);
      return false;
    }

    return true;
  }

  public isValidInputRelatedEvent(inputMatchId: number, matchIdClass: string, allEvents: LogInfoWrongOu[], tooltip: Tooltip): boolean {
    if (inputMatchId === allEvents.find(x => x.isMainMatch).matchId) {
      tooltip.display(matchIdClass, TEXT.INVALID_MATCHID);
      return false;
    }
    if (allEvents.filter(x => !x.isMainMatch).some(x => x.matchId === inputMatchId)) {
      tooltip.display(matchIdClass, TEXT.MATCH_ID_EXISTS_IN_LIST);
      return false;
    }

    return true;
  }

  public isAllEventsValid(logInfoWrongOu: LogInfoWrongOu[]): boolean {
    if (logInfoWrongOu.some(x => x.messageValidationLogInfo.some(y => y.isError))) {
      return false;
    }

    return true;
  }

  public isValidHdp(filterWrongOuModel: FilterWrongOuModel, tooltip: Tooltip): boolean {
    if (!filterWrongOuModel.wrongMarket) {
      tooltip.display(this.INPUT_WRONG_MARKET_CLASS, TEXT.REQUIRED_WRONG_MARKET);

      return false;
    }

    if (!filterWrongOuModel.actualMarket) {
      tooltip.display(this.INPUT_ACTUAL_MARKET_CLASS, TEXT.REQUIRED_ACTUAL_MARKET);

      return false;
    }

    if (!StaticService.isCorrectFormatMultipleDecimal(filterWrongOuModel.wrongMarket, this.INPUT_WRONG_MARKET_CLASS, tooltip, TEXT.INVALID_OU)) {
      return false;
    }

    return true;
  }

  public checkCanShowConfirmationWrongOu(saveRequestArg: SaveRequestArg): boolean {
    const isHasWarningTicket = saveRequestArg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
    const isEditingByAnotherUser = saveRequestArg.isEdit && saveRequestArg.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = saveRequestArg.isEdit
      && saveRequestArg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && saveRequestArg.filter.action !== saveRequestArg.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}