import { TestBed } from '@angular/core/testing';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateModel, TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';
import { TemplateWrongScoreService } from './template-wrong-score.service';

describe('TemplateWrongScoreService', () => {
  let service: TemplateWrongScoreService;
  let replaceMessageService: ReplaceMessageService;
  let templateInputsService: TemplateInputsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateWrongScoreService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
    templateInputsService = TestBed.inject(TemplateInputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceActualScore', () => {
    let mockOutputMessage: Message;
    let mockTemplateValue: TemplateValue;
    let mockSelectedTemplate: TemplateModel;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Actual Score}}',
        contentChineseTraditional: '測試訊息 {{Actual Score}}',
        contentChineseSimplified: '测试讯息 {{Actual Score}}',
        contentNewChineseSimplified: '测试讯息 {{Actual Score}}',
        contentThai: '',
        contentKorean: '',
        contentJapanese: '',
        contentItalian: '',
        contentSpanish: '',
        playerNamesEnglish: '',
        playerNamesChineseTraditional: '',
        playerNamesChineseSimplified: '',
        isTVSAddOrEditPage: false
      };

      mockTemplateValue = {
        matchId: 123,
        wrongScore: '1-0',
        actualScore: '2-1',
        groupPHAffected: 0
      };

      mockSelectedTemplate = {
        templateId: 1,
        msgEnglish: 'Test template',
        msgChineseTraditional: '測試模板',
        msgChineseSimplified: '测试模板',
        msgChineseNewSimplified: '测试模板',
        inputTexts: [
          {
            name: 'testInput',
            msgEnglish: 'Test input',
            msgChineseTraditional: '測試輸入',
            msgChineseSimplified: '测试输入',
            msgChineseNewSimplified: '测试输入',
            msgEnglishValue: 'Test value',
            msgChineseTraditionalValue: '測試值',
            msgChineseSimplifiedValue: '测试值',
            msgChineseNewSimplifiedValue: '测试值',
            hideChinese: false,
            pattern: ''
          }
        ]
      };
    });

    it('should call templateInputsService methods when subIssueTypeId is in SUBTYPE_ONWARDS and not in SUBTYPE_WRONG_SCORE_RELATED_EVENT', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeGroup.SUBTYPE_ONWARDS[0];
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(true);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(false);
      templateInputsService.replaceWrongScoreOfWrongScoreIssueType = jest.fn();
      templateInputsService.replaceActualScoreOfWrongScoreIssueType = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(templateInputsService.replaceWrongScoreOfWrongScoreIssueType).toHaveBeenCalledWith(
        mockOutputMessage, 
        mockTemplateValue.wrongScore
      );
      expect(templateInputsService.replaceActualScoreOfWrongScoreIssueType).toHaveBeenCalledWith(
        mockOutputMessage, 
        mockTemplateValue.actualScore
      );
    });

    it('should call replaceMessageService.replaceEachLanguage for each inputText when subIssueTypeId is in SUBTYPE_WRONG_SCORE_RELATED_EVENT', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT[0];
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(true);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        '{{testInput}}',
        expect.objectContaining({
          msgEnglish: 'Test value',
          msgChineseTraditional: '測試值',
          msgChineseSimplified: '测试值',
          msgChineseNewSimplified: '测试值'
        })
      );
    });

    it('should call replaceMessageService.replaceEachLanguage with ACTUAL_SCORE template when subIssueTypeId is not in SUBTYPE_ONWARDS', () => {
      // Arrange
      const subIssueTypeId = 999;
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(false);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_SCORE,
        expect.objectContaining({
          msgEnglish: '2-1',
          msgChineseTraditional: '2-1',
          msgChineseSimplified: '2-1',
          msgChineseNewSimplified: '2-1'
        })
      );
    });

    it('should handle empty actualScore in else condition', () => {
      // Arrange
      const subIssueTypeId = 999;
      mockTemplateValue.actualScore = '';
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(false);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_SCORE,
        expect.objectContaining({
          msgEnglish: '',
          msgChineseTraditional: '',
          msgChineseSimplified: '',
          msgChineseNewSimplified: ''
        })
      );
    });

    it('should handle null actualScore in else condition', () => {
      // Arrange
      const subIssueTypeId = 999;
      mockTemplateValue.actualScore = null;
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(false);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_SCORE,
        expect.objectContaining({
          msgEnglish: 'null',
          msgChineseTraditional: 'null',
          msgChineseSimplified: 'null',
          msgChineseNewSimplified: 'null'
        })
      );
    });

    it('should handle undefined actualScore in else condition', () => {
      // Arrange
      const subIssueTypeId = 999;
      mockTemplateValue.actualScore = undefined;
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(false);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.ACTUAL_SCORE,
        expect.objectContaining({
          msgEnglish: 'undefined',
          msgChineseTraditional: 'undefined',
          msgChineseSimplified: 'undefined',
          msgChineseNewSimplified: 'undefined'
        })
      );
    });

    it('should handle multiple inputTexts in SUBTYPE_WRONG_SCORE_RELATED_EVENT condition', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT[0];
      mockSelectedTemplate.inputTexts = [
        {
          name: 'input1',
          msgEnglish: 'Input 1',
          msgChineseTraditional: '輸入1',
          msgChineseSimplified: '输入1',
          msgChineseNewSimplified: '输入1',
          msgEnglishValue: 'Value 1',
          msgChineseTraditionalValue: '值1',
          msgChineseSimplifiedValue: '值1',
          msgChineseNewSimplifiedValue: '值1',
          hideChinese: false,
          pattern: ''
        },
        {
          name: 'input2',
          msgEnglish: 'Input 2',
          msgChineseTraditional: '輸入2',
          msgChineseSimplified: '输入2',
          msgChineseNewSimplified: '输入2',
          msgEnglishValue: 'Value 2',
          msgChineseTraditionalValue: '值2',
          msgChineseSimplifiedValue: '值2',
          msgChineseNewSimplifiedValue: '值2',
          hideChinese: false,
          pattern: ''
        }
      ];
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_ONWARDS, 'includes').mockReturnValue(false);
      jest.spyOn(SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT, 'includes').mockReturnValue(true);
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScore(subIssueTypeId, mockTemplateValue, mockOutputMessage, mockSelectedTemplate);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(2);
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        '{{input1}}',
        expect.objectContaining({
          msgEnglish: 'Value 1',
          msgChineseTraditional: '值1',
          msgChineseSimplified: '值1',
          msgChineseNewSimplified: '值1'
        })
      );
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        '{{input2}}',
        expect.objectContaining({
          msgEnglish: 'Value 2',
          msgChineseTraditional: '值2',
          msgChineseSimplified: '值2',
          msgChineseNewSimplified: '值2'
        })
      );
    });
  });
});