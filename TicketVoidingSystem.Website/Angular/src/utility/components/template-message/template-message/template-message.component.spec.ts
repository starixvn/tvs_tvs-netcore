import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../../utility/modules/testing.module';
import { TemplateMessageComponent } from './template-message.component';
import { HttpService } from '../../../../utility/services/http.service';
import { StaticService } from '../../../../utility/services/static.service';
import { ReplaceEventTypeService } from './services/replace-event-type.service';
import { ReplaceCommonValuesService } from './services/replace-common-values.service';
import { ReplacePlacedFromTimeRangeService } from './services/replace-placed-from-time-range.service';
import { ReplaceScoreService } from './services/replace-score.service';
import { ReplaceAIOMessageService } from './services/replace-aio-message.serivce';
import { ReplaceSpecialBetTypeService } from './services/replace-special-bet-type.service';
import { TemplateInputsService } from './services/template-inputs.service';
import { TemplateInputsForTVSService } from './services/template-inputs-for-tvs.service';
import { TemplateModel, TemplateValue } from './template.model';
import { TemplateSettings, TemplateSetting } from './template-setting.model';
import { EventType } from '../../../../utility/constants/sport.constant';
import { FunctionConst, AbnormalFilterBy } from '../../../../utility/constants/config';
import { IssueTypeConstant } from '../../../../utility/constants/issue-type.constant';
import { SimpleChange } from '@angular/core';
import { Message } from '../messages/message';

class Helper {
  static readonly fakeTemplateSettings: TemplateSettings = {
    messageTemplates: [],
    templateSettings: []
  };

  static readonly fakeTemplateModel: TemplateModel = {
    templateId: 1,
    msgEnglish: 'Test English',
    msgChineseTraditional: 'Test Chinese Traditional',
    msgChineseSimplified: 'Test Chinese Simplified',
    msgChineseNewSimplified: 'Test Chinese New Simplified',
    inputTexts: [
      {
        name: 'Test Input',
        msgEnglish: 'Test Input',
        msgEnglishValue: 'Test Value',
        msgChineseTraditional: 'Test Input',
        msgChineseTraditionalValue: 'Test Value',
        msgChineseSimplified: 'Test Input',
        msgChineseSimplifiedValue: 'Test Value',
        msgChineseNewSimplified: 'Test Input',
        msgChineseNewSimplifiedValue: 'Test Value',
        hideChinese: false,
        pattern: 'Test Pattern'
      }
    ]
  };

  static readonly fakeTemplateValue: TemplateValue = {
    sportTypeId: 1,
    isCheckedVar: false,
    eventType: EventType.LIVE,
    filterBy: 1,
    matchId: 1,
    groupPHAffected: 0
  };

  static readonly emptyInputText = {
    name: 'Test',
    msgEnglish: 'Test',
    msgEnglishValue: '',
    msgChineseTraditional: 'Test',
    msgChineseTraditionalValue: '',
    msgChineseSimplified: 'Test',
    msgChineseSimplifiedValue: '',
    msgChineseNewSimplified: 'Test',
    msgChineseNewSimplifiedValue: '',
    hideChinese: false,
    pattern: ''
  };

  static readonly filledInputText = {
    name: 'Test',
    msgEnglish: 'Test',
    msgEnglishValue: 'English Value',
    msgChineseTraditional: 'Test',
    msgChineseTraditionalValue: '',
    msgChineseSimplified: 'Test',
    msgChineseSimplifiedValue: '',
    msgChineseNewSimplified: 'Test',
    msgChineseNewSimplifiedValue: '',
    hideChinese: false,
    pattern: ''
  };

  static readonly templateSettingWithCheckedVar: TemplateSetting = {
    subIssueTypeId: 1,
    isCheckedVar: true,
    templateId: 1,
    sportType: 1
  } as TemplateSetting;

  static readonly templateSettingWithoutCheckedVar: TemplateSetting = {
    subIssueTypeId: 1,
    isCheckedVar: false,
    templateId: 1,
    sportType: 1
  } as TemplateSetting;

