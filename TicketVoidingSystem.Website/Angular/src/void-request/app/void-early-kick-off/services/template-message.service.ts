import { inject, Injectable } from '@angular/core';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { StaticService } from '../../../../utility/services/static.service';
import { VoidPageEarlyKickOffModel } from '../models/void-page-early-kick-off.model';

@Injectable()
export class TemplateMessageService {
  private readonly templateService = inject(TemplateService);

  public getTemplateValue(voidPageItem: VoidPageEarlyKickOffModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    if (StaticService.isEarlyKickOff(requestDetail.request.issueTypeId) || StaticService.isWrongKickOff(requestDetail.request.issueTypeId)) {
      templateValue.kickOffTime = requestDetail.earlyKickOffModels.find(x => x.matchId === voidPageItem.matchModel.matchId).kickOffTime;
    } else if (StaticService.isWrongOfferedName(requestDetail.request.issueTypeId)) {
      templateValue.wrongName = requestDetail.wrongOfferedNameModel.wrongName;
      templateValue.actualName = requestDetail.wrongOfferedNameModel.actualName;
      templateValue.wrongNameT = requestDetail.wrongOfferedNameModel.wrongNameT;
      templateValue.actualNameT = requestDetail.wrongOfferedNameModel.actualNameT;
      templateValue.wrongNameS = requestDetail.wrongOfferedNameModel.wrongNameS;
      templateValue.actualNameS = requestDetail.wrongOfferedNameModel.actualNameS;
    }

    return templateValue;
  }
}