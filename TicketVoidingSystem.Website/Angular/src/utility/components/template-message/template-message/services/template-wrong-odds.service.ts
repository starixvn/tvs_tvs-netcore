import { Injectable } from '@angular/core';
import { SubIssueTypeConstant } from '../../../../../utility/constants/sub-issue-type.constant';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';

@Injectable(
  { providedIn: 'root' }
)
export class TemplateWrongOddsService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateInputsService: TemplateInputsService
  ) { }

  public replaceActualMarketTVS(subIssueTypeId: number, templateValue: TemplateValue, message: Message): void {
    if (subIssueTypeId === SubIssueTypeConstant.HANDICAP || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP) {
      this.replaceActualMarketSubTypeHdp(message, subIssueTypeId, templateValue);
    } else if (subIssueTypeId === SubIssueTypeConstant.OVER_UNDER || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER) {
      this.replaceActualMarketSubTypeOu(message, subIssueTypeId, templateValue);
    }
  }

  private replaceActualMarketSubTypeHdp(message: Message, subIssueTypeId: number, templateValue: TemplateValue) {
    const isFirstHalf = subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER;
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const replacedContent: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${this.templateInputsService.getTeamName(templateValue)}-${templateValue.favoriteValue}@${TemplateContentConst.ODDS.msgEnglish} ${this.getCorrectOdds(templateValue)}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${this.templateInputsService.getTeamNameTraditional(templateValue)}-${templateValue.favoriteValue}@${TemplateContentConst.ODDS.msgChineseTraditional} ${this.getCorrectOdds(templateValue)}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${this.templateInputsService.getTeamNameSimplified(templateValue)}-${templateValue.favoriteValue}@${TemplateContentConst.ODDS.msgChineseSimplified} ${this.getCorrectOdds(templateValue)}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${this.templateInputsService.getTeamNameNewSimplified(templateValue)}-${templateValue.favoriteValue}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${this.getCorrectOdds(templateValue)}`
    };

    this.replaceMessageService.replaceEachLanguage(message, TemplateReplace.ACTUAL_MARKET, replacedContent);
  }

  private replaceActualMarketSubTypeOu(message: Message, subIssueTypeId: number, templateValue: TemplateValue) {
    const isFirstHalf = subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_HANDICAP || subIssueTypeId === SubIssueTypeConstant.FIRST_HALF_OVER_UNDER;
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const replacedContent: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${TemplateContentConst.OVER.msgEnglish}-${templateValue.wrongOU}@${TemplateContentConst.ODDS.msgEnglish} ${templateValue.correctOddsHomeOver}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${TemplateContentConst.OVER.msgChineseTraditional}-${templateValue.wrongOU}@${TemplateContentConst.ODDS.msgChineseTraditional} ${templateValue.correctOddsHomeOver}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${TemplateContentConst.OVER.msgChineseSimplified}-${templateValue.wrongOU}@${TemplateContentConst.ODDS.msgChineseSimplified} ${templateValue.correctOddsHomeOver}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${TemplateContentConst.OVER.msgChineseNewSimplified}-${templateValue.wrongOU}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${templateValue.correctOddsHomeOver}`
    };

    this.replaceMessageService.replaceEachLanguage(message, TemplateReplace.ACTUAL_MARKET, replacedContent);
  }

  private getCorrectOdds(templateValue: TemplateValue) {
    return templateValue.filterFavoriteType === 'h' ? templateValue.correctOddsHomeOver : templateValue.correctOddsAwayUnder;
  }
}