import { inject, Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../utility/components/bet-ids/bet-ids.component";
import { ConfirmationComponent } from "../../../utility/components/confirmation/confirmation.component";
import { TemplateMessageComponent } from "../../../utility/components/template-message/template-message/template-message.component";
import { TEXT } from "../../../utility/constants/text";
import { NumberItemService } from "../../../utility/components/bet-ids/number-item.service";
import { TicketsViewModel } from "../model/get-tickets.query";
import { TicketsService } from "../../../utility/components/tickets/tickets.service";
import { Tooltip } from "../../../utility/components/tooltip/tooltip.model";

@Injectable()
export class ValidationService {
    private readonly numberItemService = inject(NumberItemService);
    private readonly ticketsService = inject(TicketsService);

    highlightInvalidTransIds(betIdsComponent: BetIdsComponent, invalidTransIds: string, movedTransIds: string) {
        this.numberItemService.updateInvalidItems(betIdsComponent?.groupNumber?.items, invalidTransIds, TEXT.INVALID_TICKETS);
        this.numberItemService.updateMoved(betIdsComponent?.groupNumber?.items, movedTransIds);
    }

    checkValidation(ticketsViewModel: TicketsViewModel, messagesComponent: TemplateMessageComponent, confirmationComponent: ConfirmationComponent, tooltip: Tooltip) {
        if (this.ticketsService.getNumberOfCheckedTickets(ticketsViewModel.groups) === 0) {
            tooltip.display('checkbox-dropdown-list', TEXT.EMPTY_TICKET);
            return false;
        }
        if (!messagesComponent.checkValidation() || !confirmationComponent.checkValidation()) {
            return false;
        }

        return true;
    }
}