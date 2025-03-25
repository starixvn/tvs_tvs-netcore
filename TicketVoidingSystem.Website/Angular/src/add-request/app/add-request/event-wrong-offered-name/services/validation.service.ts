import { inject, Injectable } from '@angular/core';
import { EventLeagueComponent } from '../../../../../utility/components/event-league/event-league.component';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { PermissionAddRequest } from '../../models/permission-add-request.model';
import { CheckAddPermissionService } from '../../services/check-permission.service';
import { FilterWrongOfferedNameComponent } from '../filter-wrong-offered-name/filter-wrong-offered-name.component';
import { LogInfoWrongOfferedName } from '../models/log-info-wrong-offered-name.model';

@Injectable()
export class ValidationService {
  private readonly checkPermissionService = inject(CheckAddPermissionService);

  isAccountHasAddRequestPermission(action: string, isHasInstantlySettledTicket: boolean, isHasSettledTicket: boolean, permission: PermissionAddRequest): boolean {
    return this.checkPermissionService.isAccountHasAddRequestPermission(action, isHasInstantlySettledTicket, isHasSettledTicket, permission);
  }

  validateCommonData(eventLeague: EventLeagueComponent, filterWrongOfferedNameComponent: FilterWrongOfferedNameComponent): boolean {
    return eventLeague.isMatchIdValid() && filterWrongOfferedNameComponent.isValidity();
  }

  isValidLogInfoEvent(logInfoWrongOddsSportsBook: LogInfoWrongOfferedName): boolean {
    return !logInfoWrongOddsSportsBook.messageValidationLogInfo.some(y => y.isError);
  }

  isSubTypeChinese(subIssueTypeId: string) {
    return subIssueTypeId === SubIssueTypeConstant.TEAM_NAME_CHINESE.toString() ||
      subIssueTypeId === SubIssueTypeConstant.LEAGUE_NAME_CHINESE.toString();
  }

  isSubTypeOfLeague(subIssueTypeId: string) {
    return subIssueTypeId === SubIssueTypeConstant.LEAGUE_NAME_ENGLISH.toString() ||
      subIssueTypeId === SubIssueTypeConstant.LEAGUE_NAME_CHINESE.toString();
  }
}
