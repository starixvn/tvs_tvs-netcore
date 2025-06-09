import { inject, Injectable } from '@angular/core';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable(
  { providedIn: 'root' }
)
export class ReplaceAIOMessageService {
  private readonly replaceMessageService = inject(ReplaceMessageService);

  public execute(isVoidSingleBetPage: boolean, templateValue: TemplateValue, outputMessage: Message): void {
    if ((isVoidSingleBetPage && templateValue.checkAIOMessage) || templateValue.groupPHAffected !== 0) {
      this.replaceAIOMessage(outputMessage, templateValue.groupPHAffected);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.AOI_MESSAGE, '');
    }
  }

  private replaceAIOMessage(outputMessage: Message, groupPHAffected: number): void {
    const replacedContent = this.getAioMessageTemplate(groupPHAffected)
    this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.AOI_MESSAGE, replacedContent);
  }

  private getAioMessageTemplate(groupPHAffected: number): TemplateContent {
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
}