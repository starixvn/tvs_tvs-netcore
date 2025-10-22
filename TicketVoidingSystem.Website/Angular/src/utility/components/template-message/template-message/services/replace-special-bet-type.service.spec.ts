import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { ReplaceSpecialBetTypeService } from './replace-special-bet-type.service';

describe('ReplaceSpecialBetTypeService', () => {
  let service: ReplaceSpecialBetTypeService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplaceSpecialBetTypeService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;
    let mockBetTypeNameReplaceMessage: Message;

    beforeEach(() => {
      mockBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Special Bet Type',
        contentChineseTraditional: '特殊投注類型',
        contentChineseSimplified: '特殊投注类型',
        contentNewChineseSimplified: '特殊投注类型'
      } as Message;

      mockTemplateValue = {
        matchId: 123,
        isCheckedSpecialBetType: true,
        betTypeNameReplaceMessage: mockBetTypeNameReplaceMessage
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{SpecialBetType}}',
        contentChineseTraditional: '測試訊息 {{SpecialBetType}}',
        contentChineseSimplified: '测试讯息 {{SpecialBetType}}',
        contentNewChineseSimplified: '测试讯息 {{SpecialBetType}}'
      } as Message;
    });

    it('should call replaceSpecialBetType when isCheckedSpecialBetType is true and issueTypeUpdateSpecialBetTypeTvs is true', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      const replaceSpecialBetTypeSpy = jest.spyOn(service as any, 'replaceSpecialBetType');

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceSpecialBetTypeSpy).toHaveBeenCalledWith(mockOutputMessage, mockBetTypeNameReplaceMessage);
    });

    it('should call replaceSpecialBetType when isCheckedSpecialBetType is true and issueTypeUpdateSpecialBetTypeVoidSingleBet is true', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = false;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = true;
      const replaceSpecialBetTypeSpy = jest.spyOn(service as any, 'replaceSpecialBetType');

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceSpecialBetTypeSpy).toHaveBeenCalledWith(mockOutputMessage, mockBetTypeNameReplaceMessage);
    });

    it('should call replaceSpecialBetType when isCheckedSpecialBetType is true and both issue types are true', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = true;
      const replaceSpecialBetTypeSpy = jest.spyOn(service as any, 'replaceSpecialBetType');

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceSpecialBetTypeSpy).toHaveBeenCalledWith(mockOutputMessage, mockBetTypeNameReplaceMessage);
    });

    it('should call replaceAll with empty string when isCheckedSpecialBetType is false', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = true;
      mockTemplateValue.isCheckedSpecialBetType = false;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SPECIAL_BET_TYPE, '');
    });

    it('should call replaceAll with empty string when both issue types are false', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = false;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SPECIAL_BET_TYPE, '');
    });

    it('should call replaceAll with empty string when isCheckedSpecialBetType is true but both issue types are false', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = false;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SPECIAL_BET_TYPE, '');
    });
  });

  describe('replaceSpecialBetType', () => {
    let mockMessage: Message;
    let mockBetTypeNameReplaceMessage: Message;

    beforeEach(() => {
      mockBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Special Bet Type',
        contentChineseTraditional: '特殊投注類型',
        contentChineseSimplified: '特殊投注类型',
        contentNewChineseSimplified: '特殊投注类型'
      } as Message;

      mockMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{SpecialBetType}}',
        contentChineseTraditional: '測試訊息 {{SpecialBetType}}',
        contentChineseSimplified: '测试讯息 {{SpecialBetType}}',
        contentNewChineseSimplified: '测试讯息 {{SpecialBetType}}'
      } as Message;
    });

    it('should call replaceEachLanguage with correct content when all languages have content', () => {
      // Arrange
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['replaceSpecialBetType'](mockMessage, mockBetTypeNameReplaceMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.SPECIAL_BET_TYPE,
        expect.objectContaining({
          msgEnglish: '"Special Bet Type" ',
          msgChineseTraditional: '"特殊投注類型" ',
          msgChineseSimplified: '"特殊投注类型" ',
          msgChineseNewSimplified: '"特殊投注类型" '
        })
      );
    });

    it('should call replaceEachLanguage with empty strings when content is empty', () => {
      // Arrange
      const emptyBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User'
      } as Message;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['replaceSpecialBetType'](mockMessage, emptyBetTypeNameReplaceMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.SPECIAL_BET_TYPE,
        expect.objectContaining({
          msgEnglish: '',
          msgChineseTraditional: '',
          msgChineseSimplified: '',
          msgChineseNewSimplified: ''
        })
      );
    });

    it('should call replaceEachLanguage with empty strings when content is null', () => {
      // Arrange
      const nullBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: null,
        contentChineseTraditional: null,
        contentChineseSimplified: null,
        contentNewChineseSimplified: null
      } as Message;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['replaceSpecialBetType'](mockMessage, nullBetTypeNameReplaceMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.SPECIAL_BET_TYPE,
        expect.objectContaining({
          msgEnglish: '',
          msgChineseTraditional: '',
          msgChineseSimplified: '',
          msgChineseNewSimplified: ''
        })
      );
    });

    it('should call replaceEachLanguage with empty strings when content is undefined', () => {
      // Arrange
      const undefinedBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User'
      } as Message;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['replaceSpecialBetType'](mockMessage, undefinedBetTypeNameReplaceMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.SPECIAL_BET_TYPE,
        expect.objectContaining({
          msgEnglish: '',
          msgChineseTraditional: '',
          msgChineseSimplified: '',
          msgChineseNewSimplified: ''
        })
      );
    });

    it('should handle mixed content (some empty, some with content)', () => {
      // Arrange
      const mixedBetTypeNameReplaceMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Special Bet Type',
        contentChineseTraditional: '',
        contentChineseSimplified: '特殊投注类型',
        contentNewChineseSimplified: null
      } as Message;
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['replaceSpecialBetType'](mockMessage, mixedBetTypeNameReplaceMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockMessage,
        TemplateReplace.SPECIAL_BET_TYPE,
        expect.objectContaining({
          msgEnglish: '"Special Bet Type" ',
          msgChineseTraditional: '',
          msgChineseSimplified: '"特殊投注类型" ',
          msgChineseNewSimplified: ''
        })
      );
    });
  });

  describe('edge cases', () => {
    it('should handle null templateValue in execute', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      const nullTemplateValue = null;
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, nullTemplateValue, mockOutputMessage);
      }).toThrow();
    });

    it('should handle undefined templateValue in execute', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      const undefinedTemplateValue = undefined;
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, undefinedTemplateValue, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in execute', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      const mockTemplateValue = {
        matchId: 123,
        isCheckedSpecialBetType: true,
        betTypeNameReplaceMessage: {
          creatorId: 1,
          creatorName: 'Test User',
          contentEnglish: 'Special Bet Type',
          contentChineseTraditional: '特殊投注類型',
          contentChineseSimplified: '特殊投注类型',
          contentNewChineseSimplified: '特殊投注类型'
        }
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, null);
      }).toThrow();
    });

    it('should handle undefined outputMessage in execute', () => {
      // Arrange
      const issueTypeUpdateSpecialBetTypeTvs = true;
      const issueTypeUpdateSpecialBetTypeVoidSingleBet = false;
      const mockTemplateValue = {
        matchId: 123,
        isCheckedSpecialBetType: true,
        betTypeNameReplaceMessage: {
          creatorId: 1,
          creatorName: 'Test User',
          contentEnglish: 'Special Bet Type',
          contentChineseTraditional: '特殊投注類型',
          contentChineseSimplified: '特殊投注类型',
          contentNewChineseSimplified: '特殊投注类型'
        }
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(issueTypeUpdateSpecialBetTypeTvs, issueTypeUpdateSpecialBetTypeVoidSingleBet, mockTemplateValue, undefined);
      }).toThrow();
    });

    it('should handle null betTypeNameReplaceMessage in replaceSpecialBetType', () => {
      // Arrange
      const mockMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service['replaceSpecialBetType'](mockMessage, null);
      }).toThrow();
    });

    it('should handle undefined betTypeNameReplaceMessage in replaceSpecialBetType', () => {
      // Arrange
      const mockMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message',
        contentChineseTraditional: '測試訊息',
        contentChineseSimplified: '测试讯息',
        contentNewChineseSimplified: '测试讯息'
      } as Message;

      // Act & Assert
      expect(() => {
        service['replaceSpecialBetType'](mockMessage, undefined);
      }).toThrow();
    });
  });
});
