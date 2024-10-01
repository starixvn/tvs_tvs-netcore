import { Injectable } from '@angular/core';
import { StaticService } from 'src/utility/services/static.service';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateWrongOddsSportBookService } from './template-wrong-odds-sport-book.service';
import { TemplateWrongOddsService } from './template-wrong-odds.service';
import { TemplateWrongScoreService } from './template-wrong-score.service';

@Injectable()
export class TemplateInputsForTVSService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateWrongScoreService: TemplateWrongScoreService,
    private readonly templateWrongOddsService: TemplateWrongOddsService,
    private readonly templateWrongOddsSportBookService: TemplateWrongOddsSportBookService) { }

  public replaceInputsByIssueType(issueTypeId: number, subIssueTypeId: number, templateValue: TemplateValue, outputMessage: Message): void {
    if (StaticService.isWrongScoreNumber(issueTypeId)) {
      this.templateWrongScoreService.replaceActualScore(subIssueTypeId, templateValue, outputMessage);
    } else if (StaticService.isWrongHDPNumber(issueTypeId) || StaticService.isWrong1stHDPNumber(issueTypeId)) {
      this.replaceWrongMarketTVS(templateValue, outputMessage);
      this.replaceActualMarketOthersIssueType(templateValue, outputMessage);
      this.replaceHdpTVS(templateValue, outputMessage);
    } else if (StaticService.isWrongOUNumber(issueTypeId) || StaticService.isWrong1stOUNumber(issueTypeId)) {
      this.replaceWrongMarketTVS(templateValue, outputMessage);
      this.replaceActualMarketOthersIssueType(templateValue, outputMessage);
    } else if (StaticService.isWrongOddsNumber(issueTypeId)) {
      this.templateWrongOddsService.replaceActualMarketTVS(subIssueTypeId, templateValue, outputMessage);
    } else if (StaticService.isWrongOddsSportsBookNumber(issueTypeId)) {
      this.templateWrongOddsSportBookService.replaceActualMarketSportsBook(templateValue, outputMessage);
    }
  }

  private replaceWrongMarketTVS(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.wrongMarket) {
      const content: TemplateContent = {
        msgEnglish: `${templateValue.wrongMarket}`,
        msgChineseTraditional: `${templateValue.wrongMarket}`,
        msgChineseSimplified: `${templateValue.wrongMarket}`,
        msgChineseNewSimplified: `${templateValue.wrongMarket}`
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.WRONG_MARKET, content);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.WRONG_MARKET, '');
    }
  }

  private replaceActualMarketOthersIssueType(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.actualMarket) {
      const content: TemplateContent = {
        msgEnglish: `${templateValue.actualMarket}`,
        msgChineseTraditional: `${templateValue.actualMarket}`,
        msgChineseSimplified: `${templateValue.actualMarket}`,
        msgChineseNewSimplified: `${templateValue.actualMarket}`
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.ACTUAL_MARKET, content);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.ACTUAL_MARKET, '');
    }
  }

  private replaceHdpTVS(templateValue: TemplateValue, outputMessage: Message): void {
    if (templateValue.hdpValue) {
      const content: TemplateContent = {
        msgEnglish: `${templateValue.hdpValue}`,
        msgChineseTraditional: `${templateValue.hdpValue}`,
        msgChineseSimplified: `${templateValue.hdpValue}`,
        msgChineseNewSimplified: `${templateValue.hdpValue}`
      };
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.HDP_VALUE, content);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.HDP_VALUE, '');
    }
  }
}