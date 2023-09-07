import { Injectable } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { LeagueEventRedCardComponent } from '../../event-red-card/league-event-red-card/league-event-red-card.component';
import { PrimitivePropertyItem } from '../filter-not-participate-item/filter-not-participate-item.model';
import { FilterNotParticipateComponent } from '../filter-not-participate/filter-not-participate.component';
import { FilterNotParticipateModel } from '../models/filter-not-participate.model';
import { LogInfoNotParticipate } from '../models/log-info-not-participate.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private readonly BET_TYPE_CLASS = 'bet-type-dropdown';
  private readonly WICKET_OVER_CLASS = 'wicket-over-input';
  private readonly PLAYER_CLASS = 'player-dropdown';
  private readonly RUNS_CLASS = 'runs-input';
  private readonly LIVE_INDICATOR_CLASS = 'live-indicator';

  constructor() {
  }

  public validateCommonData(leagueEventComponent: LeagueEventRedCardComponent, filterNotParticipateComponent: FilterNotParticipateComponent): boolean {
    if (!leagueEventComponent.isMatchIdValid()) {
      return false;
    }

    if (!filterNotParticipateComponent.isValid()) {
      return false;
    }

    return true;
  }

  public isAllFieldsHaveValue(model: FilterNotParticipateModel, index: number, primitivePropertyItem: PrimitivePropertyItem, tooltip: Tooltip): boolean {
    if (!model.betTypeId) {
      tooltip.display(`${this.BET_TYPE_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!primitivePropertyItem.isDisabledPlayer && model.playerIds.length === 0) {
      tooltip.display(`${this.PLAYER_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  public isValidSingleDecimalRuns(value: string, elementClass: string, tooltip: Tooltip): boolean {
    return StaticService.isCorrectFormatSingleDecimal(value, elementClass, tooltip, TEXT.INVALID_RUNS);
  }

  public isValidOnlyNumberWicketOver(value: string, elementClass: string, tooltip: Tooltip): boolean {
    return StaticService.isCorrectFormatOnlyNumber(value, elementClass, tooltip, TEXT.INVALID_WICKET_OVER);
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
