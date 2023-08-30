import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/template.service';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { EventType } from '../../../../utility/constants/sport.constant';
import { VoidMatch } from '../../models/void-match.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateMessageService {

  constructor(private readonly templateService: TemplateService) {
  }

  getTemplateValue(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = this.templateService.getTemplateValue(voidMatch.matchModel);
    templateValue.kickOffTime = null;
    templateValue.checkSettled = voidMatch.voidTicketsMini.isHasSettledTicket;
    templateValue.fromTransTime = voidMatch.voidTicketsMini.fromTime;
    templateValue.toTransTime = voidMatch.voidTicketsMini.toTime;
    templateValue.totalTickets = voidMatch.voidTicketsMini.total;
    templateValue.isCheckedEarlyEvent = false;
    templateValue.eventType = EventType.LIVE;
    templateValue.eventType = EventType.LIVE;
    templateValue.score = this.getLiveScoreForTemplateMessage(voidMatch.logInfoDetail.scoreNormalTicket, voidMatch.logInfoDetail.scoreOfMatch);
    templateValue.isCheckTime = requestDetail.redCardModels[0].filterBy === TVSRequestFilterBy.CHECK_TIME;
    templateValue.isCheckedVar = voidMatch.isCheckedVar;
  
    return templateValue;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }
}