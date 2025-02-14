import { inject, Injectable } from '@angular/core';
import { Result } from '../../../utility/models/result';
import { CommonService } from '../../../utility/services/common.service';
import { ResultModelService } from '../../../utility/services/result-model.service';
import { StaticService } from '../../../utility/services/static.service';
import { VoidPageCommonItem } from '../models/void-page-common-item.model';
import { CheckingPermissionModel } from '../../../utility/models/checking-permission.model';

@Injectable(
  { providedIn: 'root' }
)
export class CheckVoidPermissionService {
  commonService = inject(CommonService);

  public async checkVoidBetPermission(voidPageItems: VoidPageCommonItem[]): Promise<Result<null>> {
    for (const item of voidPageItems) {
      const checkingPermissionModel = this.getCheckingPermissionModel(item);
      const result = await this.commonService.checkVoidBetPermission(checkingPermissionModel);

      if (result.errCode !== 0 && checkingPermissionModel.action) {
        return ResultModelService.createFailResult(result.errMsg, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private getCheckingPermissionModel(voidPageItem: VoidPageCommonItem): CheckingPermissionModel {
    const model = new CheckingPermissionModel();
    model.tickets = voidPageItem.voidTicketsMini.checkPermissionTickets;
    model.matchId = voidPageItem.matchModel?.matchId ?? 0;
    model.apikey = 'ticket-voiding-check-void-bet-permission';
    model.action = true;
    model.isCashOutAsUnSettledTicket = StaticService.checkHandlingCashOutAsUnSettledTicketByIssueTypeId(voidPageItem.detailViewModel.request.issueTypeId.toString());
    model.isCheckForTVS = true;
    model.cancelCashOutTickets = voidPageItem.voidTicketsMini.allCancelCashOutTickets;

    return model;
  }
}
