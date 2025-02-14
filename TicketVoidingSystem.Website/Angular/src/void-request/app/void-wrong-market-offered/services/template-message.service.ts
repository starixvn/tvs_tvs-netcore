import { inject, Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { Message } from '../../../../utility/components/template-message/messages/message';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { EventType } from '../../../../utility/constants/sport.constant';
import { VoidWrongMarketOfferedModel } from '../models/void-wrong-market-offered.model';

@Injectable()
export class TemplateMessageService {
  templateService = inject(TemplateService);

  public getTemplateValue(voidPageItem: VoidWrongMarketOfferedModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.groupPHAffected = voidPageItem.voidTicketsMini.groupPHAffected;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.eventType = voidPageItem.voidTicketsMini.isAllLiveTickets ? EventType.LIVE : null;
    templateValue.totalTickets = voidPageItem.voidTicketsMini.total;
    templateValue.fromTransTime = voidPageItem.voidTicketsMini.fromTime;
    templateValue.toTransTime = voidPageItem.voidTicketsMini.toTime;
    this.setSpecialBetTypeProperties(templateValue, voidPageItem.voidTicketsMini.betTypeNameReplaceMessage);

    return templateValue;
  }

  private setSpecialBetTypeProperties(templateValue: TemplateValue, betTypeNameReplaceMessage: Message) {
    templateValue.isCheckedSpecialBetType = true;
    templateValue.betTypeNameReplaceMessage = betTypeNameReplaceMessage;
  }
}