import { Component, inject, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { AbnormalFilterBy, FunctionConst } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { EventType } from '../../../../utility/constants/sport.constant';
import { HttpService } from '../../../../utility/services/http.service';
import { StaticService } from '../../../../utility/services/static.service';
import { Message } from '../messages/message';
import { MessagesComponent } from '../messages/messages.component';
import { ReplaceAIOMessageService } from './services/replace-aio-message.serivce';
import { ReplaceCommonValuesService } from './services/replace-common-values.service';
import { ReplaceEventTypeService } from './services/replace-event-type.service';
import { ReplacePlacedFromTimeRangeService } from './services/replace-placed-from-time-range.service';
import { ReplaceScoreService } from './services/replace-score.service';
import { ReplaceSpecialBetTypeService } from './services/replace-special-bet-type.service';
import { TemplateInputsForTVSService } from './services/template-inputs-for-tvs.service';
import { TemplateInputsService } from './services/template-inputs.service';
import { TemplateSetting, TemplateSettings } from './template-setting.model';
import { InputText, TemplateModel, TemplateValue } from './template.model';

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
  standalone: true,
  selector: 'template-message',
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.scss'],
  imports: [FormsModule, MessagesComponent],
})
export class TemplateMessageComponent implements OnChanges {
  @Input() id: number;
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
    IssueTypeConstant.WRONG_HDP,
    IssueTypeConstant.WRONG_1ST_HDP,
    IssueTypeConstant.WRONG_OU,
    IssueTypeConstant.WRONG_1ST_OU,
    IssueTypeConstant.WRONG_SCORE,
    IssueTypeConstant.WRONG_MARKET_OFFERED
  ];

  public initialize: boolean;

  httpService = inject(HttpService);
  replaceEventTypeService = inject(ReplaceEventTypeService);
  replaceCommonValuesService = inject(ReplaceCommonValuesService);
  replacePlacedFromTimeRangeService = inject(ReplacePlacedFromTimeRangeService);
  replaceScoreService = inject(ReplaceScoreService);
  replaceAIOMessageService = inject(ReplaceAIOMessageService);
  replaceSpecialBetTypeService = inject(ReplaceSpecialBetTypeService);
  templateInputsService = inject(TemplateInputsService);
  templateInputsServiceForTVS = inject(TemplateInputsForTVSService);

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    await this.init();
    if ((changes['subIssueTypeId'] || changes['value']) && this.subIssueTypeId) {
      this.updateTemplate();
      this.initialMessage = cloneDeep(this.message);
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
    if (this.autoBindingChineseForIssueId.includes(this.issueTypeId?.toString())) {
      item.msgChineseTraditionalValue = item.msgChineseSimplifiedValue = item.msgChineseNewSimplifiedValue = item.msgEnglishValue;
    }
  }

  updateTemplate() {
    let templateId = 0;
    if (StaticService.isAbnormalAccount(this.issueTypeId) || this.isAbnormalBetMixOrSystemParlay() || this.isAbnormalBetManyMatch()) {
      templateId = MESSAGE_TEMPLATE_ID_37;
    } else if (this.isDuplicateTicketsMixParlay()) {
      templateId = MESSAGE_TEMPLATE_ID_65;
    } else {
      templateId = this.findTemplateId(this.subIssueTypeId, this.value.sportTypeId, this.value.isCheckedVar);
    }
    this.selectedTemplated = this.templates.find(x => x.templateId === templateId);
    this.templateInputsService.updateOrdinalNumberForInputsDangerAccepted(this.selectedTemplated, this.value);

    this.updateMessage();
  }

  private findTemplateId(subIssueType: number, sportType?: number, isCheckedVar = false): number {
    const filterSportType = sportType ? sportType : null;
    const filterVar = isCheckedVar ? isCheckedVar : null;

    const settingsBySubType = this.templateSettings.filter(x => x.subIssueTypeId === subIssueType);
    const settingBySportType = settingsBySubType.find(x => x.sportType === filterSportType && x.isCheckedVar === filterVar);
    const defaultTemplateWhenSportNull = settingsBySubType.find(x => x.sportType === null && x.isCheckedVar === filterVar);

    if (settingBySportType) {
      return settingBySportType.templateId;
    }

    return (defaultTemplateWhenSportNull ? defaultTemplateWhenSportNull.templateId : 9999);
  }

  updateCheckBoxVarMessage() {
    this.updateTemplate();
    this.initialMessage = cloneDeep(this.message);
  }

  updateMessage() {
    this.resetMessage();
    this.replaceEventDetails();
    this.replaceFromInputs();
    this.replaceOthersInfo();
    this.message.isTVSAddOrEditPage = this.isTVSAddOrEditPage();
  }

  private resetMessage(): void {
    this.message.contentEnglish = this.selectedTemplated.msgEnglish;
    this.message.contentChineseTraditional = this.selectedTemplated.msgChineseTraditional;
    this.message.contentChineseSimplified = this.selectedTemplated.msgChineseSimplified;
    this.message.contentNewChineseSimplified = this.selectedTemplated.msgChineseNewSimplified;
  }

  private replaceEventDetails(): void {
    this.replaceEventTypeService.execute(this.value, this.issueTypeId, this.subIssueTypeId, this.message);
    this.replaceCommonValuesService.replaceSportType(this.value, this.message);
    this.replaceCommonValuesService.replaceHomeTeamName(this.value, this.message);
    this.replaceCommonValuesService.replaceAwayTeamName(this.value, this.message);
    this.replaceCommonValuesService.replaceLeagueName(this.value, this.message);
    this.replaceCommonValuesService.replaceEventDate(this.value, this.message, this.issueTypeId);
    this.replaceCommonValuesService.replaceKickOffTime(this.value, this.message);
    this.replaceCommonValuesService.replacePlayerName(this.value, this.message);
    this.replaceCommonValuesService.replaceParlay(this.isAbnormalBetMixOrSystemParlay(), this.message);
    this.replaceCommonValuesService.replaceCheckStatement(this.value, this.message);
    this.replacePlacedFromTimeRangeService.execute(this.value, this.message, this.selectedTemplated.templateId);
  }

  private replaceFromInputs(): void {
    if (this.isTVSVoidPage() || this.isTVSAddOrEditPage()) {
      this.templateInputsServiceForTVS.replaceInputsByIssueType(this.issueTypeId, this.subIssueTypeId, this.value, this.message, this.selectedTemplated);
    } else {
      this.templateInputsService.replaceInputs(this.subIssueTypeId, this.selectedTemplated, this.message);
    }
  }

  private replaceOthersInfo(): void {
    this.replaceCommonValuesService.replaceMap(this.value, this.message);
    this.replaceScoreService.execute(this.value, this.message);
    this.replaceAIOMessageService.execute(this.isVoidSinglePage(), this.value, this.message);
    this.replaceSpecialBetTypeService.execute(this.issueTypeUpdateSpecialBetTypeTvs(), this.issueTypeUpdateSpecialBetTypeVoidSingleBet(), this.value, this.message);
    this.replaceCommonValuesService.replaceInning(this.value, this.message);
  }

  issueTypeUpdateSpecialBetTypeTvs(): boolean {
    return this.isTVSVoidPage() && (StaticService.isOtherIssues(this.issueTypeId)
      || StaticService.isWrongMarketOffered(this.issueTypeId)
      || StaticService.isWrongOddsSportsBook(this.issueTypeId)
      || StaticService.isWrongHDP(this.issueTypeId)
      || StaticService.isWrongOU(this.issueTypeId)
    );
  }

  issueTypeUpdateSpecialBetTypeVoidSingleBet(): boolean {
    return this.isVoidSinglePage() && (
      StaticService.isWrongMarketOffered(this.issueTypeId) ||
      StaticService.isWrongOddsSportsBook(this.issueTypeId) ||
      StaticService.isWrongHDP(this.issueTypeId) ||
      StaticService.isWrongQuarterHDP(this.issueTypeId) ||
      StaticService.isWrongOdds(this.issueTypeId) ||
      StaticService.isOtherIssues(this.issueTypeId) ||
      (StaticService.isWrongOU(this.issueTypeId) && this.selectedTemplated.templateId !== MESSAGE_TEMPLATE_ID_38)
    );
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

  isShowCheckBoxVarMessage(): boolean {
    return this.isShowMessages
      && this.isVoidSinglePage() && (StaticService.isDangerAccepted(this.issueTypeId) || StaticService.isRedCard(this.issueTypeId) || StaticService.isWrongScore(this.issueTypeId))
      && this.templateSettings.some(x => x.subIssueTypeId === this.subIssueTypeId && x.isCheckedVar);
  }

  isShowAioCheckBoxMessage(): boolean {
    return this.isShowMessages && this.isVoidSinglePage()
      && (StaticService.isWrongHDP(this.issueTypeId) || StaticService.isWrong1stHDP(this.issueTypeId)
        || StaticService.isWrongOU(this.issueTypeId) || StaticService.isWrong1stOU(this.issueTypeId) || StaticService.isWrongOdds(this.issueTypeId));
  }

  isShowEarlyEventCheckBoxMessage(): boolean {
    return this.isShowMessages && (this.issueTypeShowEarlyEventCheckBox() || StaticService.isWrongOdds(this.issueTypeId));
  }

  issueTypeShowEarlyEventCheckBox(): boolean {
    return this.isVoidSinglePage()
      && (StaticService.isWrongHDP(this.issueTypeId) || StaticService.isWrong1stHDP(this.issueTypeId)
        || StaticService.isWrongOU(this.issueTypeId) || StaticService.isWrong1stOU(this.issueTypeId));
  }

  isAbnormalBetMixOrSystemParlay(): boolean {
    return StaticService.isAbnormalBet(this.issueTypeId) && StaticService.isFilterByMixOrSystemParlay(this.value.filterBy);
  }

  isAbnormalBetManyMatch(): boolean {
    return StaticService.isAbnormalBet(this.issueTypeId) && this.value.filterBy === AbnormalFilterBy.MANY_MATCH;
  }

  isDuplicateTicketsMixParlay(): boolean {
    return StaticService.isDuplicateTickets(this.issueTypeId) && this.value.filterBy === AbnormalFilterBy.MIX_PARLAY;
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
    return this.isVoidSinglePage()
      || (this.isTVSVoidPage() && !StaticService.isWrongScore(this.issueTypeId) && !StaticService.isWrongOdds(this.issueTypeId) && !StaticService.isWrongOddsSportsBook(this.issueTypeId)
        && !StaticService.isWrongHDP(this.issueTypeId) && !StaticService.isWrong1stHDP(this.issueTypeId)
        && !StaticService.isWrongOU(this.issueTypeId) && !StaticService.isWrong1stOU(this.issueTypeId));
  }
}
