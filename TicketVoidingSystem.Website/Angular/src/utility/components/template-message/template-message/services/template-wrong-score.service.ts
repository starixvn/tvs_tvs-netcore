import { Injectable } from '@angular/core';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateContent, TemplateModel, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';

@Injectable(
  { providedIn: 'root' }
)
export class TemplateWrongScoreService {
  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateInputsService: TemplateInputsService,
  ) { }

  public replaceActualScore(subIssueTypeId: number, templateValue: TemplateValue, outputMessage: Message, selectedTemplated: TemplateModel): void {
    if (SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(subIssueTypeId) && !SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT.includes(subIssueTypeId)) {
      this.templateInputsService.replaceWrongScoreOfWrongScoreIssueType(outputMessage, templateValue.wrongScore);
      this.templateInputsService.replaceActualScoreOfWrongScoreIssueType(outputMessage, templateValue.actualScore);
    } else if(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT.includes(subIssueTypeId)) {
      selectedTemplated.inputTexts.forEach(item => {
        const text: TemplateContent = {
          msgEnglish: item.msgEnglishValue,
          msgChineseTraditional: item.msgChineseTraditionalValue,
          msgChineseSimplified: item.msgChineseSimplifiedValue,
          msgChineseNewSimplified: item.msgChineseNewSimplifiedValue
        };
        this.replaceMessageService.replaceEachLanguage(outputMessage, `{{${item.name}}}`, text);
      });
    }
    else {
      const replacedContent: TemplateContent = {
        msgEnglish: `${templateValue.actualScore}`,
        msgChineseTraditional: `${templateValue.actualScore}`,
        msgChineseSimplified: `${templateValue.actualScore}`,
        msgChineseNewSimplified: `${templateValue.actualScore}`
      };

      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.ACTUAL_SCORE, replacedContent);
    }
  }
}