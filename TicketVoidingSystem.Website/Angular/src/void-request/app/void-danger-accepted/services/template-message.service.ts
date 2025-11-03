import { inject, Injectable } from '@angular/core';
import first from 'lodash/first';
import { WrongHdpModel } from '../../../../add-request-new/models/event-wrong-hdp.model';
import { WrongOuModel } from '../../../../add-request-new/models/event-wrong-ou.model';
import { RequestDetailViewModel } from '../../../../add-request-new/models/request-detail.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { SubIssueTypeGroup, TVSRequestFilterBy } from '../../../../utility/constants/config';
import { EventType } from '../../../../utility/constants/sport.constant';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';
import { VoidMatch } from '../../models/void-match.model';

@Injectable()
export class TemplateMessageService {
  templateService = inject(TemplateService);

  private initValueForWrongScore(templateValue: TemplateValue, voidMatch: VoidMatch): void {
    const score = (voidMatch.filterBy === TVSRequestFilterBy.TRANS_TIME || voidMatch.filterBy === TVSRequestFilterBy.TRANS_TIME_AND_CHECK_TIME)
      ? voidMatch.wrongScore
      : this.getLiveScoreForTemplateMessage(voidMatch.logInfoDetail.scoreNormalTicket, voidMatch.logInfoDetail.scoreOfMatch);

    if (SubIssueTypeGroup.SUBTYPE_NO_ONWARDS.includes(voidMatch.subIssueTypeId)) {
      templateValue.score = score;
    } else {
      templateValue.wrongScore = score;
    }

    templateValue.filterBy = voidMatch.filterBy;
    templateValue.actualScore = voidMatch.actualScore;
    templateValue.eventType = EventType.LIVE;
    templateValue.isCheckedVar = voidMatch.isCheckedVar;
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
    } else if (StaticService.isWrongOdds(issueTypeId)) {
      this.initValueForWrongOdds(templateValue, voidMatch);
    } else if (StaticService.isWrongScore(issueTypeId)) {
      this.initValueForWrongScore(templateValue, voidMatch);
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
    templateValue.wrongMarket = (wrongHdpModel.homeFavorite ?? wrongHdpModel.awayFavorite)?.replace(/&/g, ', ');
    templateValue.actualMarket = wrongHdpModel.actualMarket?.replace(/&/g, ', ');
    templateValue.hdpValue = wrongHdpModel.hdpValue?.replace(/&/g, ', ');
    templateValue.groupPHAffected = voidMatch.voidTicketsMini.groupPHAffected;
    templateValue.isCheckedSpecialBetType = StaticService.isWrongHDP(issueTypeId) && voidMatch.voidTicketsMini.betTypes !== Handicap;
    templateValue.betTypeNameReplaceMessage = voidMatch.voidTicketsMini.betTypeNameReplaceMessage;
  }

  private initValueForWrongOu(templateValue: TemplateValue, voidMatch: VoidMatch, wrongOuModels: WrongOuModel[], issueTypeId: string): void {
    const wrongOuModel = wrongOuModels.find(x => x.matchId === voidMatch.matchModel.matchId);
    const liveScoreList = voidMatch.logInfoDetail.liveScores.split('|');
    const OverUnder = "3";
    templateValue.eventType = voidMatch.isAllLiveTickets ? EventType.LIVE : null;
    templateValue.score = first(liveScoreList).replace(/ /g, '');
    templateValue.wrongMarket = wrongOuModel.wrongMarket.replace(/&/g, ', ');
    templateValue.actualMarket = wrongOuModel.actualMarket.replace(/&/g, ', ');
    templateValue.groupPHAffected = voidMatch.voidTicketsMini.groupPHAffected;
    templateValue.isCheckedSpecialBetType = StaticService.isWrongOU(issueTypeId) && voidMatch.voidTicketsMini.betTypes !== OverUnder;
    templateValue.betTypeNameReplaceMessage = voidMatch.voidTicketsMini.betTypeNameReplaceMessage;
  }

  private initValueForWrongOdds(templateValue: TemplateValue, voidMatch: VoidMatch): void {
    templateValue.filterFavoriteType = voidMatch.filterFavoriteType;
    templateValue.favoriteValue = voidMatch.favoriteValue;
    templateValue.wrongOU = voidMatch.wrongOU;
    templateValue.correctOddsHomeOver = voidMatch.correctOddsHomeOver;
    templateValue.correctOddsAwayUnder = voidMatch.correctOddsAwayUnder;
    templateValue.score = this.getLiveScoreForTemplateMessage(voidMatch.logInfoDetail.scoreNormalTicket, voidMatch.logInfoDetail.scoreOfMatch);
    templateValue.eventType = voidMatch.isAllLiveTickets ? EventType.LIVE : null;
  }
}