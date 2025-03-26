import { inject, Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../../../utility/components/bet-ids/bet-ids.component";
import { LABELS } from "../../../../../utility/constants/labels";
import { AddRequestApiService } from "../../add-request-api.service";
import { FilterModel } from "../../filter/filter.model";
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { RecoverTicketModel } from "../../models/recover-ticket.model";
import { CheckRecoverTicketResult } from "../models/check-recover-ticket-result.model";
import { CheckRecoverTicketQuery } from "../models/check-recover-ticket.query";
import { ValidationBusinessRuleOutput } from "../models/validation.model";

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public async checkBusinessRule(betIdsComponent: BetIdsComponent, recoverTicketModel: RecoverTicketModel,
    filter: FilterModel, requestId: number, permission: PermissionAddRequest): Promise<ValidationBusinessRuleOutput> {
    if (!betIdsComponent.isHasBetId()) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    betIdsComponent.groupNumber.resetAllItemsToValid();
    betIdsComponent.groupNumber.checkDuplicatedItems();
    const validationResult = await this.checkRecoverTicket(betIdsComponent, recoverTicketModel, filter, requestId, permission);
    if (validationResult === null) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    this.highlightInvalidTransIds(validationResult, betIdsComponent);
    return {
      isValid: betIdsComponent.isAllBetIdsValid(),
      transInfoJson: validationResult.transInfoJson,
      unMarkTransIds: validationResult.unMarkTransIds
     } as ValidationBusinessRuleOutput;
  }

  private async checkRecoverTicket(betIdsComponent: BetIdsComponent, recoverTicketModel: RecoverTicketModel,
    filter: FilterModel, requestId: number, permission: PermissionAddRequest): Promise<CheckRecoverTicketResult>{
    const query: CheckRecoverTicketQuery = {
      requestId: requestId,
      transIds: betIdsComponent.getAllBetIds(),
      filterBy: recoverTicketModel.filterBy,
      productIds: recoverTicketModel.productIds,
      subIssueTypeId: Number(filter.subIssueTypeId),
      isVoidAllArchivedTickets: permission.isVoidAllArchivedTickets
    };

    return this.addRequestApiService.checkRecoverTicket(query);
  }

  private highlightInvalidTransIds(validationResult: CheckRecoverTicketResult, betIdsComponent: BetIdsComponent): void {
    if (validationResult.existingReqTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(validationResult.existingReqTransIds, LABELS.INVALID_EXISTING_ON_OTHER_REQUEST);
    }

    if (validationResult.invalidTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(validationResult.invalidTransIds, LABELS.INVALID_TICKETS);
    }

    if (validationResult.unsupportedDateRangeTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateMoved(validationResult.unsupportedDateRangeTransIds);
    }
  }
}