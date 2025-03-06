import { inject, Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { VoidArchivedTicketModel } from '../models/void-archived-ticket.model';

@Injectable()
export class TemplateMessageService {
  templateService = inject(TemplateService);

  public getTemplateValue(voidPageItem: VoidArchivedTicketModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = new TemplateValue();
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;

    return templateValue;
  }
}