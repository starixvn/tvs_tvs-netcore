import { TestBed } from '@angular/core/testing';
import { Message } from '../../messages/message';
import { TemplateContentConst, TemplateReplace } from '../template.const';
import { TemplateValue } from '../template.model';
import { ReplaceMessageService } from './replace-message.service';
import { ReplaceScoreService } from './replace-score.service';

describe('ReplaceScoreService', () => {
  let service: ReplaceScoreService;
  let replaceMessageService: ReplaceMessageService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = TestBed.inject(ReplaceScoreService);
    replaceMessageService = TestBed.inject(ReplaceMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('execute', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        score: '2-1'
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Score}}',
        contentChineseTraditional: '測試訊息 {{Score}}',
        contentChineseSimplified: '测试讯息 {{Score}}',
        contentNewChineseSimplified: '测试讯息 {{Score}}'
      } as Message;
    });

    it('should call updateScore when isUpdateScoreHaveText is false', () => {
      // Arrange
      mockTemplateValue.isUpdateScoreHaveText = false;
      const updateScoreSpy = jest.spyOn(service as any, 'updateScore');

      // Act
      service.execute(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(updateScoreSpy).toHaveBeenCalledWith(mockTemplateValue, mockOutputMessage);
    });

    it('should call updateScoreHaveText when isUpdateScoreHaveText is true', () => {
      // Arrange
      mockTemplateValue.isUpdateScoreHaveText = true;
      const updateScoreHaveTextSpy = jest.spyOn(service as any, 'updateScoreHaveText');

      // Act
      service.execute(mockTemplateValue, mockOutputMessage);

      // Assert
      expect(updateScoreHaveTextSpy).toHaveBeenCalledWith(mockTemplateValue, mockOutputMessage);
    });
  });

  describe('updateScoreHaveText', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        score: '2-1',
        isUpdateScoreHaveText: true,
        isAllNonLiveTickets: false
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Score}}',
        contentChineseTraditional: '測試訊息 {{Score}}',
        contentChineseSimplified: '测试讯息 {{Score}}',
        contentNewChineseSimplified: '测试讯息 {{Score}}'
      } as Message;
    });

    it('should call replaceEachLanguage with score content when score is defined and not empty and not all non-live tickets', () => {
      // Arrange
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['updateScoreHaveText'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.SCORE,
        expect.objectContaining({
          msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${mockTemplateValue.score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
          msgChineseTraditional: `(${TemplateContentConst.SCORE.msgChineseTraditional} ${mockTemplateValue.score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
          msgChineseSimplified: `(${TemplateContentConst.SCORE.msgChineseSimplified} ${mockTemplateValue.score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
          msgChineseNewSimplified: `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${mockTemplateValue.score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
        })
      );
    });

    it('should call replaceAll with empty string when score is undefined', () => {
      // Arrange
      mockTemplateValue.score = undefined;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScoreHaveText'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });

    it('should call replaceAll with empty string when score is empty', () => {
      // Arrange
      mockTemplateValue.score = '';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScoreHaveText'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });

    it('should call replaceAll with empty string when isAllNonLiveTickets is true', () => {
      // Arrange
      mockTemplateValue.isAllNonLiveTickets = true;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScoreHaveText'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });
  });

  describe('updateScore', () => {
    let mockTemplateValue: TemplateValue;
    let mockOutputMessage: Message;

    beforeEach(() => {
      mockTemplateValue = {
        matchId: 123,
        score: '2-1'
      } as TemplateValue;

      mockOutputMessage = {
        creatorId: 1,
        creatorName: 'Test User',
        contentEnglish: 'Test message {{Score}}',
        contentChineseTraditional: '測試訊息 {{Score}}',
        contentChineseSimplified: '测试讯息 {{Score}}',
        contentNewChineseSimplified: '测试讯息 {{Score}}'
      } as Message;
    });

    it('should call replaceEachLanguage with score content when score is defined and not empty and not all non-live tickets', () => {
      // Arrange
      replaceMessageService.replaceEachLanguage = jest.fn();

      // Act
      service['updateScore'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceEachLanguage).toHaveBeenCalledWith(
        mockOutputMessage,
        TemplateReplace.SCORE,
        expect.objectContaining({
          msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${mockTemplateValue.score}) `,
          msgChineseTraditional: `(${TemplateContentConst.SCORE.msgChineseTraditional} ${mockTemplateValue.score}) `,
          msgChineseSimplified: `(${TemplateContentConst.SCORE.msgChineseSimplified} ${mockTemplateValue.score}) `,
          msgChineseNewSimplified: `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${mockTemplateValue.score}) `
        })
      );
    });

    it('should call replaceAll with empty string when score is undefined', () => {
      // Arrange
      mockTemplateValue.score = undefined;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScore'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });

    it('should call replaceAll with empty string when score is empty', () => {
      // Arrange
      mockTemplateValue.score = '';
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScore'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });

    it('should call replaceAll with empty string when isAllNonLiveTickets is true', () => {
      // Arrange
      mockTemplateValue.isAllNonLiveTickets = true;
      replaceMessageService.replaceAll = jest.fn();

      // Act
      service['updateScore'](mockTemplateValue, mockOutputMessage);

      // Assert
      expect(replaceMessageService.replaceAll).toHaveBeenCalledWith(mockOutputMessage, TemplateReplace.SCORE, '');
    });
  });

  describe('edge cases', () => {
    it('should handle null templateValue in execute', () => {
      // Arrange
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
        service.execute(nullTemplateValue, mockOutputMessage);
      }).toThrow();
    });

    it('should handle undefined templateValue in execute', () => {
      // Arrange
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
        service.execute(undefinedTemplateValue, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        score: '2-1',
        isUpdateScoreHaveText: false,
        isAllNonLiveTickets: false
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, null);
      }).toThrow();
    });

    it('should handle undefined outputMessage in execute', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        score: '2-1',
        isUpdateScoreHaveText: false,
        isAllNonLiveTickets: false
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service.execute(mockTemplateValue, undefined);
      }).toThrow();
    });

    it('should handle null templateValue in updateScoreHaveText', () => {
      // Arrange
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
        service['updateScoreHaveText'](null, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null templateValue in updateScore', () => {
      // Arrange
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
        service['updateScore'](null, mockOutputMessage);
      }).toThrow();
    });

    it('should handle null outputMessage in updateScoreHaveText', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        score: '2-1',
        isUpdateScoreHaveText: true,
        isAllNonLiveTickets: false
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service['updateScoreHaveText'](mockTemplateValue, null);
      }).toThrow();
    });

    it('should handle null outputMessage in updateScore', () => {
      // Arrange
      const mockTemplateValue = {
        matchId: 123,
        score: '2-1'
      } as TemplateValue;

      // Act & Assert
      expect(() => {
        service['updateScore'](mockTemplateValue, null);
      }).toThrow();
    });
  });
});
