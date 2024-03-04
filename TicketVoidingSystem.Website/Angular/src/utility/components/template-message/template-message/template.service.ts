import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { EventType } from '../../../../utility/constants/sport.constant';
import { SubIssueTypeConstant } from '../../../../utility/constants/sub-issue-type.constant';
import { MatchModel } from '../../../../utility/models/match.model';
import { Message } from './../messages/message';
import { Format, MessageTemplateId, TemplateContentConst, TemplateReplace } from './template.const';
import { TemplateContent, TemplateValue } from './template.model';

const NUMBER_FIVE = 5;
const MESSAGE_TEMPLATE_IDS_HAVE_TIME_RANGE_NC = [
  MessageTemplateId.NEXT_CORNER,
  MessageTemplateId.MATCH_COMPLETED,
  MessageTemplateId.NEXT_GOAL_KICK,
  MessageTemplateId.NEXT_BOOKING,
  MessageTemplateId.NEXT_GOAL,
  MessageTemplateId.PENALTY_SHOOTOUT,
  MessageTemplateId.PENALTY_SHOOTOUT_VIRTUAL
];

@Injectable()
export class TemplateService {
  constructor() { }

  getTemplateValue(match: MatchModel): TemplateValue {
    return {
      sportType: {
        msgEnglish: match.sportTypeName,
        msgChineseTraditional: match.sportTypeNameTraditional,
        msgChineseSimplified: match.sportTypeNameSimplified,
        msgChineseNewSimplified: match.sportTypeNameNewSimplified
      },
      homeTeamName: {
        msgEnglish: match.homeName,
        msgChineseTraditional: match.homeNameTraditional,
        msgChineseSimplified: match.homeNameSimplified,
        msgChineseNewSimplified: match.homeNameNewSimplified
      },
      awayTeamName: {
        msgEnglish: match.awayName,
        msgChineseTraditional: match.awayNameTraditional,
        msgChineseSimplified: match.awayNameSimplified,
        msgChineseNewSimplified: match.awayNameNewSimplified
      },
      leagueName: {
        msgEnglish: match.leagueName,
        msgChineseTraditional: match.leagueNameTraditional,
        msgChineseSimplified: match.leagueNameSimplified,
        msgChineseNewSimplified: match.leagueNameNewSimplified
      },
      eventDate: moment(new Date(match.eventDate)).format(Format.EVENT_DATE),
      sportTypeId: match.sportType,
      matchId: match.matchId,
      match: match,
      groupPHAffected: 0
    };
  }

