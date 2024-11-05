import { Injectable } from '@angular/core';
import { StaticService } from 'src/utility/services/static.service';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue, TemplateModel } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateWrongOddsSportBookService } from './template-wrong-odds-sport-book.service';
import { TemplateWrongOddsService } from './template-wrong-odds.service';
import { TemplateWrongScoreService } from './template-wrong-score.service';
import { TemplateInputsService } from './template-inputs.service';

@Injectable()
export class TemplateInputsForTVSService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateWrongScoreService: TemplateWrongScoreService,
    private readonly templateWrongOddsService: TemplateWrongOddsService,
    private readonly templateWrongOddsSportBookService: TemplateWrongOddsSportBookService,
    private readonly templateInputsService: TemplateInputsService,
  ) { }

  public replaceInputsByIssueType(issueTypeId: number, subIssueTypeId: number, templateValue: TemplateValue, outputMessage: Message, selectedTemplated: TemplateModel): void {
    if (StaticService.isWrongScore(issueTypeId)) {
      this.templateWrongScoreService.replaceActualScore(subIssueTypeId, templateValue, outputMessage);
    } else if (StaticService.isWrongHDP(issueTypeId) || StaticService.isWrong1stHDP(issueTypeId)) {
      this.replaceWrongMarketTVS(templateValue, outputMessage);
      this.replaceActualMarketOthersIssueType(templateValue, outputMessage);
      this.replaceHdpTVS(templateValue, outputMessage);
    } else if (StaticService.isWrongOU(issueTypeId) || StaticService.isWrong1stOU(issueTypeId)) {
      this.replaceWrongMarketTVS(templateValue, outputMessage);
      this.replaceActualMarketOthersIssueType(templateValue, outputMessage);
    } else if (StaticService.isWrongOdds(issueTypeId)) {
      this.templateWrongOddsService.replaceActualMarketTVS(subIssueTypeId, templateValue, outputMessage);
    } else if (StaticService.isWrongOddsSportsBook(issueTypeId)) {
      this.templateWrongOddsSportBookService.replaceActualMarketSportsBook(templateValue, outputMessage);
    } else if(StaticService.isDangerAccepted(issueTypeId)) {
      this.templateInputsService.replaceInputs(subIssueTypeId, selectedTemplated, outputMessage);
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