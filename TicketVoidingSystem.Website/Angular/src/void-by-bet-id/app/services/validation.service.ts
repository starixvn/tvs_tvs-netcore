import { Injectable } from "@angular/core";
import { BetIdsComponent } from "../../../utility/components/bet-ids/bet-ids.component";
import { ConfirmationComponent } from "../../../utility/components/confirmation/confirmation.component";
import { TemplateMessageComponent } from "../../../utility/components/template-message/template-message/template-message.component";
import { LABELS } from "../../../utility/constants/labels";

@Injectable()
export class ValidationService {
    highlightInvalidTransIds(betIdsComponent: BetIdsComponent, invalidTransIds: string, movedTransIds: string) {
        betIdsComponent.groupNumber.updateInvalidItems(invalidTransIds, LABELS.INVALID_TICKETS);
        betIdsComponent.groupNumber.updateMoved(movedTransIds);
    }

    checkValidation(messagesComponent: TemplateMessageComponent, confirmationComponent: ConfirmationComponent) {
        if (!messagesComponent.checkValidation() || !confirmationComponent.checkValidation()) {
            return false;
        }

        return true;
    }
}