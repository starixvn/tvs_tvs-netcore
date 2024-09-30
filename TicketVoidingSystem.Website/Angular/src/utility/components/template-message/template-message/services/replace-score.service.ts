import { Injectable } from '@angular/core';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable()
export class ReplaceScoreService {
  constructor(private readonly replaceMessageService: ReplaceMessageService) { }

  public execute(templateValue: TemplateValue, outputMessage: Message): void {
    templateValue.isUpdateScoreHaveText ? this.updateScoreHaveText(templateValue, outputMessage) : this.updateScore(templateValue, outputMessage);
  }

  private updateScoreHaveText(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.score !== undefined && templateValue.score.length > 0 && !templateValue?.isAllNonLiveTickets) {
      const score: TemplateContent = {
        msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${templateValue.score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
        msgChineseTraditional:
          `(${TemplateContentConst.SCORE.msgChineseTraditional} ${templateValue.score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
        msgChineseSimplified:
          `(${TemplateContentConst.SCORE.msgChineseSimplified} ${templateValue.score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
        msgChineseNewSimplified:
          `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${templateValue.score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.SCORE, score);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.SCORE, '');
    }
  }

  private updateScore(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.score !== undefined && templateValue.score.length > 0 && !templateValue?.isAllNonLiveTickets) {
      const score: TemplateContent = {
        msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${templateValue.score}) `,
        msgChineseTraditional: `(${TemplateContentConst.SCORE.msgChineseTraditional} ${templateValue.score}) `,
        msgChineseSimplified: `(${TemplateContentConst.SCORE.msgChineseSimplified} ${templateValue.score}) `,
        msgChineseNewSimplified: `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${templateValue.score}) `
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.SCORE, score);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.SCORE, '');
    }
  }
}