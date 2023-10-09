import { Component, Input, OnChanges, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { EventType } from '../../const/sport-type';
import { Message } from '../messages/message';
import { HttpService } from './../../services/http.service';
import { MessagesComponent } from './../messages/messages.component';
import { IssueTypesModel, TemplateSettings } from './template-setting.model';
import { Format, IssueTypeId, SubIssueTypeId, TemplateContentConst, TemplateReplace, VoidFunction } from './template.const';
import { InputText, TemplateContent, TemplateModel, TemplateValue } from './template.model';
import { TemplateService } from './template.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'template-message',
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.scss']
})
export class TemplateMessageComponent implements OnInit, OnChanges {
  @Input() value = new TemplateValue();
  @Input() isShowMessages = true;
  @Input() voidFunction?: number;
  @ViewChild('messages') messagesComponent: MessagesComponent;
  templates: TemplateModel[] = [];
  selectedTemplated = new TemplateModel();
  message = new Message();
  settings = new TemplateSettings();

  private hideInputChineseForTemplateId = [8, 9, 10, 11, 29, 30, 31, 32, 35];
  private autoBindingChineseForIssueId = [
    IssueTypeId.WRONG_HDP,
    IssueTypeId.WRONG_1ST_HDP,
    IssueTypeId.WRONG_OU,
    IssueTypeId.WRONG_1ST_OU,
    IssueTypeId.WRONG_SCORE,
    IssueTypeId.WRONG_MARKET_OFFERED
  ];

  constructor(private httpService: HttpService, private templateService: TemplateService) { }

  ngOnInit() { }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes['value']) {
      await this.init();
      this.updateTemplate();
    }
  }

  async init() {
    await this.getTemplateSettings();
  }

  async getTemplateSettings() {
    if (this.settings.issueTypes.length === 0) {
      const typeViewModel = await this.httpService.getJson<IssueTypesModel>('api/SharedApi/GetIssueTypes');
      this.updateIssueTypesByFunction(typeViewModel);
      const data = await this.httpService.getJson<TemplateSettings>('api/MessageTemplate/GetTemplateSettings');

      this.settings = data;
      this.settings.issueTypes = typeViewModel.issueTypes;
      this.settings.subIssueTypes = typeViewModel.subIssueTypes;
      this.settings.issueId = this.settings.issueTypes[0].issueTypeId.toString();
      this.updateSubIssueType();

      this.templates = data.messageTemplates;
      this.templates.forEach(item => {
        this.setInputTextValue(item);
      });
    }
  }

  updateIssueTypesByFunction(typeViewModel: IssueTypesModel) {
    if (this.voidFunction === VoidFunction.EARLY_KICK_OFF) {
      typeViewModel.issueTypes = typeViewModel.issueTypes.filter(
        x => x.issueTypeId === IssueTypeId.EARLY_KICK_OFF || x.issueTypeId === IssueTypeId.WRONG_KICK_OFF_TIME
      );
    }
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

  generateChinese(item: InputText) {
    if (this.autoBindingChineseForIssueId.indexOf(parseInt(this.settings.issueId, 10)) > -1) {
      item.msgChineseTraditionalValue = item.msgChineseSimplifiedValue = item.msgChineseNewSimplifiedValue = item.msgEnglishValue;
    }
  }

  updateTemplate() {
    const templateId = this.findTemplateId(this.value.sportTypeId);
    this.selectedTemplated = this.templates.find(x => x.templateId === templateId);
    this.updateMessage();
  }

  updateMessage() {
    this.resetMessage();
    this.replaceValue();
    this.updateInputs();
    this.updateScore();
    this.updateCheckStatement();
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
    this.templateService.replaceAll(this.message, TemplateReplace.EVENT_DATE, this.value.eventDate);

    this.replaceEventType();
    this.templateService.replaceTime(this.message, this.value, this.selectedTemplated.templateId);
    this.templateService.replaceKickOffTime(this.message, this.value.kickOffTime);
  }

  replaceEventType() {
    const issuesEventType = [
      IssueTypeId.WRONG_ODDS,
      IssueTypeId.WRONG_HDP,
      IssueTypeId.WRONG_1ST_HDP,
      IssueTypeId.WRONG_OU,
      IssueTypeId.WRONG_1ST_OU
    ];
    if (this.value.eventType === EventType.LIVE) {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.EVENT_TYPE, TemplateContentConst.LIVE);
    } else if (
      issuesEventType.indexOf(parseInt(this.settings.issueId, 10)) > -1 &&
      this.value.eventDate ===
      moment(new Date())
        .add(-12, 'hours')
        .format(Format.EVENT_DATE)
    ) {
      this.templateService.replaceAll(this.message, TemplateReplace.EVENT_TYPE, '');
    } else {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.EVENT_TYPE, TemplateContentConst.EARLY);
    }
  }

  updateInputs() {
    if (this.settings.issueId === IssueTypeId.WRONG_MARKET_OFFERED.toString()
      && this.selectedTemplated.inputTexts[0].msgEnglishValue.length > 0) {
      const isOnwardsSubtype = this.settings.subIssueId === SubIssueTypeId.ONWARDS;
      this.templateService.replaceScoreOfWrongMarketOffered(this.message,
        this.selectedTemplated.inputTexts[0].msgEnglishValue, isOnwardsSubtype);
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

  updateScore() {
    if (this.value.score !== undefined && this.value.score.length > 0) {
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

  updateCheckStatement() {
    if (this.value.checkSettled) {
      this.templateService.replaceEachLanguage(this.message, TemplateReplace.CHECK_STATEMENT, TemplateContentConst.CHECK_STATEMENT);
    } else {
      this.templateService.replaceAll(this.message, TemplateReplace.CHECK_STATEMENT, '');
    }
  }

  checkValidation(): boolean {
    return this.messagesComponent.checkValidation();
  }

  resetData() {
    this.settings.issueId = this.settings.issueTypes[0].issueTypeId.toString();
    this.updateSubIssueType();
    this.updateTemplate();
  }

  updateSubIssueType() {
    this.settings.selectedSubIssueTypes = this.settings.subIssueTypes.filter(x => x.issueTypeId === parseInt(this.settings.issueId, 10));
    this.settings.subIssueId = this.settings.selectedSubIssueTypes[0].subIssueTypeId.toString();
  }

  private findTemplateId(sporttype?: number): number {
    const settingsBySubType = this.settings.templateSettings.filter(x => x.subIssueTypeId === parseInt(this.settings.subIssueId, 10));
    const settingBySporttype = settingsBySubType.find(x => x.sportType === sporttype);
    const defaultTemplate = settingsBySubType.find(x => _.isNull(x.sportType));

    return _.isNil(sporttype) || _.isNil(settingBySporttype) ? defaultTemplate.templateId : settingBySporttype.templateId;
  }
}
