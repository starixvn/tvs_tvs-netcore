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
    if (templateValue.betTypeId) {
      if (this.isHandicapBetType(templateValue.groupBetTypeId, templateValue.betTeam)) {
        templateValue.filterFavoriteType = templateValue.betTeam;
        return this.createActualMarketBetTypeHandicap(templateValue.betTypeId, templateValue.correctOdds, templateValue);
      }

      if (this.isOverUnderBetType(templateValue.betTypeId)) {
        return this.createActualMarketBetTypeOu(templateValue.betTypeId, templateValue.correctOdds, templateValue.hdpValues, templateValue.betTeam);
      }
    }

    return this.createActualMarketOtherBetType(templateValue.correctOdds);
  }

  private isHandicapBetType(groupBetTypeId: number, betTeam: string): boolean {
    return SpecialSportsBookBetTypes.Handicap === groupBetTypeId.toString() && betTeam !== "All"
  }

  private isOverUnderBetType(betTypeId: string): boolean {
    return [SpecialSportsBookBetTypes.OverUnder, SpecialSportsBookBetTypes._1HOverUnder].includes(betTypeId);
  }

  private isFirstHalfBetType(betTypeId: string): boolean {
    return [SpecialSportsBookBetTypes._1HHandicap, SpecialSportsBookBetTypes._1HOverUnder].includes(betTypeId);
  }

  private createActualMarketBetTypeHandicap(betTypeId: string, correctOdds: string, templateValue: TemplateValue) {
    const isFirstHalf = this.isFirstHalfBetType(betTypeId);
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const actualMarket: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${this.templateInputsService.getTeamName(templateValue)}-${templateValue.hdpValues}@${TemplateContentConst.ODDS.msgEnglish} ${correctOdds}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${this.templateInputsService.getTeamNameTraditional(templateValue)}-${templateValue.hdpValues}@${TemplateContentConst.ODDS.msgChineseTraditional} ${correctOdds}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${this.templateInputsService.getTeamNameSimplified(templateValue)}-${templateValue.hdpValues}@${TemplateContentConst.ODDS.msgChineseSimplified} ${correctOdds}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${this.templateInputsService.getTeamNameNewSimplified(templateValue)}-${templateValue.hdpValues}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${correctOdds}`
    };

    return actualMarket;
  }

  private createActualMarketBetTypeOu(betTypeId: string, correctOdds: string, hdpValues: string, filterFavoriteType: string) {
    const isFirstHalf = this.isFirstHalfBetType(betTypeId);
    const prefixSubType = this.templateInputsService.getPrefixSubType(isFirstHalf);
    const actualMarket: TemplateContent = {
      msgEnglish: `${prefixSubType.msgEnglish}${this.getOverOrUnder(filterFavoriteType)}-${hdpValues}@${TemplateContentConst.ODDS.msgEnglish} ${correctOdds}`,
      msgChineseTraditional: `${prefixSubType.msgChineseTraditional}${this.getOverOrUnderTraditional(filterFavoriteType)}-${hdpValues}@${TemplateContentConst.ODDS.msgChineseTraditional} ${correctOdds}`,
      msgChineseSimplified: `${prefixSubType.msgChineseSimplified}${this.getOverOrUnderSimplified(filterFavoriteType)}-${hdpValues}@${TemplateContentConst.ODDS.msgChineseSimplified} ${correctOdds}`,
      msgChineseNewSimplified: `${prefixSubType.msgChineseNewSimplified}${this.getOverOrUnderNewSimplified(filterFavoriteType)}-${hdpValues}@${TemplateContentConst.ODDS.msgChineseNewSimplified} ${correctOdds}`
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

  public getOverOrUnder(filterFavoriteType: string): string {
    return filterFavoriteType === 'a' ? TemplateContentConst.UNDER.msgEnglish : TemplateContentConst.OVER.msgEnglish;
  }

  public getOverOrUnderTraditional(filterFavoriteType): string {
    return filterFavoriteType === 'a' ? TemplateContentConst.UNDER.msgChineseTraditional : TemplateContentConst.OVER.msgChineseTraditional;
  }

  public getOverOrUnderSimplified(filterFavoriteType): string {
    return filterFavoriteType === 'a' ? TemplateContentConst.UNDER.msgChineseSimplified : TemplateContentConst.OVER.msgChineseSimplified;
  }

  public getOverOrUnderNewSimplified(filterFavoriteType): string {
    return filterFavoriteType === 'a' ? TemplateContentConst.UNDER.msgChineseNewSimplified : TemplateContentConst.OVER.msgChineseNewSimplified;
  }
}