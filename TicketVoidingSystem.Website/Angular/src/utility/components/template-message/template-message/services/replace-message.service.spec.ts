import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateContent } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';

describe('ReplaceMessageService', () => {
  let service: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('replaceEachLanguage', () => {
    let mockOutputMessage: Message;
    let mockTemplateContent: TemplateContent;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Score}}',
        contentChineseTraditional: '測試訊息 {{Score}}',
        contentChineseSimplified: '测试讯息 {{Score}}',
        contentNewChineseSimplified: '测试讯息 {{Score}}'
      } as Message;

      mockTemplateContent = {
        msgEnglish: 'Score: 2-1',
        msgChineseTraditional: '比分: 2-1',
        msgChineseSimplified: '比分: 2-1',
        msgChineseNewSimplified: '比分: 2-1'
      } as TemplateContent;
    });

    it('should replace content in all languages when value is not null', () => {
      // Arrange
      const destination = '{{Score}}';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('Test message Score: 2-1');
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 比分: 2-1');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 比分: 2-1');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 比分: 2-1');
    });

    it('should not replace content when value is null', () => {
      // Arrange
      const destination = '{{Score}}';
      const originalContent = mockOutputMessage.contentEnglish;

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, null);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe(originalContent);
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 {{Score}}');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 {{Score}}');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 {{Score}}');
    });

    it('should not replace content when value is undefined', () => {
      // Arrange
      const destination = '{{Score}}';
      const originalContent = mockOutputMessage.contentEnglish;

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, undefined);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe(originalContent);
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 {{Score}}');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 {{Score}}');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 {{Score}}');
    });

    it('should handle null content fields by setting them to empty string', () => {
      // Arrange
      mockOutputMessage.contentEnglish = null;
      mockOutputMessage.contentChineseTraditional = null;
      mockOutputMessage.contentChineseSimplified = null;
      mockOutputMessage.contentNewChineseSimplified = null;
      const destination = '{{Score}}';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('');
      expect(mockOutputMessage.contentChineseTraditional).toBe('');
      expect(mockOutputMessage.contentChineseSimplified).toBe('');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('');
    });

    it('should handle undefined content fields by setting them to empty string', () => {
      // Arrange
      mockOutputMessage.contentEnglish = undefined;
      mockOutputMessage.contentChineseTraditional = undefined;
      mockOutputMessage.contentChineseSimplified = undefined;
      mockOutputMessage.contentNewChineseSimplified = undefined;
      const destination = '{{Score}}';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('');
      expect(mockOutputMessage.contentChineseTraditional).toBe('');
      expect(mockOutputMessage.contentChineseSimplified).toBe('');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('');
    });

    it('should replace multiple occurrences of destination pattern', () => {
      // Arrange
      mockOutputMessage.contentEnglish = 'Test {{Score}} message {{Score}}';
      const destination = '{{Score}}';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('Test Score: 2-1 message Score: 2-1');
    });

    it('should handle empty destination pattern', () => {
      // Arrange
      const destination = '';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      // Empty destination pattern causes each character to be replaced
      expect(mockOutputMessage.contentEnglish).toBe('Score: 2-1TScore: 2-1eScore: 2-1sScore: 2-1tScore: 2-1 Score: 2-1mScore: 2-1eScore: 2-1sScore: 2-1sScore: 2-1aScore: 2-1gScore: 2-1eScore: 2-1 Score: 2-1{Score: 2-1{Score: 2-1SScore: 2-1cScore: 2-1oScore: 2-1rScore: 2-1eScore: 2-1}Score: 2-1}Score: 2-1');
    });
  });

  describe('replaceAll', () => {
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Score}}',
        contentChineseTraditional: '測試訊息 {{Score}}',
        contentChineseSimplified: '测试讯息 {{Score}}',
        contentNewChineseSimplified: '测试讯息 {{Score}}'
      } as Message;
    });

    it('should replace content in all languages with the same value when value is not null', () => {
      // Arrange
      const destination = '{{Score}}';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('Test message 2-1');
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 2-1');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 2-1');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 2-1');
    });

    it('should not replace content when value is null', () => {
      // Arrange
      const destination = '{{Score}}';
      const originalContent = mockOutputMessage.contentEnglish;

      // Act
      service.replaceAll(mockOutputMessage, destination, null);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe(originalContent);
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 {{Score}}');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 {{Score}}');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 {{Score}}');
    });

    it('should not replace content when value is undefined', () => {
      // Arrange
      const destination = '{{Score}}';
      const originalContent = mockOutputMessage.contentEnglish;

      // Act
      service.replaceAll(mockOutputMessage, destination, undefined);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe(originalContent);
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 {{Score}}');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 {{Score}}');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 {{Score}}');
    });

    it('should handle null content fields by setting them to empty string', () => {
      // Arrange
      mockOutputMessage.contentEnglish = null;
      mockOutputMessage.contentChineseTraditional = null;
      mockOutputMessage.contentChineseSimplified = null;
      mockOutputMessage.contentNewChineseSimplified = null;
      const destination = '{{Score}}';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('');
      expect(mockOutputMessage.contentChineseTraditional).toBe('');
      expect(mockOutputMessage.contentChineseSimplified).toBe('');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('');
    });

    it('should handle undefined content fields by setting them to empty string', () => {
      // Arrange
      mockOutputMessage.contentEnglish = undefined;
      mockOutputMessage.contentChineseTraditional = undefined;
      mockOutputMessage.contentChineseSimplified = undefined;
      mockOutputMessage.contentNewChineseSimplified = undefined;
      const destination = '{{Score}}';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('');
      expect(mockOutputMessage.contentChineseTraditional).toBe('');
      expect(mockOutputMessage.contentChineseSimplified).toBe('');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('');
    });

    it('should replace multiple occurrences of destination pattern', () => {
      // Arrange
      mockOutputMessage.contentEnglish = 'Test {{Score}} message {{Score}}';
      const destination = '{{Score}}';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('Test 2-1 message 2-1');
    });

    it('should handle empty destination pattern', () => {
      // Arrange
      const destination = '';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      // Empty destination pattern causes each character to be replaced
      expect(mockOutputMessage.contentEnglish).toBe('2-1T2-1e2-1s2-1t2-1 2-1m2-1e2-1s2-1s2-1a2-1g2-1e2-1 2-1{2-1{2-1S2-1c2-1o2-1r2-1e2-1}2-1}2-1');
    });

    it('should handle empty value', () => {
      // Arrange
      const destination = '{{Score}}';
      const value = '';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      expect(mockOutputMessage.contentEnglish).toBe('Test message ');
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 ');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 ');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 ');
    });
  });

  describe('edge cases', () => {
    it('should handle null outputMessage in replaceEachLanguage', () => {
      // Arrange
      const mockTemplateContent = {
        msgEnglish: 'Score: 2-1',
        msgChineseTraditional: '比分: 2-1',
        msgChineseSimplified: '比分: 2-1',
        msgChineseNewSimplified: '比分: 2-1'
      } as TemplateContent;

      // Act & Assert
      expect(() => {
        service.replaceEachLanguage(null, '{{Score}}', mockTemplateContent);
      }).toThrow();
    });

    it('should handle null outputMessage in replaceAll', () => {
      // Act & Assert
      expect(() => {
        service.replaceAll(null, '{{Score}}', '2-1');
      }).toThrow();
    });

    it('should handle undefined outputMessage in replaceEachLanguage', () => {
      // Arrange
      const mockTemplateContent = {
        msgEnglish: 'Score: 2-1',
        msgChineseTraditional: '比分: 2-1',
        msgChineseSimplified: '比分: 2-1',
        msgChineseNewSimplified: '比分: 2-1'
      } as TemplateContent;

      // Act & Assert
      expect(() => {
        service.replaceEachLanguage(undefined, '{{Score}}', mockTemplateContent);
      }).toThrow();
    });

    it('should handle undefined outputMessage in replaceAll', () => {
      // Act & Assert
      expect(() => {
        service.replaceAll(undefined, '{{Score}}', '2-1');
      }).toThrow();
    });

    it('should handle special regex characters in destination', () => {
      // Arrange
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message [Score]',
        contentChineseTraditional: '測試訊息 [Score]',
        contentChineseSimplified: '测试讯息 [Score]',
        contentNewChineseSimplified: '测试讯息 [Score]'
      } as Message;
      const destination = '[Score]';
      const value = '2-1';

      // Act
      service.replaceAll(mockOutputMessage, destination, value);

      // Assert
      // [Score] is treated as regex character class [S], [c], [o], [r], [e] - matches any of these characters
      expect(mockOutputMessage.contentEnglish).toBe('T2-1st m2-1ssag2-1 [2-12-12-12-12-1]');
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 [2-12-12-12-12-1]');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 [2-12-12-12-12-1]');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 [2-12-12-12-12-1]');
    });

    it('should handle special regex characters in destination for replaceEachLanguage', () => {
      // Arrange
      const mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message [Score]',
        contentChineseTraditional: '測試訊息 [Score]',
        contentChineseSimplified: '测试讯息 [Score]',
        contentNewChineseSimplified: '测试讯息 [Score]'
      } as Message;
      const mockTemplateContent = {
        msgEnglish: 'Score: 2-1',
        msgChineseTraditional: '比分: 2-1',
        msgChineseSimplified: '比分: 2-1',
        msgChineseNewSimplified: '比分: 2-1'
      } as TemplateContent;
      const destination = '[Score]';

      // Act
      service.replaceEachLanguage(mockOutputMessage, destination, mockTemplateContent);

      // Assert
      // [Score] is treated as regex character class [S], [c], [o], [r], [e] - matches any of these characters
      expect(mockOutputMessage.contentEnglish).toBe('TScore: 2-1st mScore: 2-1ssagScore: 2-1 [Score: 2-1Score: 2-1Score: 2-1Score: 2-1Score: 2-1]');
      expect(mockOutputMessage.contentChineseTraditional).toBe('測試訊息 [比分: 2-1比分: 2-1比分: 2-1比分: 2-1比分: 2-1]');
      expect(mockOutputMessage.contentChineseSimplified).toBe('测试讯息 [比分: 2-1比分: 2-1比分: 2-1比分: 2-1比分: 2-1]');
      expect(mockOutputMessage.contentNewChineseSimplified).toBe('测试讯息 [比分: 2-1比分: 2-1比分: 2-1比分: 2-1比分: 2-1]');
    });
  });
});
