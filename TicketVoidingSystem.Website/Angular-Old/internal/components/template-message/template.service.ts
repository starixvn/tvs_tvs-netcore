import { MatchViewModel } from './../match-detail/match.viewmodel';
import { Message } from './../messages/message';
import { MessageTemplateId } from './template.const';
import { TemplateContent, TemplateValue } from './template.model';
import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

import { TemplateReplace, TemplateContentConst, Format } from './template.const';
import { SportType, EventType } from '../../const/sport-type';

@Injectable()
export class TemplateService {
    constructor() { }

    getTemplateValue(match: MatchViewModel): TemplateValue {
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
            sportTypeId: match.sportType
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

    replaceKickOffTime(message: Message, time: string) {
        const kickOffTime = moment(new Date(time)).format('D/M h:mm:ss A');
        const replacedContent: TemplateContent = {
            msgEnglish: `${kickOffTime} ${TemplateContentConst.GMT_8.msgEnglish}`,
            msgChineseTraditional: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseTraditional}`,
            msgChineseSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseSimplified}`,
            msgChineseNewSimplified: `${kickOffTime} ${TemplateContentConst.GMT_8.msgChineseNewSimplified}`
        };
        this.replaceEachLanguage(message, TemplateReplace.KO_TIME, replacedContent);
    }

    replaceTime(message: Message, value: TemplateValue, messageTemplateId: number) {
        const isTheSameDay = moment(new Date(value.fromTime)).format('DD/MM') === moment(new Date(value.toTime)).format('DD/MM');
        const fromTime = moment(new Date(value.fromTime)).format('D/M h:mm:ss A');
        const toTime = isTheSameDay ?
            moment(new Date(value.toTime)).format('h:mm:ss A')
            : moment(new Date(value.toTime)).format('D/M h:mm:ss A');

        const timeRange = `${fromTime} - ${toTime} `;
        this.replacePlacedFromTimeRange(message, value, timeRange, messageTemplateId);
        this.replaceFromTimeRange(message, value, timeRange);
    }

    private replacePlacedFromTimeRange(message: Message, value: TemplateValue, timeRange: string, messageTemplateId: number) {
        const isNextCornerTemplate = messageTemplateId === MessageTemplateId.NEXT_CORNER;
        if (value.totalTickets > 5) {
            const replacedContent: TemplateContent = {
                msgEnglish: `${TemplateContentConst.PLACED_FROM.msgEnglish} ${timeRange}${TemplateContentConst.GMT_8.msgEnglish} `,
                msgChineseTraditional:
            `${TemplateContentConst.PLACED_FROM.msgChineseTraditional} ${timeRange}${TemplateContentConst.GMT_8.msgChineseTraditional} `,
                msgChineseSimplified:
            `${TemplateContentConst.PLACED_FROM.msgChineseSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseSimplified} `,
                msgChineseNewSimplified:
            `${TemplateContentConst.PLACED_FROM.msgChineseNewSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseNewSimplified} `
            };

            const destination =  isNextCornerTemplate ? TemplateReplace.PLACED_FROM_TIME_RANGE_NC : TemplateReplace.PLACED_FROM_TIME_RANGE;
            this.replaceEachLanguage(message, destination, replacedContent);
        }
        else {
            if (isNextCornerTemplate) {
                this.replaceAll(message, TemplateReplace.PLACED_FROM_TIME_RANGE_NC, '');
            } else {
                if (value.totalTickets <= 5 && value.eventType === EventType.LIVE) {
                    this.replaceEachLanguage(message, TemplateReplace.PLACED_FROM_TIME_RANGE, TemplateContentConst.PLACED_AT);
                }
                else {
                    this.replaceAll(message, TemplateReplace.PLACED_FROM_TIME_RANGE, '');
                }
            }
        }
    }

    private replaceFromTimeRange(message: Message, value: TemplateValue, timeRange: string) {
        if (value.totalTickets > 5) {
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
        }
        else {
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
}