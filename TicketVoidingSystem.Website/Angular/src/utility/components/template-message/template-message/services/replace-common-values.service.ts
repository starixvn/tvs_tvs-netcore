import { Injectable, inject } from '@angular/core';
import moment from 'moment';
import { Message } from '../../messages/message';
import { FormatDateTime, TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable({
  providedIn: 'root'
})
export class ReplaceCommonValuesService {
  replaceMessageService = inject(ReplaceMessageService);

  public replaceSportType(templateValue: TemplateValue, outputMessage: Message): void {
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.SPORT_TYPE, templateValue.sportType);
  }

  public replaceHomeTeamName(templateValue: TemplateValue, outputMessage: Message): void {
   this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.HOME_TEAM_NAME, templateValue.homeTeamName);
  }

  public replaceAwayTeamName(templateValue: TemplateValue, outputMessage: Message): void {
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.AWAY_TEAM_NAME, templateValue.awayTeamName);
  }

  public replaceLeagueName(templateValue: TemplateValue, outputMessage: Message): void {
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.LEAGUE_NAME, templateValue.leagueName);
  }

  public replacePlayerName(templateValue: TemplateValue, outputMessage: Message): void {
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.PLAYER_NAME, templateValue.playerName);
  }

  public replaceEventDate(templateValue: TemplateValue, outputMessage: Message): void {
    let kickOffTimeDateGMT8 = new Date(templateValue.match?.kickOffTime);
    kickOffTimeDateGMT8.setHours(kickOffTimeDateGMT8.getHours() - 12);
    let eventDate = moment(kickOffTimeDateGMT8).format(FormatDateTime.EVENT_DATE);
    this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.EVENT_DATE, eventDate);
  }

  public replaceKickOffTime(templateValue: TemplateValue, outputMessage: Message): void {
    const dateKickOffTime = new Date(templateValue?.kickOffTime);
    const kickOffTime = moment(dateKickOffTime.setSeconds(dateKickOffTime.getSeconds() - 1)).format(FormatDateTime.DATE_TIME);
    const replacedContent: TemplateContent = {
      msgEnglish: `${kickOffTime} ${TemplateContentConst.GMT_8.msgEnglish}`,
      msgChineseTraditional: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseTraditional}`,
      msgChineseSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseSimplified}`,
      msgChineseNewSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseNewSimplified}`
    };
    
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.KO_TIME, replacedContent);
  }

  public replaceParlay(isAbnormalBetParlay: boolean, outputMessage: Message): void {
    if (isAbnormalBetParlay) {
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.PARLAY, TemplateContentConst.PARLAY);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.PARLAY, '');
    }
  }

  public replaceCheckStatement(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.checkSettled) {
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.CHECK_STATEMENT, TemplateContentConst.CHECK_STATEMENT);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.CHECK_STATEMENT, '');
    }
  }

  public replaceMap(templateValue: TemplateValue, outputMessage: Message): void {
    this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.MAP, templateValue.smallestMapTicket ? `${templateValue.smallestMapTicket} ` : '');
  }
}