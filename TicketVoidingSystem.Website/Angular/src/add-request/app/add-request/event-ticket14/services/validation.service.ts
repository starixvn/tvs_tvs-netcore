import { inject, Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../../../utility/components/bet-ids/bet-ids.component";
import { LABELS } from "../../../../../utility/constants/labels";
import { AddRequestApiService } from "../../add-request-api.service";
import { PermissionAddRequest } from "../../models/permission-add-request.model";
import { CheckTicket14Query } from "../models/check-ticket14.query";
import { CheckTickets14Result } from "../models/check-tickets14-result.model";
import { ValidationBusinessRuleOutput } from "../models/validation.model";

@Injectable()
export class ValidationService {
  private readonly addRequestApiService = inject(AddRequestApiService);

  public async checkBusinessRule(betIdsComponent: BetIdsComponent, issueTypeId: string, permission: PermissionAddRequest): Promise<ValidationBusinessRuleOutput> {
    if (!betIdsComponent.isHasBetId()) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    betIdsComponent.groupNumber.resetAllItemsToValid();
    betIdsComponent.groupNumber.checkDuplicatedItems();
    const validationResult = await this.checkTickets14(betIdsComponent, permission);
    if (validationResult === null) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    this.highlightInvalidTransIds(validationResult, betIdsComponent);
    return {
      isValid: betIdsComponent.isAllBetIdsValid(),
      transInfoJson: validationResult.transInfoJson
     } as ValidationBusinessRuleOutput;
  }

  private async checkTickets14(betIdsComponent: BetIdsComponent, permission: PermissionAddRequest): Promise<CheckTickets14Result>{
    const query: CheckTicket14Query = {
      transIds: betIdsComponent.getAllBetIds(),
      isVoidAllArchivedTickets: permission.isVoidAllArchivedTickets
    };

    return this.addRequestApiService.checkTickets14(query);
  }

  private highlightInvalidTransIds(validationResult: CheckTickets14Result, betIdsComponent: BetIdsComponent): void {
    if (validationResult.invalidTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(validationResult.invalidTransIds, LABELS.INVALID_TICKETS);
    }
    if (validationResult.unsupportedDateRangeTransIds?.length > 0) {
      betIdsComponent.groupNumber.updateInvalidItems(validationResult.unsupportedDateRangeTransIds, LABELS.INVALID_UNSUPPORTED_DATE_RANGE_TICKETS);
    }
  }
}