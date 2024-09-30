import { Injectable } from '@angular/core';
import { SubIssueTypeGroup } from 'src/utility/constants/config';
import { OrdinalNumberConstant } from 'src/utility/constants/ordinal-number.constant';
import { StaticService } from 'src/utility/services/static.service';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateModel, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

@Injectable()
export class TemplateInputsService {

  constructor(private readonly replaceMessageService: ReplaceMessageService) { }

  public replaceInputs(subIssueTypeId: number, selectedTemplated: TemplateModel, outputMessage: Message): void {
    if (selectedTemplated.inputTexts?.length > 0) {
      if (SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(subIssueTypeId)) {
        this.replaceWrongScoreOfWrongScoreIssueType(outputMessage, selectedTemplated.inputTexts[0].msgEnglishValue);
        this.replaceActualScoreOfWrongScoreIssueType(outputMessage, selectedTemplated.inputTexts[1].msgEnglishValue);
      } else {
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
    }
  }

  public updateOrdinalNumberForInputsNextCorner(issueTypeId: number, selectedTemplated: TemplateModel, templateValue: TemplateValue): void {
    for (const element of selectedTemplated.inputTexts) {
      if (StaticService.isDangerAcceptedNumber(issueTypeId) && templateValue.numberOfCorner && element.msgEnglish === "Next Corner") {
        const nextCorner = OrdinalNumberConstant.ORDINAL_NUMBER.find(x => x.value === templateValue.numberOfCorner.toString());
        element.msgEnglishValue = nextCorner.englishValue;
        element.msgChineseTraditionalValue = `第${nextCorner.chineseTraditionalValue}`;
        element.msgChineseSimplifiedValue = `第${nextCorner.chineseSimplifiedValue}`;
        element.msgChineseNewSimplifiedValue = `第${nextCorner.chineseSimplifiedValue}`;
      }
    }
  }

  public replaceWrongScoreOfWrongScoreIssueType(message: Message, score: string): void {
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

      this.replaceMessageService.replaceEachLanguage(message, TemplateReplace.WRONG_SCORE_ONWARDS, replacedContent);
    } else {
      this.replaceMessageService.replaceAll(message, TemplateReplace.WRONG_SCORE_ONWARDS, '');
    }
  }

  public replaceActualScoreOfWrongScoreIssueType(message: Message, score: string): void {
    if (score?.length > 0) {
      const replacedContent: TemplateContent = {
        msgEnglish: `${score} ${TemplateContentConst.ONWARDS.msgEnglish}`,
        msgChineseTraditional: `${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}`,
        msgChineseSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}`,
        msgChineseNewSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}`
      };

      this.replaceMessageService.replaceEachLanguage(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, replacedContent);
    } else {
      this.replaceMessageService.replaceAll(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, '');
    }
  }

  public getPrefixSubType(isFirstHalf: boolean): TemplateContent {
    const prfixSubType: TemplateContent = {
      msgEnglish: `${isFirstHalf ? TemplateContentConst.FIRST_HALF.msgEnglish : ''}`,
      msgChineseTraditional: `${isFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseTraditional : ''}`,
      msgChineseSimplified: `${isFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseSimplified : ''}`,
      msgChineseNewSimplified: `${isFirstHalf ? TemplateContentConst.FIRST_HALF.msgChineseNewSimplified : ''}`,
    }

    return prfixSubType;
  }

  public getTeamName(templateValue: TemplateValue): string {
    return templateValue.filterFavoriteType === 'h' ? templateValue.match?.homeName : templateValue.match?.awayName;
  }

  public getTeamNameTraditional(templateValue: TemplateValue): string {
    return templateValue.filterFavoriteType === 'h' ? templateValue.match?.homeNameTraditional : templateValue.match?.awayNameTraditional;
  }

  public getTeamNameSimplified(templateValue: TemplateValue): string {
    return templateValue.filterFavoriteType === 'h' ? templateValue.match?.homeNameSimplified : templateValue.match?.awayNameSimplified;
  }

  public getTeamNameNewSimplified(templateValue: TemplateValue): string {
    return templateValue.filterFavoriteType === 'h' ? templateValue.match?.homeNameNewSimplified : templateValue.match?.awayNameNewSimplified;
  }
}