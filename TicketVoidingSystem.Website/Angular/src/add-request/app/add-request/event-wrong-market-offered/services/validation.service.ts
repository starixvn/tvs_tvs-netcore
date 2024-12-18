import { Injectable } from '@angular/core';
import { AdvancedModeAddRequestComponent } from '../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { FilterTimeComponent } from '../filter-time/filter-time.component';
import { LogInfoWrongMarketOffered } from '../models/log-info-wrong-market-offered.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validateCommonData(eventLeague: EventLeagueComponent, filterTimeComponent: FilterTimeComponent, advancedMode?: AdvancedModeAddRequestComponent): boolean {
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

  isValidLogInfoEvent(logInfoWrongMarketOffered: LogInfoWrongMarketOffered): boolean {
    return logInfoWrongMarketOffered.logInfoItems.some(y => y.messageValidationLogInfo.every(t => !t.isError));
  }
}
