import { inject, Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../../../../utility/components/bet-ids/bet-ids.component";
import { TEXT } from "../../../../../../utility/constants/text";
import { PermissionAddRequest } from "../../../../../models/permission-add-request.model";
import { AppService } from "../../app.service";
import { CheckTicket14Query } from "../models/check-ticket14.query";
import { CheckTickets14Result } from "../models/check-tickets14-result.model";
import { ValidationBusinessRuleOutput } from "../models/validation.model";
import { NumberItemService } from "../../../../../../utility/components/bet-ids/number-item.service";

@Injectable()
export class ValidationService {
  private readonly eventTicket14ApiService = inject(AppService);
  private readonly numberItemService = inject(NumberItemService);
  
  public async checkBusinessRule(betIdsComponent: BetIdsComponent, permission: PermissionAddRequest): Promise<ValidationBusinessRuleOutput> {
    if (!betIdsComponent.isHasBetId()) {
      return { isValid: false } as ValidationBusinessRuleOutput;
    }

    this.numberItemService.resetAllItemsToValid(betIdsComponent.groupNumber);
    this.numberItemService.checkDuplicatedItems(betIdsComponent.groupNumber.items);
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

    return this.eventTicket14ApiService.checkTickets14(query);
  }

  private highlightInvalidTransIds(validationResult: CheckTickets14Result, betIdsComponent: BetIdsComponent): void {
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, validationResult.invalidTransIds, TEXT.INVALID_TICKETS);
    this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, validationResult.unsupportedDateRangeTransIds, TEXT.INVALID_UNSUPPORTED_DATE_RANGE_TICKETS);
  }
}