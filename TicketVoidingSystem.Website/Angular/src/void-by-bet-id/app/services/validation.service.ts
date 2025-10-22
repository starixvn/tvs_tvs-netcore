import { inject, Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../utility/components/bet-ids/bet-ids.component";
import { ConfirmationComponent } from "../../../utility/components/confirmation/confirmation.component";
import { TemplateMessageComponent } from "../../../utility/components/template-message/template-message/template-message.component";
import { TEXT } from "../../../utility/constants/text";
import { NumberItemService } from "../../../utility/components/bet-ids/number-item.service";

@Injectable()
export class ValidationService {
    private readonly numberItemService = inject(NumberItemService);

    highlightInvalidTransIds(betIdsComponent: BetIdsComponent, invalidTransIds: string, movedTransIds: string) {
        this.numberItemService.updateInvalidItems(betIdsComponent.groupNumber.items, invalidTransIds, TEXT.INVALID_TICKETS);
        this.numberItemService.updateMoved(betIdsComponent.groupNumber.items, movedTransIds);
    }

    checkValidation(messagesComponent: TemplateMessageComponent, confirmationComponent: ConfirmationComponent) {
        if (!messagesComponent.checkValidation() || !confirmationComponent.checkValidation()) {
            return false;
        }

        return true;
    }
}