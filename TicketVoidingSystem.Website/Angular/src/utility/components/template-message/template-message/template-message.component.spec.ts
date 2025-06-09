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
import { FunctionConst } from '../../../../utility/constants/config';
import { SimpleChange } from '@angular/core';

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
    component.templates = [Helper.fakeTemplateModel];
    component.templateSettings = Helper.fakeTemplateSettings.templateSettings;
    component.initialize = true;
    component.issueTypeId = 13;
    component.templates[0].templateId = 37;

    // Act
    await component.ngOnChanges({
      subIssueTypeId: {
        currentValue: 1,
        previousValue: null,
        firstChange: true
      } as SimpleChange,
      value: {
        currentValue: Helper.fakeTemplateValue,
        previousValue: null,
        firstChange: true
      } as SimpleChange
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
    component.templates = [Helper.fakeTemplateModel];
    component.templates[0].templateId = 37;
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
    component.issueTypeId = 3;

    // Act
    const result = component.isShowDynamicInputs();

    // Assert
    expect(result).toBeFalsy();
  });

  it('should show checkbox var message for void single page with danger accepted', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = 1;
    component.isShowMessages = true;
    component.subIssueTypeId = 1;
    component.templateSettings = [{
      subIssueTypeId: 1,
      isCheckedVar: true,
      templateId: 1,
      sportType: 1
    } as TemplateSetting];
    component.selectedTemplated = Helper.fakeTemplateModel;

    // Act
    const result = component.isShowCheckBoxVarMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show AIO checkbox message for void single page with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = 4;
    component.isShowMessages = true;

    // Act
    const result = component.isShowAioCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should show early event checkbox message for void single page with wrong HDP', () => {
    // Arrange
    component.voidFunction = FunctionConst.SINGLE;
    component.issueTypeId = 4;
    component.isShowMessages = true;

    // Act
    const result = component.isShowEarlyEventCheckBoxMessage();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if abnormal bet is mix or system parlay', () => {
    // Arrange
    component.issueTypeId = 11;
    component.value.filterBy = 1;

    // Act
    const result = component.isAbnormalBetMixOrSystemParlay();

    // Assert
    expect(result).toBeTruthy();
  });

  it('should check if duplicate tickets is mix parlay', () => {
    // Arrange
    component.issueTypeId = 20;
    component.value.filterBy = 1;

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
});
