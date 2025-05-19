import { inject, Injectable } from '@angular/core';
import { PlayerName, RequestDetailViewModel } from '../../../../edit-request/app/request.model';
import { TemplateService } from '../../../../utility/components/template-message/template-message/services/template.service';
import { TemplateContent, TemplateValue } from '../../../../utility/components/template-message/template-message/template.model';
import { EventType, SportType } from '../../../../utility/constants/sport.constant';
import { LogInfoDetail } from '../../../../utility/models/log-info-detail.model';
import { StaticService } from '../../../../utility/services/static.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';

@Injectable()
export class TemplateMessageService {
  templateService = inject(TemplateService);

  public getTemplateValue(voidPageItem: VoidNotParticipateModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.groupPHAffected = voidPageItem.voidTicketsMini.groupPHAffected;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.eventType = voidPageItem.voidTicketsMini.isAllLiveTickets ? EventType.LIVE : null;
    templateValue.score = this.getScore(requestDetail, voidPageItem.logInfoDetail);
    templateValue.isAllNonLiveTickets = voidPageItem.voidTicketsMini.isAllNonLiveTickets;
    templateValue.totalTickets = voidPageItem.voidTicketsMini.total;
    templateValue.fromTransTime = voidPageItem.voidTicketsMini.fromTime;
    templateValue.toTransTime = voidPageItem.voidTicketsMini.toTime;
    
    if (StaticService.isNotParticipate(requestDetail.request.issueTypeId)) {
      templateValue.playerName = this.getPlayerName(requestDetail.playerNames[0]);
    }

    if (this.isSpecialBetType(requestDetail.request.issueTypeId)) {
      this.setSpecialBetTypeProperties(templateValue, voidPageItem.voidTicketsMini, requestDetail);
    }

    if (StaticService.isOtherIssues(requestDetail.request.issueTypeId)) {
      templateValue.smallestMapTicket = voidPageItem.voidTicketsMini.smallestMapTicket;
    }
    
    if (this.isSportTypeBaseball(requestDetail.request.sportType) && StaticService.isMatchEarlyCompleted(requestDetail.request.issueTypeId)) {
      templateValue.inning = voidPageItem.voidTicketsMini.inning;
    }

    return templateValue;
  }

  private isSpecialBetType(issueTypeId: number): boolean {
    return StaticService.isWrongMarketOffered(issueTypeId)
      || StaticService.isTechnicalError(issueTypeId)
      || StaticService.isWrongOddsSportsBook(issueTypeId)
      || StaticService.isOtherIssues(issueTypeId);
  }

  private setSpecialBetTypeProperties(templateValue: TemplateValue, voidTicketsMini: TicketsModel, requestDetail: RequestDetailViewModel) {
    templateValue.isCheckedSpecialBetType = true;
    templateValue.betTypeNameReplaceMessage = voidTicketsMini.betTypeNameReplaceMessage;

    if (StaticService.isWrongOddsSportsBook(requestDetail.request.issueTypeId)) {
      templateValue.correctOdds = requestDetail.wrongOddsSportsBookModel.correctOdds;
      if (voidTicketsMini.betTypes.split(',').length === 1) {
        templateValue.betTypeId = voidTicketsMini.betTypes.split(',')[0];
        templateValue.betTeam = voidTicketsMini.betTeam;
        templateValue.hdpValues = voidTicketsMini.hdpValues;
        templateValue.groupBetTypeId = voidTicketsMini.groupBetTypeId;
      }
    }
  }

  private getPlayerName(playerName: PlayerName): TemplateContent {
    return {
      msgEnglish: playerName.playerNamesEnglish,
      msgChineseTraditional: playerName.playerNamesChineseTraditional,
      msgChineseSimplified: playerName.playerNamesChineseSimplified,
      msgChineseNewSimplified: playerName.playerNamesChineseSimplified
    } as TemplateContent;
  }

  private getScore(requestDetail: RequestDetailViewModel, logInfoDetail: LogInfoDetail): string {
    if(!this.isSportTypeSoccer(requestDetail.request.sportType)) {
      return '';
    }
    if(StaticService.isMatchEarlyCompleted(requestDetail.request.issueTypeId) || StaticService.isWrongOddsSportsBook(requestDetail.request.issueTypeId)) {
      return this.getLiveScoreForTemplateMessage(logInfoDetail.scoreNormalTicket, logInfoDetail.scoreOfMatch);
    }
    return '';
  }
  

  private isSportTypeSoccer(sportType: number): boolean {
    return sportType === SportType.SOCCER;
  }

  private isSportTypeBaseball(sportType: number): boolean {
    return sportType === SportType.BASEBALL;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }
}