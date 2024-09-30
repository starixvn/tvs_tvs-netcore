import { Injectable } from '@angular/core';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateContent, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';

export class SpecialSportsBookBetTypes {
  static readonly Handicap = "1";
  static readonly OverUnder = "3";
  static readonly _1HHandicap = "7";
  static readonly _1HOverUnder = "8";
}

@Injectable()
export class TemplateWrongOddsSportBookService {

  constructor(
    private readonly replaceMessageService: ReplaceMessageService,
    private readonly templateInputsService: TemplateInputsService,
  ) { }

  public replaceActualMarketSportsBook(templateValue: TemplateValue, outputMessage: Message): void {
    const actualMarket = this.createActualMarketContent(templateValue);
    if (actualMarket) {
      this.replaceMessageService.replaceEachLanguage(outputMessage, TemplateReplace.ACTUAL_MARKET, actualMarket);
    } else {
      this.replaceMessageService.replaceAll(outputMessage, TemplateReplace.ACTUAL_MARKET, '');
    }
  }

  private createActualMarketContent(templateValue: TemplateValue): TemplateContent {
    if (templateValue.totalBetTypesSelected === 1) {
      if (this.isHandicapBetType(templateValue.uniqueBetTypeSelected.id)) {
        return this.createActualMarketBetTypeHdp(templateValue.uniqueBetTypeSelected.id, templateValue.correctOdds, templateValue);
      }

      if (this.isOverUnderBetType(templateValue.uniqueBetTypeSelected.id)) {
        return this.createActualMarketBetTypeOu(templateValue.uniqueBetTypeSelected.id, templateValue.correctOdds, templateValue.uniqueBetTypeSelected.hdp1);
      }
    }

    return this.createActualMarketOtherBetType(templateValue.correctOdds);
  }

  private isHandicapBetType(betTypeId: string): boolean {
    return [SpecialSportsBookBetTypes.Handicap, SpecialSportsBookBetTypes._1HHandicap].includes(betTypeId);
  }

  private isOverUnderBetType(betTypeId: string): boolean {
    return [SpecialSportsBookBetTypes.OverUnder, SpecialSportsBookBetTypes._1HOverUnder].includes(betTypeId);
  }

  private isFirstHalfBetType(betTypeId: string): boolean {
    return [SpecialSportsBookBetTypes._1HHandicap, SpecialSportsBookBetTypes._1HOverUnder].includes(betTypeId);
  }

  private createActualMarketBetTypeHdp(betTypeId: string, correctOdds: string, templateValue: TemplateValue) {
    const isFirstHalf = this.isFirstHalfBetType(betTypeId);
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const actualMarket: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${this.templateInputsService.getTeamName(templateValue)}@${TemplateContentConst.ODDS.msgEnglish} ${correctOdds}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${this.templateInputsService.getTeamNameTraditional(templateValue)}@${TemplateContentConst.ODDS.msgChineseTraditional} ${correctOdds}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${this.templateInputsService.getTeamNameSimplified(templateValue)}@${TemplateContentConst.ODDS.msgChineseSimplified} ${correctOdds}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${this.templateInputsService.getTeamNameNewSimplified(templateValue)}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${correctOdds}`
    };

    return actualMarket;
  }

  private createActualMarketBetTypeOu(betTypeId: string, correctOdds: string, inputOverUnder: string) {
    const isFirstHalf = this.isFirstHalfBetType(betTypeId);
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const actualMarket: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${TemplateContentConst.OVER.msgEnglish}-${inputOverUnder}@${TemplateContentConst.ODDS.msgEnglish} ${correctOdds}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${TemplateContentConst.OVER.msgChineseTraditional}-${inputOverUnder}@${TemplateContentConst.ODDS.msgChineseTraditional} ${correctOdds}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${TemplateContentConst.OVER.msgChineseSimplified}${inputOverUnder}@${TemplateContentConst.ODDS.msgChineseSimplified} ${correctOdds}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${TemplateContentConst.OVER.msgChineseNewSimplified}-${inputOverUnder}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${correctOdds}`
    };

    return actualMarket;
  }

  private createActualMarketOtherBetType(correctOdds: string) {
    const actualMarket: TemplateContent = {
      msgEnglish: `@${TemplateContentConst.ODDS.msgEnglish} ${correctOdds}`,
      msgChineseTraditional: `@${TemplateContentConst.ODDS.msgChineseTraditional} ${correctOdds}`,
      msgChineseSimplified: `@${TemplateContentConst.ODDS.msgChineseSimplified} ${correctOdds}`,
      msgChineseNewSimplified: `@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${correctOdds}`
    };

    return actualMarket;
  }
}