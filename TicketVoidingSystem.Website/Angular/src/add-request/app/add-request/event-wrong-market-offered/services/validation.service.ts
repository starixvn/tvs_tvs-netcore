import { Injectable } from '@angular/core';
import { AdvancedModeAddRequestComponent } from '../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { TVSRequestActionType } from '../../../../../utility/constants/config';
import { FilterTimeComponent } from '../filter-time/filter-time.component';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  public validateCommonData(eventLeague: EventLeagueComponent, filterTimeComponent: FilterTimeComponent, advancedMode?: AdvancedModeAddRequestComponent): boolean {
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

  public isValidLogInfoEvent(logInfoWrongMarketOffered: LogInfoWrongMarketOffered): boolean {
    return !logInfoWrongMarketOffered.messageValidationLogInfo.some(y => y.isError);
  }

  public checkCanShowConfirmationWrongMarketOffered(argWrongMarketOffered: SaveRequestArg): boolean {
    const isHasWarningSettledTicket = argWrongMarketOffered.logInfoEvent.logInfoDetail?.settleCount > 0;
    const isHasWarningTicket = argWrongMarketOffered.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argWrongMarketOffered.isEdit && argWrongMarketOffered.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argWrongMarketOffered.isEdit
      && argWrongMarketOffered.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString() 
      && argWrongMarketOffered.filter.action !== argWrongMarketOffered.actionIdOfFirstTimeAccess;

    return isHasWarningSettledTicket || isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
