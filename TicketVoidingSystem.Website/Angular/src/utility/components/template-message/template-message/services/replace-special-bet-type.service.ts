import { Injectable } from '@angular/core';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable(
  { providedIn: 'root' }
)
export class ReplaceSpecialBetTypeService {
  constructor(private readonly replaceMessageService: ReplaceMessageService) { }

  public execute(issueTypeUpdateSpecialBetTypeTvs: boolean, issueTypeUpdateSpecialBetTypeVoidSingleBet: boolean, templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.isCheckedSpecialBetType && (issueTypeUpdateSpecialBetTypeTvs || issueTypeUpdateSpecialBetTypeVoidSingleBet)) {
      this.replaceSpecialBetType(outputMessage, templateValue.betTypeNameReplaceMessage);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.SPECIAL_BET_TYPE, '');
    }
  }

  private replaceSpecialBetType(message: Message, betTypeNameReplaceMessage: Message): void {
    const replacedContent: TemplateContent = {
      msgEnglish: betTypeNameReplaceMessage.contentEnglish ? `"${betTypeNameReplaceMessage.contentEnglish}" ` : '',
      msgChineseTraditional: betTypeNameReplaceMessage.contentChineseTraditional ? `"${betTypeNameReplaceMessage.contentChineseTraditional}" ` : '',
      msgChineseSimplified: betTypeNameReplaceMessage.contentChineseSimplified ? `"${betTypeNameReplaceMessage.contentChineseSimplified}" ` : '',
      msgChineseNewSimplified: betTypeNameReplaceMessage.contentNewChineseSimplified ? `"${betTypeNameReplaceMessage.contentNewChineseSimplified}" ` : ''
    };

    this.replaceMessageService.replaceEachLanguage(message, TemplateReplace.SPECIAL_BET_TYPE, replacedContent);
  }
}