  replaceEachLanguage(message: Message, destination: string, value: TemplateContent) {
    if (!_.isNil(value)) {
      message.contentEnglish = _.isNil(message.contentEnglish) ? '' :
        message.contentEnglish.replace(new RegExp(destination, 'g'), value.msgEnglish);
      message.contentChineseTraditional = _.isNil(message.contentChineseTraditional) ? '' :
        message.contentChineseTraditional.replace(new RegExp(destination, 'g'), value.msgChineseTraditional);
      message.contentChineseSimplified = _.isNil(message.contentChineseSimplified) ? '' :
        message.contentChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseSimplified);
      message.contentNewChineseSimplified = _.isNil(message.contentNewChineseSimplified) ? '' :
        message.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value.msgChineseNewSimplified);
    }
  }

  replaceAll(message: Message, destination: string, value: string) {
    if (!_.isNil(value)) {
      message.contentEnglish = _.isNil(message.contentEnglish) ? '' :
        message.contentEnglish.replace(new RegExp(destination, 'g'), value);
      message.contentChineseTraditional = _.isNil(message.contentChineseTraditional) ? '' :
        message.contentChineseTraditional.replace(new RegExp(destination, 'g'), value);
      message.contentChineseSimplified = _.isNil(message.contentChineseSimplified) ? '' :
        message.contentChineseSimplified.replace(new RegExp(destination, 'g'), value);
      message.contentNewChineseSimplified = _.isNil(message.contentNewChineseSimplified) ? '' :
        message.contentNewChineseSimplified.replace(new RegExp(destination, 'g'), value);
    }
  }

  replaceEventDate(message: Message, value: string) {
    let kickOffTimeDateGMT8 = new Date(value);
    kickOffTimeDateGMT8.setHours(kickOffTimeDateGMT8.getHours() - 12);
    let eventDate = moment(kickOffTimeDateGMT8).format(Format.EVENT_DATE);
    this.replaceAll(message, TemplateReplace.EVENT_DATE, eventDate);
  }

  replaceKickOffTime(message: Message, time: string) {
    const dateKickOffTime = new Date(time);
    const kickOffTime = moment(dateKickOffTime.setSeconds(dateKickOffTime.getSeconds() - 1)).format(TemplateContentConst.DATE_TIME);
    const replacedContent: TemplateContent = {
      msgEnglish: `${kickOffTime} ${TemplateContentConst.GMT_8.msgEnglish}`,
      msgChineseTraditional: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseTraditional}`,
      msgChineseSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseSimplified}`,
      msgChineseNewSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseNewSimplified}`
    };
    this.replaceEachLanguage(message, TemplateReplace.KO_TIME, replacedContent);
  }

  replaceTime(message: Message, value: TemplateValue, messageTemplateId: number) {
    const isTheSameDay = moment(new Date(value.fromTransTime)).format('DD/MM') === moment(new Date(value.toTransTime)).format('DD/MM');
    const fromTime = moment(new Date(value.fromTransTime)).format(TemplateContentConst.DATE_TIME);
    const toTime = isTheSameDay ?
      moment(new Date(value.toTransTime)).format('h:mm:ss A')
      : moment(new Date(value.toTransTime)).format(TemplateContentConst.DATE_TIME);

    const timeRange = `${fromTime} - ${toTime} `;
    this.replacePlacedFromTimeRange(message, value, timeRange, messageTemplateId);
    this.replaceFromTimeRange(message, value, timeRange);
  }

  private replacePlacedFromTimeRange(message: Message, value: TemplateValue, timeRange: string,
    messageTemplateId: number) {
    const isTemplateHaveTimeRangeNC = MESSAGE_TEMPLATE_IDS_HAVE_TIME_RANGE_NC.indexOf(messageTemplateId) > -1;

    if (value.totalTickets > NUMBER_FIVE) {
      const replacedContent: TemplateContent = {
        msgEnglish: `${TemplateContentConst.PLACED_FROM.msgEnglish} ${timeRange}${TemplateContentConst.GMT_8.msgEnglish} `,
        msgChineseTraditional:
          `${TemplateContentConst.PLACED_FROM.msgChineseTraditional} ${timeRange}${TemplateContentConst.GMT_8.msgChineseTraditional} `,
        msgChineseSimplified:
          `${TemplateContentConst.PLACED_FROM.msgChineseSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseSimplified} `,
        msgChineseNewSimplified:
          `${TemplateContentConst.PLACED_FROM.msgChineseNewSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseNewSimplified} `
      };

      const destination = isTemplateHaveTimeRangeNC ? TemplateReplace.PLACED_FROM_TIME_RANGE_NC : TemplateReplace.PLACED_FROM_TIME_RANGE;
      this.replaceEachLanguage(message, destination, replacedContent);
    } else {
      if (isTemplateHaveTimeRangeNC) {
        this.replaceAll(message, TemplateReplace.PLACED_FROM_TIME_RANGE_NC, '');
      } else {
        if (value.totalTickets <= 5 && value.eventType === EventType.LIVE) {
          this.replaceEachLanguage(message, TemplateReplace.PLACED_FROM_TIME_RANGE, TemplateContentConst.PLACED_AT);
        } else {
          this.replaceAll(message, TemplateReplace.PLACED_FROM_TIME_RANGE, '');
        }
      }
    }
  }

  private replaceFromTimeRange(message: Message, value: TemplateValue, timeRange: string) {
    if (value.totalTickets > NUMBER_FIVE) {
      const replacedContent: TemplateContent = {
        msgEnglish: `${TemplateContentConst.FROM.msgEnglish} ${timeRange}${TemplateContentConst.GMT_8.msgEnglish} `,
        msgChineseTraditional:
          `${TemplateContentConst.FROM.msgChineseTraditional} ${timeRange}${TemplateContentConst.GMT_8.msgChineseTraditional} `,
        msgChineseSimplified:
          `${TemplateContentConst.FROM.msgChineseSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseSimplified} `,
        msgChineseNewSimplified:
          `${TemplateContentConst.FROM.msgChineseNewSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseNewSimplified} `
      };
      this.replaceEachLanguage(message, TemplateReplace.FROM_TIME_RANGE, replacedContent);
    } else {
      this.replaceAll(message, TemplateReplace.FROM_TIME_RANGE, '');
    }
  }

  replaceScoreOfWrongMarketOffered(message: Message, score: string, isOnwardsSubtype: boolean) {
    const replacedContent: TemplateContent = {
      msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
      msgChineseTraditional:
        `(${TemplateContentConst.SCORE.msgChineseTraditional} ${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
      msgChineseSimplified:
        `(${TemplateContentConst.SCORE.msgChineseSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
      msgChineseNewSimplified:
        `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
    };
    if (!isOnwardsSubtype) {
      replacedContent.msgEnglish = replacedContent.msgEnglish.replace(' ' + TemplateContentConst.ONWARDS.msgEnglish, '');
      replacedContent.msgChineseTraditional =
        replacedContent.msgChineseTraditional.replace(' ' + TemplateContentConst.ONWARDS.msgChineseTraditional, '');
      replacedContent.msgChineseSimplified =
        replacedContent.msgChineseSimplified.replace(' ' + TemplateContentConst.ONWARDS.msgChineseSimplified, '');
      replacedContent.msgChineseNewSimplified =
        replacedContent.msgChineseNewSimplified.replace(' ' + TemplateContentConst.ONWARDS.msgChineseNewSimplified, '');
    }
    this.replaceEachLanguage(message, TemplateReplace.SCORE, replacedContent);
  }

  replaceWrongScoreOfWrongScoreIssueType(message: Message, score: string) {
    if (score?.length > 0) {
      const replacedContent: TemplateContent = {
        msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
        msgChineseTraditional:
          `(${TemplateContentConst.SCORE.msgChineseTraditional} ${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
        msgChineseSimplified:
          `(${TemplateContentConst.SCORE.msgChineseSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
        msgChineseNewSimplified:
          `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
      };

      this.replaceEachLanguage(message, TemplateReplace.WRONG_SCORE_ONWARDS, replacedContent);
    } else {
      this.replaceAll(message, TemplateReplace.WRONG_SCORE_ONWARDS, '');
    }
  }

  replaceActualScoreOfWrongScoreIssueType(message: Message, score: string) {
    if (score?.length > 0) {
      const replacedContent: TemplateContent = {
        msgEnglish: `${score} ${TemplateContentConst.ONWARDS.msgEnglish}`,
        msgChineseTraditional: `${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}`,
        msgChineseSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}`,
        msgChineseNewSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}`
      };

      this.replaceEachLanguage(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, replacedContent);
    } else {
      this.replaceAll(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, '');
    }
  }

  replaceAOIMessage(message: Message, groupPHAffected: number) {
    const replacedContent = this.getAioMessageTemplate(groupPHAffected)
    this.replaceEachLanguage(message, TemplateReplace.AOI_MESSAGE, replacedContent);
  }

  getAioMessageTemplate(groupPHAffected: number) {
    if (groupPHAffected === 1) {
      return {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2.msgChineseNewSimplified}`
      } as TemplateContent;
    }

    if (groupPHAffected === 3) {
      return {
        msgEnglish: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_1X2_AIO.msgChineseNewSimplified}`
      } as TemplateContent;
    }

    return {
      msgEnglish: `${TemplateContentConst.AIO_MESSAGE_AIO.msgEnglish}`,
        msgChineseTraditional: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseTraditional}`,
        msgChineseSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseSimplified}`,
        msgChineseNewSimplified: `${TemplateContentConst.AIO_MESSAGE_AIO.msgChineseNewSimplified}`
    } as TemplateContent;
  }

  replaceSpecialBetType(message: Message, betTypeNameReplaceMessage: Message) {
    const replacedContent: TemplateContent = {
      msgEnglish: `"${betTypeNameReplaceMessage.contentEnglish}" `,
      msgChineseTraditional: `"${betTypeNameReplaceMessage.contentChineseTraditional}" `,
      msgChineseSimplified: `"${betTypeNameReplaceMessage.contentChineseSimplified}" `,
      msgChineseNewSimplified: `"${betTypeNameReplaceMessage.contentNewChineseSimplified}" `
    };

    this.replaceEachLanguage(message, TemplateReplace.SPECIAL_BET_TYPE, replacedContent);
  }

  replaceActualMarketTvsWrongOdds(message: Message, subIssueTypeId: number, templateValue: TemplateValue) {
    if (subIssueTypeId === SubIssueTypeConstant.HANDICAP || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP) {
      this.replaceActualMarketSubTypeHdp(message, subIssueTypeId, templateValue);
    } else if (subIssueTypeId === SubIssueTypeConstant.OVER_UNDER || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER) {
      this.replaceActualMarketSubTypeOu(message, subIssueTypeId, templateValue);
    }
  }

  private replaceActualMarketSubTypeHdp(message: Message, subIssueTypeId: number, templateValue: TemplateValue) {
    const prfixSubType = this.getPrefixSubType(subIssueTypeId);
    const replacedContent: TemplateContent = {
      msgEnglish: `${prfixSubType.msgEnglish}${this.getTeamName(templateValue)}@${TemplateContentConst.ODDS.msgEnglish} ${templateValue.correctOdds}`,
      msgChineseTraditional: `${prfixSubType.msgChineseTraditional}${this.getTeamNameTraditional(templateValue)}@${TemplateContentConst.ODDS.msgChineseTraditional} ${templateValue.correctOdds}`,
      msgChineseSimplified: `${prfixSubType.msgChineseSimplified}${this.getTeamNameSimplified(templateValue)}@${TemplateContentConst.ODDS.msgChineseSimplified} ${templateValue.correctOdds}`,
      msgChineseNewSimplified: `${prfixSubType.msgChineseNewSimplified}${this.getTeamNameNewSimplified(templateValue)}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${templateValue.correctOdds}`
    };

    this.replaceEachLanguage(message, TemplateReplace.ACTUAL_MARKET, replacedContent);
  }

  private replaceActualMarketSubTypeOu(message: Message, subIssueTypeId: number, templateValue: TemplateValue) {
    const prefixSubType = this.getPrefixSubType(subIssueTypeId);
    const replacedContent: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${this.getOuType(templateValue)}-${templateValue.ouValue}@${TemplateContentConst.ODDS.msgEnglish} ${templateValue.correctOdds}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${this.getOuTypeTraditional(templateValue)}-${templateValue.ouValue}@${TemplateContentConst.ODDS.msgChineseTraditional} ${templateValue.correctOdds}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${this.getOuTypeSimplified(templateValue)}${templateValue.ouValue}@${TemplateContentConst.ODDS.msgChineseSimplified} ${templateValue.correctOdds}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${this.getOuTypeNewSimplified(templateValue)}-${templateValue.ouValue}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${templateValue.correctOdds}`
    };

    this.replaceEachLanguage(message, TemplateReplace.ACTUAL_MARKET, replacedContent);
  }

  private getPrefixSubType(subIssueTypeId: number): TemplateContent {
    const isSubTypeFirstHalf = subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER;
    const prfixSubType: TemplateContent = {
      msgEnglish: `${isSubTypeFirstHalf ? TemplateContentConst.FIRST_HALF.msgEnglish : ''}`,
      msgChineseTraditional: `${isSubTypeFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseTraditional : ''}`,
      msgChineseSimplified: `${isSubTypeFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseSimplified : ''}`,
      msgChineseNewSimplified: `${isSubTypeFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseNewSimplified : ''}`,
    }

    return prfixSubType;
  }

  private getTeamName(templateValue: TemplateValue): string {
    return templateValue.betTeam === 'h' ? templateValue.match?.homeName : templateValue.match?.awayName;
  }

  private getTeamNameTraditional(templateValue: TemplateValue): string {
    return templateValue.betTeam === 'h' ? templateValue.match?.homeNameTraditional : templateValue.match?.awayNameTraditional;
  }

  private getTeamNameSimplified(templateValue: TemplateValue): string {
    return templateValue.betTeam === 'h' ? templateValue.match?.homeNameSimplified : templateValue.match?.awayNameSimplified;
  }

  private getTeamNameNewSimplified(templateValue: TemplateValue): string {
    return templateValue.betTeam === 'h' ? templateValue.match?.homeNameNewSimplified : templateValue.match?.awayNameNewSimplified;
  }

  private getOuType(templateValue: TemplateValue): string {
    return templateValue.filterOuType === 'h' ? TemplateContentConst.OVER.msgEnglish : TemplateContentConst.UNDER.msgEnglish;
  }

  private getOuTypeTraditional(templateValue: TemplateValue): string {
    return templateValue.filterOuType === 'h' ? TemplateContentConst.OVER.msgChineseTraditional : TemplateContentConst.UNDER.msgChineseTraditional;
  }

  private getOuTypeSimplified(templateValue: TemplateValue): string {
    return templateValue.filterOuType === 'h' ? TemplateContentConst.OVER.msgChineseSimplified : TemplateContentConst.UNDER.msgChineseSimplified;
  }

  private getOuTypeNewSimplified(templateValue: TemplateValue): string {
    return templateValue.filterOuType === 'h' ? TemplateContentConst.OVER.msgChineseNewSimplified : TemplateContentConst.UNDER.msgChineseNewSimplified;
  }
}
