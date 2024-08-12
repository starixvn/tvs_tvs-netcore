import { Component, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment-timezone';
import { AbnormalFilterBy, FunctionConst, SubIssueTypeGroup } from '../../../../utility/constants/config';
import { OrdinalNumberConstant } from '../../../../utility/constants/ordinal-number.constant';
import { EventType } from '../../../../utility/constants/sport.constant';
import { HttpService } from '../../../../utility/services/http.service';
import { StaticService } from '../../../../utility/services/static.service';
import { Message } from '../messages/message';
import { MessagesComponent } from './../messages/messages.component';
import { TemplateSetting, TemplateSettings } from './template-setting.model';
import { FormatDateTime, IssueTypeId, SubIssueTypeId, TemplateContentConst, TemplateReplace } from './template.const';
import { InputText, TemplateContent, TemplateModel, TemplateValue } from './template.model';
import { TemplateService } from './template.service';

const MESSAGE_TEMPLATE_ID_8 = 8;
const MESSAGE_TEMPLATE_ID_9 = 9;
const MESSAGE_TEMPLATE_ID_10 = 10;
const MESSAGE_TEMPLATE_ID_11 = 11;
const MESSAGE_TEMPLATE_ID_29 = 29;
const MESSAGE_TEMPLATE_ID_30 = 30;
const MESSAGE_TEMPLATE_ID_31 = 31;
const MESSAGE_TEMPLATE_ID_32 = 32;
const MESSAGE_TEMPLATE_ID_35 = 35;
const MESSAGE_TEMPLATE_ID_36 = 36;
const MESSAGE_TEMPLATE_ID_37 = 37;
const MESSAGE_TEMPLATE_ID_38 = 38;
const MESSAGE_TEMPLATE_ID_65 = 65;

@Component({
  selector: 'template-message',
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.scss']
})
export class TemplateMessageComponent implements OnChanges {
  @Input() value = new TemplateValue();
  @Input() subIssueTypeId: number;
  @Input() issueTypeId: number;
  @Input() isShowMessages = true;
  @Input() voidFunction?: number;
  @ViewChild('messages') messagesComponent: MessagesComponent;

  templates: TemplateModel[] = [];
  selectedTemplated = new TemplateModel();
  message = new Message();
  initialMessage = new Message();
  templateSettings: TemplateSetting[];
  private readonly hideInputChineseForTemplateId = [
    MESSAGE_TEMPLATE_ID_8,
    MESSAGE_TEMPLATE_ID_9,
    MESSAGE_TEMPLATE_ID_10,
    MESSAGE_TEMPLATE_ID_11,
    MESSAGE_TEMPLATE_ID_29,
    MESSAGE_TEMPLATE_ID_30,
    MESSAGE_TEMPLATE_ID_31,
    MESSAGE_TEMPLATE_ID_32,
    MESSAGE_TEMPLATE_ID_35,
    MESSAGE_TEMPLATE_ID_36,
    MESSAGE_TEMPLATE_ID_38,
  ];

  private readonly autoBindingChineseForIssueId = [
    IssueTypeId.WRONG_HDP,
    IssueTypeId.WRONG_1ST_HDP,
    IssueTypeId.WRONG_OU,
    IssueTypeId.WRONG_1ST_OU,
    IssueTypeId.WRONG_SCORE,
    IssueTypeId.WRONG_MARKET_OFFERED
  ];

  public initialize: boolean;

  constructor(private readonly httpService: HttpService,

    private readonly templateService: TemplateService,
  ) { }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    await this.init();
    if ((changes['subIssueTypeId'] || changes['value']) && this.subIssueTypeId) {
      this.updateTemplate();
      this.initialMessage = _.cloneDeep(this.message);
    }
  }

  async init() {
    if (!this.initialize) {
      await this.getTemplateSetting();
      this.initialize = true;
    }
  }

  async getTemplateSetting() {
    const data = await this.httpService.getJson<TemplateSettings>('api/MessageTemplate/GetTemplateSettings');
    const messageTemplates = data.messageTemplates;
    messageTemplates.forEach(item => {
      this.setInputTextValue(item);
    });

    this.templateSettings = data.templateSettings;
    this.templates = messageTemplates;
  }

  private setInputTextValue(item: TemplateModel) {
    item.inputTexts.forEach(input => {
      input.msgEnglishValue = '';
      input.msgChineseTraditionalValue = '';
      input.msgChineseSimplifiedValue = '';
      input.msgChineseNewSimplifiedValue = '';
      input.hideChinese = this.hideInputChineseForTemplateId.indexOf(item.templateId) > -1;
    });
  }

  setChineseInput(item: InputText) {
    if (this.autoBindingChineseForIssueId.indexOf(this.issueTypeId) > -1) {
      item.msgChineseTraditionalValue = item.msgChineseSimplifiedValue = item.msgChineseNewSimplifiedValue = item.msgEnglishValue;
    }
  }

  updateTemplate() {
    let templateId = 0;
    if (this.isAbnormalAccount() || this.isAbnormalBetMixOrSystemParlay()) {
      templateId = MESSAGE_TEMPLATE_ID_37;
    } else if (this.isDuplicateTicketsMixParlay()) {
      templateId = MESSAGE_TEMPLATE_ID_65;
    } else {
      templateId = this.findTemplateId(this.subIssueTypeId, this.value.sportTypeId, this.value.isCheckedVar);
    }
    this.selectedTemplated = this.templates.find(x => x.templateId === templateId);
    this.updateInputsNextCorner();
    this.updateMessage();
  }

  private findTemplateId(subIssueType: number, sportType?: number, isCheckedVar = false): number {
    const filterSportType = sportType ? sportType : null;
    const filterVar = isCheckedVar ? isCheckedVar : null;

    const settingsBySubType = this.templateSettings.filter(x => x.subIssueTypeId === subIssueType);
    const settingBySportType = settingsBySubType.find(x => x.sportType === filterSportType && x.isCheckedVar === filterVar);
    const defaultTemplateWhenSportNull = settingsBySubType.find(x => x.sportType === null && x.isCheckedVar === filterVar);

    return settingBySportType ? settingBySportType.templateId :
      (defaultTemplateWhenSportNull ? defaultTemplateWhenSportNull.templateId : 9999);
  }

  updateMessage() {
    this.resetMessage();
    this.replaceEventType();
    this.replaceValue();
    if (this.isTVSVoidPage() && this.isWrongScore()) {
      this.updateMessageForWrongScore();
    } else if (this.isTVSVoidPage() && (this.isWrongHDP() || this.isWrong1stHDP())) {
      this.selectedTemplated.inputTexts = [];
      this.updateWrongMarketTVS();
      this.updateActualMarketTVS();
      this.updateHdpTVS();
    } else if (this.isTVSVoidPage() && (this.isWrongOU() || this.isWrong1stOU())) {
      this.selectedTemplated.inputTexts = [];
      this.updateWrongMarketTVS();
      this.updateActualMarketTVS();
    } else if (this.isTVSVoidPage() && this.isWrongOdds()) {
      this.selectedTemplated.inputTexts = [];
      this.updateActualMarketTvsWrongOdds();
    } else {
      this.updateInputs();
    }

    this.value.isUpdateScoreHaveText ? this.updateScoreHaveText() : this.updateScore();
    this.updateParlay();
    this.updateCheckStatement();
    this.updateAIOMessage();
    this.updateSpecialBetType();
    this.updateActualMarketTvsWrongOdds();
    this.message.isTVSAddOrEditPage = this.isTVSAddOrEditPage();
  }

  resetMessage() {
    this.message.contentEnglish = this.selectedTemplated.msgEnglish;
    this.message.contentChineseTraditional = this.selectedTemplated.msgChineseTraditional;
    this.message.contentChineseSimplified = this.selectedTemplated.msgChineseSimplified;
    this.message.contentNewChineseSimplified = this.selectedTemplated.msgChineseNewSimplified;
  }

  replaceValue() {
    this.templateService.replaceEachLanguage(this.message, TemplateReplace.SPORT_TYPE, this.value.sportType);
    this.templateService.replaceEachLanguage(this.message, TemplateReplace.HOME_TEAM_NAME, this.value.homeTeamName);
    this.templateService.replaceEachLanguage(this.message, TemplateReplace.AWAY_TEAM_NAME, this.value.awayTeamName);
    this.templateService.replaceEachLanguage(this.message, TemplateReplace.LEAGUE_NAME, this.value.leagueName);
    this.templateService.replaceEventDate(this.message, this.value.match?.kickOffTime);
    this.templateService.replaceTime(this.message, this.value, this.selectedTemplated.templateId);
    this.templateService.replaceKickOffTime(this.message, this.value?.kickOffTime);
    this.templateService.replaceEachLanguage(this.message, TemplateReplace.PLAYER_NAME, this.value.playerName);
  }

  replaceEventType(): void {
    if (this.value.eventType === EventType.LIVE) {
      this.value.isCheckedEarlyEvent = false;
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.EVENT_TYPE, TemplateContentConst.LIVE);
      return;
    }

    if (this.value.isCheckedEarlyEvent) {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.EVENT_TYPE, TemplateContentConst.EARLY);
      return;
    }

    if (this.checkCanUpdateEventTypeToBlank()) {
      this.templateService.replaceAll(this.message, TemplateReplace.EVENT_TYPE, '');
    } else {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.EVENT_TYPE, TemplateContentConst.EARLY);
    }
  }

  checkCanUpdateEventTypeToBlank(): boolean {
    const issueTypes = [
      IssueTypeId.DANGER_ACCEPTED,
      IssueTypeId.WRONG_SCORE,
      IssueTypeId.RED_CARD,
      IssueTypeId.WRONG_MARKET_OFFERED,
      IssueTypeId.REDUCED_OVER,
      IssueTypeId.ABANDONED,
      IssueTypeId.MATCH_COMPLETED,
      IssueTypeId.NOT_PARTICIPATE,
      IssueTypeId.WRONG_QUARTER_HDP
    ];

    const subIssueTypeS = [
      SubIssueTypeId.GAME_CRASHED_VOID_LIVE,
      SubIssueTypeId.TECHNICAL_ERROR
    ];

    const isSpecialIssueType = issueTypes.includes(this.issueTypeId) ||
      (this.issueTypeId === IssueTypeId.OTHER_ISSUES && subIssueTypeS.includes(this.subIssueTypeId));

    const isDateMismatched = this.value.eventDate !== moment.utc().tz('America/Caracas').format(FormatDateTime.EVENT_DATE);

    if (isSpecialIssueType && isDateMismatched) {
      return false;
    }

    const issueTypesHasCheckBoxEarlyEvent = [
      IssueTypeId.WRONG_ODDS,
      IssueTypeId.WRONG_HDP,
      IssueTypeId.WRONG_1ST_HDP,
      IssueTypeId.WRONG_OU,
      IssueTypeId.WRONG_1ST_OU
    ];

    const isCheckedEarlyEvent = issueTypesHasCheckBoxEarlyEvent.includes(this.issueTypeId) && this.value.isCheckedEarlyEvent;

    return !isCheckedEarlyEvent;
  }

  updateInputs() {
    if (SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(this.subIssueTypeId)) {
      this.templateService.replaceWrongScoreOfWrongScoreIssueType(this.message,
        this.selectedTemplated.inputTexts[0].msgEnglishValue);
      this.templateService.replaceActualScoreOfWrongScoreIssueType(this.message,
        this.selectedTemplated.inputTexts[1].msgEnglishValue);
    } else {
      this.selectedTemplated.inputTexts.forEach(item => {
        const text: TemplateContent = {
          msgEnglish: item.msgEnglishValue,
          msgChineseTraditional: item.msgChineseTraditionalValue,
          msgChineseSimplified: item.msgChineseSimplifiedValue,
          msgChineseNewSimplified: item.msgChineseNewSimplifiedValue
        };
        this.templateService.replaceEachLanguage(this.message, `{{${item.name}}}`, text);
      });
    }
  }

  updateInputsNextCorner() {
    for (const element of this.selectedTemplated.inputTexts) {
      if (this.issueTypeId === IssueTypeId.DANGER_ACCEPTED && this.value.numberOfCorner && element.msgEnglish === "Next Corner") {
        const nextCorner = OrdinalNumberConstant.ORDINAL_NUMBER.find(x => x.value === this.value.numberOfCorner.toString());
        element.msgEnglishValue = nextCorner.englishValue;
        element.msgChineseTraditionalValue = `第${nextCorner.chineseTraditionalValue}`;
        element.msgChineseSimplifiedValue = `第${nextCorner.chineseSimplifiedValue}`;
        element.msgChineseNewSimplifiedValue = `第${nextCorner.chineseSimplifiedValue}`;
      }
    }
  }

  updateMessageForWrongScore() {
    if (this.issueTypeId === IssueTypeId.WRONG_SCORE) {
      if (SubIssueTypeGroup.SUBTYPE_ONWARDS.includes(this.subIssueTypeId)) {
        this.templateService.replaceWrongScoreOfWrongScoreIssueType(this.message,
          this.value.wrongScore);
        this.templateService.replaceActualScoreOfWrongScoreIssueType(this.message,
          this.value.actualScore);
      } else {
        const replacedContent: TemplateContent = {
          msgEnglish: `${this.value.actualScore}`,
          msgChineseTraditional: `${this.value.actualScore}`,
          msgChineseSimplified: `${this.value.actualScore}`,
          msgChineseNewSimplified: `${this.value.actualScore}`
        };

        this.templateService.replaceEachLanguage(this.message, TemplateReplace.ACTUAL_SCORE, replacedContent);
      }
    }
  }

  updateWrongMarketTVS() {
    if (this.value.wrongMarket) {
      const content: TemplateContent = {
        msgEnglish: `${this.value.wrongMarket}`,
        msgChineseTraditional: `${this.value.wrongMarket}`,
        msgChineseSimplified: `${this.value.wrongMarket}`,
        msgChineseNewSimplified: `${this.value.wrongMarket}`
      };
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.WRONG_MARKET, content);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.WRONG_MARKET, '');
    }
  }

  updateActualMarketTVS() {
    if (this.value.actualMarket) {
      const content: TemplateContent = {
        msgEnglish: `${this.value.actualMarket}`,
        msgChineseTraditional: `${this.value.actualMarket}`,
        msgChineseSimplified: `${this.value.actualMarket}`,
        msgChineseNewSimplified: `${this.value.actualMarket}`
      };
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.ACTUAL_MARKET, content);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.ACTUAL_MARKET, '');
    }
  }

  updateHdpTVS() {
    if (this.value.hdpValue) {
      const content: TemplateContent = {
        msgEnglish: `${this.value.hdpValue}`,
        msgChineseTraditional: `${this.value.hdpValue}`,
        msgChineseSimplified: `${this.value.hdpValue}`,
        msgChineseNewSimplified: `${this.value.hdpValue}`
      };
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.HDP_VALUE, content);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.HDP_VALUE, '');
    }
  }

  updateScore() {
    if (this.value.score !== undefined && this.value.score.length > 0 && !this.value?.isAllNonLiveTickets) {
      const score: TemplateContent = {
        msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${this.value.score}) `,
        msgChineseTraditional: `(${TemplateContentConst.SCORE.msgChineseTraditional} ${this.value.score}) `,
        msgChineseSimplified: `(${TemplateContentConst.SCORE.msgChineseSimplified} ${this.value.score}) `,
        msgChineseNewSimplified: `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${this.value.score}) `
      };
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.SCORE, score);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.SCORE, '');
    }
  }

  updateScoreHaveText() {
    if (this.value.score !== undefined && this.value.score.length > 0 && !this.value?.isAllNonLiveTickets) {
      const score: TemplateContent = {
        msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${this.value.score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
        msgChineseTraditional:
          `(${TemplateContentConst.SCORE.msgChineseTraditional} ${this.value.score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
        msgChineseSimplified:
          `(${TemplateContentConst.SCORE.msgChineseSimplified} ${this.value.score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
        msgChineseNewSimplified:
          `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${this.value.score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
      };
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.SCORE, score);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.SCORE, '');
    }
  }

  updateCheckStatement() {
    if (this.value.checkSettled) {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.CHECK_STATEMENT, TemplateContentConst.CHECK_STATEMENT);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.CHECK_STATEMENT, '');
    }
  }

  updateAIOMessage() {
    if ((this.isVoidSinglePage() && this.value.checkAIOMessage) || this.value.groupPHAffected !== 0) {
      this.templateService.replaceAOIMessage(this.message, this.value.groupPHAffected);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.AOI_MESSAGE, '');
    }
  }

  updateParlay() {
    if (this.isAbnormalBetMixOrSystemParlay()) {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.PARLAY, TemplateContentConst.PARLAY);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.PARLAY, '');
    }
  }

  updateSpecialBetType() {
    if (this.value.isCheckedSpecialBetType && (this.isLikelyWrongMarketOffered() || this.issueTypeUpdateSpecialBetTypeVoidSingleBet())) {
      this.templateService.replaceSpecialBetType(this.message, this.value.betTypeNameReplaceMessage);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.SPECIAL_BET_TYPE, '');
    }
  }

  updateActualMarketTvsWrongOdds() {
    if (this.isTVSVoidPage() && this.isWrongOdds()) {
      this.templateService.replaceActualMarketTvsWrongOdds(this.message, this.subIssueTypeId, this.value);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.ACTUAL_MARKET, '');
    }
  }

  issueTypeUpdateSpecialBetTypeVoidSingleBet(): boolean {
    return this.isVoidSinglePage() &&
      (this.isWrongHDP() || this.isWrongQuarterHDP() || this.isWrongOdds() || this.isLikelyWrongMarketOffered()
        || (this.isWrongOU() && this.selectedTemplated.templateId !== MESSAGE_TEMPLATE_ID_38));
  }

  checkValidation(): boolean {
    return this.messagesComponent.checkValidation();
  }

  public isHasWarningForDynamicInput(): boolean {
    if (this.isShowDynamicInputs()) {
      const isInputsValid = this.selectedTemplated.inputTexts.some(x => !x.msgEnglishValue || !x.msgChineseTraditionalValue
        || !x.msgChineseSimplifiedValue || !x.msgChineseNewSimplifiedValue);

      return isInputsValid;
    }

    return false;
  }

  isDisabledCheckBoxEarlyEvent(): boolean {
    return this.value.eventType === EventType.LIVE;
  }

  isShowCheckBoxSpecialBetType(): boolean {
    return this.isShowMessages && this.issueTypeUpdateSpecialBetTypeVoidSingleBet();
  }

  isShowAioCheckBoxMessage(): boolean {
    return this.isShowMessages && this.isVoidSinglePage() && (this.isWrongHDP() || this.isWrong1stHDP() || this.isWrongOU() || this.isWrong1stOU() || this.isWrongOdds());
  }

  isShowEarlyEventCheckBoxMessage(): boolean {
    return this.isShowMessages && (this.issueTypeShowEarlyEventCheckBox() || this.isWrongOdds());
  }

  issueTypeShowEarlyEventCheckBox(): boolean {
    return this.isVoidSinglePage() && (this.isWrongHDP() || this.isWrong1stHDP() || this.isWrongOU() || this.isWrong1stOU());
  }

  isAbnormalBetMixOrSystemParlay(): boolean {
    return this.isAbnormalBet() && StaticService.isFilterByMixOrSystemParlay(this.value.filterBy);
  }

  isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.issueTypeId?.toString()) && this.value.filterBy === AbnormalFilterBy.MIX_PARLAY;
  }

  isAbnormalAccount(): boolean {
    return StaticService.isAbnormalAccount(this.issueTypeId?.toString());
  }

  isAbnormalBet(): boolean {
    return StaticService.isAbnormalBet(this.issueTypeId?.toString());
  }

  isWrongScore(): boolean {
    return StaticService.isWrongScore(this.issueTypeId?.toString());
  }

  isTVSVoidPage(): boolean {
    return this.voidFunction === FunctionConst.TVS_VOID_PAGE;
  }

  isTVSAddOrEditPage(): boolean {
    return this.voidFunction === FunctionConst.TVS_ADD_PAGE;
  }

  isVoidSinglePage(): boolean {
    return this.voidFunction === FunctionConst.SINGLE;
  }

  isShowDynamicInputs(): boolean {
    return this.isVoidSinglePage() || (this.isTVSVoidPage() && !this.isWrongScore() && !this.isWrongOdds());
  }

  isWrongOdds(): boolean {
    return StaticService.isWrongOdds(this.issueTypeId?.toString());
  }

  isWrongHDP(): boolean {
    return StaticService.isWrongHDP(this.issueTypeId?.toString());
  }

  isWrong1stHDP(): boolean {
    return StaticService.isWrong1stHDP(this.issueTypeId?.toString());
  }

  isWrongQuarterHDP(): boolean {
    return StaticService.isWrongQuarterHDP(this.issueTypeId?.toString());
  }

  isWrongOU(): boolean {
    return StaticService.isWrongOU(this.issueTypeId?.toString());
  }

  isWrong1stOU(): boolean {
    return StaticService.isWrong1stOU(this.issueTypeId?.toString());
  }

  isOtherIssues(): boolean {
    return StaticService.isOtherIssues(this.issueTypeId?.toString());
  }

  isLikelyWrongMarketOffered(): boolean {
    return StaticService.isLikelyWrongMarketOffered(this.issueTypeId?.toString());
  }
}
