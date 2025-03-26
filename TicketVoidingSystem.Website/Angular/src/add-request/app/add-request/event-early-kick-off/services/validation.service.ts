import { Injectable } from '@angular/core';
import { DateFullTimeNewComponent } from '../../../../../utility/components/date-time/date-full-time-new/date-full-time-new.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { LABELS } from '../../../../../utility/constants/labels';
import { LogInfoEarlyKickOff } from '../models/log-info-eko.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {

  public validateCommonData(eventLeagueComponent: EventLeagueComponent, kickOffTimeComponent: DateFullTimeNewComponent): boolean {
    if (!eventLeagueComponent.isMatchIdValid()) {
      return false;
    }

    if (!this.isTimeKickOffValid(kickOffTimeComponent)) {
      return false;
    }

    return true;
  }

  public isValidInputRelatedEvent(inputMatchId: number, matchIdClass: string, allEvents: LogInfoEarlyKickOff[], tooltip: Tooltip): boolean {
    if (inputMatchId === allEvents.find(x => x.isMainMatch).matchId) {
      tooltip.display(matchIdClass, LABELS.INVALID_MATCHID);
      return false;
    }
    if (allEvents.filter(x => !x.isMainMatch).some(x => x.matchId === inputMatchId)) {
      tooltip.display(matchIdClass, LABELS.MATCH_ID_EXISTS_IN_LIST);
      return false;
    }

    return true;
  }

  public isAllEventsValid(logInfoEarlyKickOff: LogInfoEarlyKickOff[]): boolean {
    return logInfoEarlyKickOff.every(x => this.isEventMatchValid(x));
  }

  public checkCanShowConfirmationEarlyKickOff(saveRequestArg: SaveRequestArg): boolean {
    const isHasWarningEvent = saveRequestArg.allEvents.filter(x => !x.isMainMatch).some(x => x.isInvalidTotalTickets);
    const isHasWarningTicket = saveRequestArg.allEvents.some(x => x.messageValidationLogInfo?.some(y => !y.isError));
    const isEditingByAnotherUser = saveRequestArg.isEdit && saveRequestArg.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = saveRequestArg.isEdit
      && saveRequestArg.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && saveRequestArg.filter.action !== saveRequestArg.actionIdOfFirstTimeAccess;

    return isHasWarningEvent || isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }

  private isTimeKickOffValid(kickOffTimeComponent: DateFullTimeNewComponent): boolean {
    return kickOffTimeComponent.validateWithTooltip();
  }

  private isEventMatchValid(event: LogInfoEarlyKickOff): boolean {
    if (event.isMainMatch && event.isInvalidTotalTickets) {
      return false;
    }

    return true;
  }

  public isEditingByAnotherUser(isEdit: boolean, editingBy: number, createdBy: number): boolean {
    return isEdit && editingBy !== createdBy;
  }
}