import { inject, Injectable } from '@angular/core';
import { PermissionAddRequest } from 'src/add-request-new/models/permission-add-request.model';
import { CheckAddPermissionService } from 'src/add-request-new/services/check-permission.service';
import { AdvancedModeAddRequestComponent } from 'src/utility/components/advanced-mode-add-request/advanced-mode-add-request.component';
import { EventLeagueComponent } from 'src/utility/components/event-league/event-league.component';
import { Tooltip } from 'src/utility/components/tooltip/tooltip.model';
import { SubIssueTypeConstant } from 'src/utility/constants/sub-issue-type.constant';
import { StaticService } from 'src/utility/services/static.service';
import { FilterOtherIssuesComponent } from '../filter-other-issues/filter-other-issues.component';
import { FilterOtherIssuesModel } from '../models/filter-other-isssues.model';
import { LogInfoOtherIssues } from '../models/log-info-other-issues.model';

@Injectable()
export class ValidationService {
  private readonly FROM_DATE_TIME_CLASS = 'from-date-time';
  private readonly checkPermissionService = inject(CheckAddPermissionService);

  isAccountHasAddRequestPermission(action: string, isHasInstantlySettledTicket: boolean, isHasSettledTicket: boolean, permission: PermissionAddRequest): boolean {
    return this.checkPermissionService.isAccountHasAddRequestPermission(action, isHasInstantlySettledTicket, isHasSettledTicket, permission);
  }

  validateCommonData(eventLeague: EventLeagueComponent, filterOtherIssuesComponent?: FilterOtherIssuesComponent, advancedMode?: AdvancedModeAddRequestComponent): boolean {
    if (!eventLeague.isMatchIdValid()) {
      return false;
    }

    if (filterOtherIssuesComponent && !filterOtherIssuesComponent.isValidity()) {
      return false;
    }

    if (advancedMode && !advancedMode.isValidity()) {
      return false;
    }

    return true;
  }

  isFromTimeSameOrBeforeToTime(filterOtherIssuesModel: FilterOtherIssuesModel, tooltip: Tooltip): boolean {
    return StaticService.isFromTimeSameOrBeforeToTime(filterOtherIssuesModel.fromDateTime, filterOtherIssuesModel.toDateTime, tooltip, this.FROM_DATE_TIME_CLASS);
  }

  isValidLogInfoEvent(logInfoOtherIssues: LogInfoOtherIssues): boolean {
    return !logInfoOtherIssues.messageValidationLogInfo.some(y => y.isError);
  }

  isShowFilterTime(issueTypeId: string, subIssueTypeId: string){
    return !StaticService.isMatchEarlyCompleted(issueTypeId) && subIssueTypeId === SubIssueTypeConstant.RESTART.toString();
  }
}
