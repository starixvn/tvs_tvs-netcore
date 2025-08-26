import { Injectable } from '@angular/core';
import { AdvancedModeAddRequestComponent } from '../../../../../../utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from '../../../../../../utility/components/event-league/event-league.component';
import { TVSRequestActionType } from '../../../../../../utility/constants/config';
import { FilterTimeTechnicalErrorComponent } from '../filter-time-technical-error/filter-time-technical-error.component';
import { LogInfoTechnicalError } from '../models/log-info-technical-error.model';
import { SaveRequestArg } from '../models/save-request-arg.model';

@Injectable()
export class ValidationService {
  public validateCommonData(eventLeague: EventLeagueComponent, filterTimeComponent: FilterTimeTechnicalErrorComponent, advancedMode?: AdvancedModeAddRequestComponent): boolean {
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

  public isValidLogInfoEvent(logInfoTechnicalError: LogInfoTechnicalError): boolean {
    return !logInfoTechnicalError.messageValidationLogInfo.some(y => y.isError);
  }

  public checkCanShowConfirmationTechnicalError(argTechnicalError: SaveRequestArg): boolean {
    const isHasWarningSettledTicket = argTechnicalError.logInfoEvent.logInfoDetail?.settleCount > 0;
    const isHasWarningTicket = argTechnicalError.logInfoEvent.messageValidationLogInfo?.some(y => !y.isError);
    const isEditingByAnotherUser = argTechnicalError.isEdit && argTechnicalError.userId !== Number(document.getElementById('body').getAttribute('user-id'));
    const isHasWarningTakenNote = argTechnicalError.isEdit
      && argTechnicalError.filter.action === TVSRequestActionType.TAKE_NOTE_ID.toString()
      && argTechnicalError.filter.action !== argTechnicalError.actionIdOfFirstTimeAccess;

    return isHasWarningSettledTicket || isHasWarningTicket || isHasWarningTakenNote || isEditingByAnotherUser;
  }
}
