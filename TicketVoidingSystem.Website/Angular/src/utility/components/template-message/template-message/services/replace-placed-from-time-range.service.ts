import { inject, Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { EventType } from '../../../../../utility/constants/sport.constant';
import { Message } from '../../messages/message';
import { FormatDateTime, MessageTemplateId, TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

const MAX_NUMBER_TICKETS = 5;
const MESSAGE_TEMPLATE_IDS_HAVE_TIME_RANGE_NC = [
  MessageTemplateId.NEXT_CORNER,
  MessageTemplateId.MATCH_COMPLETED,
  MessageTemplateId.NEXT_GOAL_KICK,
  MessageTemplateId.NEXT_BOOKING,
  MessageTemplateId.NEXT_GOAL,
  MessageTemplateId.PENALTY_SHOOTOUT,
  MessageTemplateId.PENALTY_SHOOTOUT_VIRTUAL
];

@Injectable(
  { providedIn: 'root' }
)
export class ReplacePlacedFromTimeRangeService {
  private readonly replaceMessageService = inject(ReplaceMessageService);

  public execute(templateValue: TemplateValue, outputMessage: Message, messageTemplateId: number): void {
    const isTheSameDay = dayjs(new Date(templateValue.fromTransTime)).format('DD/MM') === dayjs(new Date(templateValue.toTransTime)).format('DD/MM');
    const fromTime = dayjs(new Date(templateValue.fromTransTime)).format(FormatDateTime.DATE_TIME);
    const toTime = isTheSameDay ?
      dayjs(new Date(templateValue.toTransTime)).format(FormatDateTime.TIME)
      : dayjs(new Date(templateValue.toTransTime)).format(FormatDateTime.DATE_TIME);

    const timeRange = `${fromTime} - ${toTime} `;
    this.replacePlacedFromTimeRange(templateValue, outputMessage, timeRange, messageTemplateId);
    this.replaceFromTimeRange(templateValue, outputMessage, timeRange);
  }

  private replacePlacedFromTimeRange(templateValue: TemplateValue, outputMessage: Message, timeRange: string, messageTemplateId: number) {
    const isTemplateHaveTimeRangeNC = MESSAGE_TEMPLATE_IDS_HAVE_TIME_RANGE_NC.indexOf(messageTemplateId) > -1;

    if (templateValue.totalTickets > MAX_NUMBER_TICKETS) {
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
      this.replaceMessageService.replaceEachLanguage(outputMessage, destination, replacedContent);
    } else {
      if (isTemplateHaveTimeRangeNC) {
        this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.PLACED_FROM_TIME_RANGE_NC, '');
      } else {
        if (templateValue.totalTickets <= 5 && templateValue.eventType === EventType.LIVE) {
          this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.PLACED_FROM_TIME_RANGE, TemplateContentConst.PLACED_AT);
        } else {
          this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.PLACED_FROM_TIME_RANGE, '');
        }
      }
    }
  }

  private replaceFromTimeRange(templateValue: TemplateValue, outputMessage: Message, timeRange: string) {
    if (templateValue.totalTickets > MAX_NUMBER_TICKETS) {
      const replacedContent: TemplateContent = {
        msgEnglish: `${TemplateContentConst.FROM.msgEnglish} ${timeRange}${TemplateContentConst.GMT_8.msgEnglish} `,
        msgChineseTraditional:
          `${TemplateContentConst.FROM.msgChineseTraditional} ${timeRange}${TemplateContentConst.GMT_8.msgChineseTraditional} `,
        msgChineseSimplified:
          `${TemplateContentConst.FROM.msgChineseSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseSimplified} `,
        msgChineseNewSimplified:
          `${TemplateContentConst.FROM.msgChineseNewSimplified} ${timeRange}${TemplateContentConst.GMT_8.msgChineseNewSimplified} `
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.FROM_TIME_RANGE, replacedContent);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.FROM_TIME_RANGE, '');
    }
  }
}