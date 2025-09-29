import { inject, Injectable } from "@angular/core";
import { TemplateValue } from "../../../utility/components/template-message/template-message/template.model";
import { MatchModel } from "../../../utility/models/match.model";
import { AbnormalFilterBy } from "../../../utility/constants/config";
import { TicketsViewModel } from "../model/get-tickets.query";
import { TemplateService } from "../../../utility/components/template-message/template-message/services/template.service";
import { MessagesResult } from "../../../utility/components/messages-result/messages-result.model";
import { clone } from "lodash";
import { Result } from "../../../utility/models/result";
import { TicketsService } from "../../../utility/components/tickets/tickets.service";

@Injectable()
export class TemplateMessageService {
  templateService = inject(TemplateService);
  ticketsService = inject(TicketsService);
  
  generateTemplateValue(abnormalBetType: string, matchViewModel:
    MatchModel, ticketsViewModel: TicketsViewModel) {
    let templateValue = new TemplateValue();
    
    if (matchViewModel?.matchId) {
      templateValue = this.templateService.initializeTemplateValue(matchViewModel);
      templateValue.filterBy = Number(abnormalBetType);
      templateValue.isVoidByBetId = true;
    }
    else {
      templateValue.filterBy = abnormalBetType === AbnormalFilterBy.MIX_PARLAY.toString()
        ? AbnormalFilterBy.MIX_PARLAY : AbnormalFilterBy.MANY_MATCH;
    }

    templateValue.totalTickets = ticketsViewModel.totalItems;
    templateValue.checkSettled = this.ticketsService.checkSettledTickets(ticketsViewModel.groups);

    return templateValue;
  }

  updateMessagesResult(messagesResult: MessagesResult, results: Result<null>[]) {
    messagesResult.isShow = true;
    messagesResult.header = 'Void Bet Result';
    messagesResult.results = results;

    return clone(messagesResult);
  }
}