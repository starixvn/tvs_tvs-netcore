import { Injectable } from '@angular/core';
import { SubIssueTypeGroup } from 'src/utility/constants/config';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateValue, TemplateContent } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';

@Injectable()
export class TemplateWrongScoreService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateInputsService: TemplateInputsService,
  ) { }

  public replaceActualScore(subIssueTypeId: number, templateValue: TemplateValue, outputMessage: Message): void {
    if (SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(subIssueTypeId)) {
      this.templateInputsService.replaceWrongScoreOfWrongScoreIssueType(outputMessage, templateValue.wrongScore);
      this.templateInputsService.replaceActualScoreOfWrongScoreIssueType(outputMessage, templateValue.actualScore);
    } else {
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