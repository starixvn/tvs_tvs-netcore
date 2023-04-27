import { Injectable } from '@angular/core';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { LABELS } from '../../../../utility/constants/labels';
import { BetID } from '../../../../utility/models/bet-id.model';
import { CheckingPermissionModel } from '../../../../utility/models/checking-permission.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { StaticService } from '../../../../utility/services/static.service';
import { VoidMatch } from '../../models/void-match.model';
import { TicketsModel } from '../../tickets-list/tickets.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private readonly commonService: CommonService) { }

  checkValidationBeforeVoid(matchHasTickets: VoidMatch[], templateMessageComponents: TemplateMessageComponent[]): Result<null> {
    if (matchHasTickets.length === 0) {
      return ResultModelService.createFailResult(LABELS.ALL_TICKETS_VOIDED, 1);
    }

    for (const item of matchHasTickets) {
      const messageComponent = templateMessageComponents.find(x => x.value.matchId === item.matchModel.matchId);
      if (!messageComponent) {
        return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${item.matchModel.matchId})`, 1);
      }

      if (!messageComponent.checkValidation()) {
        return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${item.matchModel.matchId})`, 1);
      }

      this.mapValidMessageToVoidMatch(item, messageComponent);

      if (item.voidReason.reasonEnglish === '' || item.voidReason.reasonChineseSimplified === '') {
        return ResultModelService.createFailResult(`${LABELS.INPUT_REASON} (MatchId: ${item.matchModel.matchId})`, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  async checkVoidBetPermission(matchHasTickets: VoidMatch[], issueTypeId: number): Promise<Result<null>> {
    for (const item of matchHasTickets) {
      const checkingPermissionModel = new CheckingPermissionModel();
      checkingPermissionModel.setParam(this.getTicketsForCheckPermission(item.voidTicketsMini), item.matchModel.matchId,
        'ticket-voiding-check-void-bet-permission', true, StaticService.checkHandlingCashOutAsUnSettledTicketByIssueTypeId(IssueTypeConstant.DANGER_ACCEPTED), true,
        this.getcancelCashOutTicketsForCheckPermission(item.voidTicketsMini));
      checkingPermissionModel.matchId = StaticService.isAbnormalAccount(issueTypeId.toString()) ? 0 : checkingPermissionModel.matchId;

      const result = await this.commonService.checkVoidBetPermission(checkingPermissionModel);
      if (result.errCode !== 0 && checkingPermissionModel.action) {
        return ResultModelService.createFailResult(result.errMsg, 1);
      }
    }

    return ResultModelService.createSuccessResult();
  }

  private getTicketsForCheckPermission(voidTicketsMini: TicketsModel): BetID[] {
    const singleTickets = voidTicketsMini.singleTickets.filter(x => !voidTicketsMini.uncheckedTransIds.includes(x.transId));
    const parlayTickets = voidTicketsMini.parlayTickets.filter(x => !voidTicketsMini.uncheckedTransIds.includes(x.transId));

    return singleTickets.concat(parlayTickets);
  }
  private getcancelCashOutTicketsForCheckPermission(voidTicketsMini: TicketsModel): BetID[] {
    return voidTicketsMini.cancelCashOutTickets.filter(x => !voidTicketsMini.uncheckedTransIds.includes(x.transId));
  }

  private mapValidMessageToVoidMatch(voidMatch: VoidMatch, templateMessageComponent: TemplateMessageComponent) {
    voidMatch.templateMessage = templateMessageComponent.message;
  }
}
