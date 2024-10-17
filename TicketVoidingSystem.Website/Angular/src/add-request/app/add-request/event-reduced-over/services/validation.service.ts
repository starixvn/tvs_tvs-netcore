import { Injectable } from '@angular/core';
import { Tooltip } from '../../../../../utility/components/tooltip/tooltip.model';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { TEXT } from '../../../../../utility/constants/text';
import { StaticService } from '../../../../../utility/services/static.service';
import { PrimitivePropertyItem } from '../filter-reduced-over-item/filter-reduced-over-item.model';
import { FilterReducedOverComponent } from '../filter-reduced-over/filter-reduced-over.component';
import { FilterReducedOverModel } from '../models/filter-reduced-over.model';
import { LogInfoReducedOver } from '../models/log-info-reduced-over.model';
import { SaveRequestArg } from '../models/save-request-arg.model';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';

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

  public validateCommonData(eventLeagueComponent: EventLeagueComponent, filterReducedOverComponent: FilterReducedOverComponent): boolean {
    if (!eventLeagueComponent.isMatchIdValid()) {
      return false;
    }

    if (!filterReducedOverComponent.isValid()) {
      return false;
    }

    return true;
  }

  public isAllFieldsHaveValue(model: FilterReducedOverModel, index: number, primitivePropertyItem: PrimitivePropertyItem, tooltip: Tooltip): boolean {
    if (model.betTypeIds.length === 0) {
      tooltip.display(`${this.BET_TYPE_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!this.isValidWicketOver(model, index, primitivePropertyItem, tooltip)) {
      return false;
    }

    if (!primitivePropertyItem.isDisabledPlayer && model.playerIds.length === 0) {
      tooltip.display(`${this.PLAYER_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!this.isValidRuns(model, index, primitivePropertyItem, tooltip)) {
      return false;
    }

    if (!model.nonLive && !model.live) {
      tooltip.display(`${this.LIVE_INDICATOR_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    return true;
  }

  private isValidWicketOver(model: FilterReducedOverModel, index: number, primitivePropertyItem: PrimitivePropertyItem, tooltip: Tooltip): boolean {
    if (!primitivePropertyItem.isDisabledWicketOver && !model.wicketOver) {
      tooltip.display(`${this.WICKET_OVER_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!primitivePropertyItem.isDisabledWicketOver && !this.isValidOnlyNumberWicketOver(model.wicketOver, `${this.WICKET_OVER_CLASS}${index}`, tooltip)) {
      return false;
    }

    return true;
  }

  private isValidRuns(model: FilterReducedOverModel, index: number, primitivePropertyItem: PrimitivePropertyItem, tooltip: Tooltip): boolean {
    if (!primitivePropertyItem.isDisabledRuns && !model.runs) {
      tooltip.display(`${this.RUNS_CLASS}${index}`, TEXT.REQUIRED_FIELD);
      return false;
    }

    if (!primitivePropertyItem.isDisabledRuns && !this.isValidSingleDecimalRuns(model.runs, `${this.RUNS_CLASS}${index}`, tooltip)) {
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

  public isValidLogInfoEvent(logInfoReducedOver: LogInfoReducedOver): boolean {
    return !logInfoReducedOver.messageValidationLogInfo.some(y => y.isError);
  }

  public checkCanShowConfirmationReducedOver(argReducedOver: SaveRequestArg): boolean {
    const isHasSettledTicket = argReducedOver.logInfoEvent.logInfoDetail.settleCount > 0;
    const isHasWarningTicket = argReducedOver.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argReducedOver.isEdit && argReducedOver.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argReducedOver.isEdit
      && argReducedOver.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() && argReducedOver.filter.action !== argReducedOver.actionIdOfFirstTimeAccess;

    return isHasSettledTicket || isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
