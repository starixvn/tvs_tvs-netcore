import { Injectable } from '@angular/core';
import { PlayerName, RequestDetailViewModel } from 'src/edit-request/app/request.model';
import { TemplateService } from 'src/utility/components/template-message/template-message/services/template.service';
import { TemplateContent, TemplateValue } from 'src/utility/components/template-message/template-message/template.model';
import { EventType, SportType } from 'src/utility/constants/sport.constant';
import { StaticService } from 'src/utility/services/static.service';
import { TicketsModel } from '../../tickets-list/tickets.model';
import { VoidNotParticipateModel } from '../models/void-page-not-participate.model';

@Injectable()
export class TemplateMessageService {
  constructor(
    private readonly templateService: TemplateService
  ) { }

  public getTemplateValue(voidPageItem: VoidNotParticipateModel, requestDetail: RequestDetailViewModel): TemplateValue {
    const templateValue = voidPageItem.matchModel ? this.templateService.initializeTemplateValue(voidPageItem.matchModel) : new TemplateValue();
    templateValue.groupPHAffected = voidPageItem.voidTicketsMini.groupPHAffected;
    templateValue.checkSettled = voidPageItem.voidTicketsMini.isHasSettledTicket;
    templateValue.eventType = voidPageItem.voidTicketsMini.isAllLiveTickets ? EventType.LIVE : null;
    if (StaticService.isNotParticipateNumber(requestDetail.request.issueTypeId)) {
      templateValue.playerName = this.getPlayerName(requestDetail.playerNames[0]);
    }

    if (this.isSpecialBetType(requestDetail.request.issueTypeId)) {
      this.setSpecialBetTypeProperties(templateValue, voidPageItem.voidTicketsMini, requestDetail);
    }

    return templateValue;
  }

  private isSpecialBetType(issueTypeId: number): boolean {
    return StaticService.isLikelyWrongMarketOffered(issueTypeId.toString())
      || StaticService.isWrongOddsSportsBookNumber(issueTypeId);
  }

  private setSpecialBetTypeProperties(templateValue: TemplateValue, voidTicketsMini: TicketsModel, requestDetail: RequestDetailViewModel) {
    templateValue.isCheckedSpecialBetType = true;
    templateValue.betTypeNameReplaceMessage = voidTicketsMini.betTypeNameReplaceMessage;
    templateValue.totalTickets = voidTicketsMini.total;
    templateValue.fromTransTime = voidTicketsMini.fromTime;
    templateValue.toTransTime = voidTicketsMini.toTime;

    if (StaticService.isWrongOddsSportsBookNumber(requestDetail.request.issueTypeId)) {
      templateValue.totalBetTypesSelected = requestDetail.wrongOddsSportsBookModel.betTeamsResult.length;
      templateValue.uniqueBetTypeSelected = templateValue.totalBetTypesSelected === 1 ? requestDetail.wrongOddsSportsBookModel.betTeamsResult[0] : null;
      templateValue.correctOdds = requestDetail.wrongOddsSportsBookModel.correctOdds;
      if (this.isSportTypeSoccer(requestDetail.request.sportType)) {
        templateValue.score = this.getLiveScoreForTemplateMessage(requestDetail.wrongOddsSportsBookModel.logInfoDetail.scoreNormalTicket, requestDetail.wrongOddsSportsBookModel.logInfoDetail.scoreOfMatch);
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

  private isSportTypeSoccer(sportType: number): boolean {
    return sportType === SportType.SOCCER;
  }

  private getLiveScoreForTemplateMessage(scoreNormalTicket: string, scoreOfMatch: string): string {
    return !scoreNormalTicket ? scoreOfMatch : scoreNormalTicket.split('|')[0].replace(/ /g, '');
  }
}