  static readonly templateModelWithTemplateId8: TemplateModel = {
    ...Helper.fakeTemplateModel,
    templateId: 8,
    inputTexts: [{
      ...Helper.emptyInputText,
      msgEnglishValue: 'Old Value',
      msgChineseTraditionalValue: 'Old Value',
      msgChineseSimplifiedValue: 'Old Value',
      msgChineseNewSimplifiedValue: 'Old Value',
      hideChinese: false
    }]
  };

  static readonly templateModelWithTemplateId37: TemplateModel = {
    ...Helper.fakeTemplateModel,
    templateId: 37
  };

  static readonly templateModelWithTemplateId65: TemplateModel = {
    ...Helper.fakeTemplateModel,
    templateId: 65
  };

  static readonly templateModelWithTemplateId38: TemplateModel = {
    ...Helper.fakeTemplateModel,
    templateId: 38
  };

  static readonly simpleChange = (currentValue: any, previousValue: any = null) => ({
    currentValue,
    previousValue,
    firstChange: true
  } as SimpleChange);
}

describe('TemplateMessageComponent', () => {
  let component: TemplateMessageComponent;
  let fixture: ComponentFixture<TemplateMessageComponent>;
  let httpService: HttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        HttpService,
        StaticService,
        ReplaceEventTypeService,
        ReplaceCommonValuesService,
        ReplacePlacedFromTimeRangeService,
        ReplaceScoreService,
        ReplaceAIOMessageService,
        ReplaceSpecialBetTypeService,
        TemplateInputsService,
        TemplateInputsForTVSService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateMessageComponent);
    httpService = fixture.debugElement.injector.get(HttpService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', async () => {
    // Arrange
    httpService.getJson = jest.fn().mockResolvedValue(Helper.fakeTemplateSettings);

    // Act
    await component.init();

    // Assert
    expect(component.initialize).toBeTruthy();
    expect(httpService.getJson).toHaveBeenCalledWith('api/MessageTemplate/GetTemplateSettings');
  });

  it('should handle changes in subIssueTypeId and value', async () => {
    // Arrange
    component.subIssueTypeId = 1;
    component.value = Helper.fakeTemplateValue;
    component.templates = [Helper.templateModelWithTemplateId37];
    component.templateSettings = Helper.fakeTemplateSettings.templateSettings;
    component.initialize = true;
    component.issueTypeId = 13;

    // Act
    await component.ngOnChanges({
      subIssueTypeId: Helper.simpleChange(1),
      value: Helper.simpleChange(Helper.fakeTemplateValue)
    });

    // Assert
    expect(component.selectedTemplated).toBeDefined();
    expect(component.initialMessage).toBeDefined();
  });

  it('should update template when subIssueTypeId changes', async () => {
    // Arrange
    component.subIssueTypeId = 1;
    component.issueTypeId = 13;
    component.value = Helper.fakeTemplateValue;
    component.templates = [Helper.templateModelWithTemplateId37];
    component.templateSettings = Helper.fakeTemplateSettings.templateSettings;
    component.initialize = true;

    // Act
    component.updateTemplate();

    // Assert
    expect(component.selectedTemplated).toBeDefined();
  });

  it('should show dynamic inputs for void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show dynamic inputs for TVS void page with wrong score', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_SCORE);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show checkbox var message for void single page with danger accepted', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithCheckedVar];
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show AIO checkbox message for void single page with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show early event checkbox message for void single page with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if duplicate tickets is mix parlay', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.DUPLICATE_TICKETS);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MIX_PARLAY };

    // Act
    const result = component.isDuplicateTicketsMixParlay();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if TVS void page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;

    // Act
    const result = component.isTVSVoidPage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if TVS add or edit page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_ADD_PAGE;

    // Act
    const result = component.isTVSAddOrEditPage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;

    // Act
    const result = component.isVoidSinglePage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should get template settings and set input text values', async () => {
    // Arrange
    const fakeSettings: TemplateSettings = {
      messageTemplates: [Helper.templateModelWithTemplateId8],
      templateSettings: []
    };
    httpService.getJson = jest.fn().mockResolvedValue(fakeSettings);

    // Act
    await component.getTemplateSetting();

    // Assert
    expect(component.templates).toHaveLength(1);
    expect(component.templates[0].inputTexts[0].msgEnglishValue).toBe('');
    expect(component.templates[0].inputTexts[0].msgChineseTraditionalValue).toBe('');
    expect(component.templates[0].inputTexts[0].msgChineseSimplifiedValue).toBe('');
    expect(component.templates[0].inputTexts[0].msgChineseNewSimplifiedValue).toBe('');
    expect(component.templates[0].inputTexts[0].hideChinese).toBeTruthy();
  });

  it('should set Chinese input values when auto binding is enabled', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);
    const inputText = { ...Helper.filledInputText };

    // Act
    component.setChineseInput(inputText);

    // Assert
    expect(inputText.msgChineseTraditionalValue).toBe('English Value');
    expect(inputText.msgChineseSimplifiedValue).toBe('English Value');
    expect(inputText.msgChineseNewSimplifiedValue).toBe('English Value');
  });

  it('should not set Chinese input values when auto binding is disabled', () => {
    // Arrange
    component.issueTypeId = 99; // Issue type not in auto binding list
    const inputText = { ...Helper.filledInputText };

    // Act
    component.setChineseInput(inputText);

    // Assert
    expect(inputText.msgChineseTraditionalValue).toBe('');
    expect(inputText.msgChineseSimplifiedValue).toBe('');
    expect(inputText.msgChineseNewSimplifiedValue).toBe('');
  });

  it('should find template ID by sport type and isCheckedVar', () => {
    // Arrange
    component.templateSettings = [
      {
        subIssueTypeId: 1,
        sportType: 1,
        isCheckedVar: true,
        templateId: 10
      } as TemplateSetting,
      {
        subIssueTypeId: 1,
        sportType: null,
        isCheckedVar: true,
        templateId: 20
      } as TemplateSetting
    ];

    // Act
    const result = component['findTemplateId'](1, 1, true);

    // Assert
    expect(result).toBe(10);
  });

  it('should find default template ID when sport type not found', () => {
    // Arrange
    component.templateSettings = [
      {
        subIssueTypeId: 1,
        sportType: null,
        isCheckedVar: null,
        templateId: 20
      } as TemplateSetting
    ];

    // Act
    const result = component['findTemplateId'](1, 999, false);

    // Assert
    expect(result).toBe(20);
  });

  it('should return 9999 when no template found', () => {
    // Arrange
    component.templateSettings = [];

    // Act
    const result = component['findTemplateId'](1, 1, false);

    // Assert
    expect(result).toBe(9999);
  });

  it('should update template for abnormal account', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.ABNORMAL_ACCOUNT);
    component.value = Helper.fakeTemplateValue;
    component.templates = [Helper.templateModelWithTemplateId37];
    component.templateSettings = [];

    // Act
    component.updateTemplate();

    // Assert
    expect(component.selectedTemplated.templateId).toBe(37);
  });

  it('should update template for abnormal bet mix parlay', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.ABNORMAL_BET);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MIX_PARLAY };
    component.templates = [Helper.templateModelWithTemplateId37];
    component.templateSettings = [];

    // Act
    component.updateTemplate();

    // Assert
    expect(component.selectedTemplated.templateId).toBe(37);
  });

  it('should update template for abnormal bet many match', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.ABNORMAL_BET);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MANY_MATCH };
    component.templates = [Helper.templateModelWithTemplateId37];
    component.templateSettings = [];

    // Act
    component.updateTemplate();

    // Assert
    expect(component.selectedTemplated.templateId).toBe(37);
  });

  it('should update template for duplicate tickets mix parlay', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.DUPLICATE_TICKETS);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MIX_PARLAY };
    component.templates = [Helper.templateModelWithTemplateId65];
    component.templateSettings = [];

    // Act
    component.updateTemplate();

    // Assert
    expect(component.selectedTemplated.templateId).toBe(65);
  });

  it('should update checkbox var message', () => {
    // Arrange
    component.subIssueTypeId = 1;
    component.issueTypeId = 1;
    component.value = Helper.fakeTemplateValue;
    component.templates = [Helper.fakeTemplateModel];
    component.templateSettings = [
      {
        subIssueTypeId: 1,
        sportType: 1,
        isCheckedVar: null,
        templateId: 1
      } as TemplateSetting
    ];
    component.selectedTemplated = Helper.fakeTemplateModel;
    component.message = new Message();

    // Act
    component.updateCheckBoxVarMessage();

    // Assert
    expect(component.initialMessage).toBeDefined();
  });

  it('should reset message from selected template', () => {
    // Arrange
    component.selectedTemplated = Helper.fakeTemplateModel;
    component.message = new Message();

    // Act
    component['resetMessage']();

    // Assert
    expect(component.message.contentEnglish).toBe(Helper.fakeTemplateModel.msgEnglish);
    expect(component.message.contentChineseTraditional).toBe(Helper.fakeTemplateModel.msgChineseTraditional);
    expect(component.message.contentChineseSimplified).toBe(Helper.fakeTemplateModel.msgChineseSimplified);
    expect(component.message.contentNewChineseSimplified).toBe(Helper.fakeTemplateModel.msgChineseNewSimplified);
  });

  it('should update message and set isTVSAddOrEditPage', () => {
    // Arrange
    component.selectedTemplated = Helper.fakeTemplateModel;
    component.voidFunction = FunctionConst.TVS_ADD_PAGE;
    component.value = Helper.fakeTemplateValue;
    component.issueTypeId = 1;
    component.subIssueTypeId = 1;

    // Act
    component.updateMessage();

    // Assert
    expect(component.message.isTVSAddOrEditPage).toBeTruthy();
  });

  it('should check validation through messages component', () => {
    // Arrange
    component.messagesComponent = {
      checkValidation: jest.fn().mockReturnValue(true)
    } as any;

    // Act
    const result = component.checkValidation();

    // Assert
    expect(result).toBeTruthy();
    expect(component.messagesComponent.checkValidation).toHaveBeenCalled();
  });

  it('should return true when has warning for dynamic input with empty values', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.selectedTemplated = {
      ...Helper.fakeTemplateModel,
      inputTexts: [Helper.emptyInputText]
    };

    // Act
    const result = component.isHasWarningForDynamicInput();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false when no warning for dynamic input with all values filled', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.isHasWarningForDynamicInput();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false when not showing dynamic inputs', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_SCORE);

    // Act
    const result = component.isHasWarningForDynamicInput();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should disable checkbox early event for live event', () => {
    // Arrange
    component.value = { ...Helper.fakeTemplateValue, eventType: EventType.LIVE };

    // Act
    const result = component.isDisabledCheckBoxEarlyEvent();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should enable checkbox early event for non-live event', () => {
    // Arrange
    component.value = { ...Helper.fakeTemplateValue, eventType: '0' }; // Non-live event

    // Act
    const result = component.isDisabledCheckBoxEarlyEvent();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show checkbox special bet type for void single page with wrong market offered', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_MARKET_OFFERED);
    component.isShowMessages = true;

    // Act
    const result = component.isShowCheckBoxSpecialBetType();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show checkbox special bet type when isShowMessages is false', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_MARKET_OFFERED);
    component.isShowMessages = false;

    // Act
    const result = component.isShowCheckBoxSpecialBetType();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show AIO checkbox message for wrong 1st HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_HDP);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show AIO checkbox message for wrong OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show AIO checkbox message for wrong 1st OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_OU);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show AIO checkbox message for wrong odds', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_ODDS);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show AIO checkbox message for non-void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show early event checkbox message for wrong odds', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_ODDS);
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show early event checkbox message for void single page with wrong 1st HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_HDP);
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show early event checkbox message for void single page with wrong OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show early event checkbox message for void single page with wrong 1st OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_OU);
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeShowEarlyEventCheckBox with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);

    // Act
    const result = component.issueTypeShowEarlyEventCheckBox();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for issueTypeShowEarlyEventCheckBox when not void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);

    // Act
    const result = component.issueTypeShowEarlyEventCheckBox();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true for isAbnormalBetManyMatch', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.ABNORMAL_BET);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MANY_MATCH };

    // Act
    const result = component.isAbnormalBetManyMatch();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for isAbnormalBetManyMatch when not abnormal bet', () => {
    // Arrange
    component.issueTypeId = 1;
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MANY_MATCH };

    // Act
    const result = component.isAbnormalBetManyMatch();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false for isAbnormalBetManyMatch when filterBy is not MANY_MATCH', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.ABNORMAL_BET);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MIX_PARLAY };

    // Act
    const result = component.isAbnormalBetManyMatch();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false for isDuplicateTicketsMixParlay when not duplicate tickets', () => {
    // Arrange
    component.issueTypeId = 1;
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.MIX_PARLAY };

    // Act
    const result = component.isDuplicateTicketsMixParlay();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return false for isDuplicateTicketsMixParlay when filterBy is not MIX_PARLAY', () => {
    // Arrange
    component.issueTypeId = parseInt(IssueTypeConstant.DUPLICATE_TICKETS);
    component.value = { ...Helper.fakeTemplateValue, filterBy: AbnormalFilterBy.SINGLE };

    // Act
    const result = component.isDuplicateTicketsMixParlay();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeTvs with other issues', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.OTHER_ISSUES);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeTvs with wrong market offered', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_MARKET_OFFERED);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeTvs with wrong odds sports book', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeTvs with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeTvs with wrong OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for issueTypeUpdateSpecialBetTypeTvs when not TVS void page', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.OTHER_ISSUES);

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeTvs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeVoidSingleBet with wrong market offered', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_MARKET_OFFERED);
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeVoidSingleBet();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeVoidSingleBet with wrong quarter HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_QUARTER_HDP);
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeVoidSingleBet();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for issueTypeUpdateSpecialBetTypeVoidSingleBet when wrong OU with template ID 38', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);
    component.selectedTemplated = Helper.templateModelWithTemplateId38;

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeVoidSingleBet();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should return true for issueTypeUpdateSpecialBetTypeVoidSingleBet when wrong OU with template ID not 38', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);
    component.selectedTemplated = { ...Helper.fakeTemplateModel, templateId: 1 };

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeVoidSingleBet();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should return false for issueTypeUpdateSpecialBetTypeVoidSingleBet when not void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_MARKET_OFFERED);
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.issueTypeUpdateSpecialBetTypeVoidSingleBet();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show dynamic inputs for TVS void page with valid issue types', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.OTHER_ISSUES);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show dynamic inputs for TVS void page with wrong odds', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_ODDS);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show dynamic inputs for TVS void page with wrong odds sports book', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_ODDS_SPORTS_BOOK);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show dynamic inputs for TVS void page with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_HDP);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show dynamic inputs for TVS void page with wrong 1st HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_HDP);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show dynamic inputs for TVS void page with wrong OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_OU);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show dynamic inputs for TVS void page with wrong 1st OU', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_1ST_OU);

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show checkbox var message when isShowMessages is false', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
    component.isShowMessages = false;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithCheckedVar];

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should not show checkbox var message when not void single page', () => {
    // Arrange
    component.voidFunction = FunctionConst.TVS_VOID_PAGE;
    component.issueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithCheckedVar];

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show checkbox var message for red card', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.RED_CARD);
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithCheckedVar];

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show checkbox var message for wrong score', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.WRONG_SCORE);
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithCheckedVar];

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should not show checkbox var message when no template setting with isCheckedVar', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = parseInt(IssueTypeConstant.DANGER_ACCEPTED);
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [Helper.templateSettingWithoutCheckedVar];

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeFalsy();
  });
});
