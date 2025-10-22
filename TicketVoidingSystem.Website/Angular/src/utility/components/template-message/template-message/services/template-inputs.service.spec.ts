import { TestBed } from '@angular/core/testing';
import { SubIssueTypeGroup } from '../../../../../utility/constants/config';
import { OrdinalNumberConstant } from '../../../../../utility/constants/ordinal-number.constant';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateModel, TemplateValue, InputText } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { TemplateInputsService } from './template-inputs.service';
import { MatchModel } from '../../../../../utility/models/match.model';

describe('TemplateInputsService', () => {
  let service: TemplateInputsService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(TemplateInputsService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceInputs', () => {
    let mockOutputMessage: Message;
    let mockTemplateModel: TemplateModel;
    let mockInputTexts: InputText[];

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{TestInput}}',
        contentChineseTraditional: '測試訊息 {{TestInput}}',
        contentChineseSimplified: '测试讯息 {{TestInput}}',
        contentNewChineseSimplified: '测试讯息 {{TestInput}}',
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

      mockInputTexts = [
        {
          name: 'TestInput',
          msgEnglish: 'Test Input',
          msgChineseTraditional: '測試輸入',
          msgChineseSimplified: '测试输入',
          msgChineseNewSimplified: '测试输入',
          msgEnglishValue: 'Test Value',
          msgChineseTraditionalValue: '測試值',
          msgChineseSimplifiedValue: '测试值',
          msgChineseNewSimplifiedValue: '测试值',
          hideChinese: false,
          pattern: ''
        }
      ];

      mockTemplateModel = {
        templateId: 1,
        msgEnglish: 'Test Template',
        msgChineseTraditional: '測試模板',
        msgChineseSimplified: '测试模板',
        msgChineseNewSimplified: '测试模板',
        inputTexts: mockInputTexts
      };
    });

    it('should not process when inputTexts is empty', () => {
      // Arrange
      mockTemplateModel.inputTexts = [];
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceInputs(1, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
    });

    it('should not process when inputTexts is null', () => {
      // Arrange
      mockTemplateModel.inputTexts = null;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceInputs(1, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
    });

    it('should call replaceWrongScoreOfWrongScoreIssueType and replaceActualScoreOfWrongScoreIssueType for SUBTYPE_ONWARDS', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeGroup.SUBTYPE_ONWARDS[0];
      // Add second inputText for this test case
      const secondInputText: InputText = {
        name: 'SecondInput',
        msgEnglish: 'Second Input',
        msgChineseTraditional: '第二個輸入',
        msgChineseSimplified: '第二个输入',
        msgChineseNewSimplified: '第二个输入',
        msgEnglishValue: 'Second Value',
        msgChineseTraditionalValue: '第二個值',
        msgChineseSimplifiedValue: '第二个值',
        msgChineseNewSimplifiedValue: '第二个值',
        hideChinese: false,
        pattern: ''
      };
      mockTemplateModel.inputTexts = [...mockInputTexts, secondInputText];
      
      replaceMessageService.replaceEachLanguage = jest.fn();
      replaceMessageService.replaceAll = jest.fn();
      const replaceWrongScoreSpy = jest.spyOn(service, 'replaceWrongScoreOfWrongScoreIssueType');
      const replaceActualScoreSpy = jest.spyOn(service, 'replaceActualScoreOfWrongScoreIssueType');

      // Act
      service.replaceInputs(subIssueTypeId, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceWrongScoreSpy).toHaveBeenCalledWith(mockOutputMessage, mockInputTexts[0].msgEnglishValue);
      expect(replaceActualScoreSpy).toHaveBeenCalledWith(mockOutputMessage, secondInputText.msgEnglishValue);
    });

    it('should not call replaceWrongScoreOfWrongScoreIssueType for SUBTYPE_WRONG_SCORE_RELATED_EVENT', () => {
      // Arrange
      const subIssueTypeId = SubIssueTypeGroup.SUBTYPE_WRONG_SCORE_RELATED_EVENT[0];
      replaceMessageService.replaceEachLanguage = jest.fn();
      service.replaceWrongScoreOfWrongScoreIssueType = jest.fn();
      service.replaceActualScoreOfWrongScoreIssueType = jest.fn();

      // Act
      service.replaceInputs(subIssueTypeId, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(service.replaceWrongScoreOfWrongScoreIssueType).not.toHaveBeenCalled();
      expect(service.replaceActualScoreOfWrongScoreIssueType).not.toHaveBeenCalled();
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(1);
    });

    it('should call replaceEachLanguage for each inputText for normal subIssueTypeId', () => {
      // Arrange
      const subIssueTypeId = 999; // Some other subIssueTypeId
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceInputs(subIssueTypeId, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        '{{TestInput}}',
        expect.objectContaining({
          msgEnglish: 'Test Value',
          msgChineseTraditional: '測試值',
          msgChineseSimplified: '测试值',
          msgChineseNewSimplified: '测试值'
        })
      );
    });

    it('should handle multiple inputTexts', () => {
      // Arrange
      const additionalInputText: InputText = {
        name: 'AnotherInput',
        msgEnglish: 'Another Input',
        msgChineseTraditional: '另一個輸入',
        msgChineseSimplified: '另一个输入',
        msgChineseNewSimplified: '另一个输入',
        msgEnglishValue: 'Another Value',
        msgChineseTraditionalValue: '另一個值',
        msgChineseSimplifiedValue: '另一个值',
        msgChineseNewSimplifiedValue: '另一个值',
        hideChinese: false,
        pattern: ''
      };
      mockTemplateModel.inputTexts = [...mockInputTexts, additionalInputText];
      const subIssueTypeId = 999;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceInputs(subIssueTypeId, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateOrdinalNumberForInputsDangerAccepted', () => {
    let mockTemplateModel: TemplateModel;
    let mockTemplateValue: TemplateValue;
    let mockInputTexts: InputText[];

    beforeEach(() => {
      mockInputTexts = [
        {
          name: 'NextCorner',
          msgEnglish: 'Next Corner',
          msgChineseTraditional: '下一個角球',
          msgChineseSimplified: '下一个角球',
          msgChineseNewSimplified: '下一个角球',
          msgEnglishValue: '1st',
          msgChineseTraditionalValue: '第一',
          msgChineseSimplifiedValue: '第一',
          msgChineseNewSimplifiedValue: '第一',
          hideChinese: false,
          pattern: ''
        },
        {
          name: 'OtherInput',
          msgEnglish: 'Other Input',
          msgChineseTraditional: '其他輸入',
          msgChineseSimplified: '其他输入',
          msgChineseNewSimplified: '其他输入',
          msgEnglishValue: 'Other Value',
          msgChineseTraditionalValue: '其他值',
          msgChineseSimplifiedValue: '其他值',
          msgChineseNewSimplifiedValue: '其他值',
          hideChinese: false,
          pattern: ''
        }
      ];

      mockTemplateModel = {
        templateId: 1,
        msgEnglish: 'Test Template',
        msgChineseTraditional: '測試模板',
        msgChineseSimplified: '测试模板',
        msgChineseNewSimplified: '测试模板',
        inputTexts: mockInputTexts
      };

      mockTemplateValue = {
        matchId: 123,
        numberOfSubType: 2,
        groupPHAffected: 0
      };
    });

    it('should update ordinal number for matching inputTexts', () => {
      // Arrange
      const expectedOrdinalNumber = OrdinalNumberConstant.ORDINAL_NUMBER.find(x => x.value === '2');

      // Act
      service.updateOrdinalNumberForInputsDangerAccepted(mockTemplateModel, mockTemplateValue);

      // Assert
      expect(mockInputTexts[0].msgEnglishValue).toBe(expectedOrdinalNumber.englishValue);
      expect(mockInputTexts[0].msgChineseTraditionalValue).toBe(`第${expectedOrdinalNumber.chineseTraditionalValue}`);
      expect(mockInputTexts[0].msgChineseSimplifiedValue).toBe(`第${expectedOrdinalNumber.chineseSimplifiedValue}`);
      expect(mockInputTexts[0].msgChineseNewSimplifiedValue).toBe(`第${expectedOrdinalNumber.chineseSimplifiedValue}`);
    });

    it('should not update ordinal number for non-matching inputTexts', () => {
      // Arrange
      const originalValue = mockInputTexts[1].msgEnglishValue;

      // Act
      service.updateOrdinalNumberForInputsDangerAccepted(mockTemplateModel, mockTemplateValue);

      // Assert
      expect(mockInputTexts[1].msgEnglishValue).toBe(originalValue);
    });

    it('should not update when numberOfSubType is null', () => {
      // Arrange
      mockTemplateValue.numberOfSubType = null;
      const originalValue = mockInputTexts[0].msgEnglishValue;

      // Act
      service.updateOrdinalNumberForInputsDangerAccepted(mockTemplateModel, mockTemplateValue);

      // Assert
      expect(mockInputTexts[0].msgEnglishValue).toBe(originalValue);
    });

    it('should not update when numberOfSubType is undefined', () => {
      // Arrange
      mockTemplateValue.numberOfSubType = undefined;
      const originalValue = mockInputTexts[0].msgEnglishValue;

      // Act
      service.updateOrdinalNumberForInputsDangerAccepted(mockTemplateModel, mockTemplateValue);

      // Assert
      expect(mockInputTexts[0].msgEnglishValue).toBe(originalValue);
    });

    it('should handle multiple matching inputTexts', () => {
      // Arrange
      const additionalInputText: InputText = {
        name: 'NextBooking',
        msgEnglish: 'Next Booking',
        msgChineseTraditional: '下一個預訂',
        msgChineseSimplified: '下一个预订',
        msgChineseNewSimplified: '下一个预订',
        msgEnglishValue: '1st',
        msgChineseTraditionalValue: '第一',
        msgChineseSimplifiedValue: '第一',
        msgChineseNewSimplifiedValue: '第一',
        hideChinese: false,
        pattern: ''
      };
      mockTemplateModel.inputTexts = [...mockInputTexts, additionalInputText];
      const expectedOrdinalNumber = OrdinalNumberConstant.ORDINAL_NUMBER.find(x => x.value === '2');

      // Act
      service.updateOrdinalNumberForInputsDangerAccepted(mockTemplateModel, mockTemplateValue);

      // Assert
      expect(mockInputTexts[0].msgEnglishValue).toBe(expectedOrdinalNumber.englishValue);
      expect(additionalInputText.msgEnglishValue).toBe(expectedOrdinalNumber.englishValue);
    });
  });

  describe('replaceWrongScoreOfWrongScoreIssueType', () => {
    let mockMessage: Message;

    beforeEach(() => {
      mockMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{WrongScoreOW}}',
        contentChineseTraditional: '測試訊息 {{WrongScoreOW}}',
        contentChineseSimplified: '测试讯息 {{WrongScoreOW}}',
        contentNewChineseSimplified: '测试讯息 {{WrongScoreOW}}',
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
    });

    it('should call replaceEachLanguage when score has length', () => {
      // Arrange
      const score = '2-1';
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceWrongScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.WRONG_SCORE_ONWARDS,
        expect.objectContaining({
          msgEnglish: expect.stringContaining('(Score 2-1 onwards)'),
          msgChineseTraditional: expect.stringContaining('(比分 2-1 開始)'),
          msgChineseSimplified: expect.stringContaining('(比分 2-1 开始)'),
          msgChineseNewSimplified: expect.stringContaining('(比分 2-1 开始)')
        })
      );
    });

    it('should call replaceAll with empty string when score is empty', () => {
      // Arrange
      const score = '';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.WRONG_SCORE_ONWARDS,
        ''
      );
    });

    it('should call replaceAll with empty string when score is null', () => {
      // Arrange
      const score = null;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.WRONG_SCORE_ONWARDS,
        ''
      );
    });

    it('should call replaceAll with empty string when score is undefined', () => {
      // Arrange
      const score = undefined;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceWrongScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.WRONG_SCORE_ONWARDS,
        ''
      );
    });
  });

  describe('replaceActualScoreOfWrongScoreIssueType', () => {
    let mockMessage: Message;

    beforeEach(() => {
      mockMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Actual ScoreOW}}',
        contentChineseTraditional: '測試訊息 {{Actual ScoreOW}}',
        contentChineseSimplified: '测试讯息 {{Actual ScoreOW}}',
        contentNewChineseSimplified: '测试讯息 {{Actual ScoreOW}}',
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
    });

    it('should call replaceEachLanguage when score has length', () => {
      // Arrange
      const score = '3-0';
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceActualScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.ACTUAL_SCORE_ONWARDS,
        expect.objectContaining({
          msgEnglish: expect.stringContaining('3-0 onwards'),
          msgChineseTraditional: expect.stringContaining('3-0 開始'),
          msgChineseSimplified: expect.stringContaining('3-0 开始'),
          msgChineseNewSimplified: expect.stringContaining('3-0 开始')
        })
      );
    });

    it('should call replaceAll with empty string when score is empty', () => {
      // Arrange
      const score = '';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceActualScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.ACTUAL_SCORE_ONWARDS,
        ''
      );
    });

    it('should call replaceAll with empty string when score is null', () => {
      // Arrange
      const score = null;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceActualScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.ACTUAL_SCORE_ONWARDS,
        ''
      );
    });

    it('should call replaceAll with empty string when score is undefined', () => {
      // Arrange
      const score = undefined;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.replaceActualScoreOfWrongScoreIssueType(mockMessage, score);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.ACTUAL_SCORE_ONWARDS,
        ''
      );
    });
  });

  describe('getPrefixSubType', () => {
    it('should return first half prefix when isFirstHalf is true', () => {
      // Act
      const result = service.getPrefixSubType(true);

      // Assert
      expect(result).toEqual({
        msgEnglish: TemplateContentConst.FIRST_HALF.msgEnglish,
        msgChineseTraditional: TemplateContentConst.FIRST_HALF.msgChineseTraditional,
        msgChineseSimplified: TemplateContentConst.FIRST_HALF.msgChineseSimplified,
        msgChineseNewSimplified: TemplateContentConst.FIRST_HALF.msgChineseNewSimplified
      });
    });

    it('should return empty prefix when isFirstHalf is false', () => {
      // Act
      const result = service.getPrefixSubType(false);

      // Assert
      expect(result).toEqual({
        msgEnglish: '',
        msgChineseTraditional: '',
        msgChineseSimplified: '',
        msgChineseNewSimplified: ''
      });
    });
  });

  describe('getTeamName', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: {
          homeName: 'Home Team',
          awayName: 'Away Team',
          homeNameTraditional: '主隊',
          awayNameTraditional: '客隊',
          homeNameSimplified: '主队',
          awayNameSimplified: '客队',
          homeNameNewSimplified: '主队',
          awayNameNewSimplified: '客队'
        } as MatchModel
      };
    });

    it('should return home team name when filterFavoriteType is "h"', () => {
      // Act
      const result = service.getTeamName(mockTemplateValue);

      // Assert
      expect(result).toBe('Home Team');
    });

    it('should return away team name when filterFavoriteType is not "h"', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = 'a';

      // Act
      const result = service.getTeamName(mockTemplateValue);

      // Assert
      expect(result).toBe('Away Team');
    });

    it('should return away team name when filterFavoriteType is undefined', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = undefined;

      // Act
      const result = service.getTeamName(mockTemplateValue);

      // Assert
      expect(result).toBe('Away Team');
    });

    it('should return away team name when filterFavoriteType is null', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = null;

      // Act
      const result = service.getTeamName(mockTemplateValue);

      // Assert
      expect(result).toBe('Away Team');
    });
  });

  describe('getTeamNameTraditional', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: {
          homeName: 'Home Team',
          awayName: 'Away Team',
          homeNameTraditional: '主隊',
          awayNameTraditional: '客隊',
          homeNameSimplified: '主队',
          awayNameSimplified: '客队',
          homeNameNewSimplified: '主队',
          awayNameNewSimplified: '客队'
        } as MatchModel
      };
    });

    it('should return home team traditional name when filterFavoriteType is "h"', () => {
      // Act
      const result = service.getTeamNameTraditional(mockTemplateValue);

      // Assert
      expect(result).toBe('主隊');
    });

    it('should return away team traditional name when filterFavoriteType is not "h"', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = 'a';

      // Act
      const result = service.getTeamNameTraditional(mockTemplateValue);

      // Assert
      expect(result).toBe('客隊');
    });
  });

  describe('getTeamNameSimplified', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: {
          homeName: 'Home Team',
          awayName: 'Away Team',
          homeNameTraditional: '主隊',
          awayNameTraditional: '客隊',
          homeNameSimplified: '主队',
          awayNameSimplified: '客队',
          homeNameNewSimplified: '主队',
          awayNameNewSimplified: '客队'
        } as MatchModel
      };
    });

    it('should return home team simplified name when filterFavoriteType is "h"', () => {
      // Act
      const result = service.getTeamNameSimplified(mockTemplateValue);

      // Assert
      expect(result).toBe('主队');
    });

    it('should return away team simplified name when filterFavoriteType is not "h"', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = 'a';

      // Act
      const result = service.getTeamNameSimplified(mockTemplateValue);

      // Assert
      expect(result).toBe('客队');
    });
  });

  describe('getTeamNameNewSimplified', () => {
    let mockTemplateValue: TemplateValue;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: {
          homeName: 'Home Team',
          awayName: 'Away Team',
          homeNameTraditional: '主隊',
          awayNameTraditional: '客隊',
          homeNameSimplified: '主队',
          awayNameSimplified: '客队',
          homeNameNewSimplified: '主队',
          awayNameNewSimplified: '客队'
        } as MatchModel
      };
    });

    it('should return home team new simplified name when filterFavoriteType is "h"', () => {
      // Act
      const result = service.getTeamNameNewSimplified(mockTemplateValue);

      // Assert
      expect(result).toBe('主队');
    });

    it('should return away team new simplified name when filterFavoriteType is not "h"', () => {
      // Arrange
      mockTemplateValue.filterFavoriteType = 'a';

      // Act
      const result = service.getTeamNameNewSimplified(mockTemplateValue);

      // Assert
      expect(result).toBe('客队');
    });
  });

  describe('edge cases', () => {
    it('should handle null match in templateValue for getTeamName', () => {
      // Arrange
      const mockTemplateValue: TemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: null
      };

      // Act
      const result = service.getTeamName(mockTemplateValue);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle undefined match in templateValue for getTeamNameTraditional', () => {
      // Arrange
      const mockTemplateValue: TemplateValue = {
        matchId: 123,
        filterFavoriteType: 'h',
        groupPHAffected: 0,
        match: undefined
      };

      // Act
      const result = service.getTeamNameTraditional(mockTemplateValue);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle empty inputTexts array in replaceInputs', () => {
      // Arrange
      const mockTemplateModel= {
        templateId: 1,
        msgEnglish: 'Test Template',
        msgChineseTraditional: '測試模板',
        msgChineseSimplified: '测试模板',
        msgChineseNewSimplified: '测试模板',
        inputTexts: []
      } as TemplateModel;
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service.replaceInputs(1, mockTemplateModel, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).not.toHaveBeenCalled();
    });
  });
});
