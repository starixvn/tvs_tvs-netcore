import { Injectable } from '@angular/core';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { LABELS } from '../../../../utility/constants/labels';
import { CheckingPermissionModel } from '../../../../utility/models/checking-permission.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private readonly commonService: CommonService) { }

  checkValidationBeforeVoid(matchHasTickets: VoidPageEarlyKickOffModel[], templateMessageComponents: TemplateMessageComponent[]): Result<null> {
    if (matchHasTickets.length === 0) {
      return ResultModelService.createFailResult(LABELS.ALL_TICKETS_VOIDED, 1);
    }

    for (const item of matchHasTickets) {
      const messageComponent = templateMessageComponents.find(x => x.value.matchId === item.matchModel.matchId);
      if (!messageComponent || !messageComponent.checkValidation()) {
        return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${item.matchModel.matchId})`, 1);
      }

      this.mapValidMessageToVoidMatch(item, messageComponent);

      if (item.voidReason.reasonEnglish === '' || item.voidReason.reasonChineseSimplified === '') {
        return ResultModelService.createFailResult(`${LABELS.INPUT_REASON} (MatchId: ${item.matchModel.matchId})`, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  async checkVoidBetPermission(matchHasTickets: VoidPageEarlyKickOffModel[]): Promise<Result<null>> {
    for (const item of matchHasTickets) {
      const checkingPermissionModel = new CheckingPermissionModel();
      const ticketsForChecks = item.voidTicketsMini.checkPermissionTickets;
      checkingPermissionModel.setParam(ticketsForChecks, item.matchModel.matchId,
        'ticket-voiding-check-void-bet-permission', true, true, true,
        item.voidTicketsMini.allCancelCashOutTickets);
      const result = await this.commonService.checkVoidBetPermission(checkingPermissionModel);

      if (result.errCode !== 0 && checkingPermissionModel.action) {
        return ResultModelService.createFailResult(result.errMsg, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private mapValidMessageToVoidMatch(voidMatch: VoidPageEarlyKickOffModel, templateMessageComponent: TemplateMessageComponent) {
    voidMatch.templateMessage = templateMessageComponent.message;
  }
}
