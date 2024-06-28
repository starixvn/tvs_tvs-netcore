import { MatchModel } from "../../../models/match.model";
import { Message } from "../messages/message";

export class TemplateContent {
  msgEnglish: string;
  msgChineseTraditional: string;
  msgChineseSimplified: string;
  msgChineseNewSimplified: string;
}

export class TemplateModel extends TemplateContent {
  templateId: number;
  inputTexts: InputText[];
}

export class InputText extends TemplateContent {
  name: string;
  msgEnglishValue: string;
  msgChineseTraditionalValue: string;
  msgChineseSimplifiedValue: string;
  msgChineseNewSimplifiedValue: string;
  hideChinese: boolean;
  pattern: string;
}

export class TemplateValue {
  matchId: number;
  sportType?: TemplateContent;
  homeTeamName?: TemplateContent;
  awayTeamName?: TemplateContent;
  leagueName?: TemplateContent;
  eventDate?: string;
  eventType?: string;
  kickOffTime?: string;
  fromTransTime?: Date;
  toTransTime?: Date;
  fromCheckTime?: Date;
  toCheckTime?: Date;
  totalTickets?: number;
  score?: string;
  checkSettled?: boolean;
  sportTypeId?: number;
  isCheckTime?: boolean;
  wrongScore?: string;
  actualScore?: string;
  checkAIOMessage?: boolean;
  groupPHAffected: number;
  isUpdateScoreHaveText?: boolean;
  filterBy?: number;
  wrongMarket?: string;
  actualMarket?: string;
  hdpValue?: string;
  isCheckedEarlyEvent?: boolean;
  isCheckedSpecialBetType?: boolean;
  betTypeNameReplaceMessage?: Message;
  match?: MatchModel;
  filterFavoriteType?: string;
  correctOddsHomeOver?: string;
  wrongOU?: string;
  isCheckedVar?: boolean;
  playerName?: TemplateContent;
  numberOfCorner?: number;
  isAllNonLiveTickets?: boolean
}
