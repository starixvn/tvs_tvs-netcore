import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { WrongHdpModel } from '../../../../add-request/app/add-request/models/event-wrong-hdp.model';
import { WrongOddsSportsBookModel } from '../../../../add-request/app/add-request/models/event-wrong-odds-sports-book.model';
import { WrongOuModel } from '../../../../add-request/app/add-request/models/event-wrong-ou.model';
import { RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { TVSRequestFilterBy } from '../../../../utility/constants/config';
import { EventType } from '../../../../utility/constants/sport.constant';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';
import { VoidMatch } from '../../models/void-match.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateMessageService {

  constructor(private readonly templateService: TemplateService) {
  }

  getTemplateValue(voidMatch: VoidMatch, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = this.templateService.initializeTemplateValue(voidMatch.matchModel);
    templateValue.groupPHAffected = voidMatch.voidTicketsMini.groupPHAffected;
    templateValue.checkSettled = voidMatch.voidTicketsMini.isHasSettledTicket;
    templateValue.fromTransTime = voidMatch.voidTicketsMini.fromTime;
    templateValue.toTransTime = voidMatch.voidTicketsMini.toTime;
    templateValue.totalTickets = voidMatch.voidTicketsMini.total;
    templateValue.isCheckedEarlyEvent = false;
    templateValue.isAllNonLiveTickets = voidMatch.voidTicketsMini.isAllNonLiveTickets;
    const issueTypeId = requestDetail.request.issueTypeId.toString();
    if (StaticService.isDangerAccepted(issueTypeId)) {
      this.initValueForLikelyDangerAccepted(templateValue, voidMatch.logInfoDetail, requestDetail.dangerAcceptedModels[0].filterBy, voidMatch.isCheckedVar);
    } else if (StaticService.isWrongHDP(issueTypeId) || StaticService.isWrong1stHDP(issueTypeId)) {
      this.initValueForWrongHdp(templateValue, voidMatch, requestDetail.wrongHdpModels, issueTypeId);
    } else if (StaticService.isWrongOU(issueTypeId) || StaticService.isWrong1stOU(issueTypeId)) {
      this.initValueForWrongOu(templateValue, voidMatch, requestDetail.wrongOuModels, issueTypeId);
    } else if (StaticService.isRedCard(issueTypeId)) {
      this.initValueForLikelyDangerAccepted(templateValue, voidMatch.logInfoDetail, requestDetail.redCardModels[0].filterBy, voidMatch.isCheckedVar);
    }

    return templateValue;
  }

  private initValueForLikelyDangerAccepted(templateValue: TemplateValue, logInfoDetail: LogInfoDetail, filterBy: number, isCheckedVar = false): void {
    templateValue.eventType = EventType.LIVE;
    templateValue.score = this.getLiveScoreForTemplateMessage(logInfoDetail.scoreNormalTicket, logInfoDetail.scoreOfMatch);
    templateValue.isCheckTime = filterBy === TVSRequestFilterBy.CHECK_TIME;
    templateValue.isCheckedVar = isCheckedVar;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }

  private initValueForWrongHdp(templateValue: TemplateValue, voidMatch: VoidMatch, wrongHdpModels: WrongHdpModel[], issueTypeId: string): void {
    const wrongHdpModel = wrongHdpModels.find(x => x.matchId === voidMatch.matchModel.matchId);
    const Handicap = "1";

    templateValue.eventType = voidMatch.isAllLiveTickets ? EventType.LIVE : null;
    templateValue.score = this.getLiveScoreForTemplateMessage(voidMatch.logInfoDetail.scoreNormalTicket, voidMatch.logInfoDetail.scoreOfMatch);
    templateValue.wrongMarket = wrongHdpModel.homeFavorite ?? wrongHdpModel.awayFavorite;
    templateValue.actualMarket = wrongHdpModel.actualMarket;
    templateValue.hdpValue = wrongHdpModel.hdpValue;
    templateValue.groupPHAffected = voidMatch.voidTicketsMini.groupPHAffected;
    templateValue.isCheckedSpecialBetType = StaticService.isWrongHDP(issueTypeId) && voidMatch.voidTicketsMini.betTypes !== Handicap;
    templateValue.betTypeNameReplaceMessage = voidMatch.voidTicketsMini.betTypeNameReplaceMessage;
  }

  private initValueForWrongOu(templateValue: TemplateValue, voidMatch: VoidMatch, wrongOuModels: WrongOuModel[], issueTypeId: string): void {
    const wrongOuModel = wrongOuModels.find(x => x.matchId === voidMatch.matchModel.matchId);
    const liveScoreList = voidMatch.logInfoDetail.liveScores.split('|');
    const OverUnder = "3";
    templateValue.eventType = voidMatch.isAllLiveTickets ? EventType.LIVE : null;
    templateValue.score = _.first(liveScoreList).replace(/ /g, '');
    templateValue.wrongMarket = wrongOuModel.wrongMarket;
    templateValue.actualMarket = wrongOuModel.actualMarket;
    templateValue.groupPHAffected = voidMatch.voidTicketsMini.groupPHAffected;
    templateValue.isCheckedSpecialBetType = StaticService.isWrongOU(issueTypeId) && voidMatch.voidTicketsMini.betTypes !== OverUnder;
    templateValue.betTypeNameReplaceMessage = voidMatch.voidTicketsMini.betTypeNameReplaceMessage;
  }
}