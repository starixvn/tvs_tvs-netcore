import { Injectable } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { FilterNotParticipateComponent } from '../filter-not-participate/filter-not-participate.component';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly PLAYER_CLASS = 'player-dropdown';
  private readonly GROUP_BET_TYPE_CLASS = 'group-bet-type-dropdown';

  public validateCommonData(leagueEventComponent: LeagueEventRedCardComponent, filterNotParticipateComponent: FilterNotParticipateComponent): boolean {
    if (!leagueEventComponent.isMatchIdValid()) {
      return false;
    }

    if (!filterNotParticipateComponent.isValid()) {
      return false;
    }

    return true;
  }

  public isAllFieldsHaveValue(model: FilterNotParticipateModel, index: number, tooltip: Tooltip): boolean {
    if (!model.playerId) {
      tooltip.display(`${this.PLAYER_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (model.groupBetTypeIds.length === 0) {
      tooltip.display(`${this.GROUP_BET_TYPE_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  public isValidLogInfoEvent(logInfoNotParticipate: LogInfoNotParticipate): boolean {
    return !logInfoNotParticipate.messageValidationLogInfo.some(y => y.isError);
  }

  public checkCanShowConfirmationNotParticipate(argNotParticipate: SaveRequestArg): boolean {
    const isHasWarningTicket = argNotParticipate.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argNotParticipate.isEdit && argNotParticipate.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argNotParticipate.isEdit
      && argNotParticipate.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && argNotParticipate.filter.action !== argNotParticipate.actionIdOfFirstTimeAccess;

    return isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
