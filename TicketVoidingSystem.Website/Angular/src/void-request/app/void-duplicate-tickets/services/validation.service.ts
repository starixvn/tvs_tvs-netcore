import { Injectable } from '@angular/core';
import { TemplateMessageComponent } from '../../../../utility/components/template-message/template-message/template-message.component';
import { AbnormalFilterBy } from '../../../../utility/constants/config';
import { LABELS } from '../../../../utility/constants/labels';
import { CheckingPermissionModel } from '../../../../utility/models/checking-permission.model';
import { Result } from '../../../../utility/models/result';
import { CommonService } from '../../../../utility/services/common.service';
import { ResultModelService } from '../../../../utility/services/result-model.service';
import { StaticService } from '../../../../utility/services/static.service';
import { VoidPageDuplicateTicketsModel } from '../models/void-page-duplicate-tickets.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private readonly commonService: CommonService) { }

  public isDuplicateTicketsMixParlay(filterBy: number): boolean {
    return filterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  public checkValidationBeforeVoid(voidPageItem: VoidPageDuplicateTicketsModel, templateMessageComponent: TemplateMessageComponent): Result<null> {
    if (voidPageItem === null || voidPageItem === undefined || voidPageItem.voidTicketsMini.total === 0) {
      return ResultModelService.createFailResult(LABELS.ALL_TICKETS_VOIDED, 1);
    }

    if (!templateMessageComponent) {
      return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${voidPageItem.matchModel.matchId})`, 1);
    }

    if (!templateMessageComponent.checkValidation()) {
      return ResultModelService.createFailResult(`${LABELS.INVALID_TEMPLATE_MESSAGE} (MatchId: ${voidPageItem.matchModel.matchId})`, 1);
    }

    this.mapValidMessageToVoidPageItem(voidPageItem, templateMessageComponent);

    if (!this.isDuplicateTicketsMixParlay(voidPageItem.filterBy) && (voidPageItem.voidReason?.reasonEnglish === '' || voidPageItem.voidReason?.reasonChineseSimplified === '')) {
      return ResultModelService.createFailResult(`${LABELS.INPUT_REASON} (MatchId: ${voidPageItem.matchModel.matchId})`, 1);
    }

    return ResultModelService.createSuccessResult();
  }

  async checkVoidBetPermission(voidPageItem: VoidPageDuplicateTicketsModel): Promise<Result<null>> {
    const checkingPermissionModel = this.getCheckingPermissionModel(voidPageItem);
    const result = await this.commonService.checkVoidBetPermission(checkingPermissionModel);

    if (result.errCode !== 0 && checkingPermissionModel.action) {
      return ResultModelService.createFailResult(result.errMsg, 1);
    }

    return ResultModelService.createSuccessResult();
  }

  private getCheckingPermissionModel(voidPageItem: VoidPageDuplicateTicketsModel): CheckingPermissionModel {
    const model = new CheckingPermissionModel();
    model.tickets = voidPageItem.voidTicketsMini.checkPermissionTickets;
    model.matchId = this.isDuplicateTicketsMixParlay(voidPageItem.filterBy) ? 0 : voidPageItem.matchModel.matchId;
    model.apikey = 'ticket-voiding-check-void-bet-permission';
    model.action = true;
    model.isCashOutAsUnSettledTicket = StaticService.checkHandlingCashOutAsUnSettledTicketByIssueTypeId(voidPageItem.detailViewModel.request.issueTypeId.toString());
    model.isCheckForTVS = true;
    model.cancelCashOutTickets = voidPageItem.voidTicketsMini.allCancelCashOutTickets;

    return model;
  }

  private mapValidMessageToVoidPageItem(voidPageItem: VoidPageDuplicateTicketsModel, templateMessageComponent: TemplateMessageComponent) {
    voidPageItem.templateMessage = templateMessageComponent.message;
  }
}
